# 논술런 V2 — Thin PHP Bridge 설계서 (Draft v0.1)

> 작성: 2026-10-01
> 범위: Gate 1.3 Legacy Integration v1 — `HomepageViewer` 하나
> 전제: Q1 결과 **재사용할 기존 Viewer endpoint 없음** → Thin PHP Bridge로 확정

---

## 1. Bridge의 정의

Bridge는 새 Backend가 아니다.

> **Legacy PHP가 이미 계산한 결과를 읽어서, V2가 쓰는 Canonical JSON으로 번역만 하는 얇은 파일.**

| Bridge가 하는 것 | Bridge가 하지 않는 것 |
|---|---|
| `common.php`를 include해서 기존 세션/회원 판정 재사용 | 새 인증, 토큰, JWT 발급 |
| 필요한 필드만 골라 JSON으로 노출 | 쓰기(INSERT/UPDATE), 결제, 상태 변경 |
| Legacy 권한 판단을 `capabilities`로 번역 | 범용 REST API, 테이블별 endpoint |

---

## 2. 파일 구조

```text
nonsul-learn-html1/
└── html2/
    └── v2-api/                 ← Production 안의 유일한 Git-managed 영역
        ├── _bootstrap.php      ← 공통: common.php 로드, 출력 격리, 헤더, 응답 헬퍼
        ├── viewer.php          ← GET /v2-api/viewer.php
        ├── .htaccess           ← GET만 허용, 디렉터리 리스팅 차단
        └── README.md           ← Contract 버전, 배포 방법
```

규칙:
- Bridge 파일은 **`v2-api/` 밖의 어떤 파일도 수정하지 않는다.** 읽기(include)만 한다.
- endpoint 하나 = 파일 하나 = V2 Contract 하나.

---

## 3. 공통 부트스트랩 (`_bootstrap.php`)

```php
<?php
// html2/v2-api/_bootstrap.php
// 목적: 기존 common.php를 재사용하되, 그 부수효과가 JSON 응답을 오염시키지 않게 격리한다.

if (basename($_SERVER['SCRIPT_FILENAME']) === '_bootstrap.php') { http_response_code(404); exit; }

ob_start();                                              // common.php가 출력하는 것(경고, BOM 등) 흡수
require_once $_SERVER['DOCUMENT_ROOT'] . '/common.php';  // __DIR__ 대신 DOCUMENT_ROOT (배포 경로 독립)
ob_end_clean();

session_write_close();                                   // 세션 파일 lock 즉시 해제 → 동시 요청 직렬화 방지

function v2_json(int $status, array $body): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    echo json_encode(['v' => 1] + $body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    v2_json(405, ['error' => 'method_not_allowed']);
}
```

설계 포인트:
- **`ob_start()` / `ob_end_clean()`**: 그누보드 `common.php`가 notice나 공백을 출력해도 JSON이 깨지지 않는다.
- **`session_write_close()`**: 읽기 전용이므로 세션을 바로 닫는다. 파일 세션은 요청마다 lock을 잡기 때문에, 안 닫으면 같은 사용자의 PHP 페이지 요청과 서로 기다리게 된다.
- **`DOCUMENT_ROOT` 기준 include**: 배포 방식(심볼릭 링크 등)이 바뀌어도 `common.php` 경로가 깨지지 않는다.
- **Envelope `v: 1`**: Contract 버전. 필드를 지우거나 의미를 바꿀 때만 올린다. 필드 추가는 버전 유지.

---

## 4. Viewer endpoint (`viewer.php`)

```php
<?php
// html2/v2-api/viewer.php — HomepageViewer Contract v1
require __DIR__ . '/_bootstrap.php';

if (empty($is_member)) {
    v2_json(200, ['authenticated' => false]);
}

$level = (int)$member['mb_level'];

v2_json(200, [
    'authenticated' => true,
    'member' => [
        'displayName' => (string)$member['mb_name'],   // TBD: Header가 mb_name인지 mb_nick인지 확인 후 확정
        'level'       => $level,
    ],
    'capabilities' => [
        'correction' => $level > 7,                    // Legacy 권한 판단은 PHP가 소유
        'admin'      => !empty($is_admin),             // TBD: Header에 관리자 메뉴가 있을 때만 유지
    ],
]);
```

### Contract v1

```jsonc
// 비로그인
{ "v": 1, "authenticated": false }

// 로그인
{
  "v": 1,
  "authenticated": true,
  "member": { "displayName": "김도현", "level": 2 },
  "capabilities": { "correction": false, "admin": false }
}
```

### 필드 원칙

| 원칙 | 이유 |
|---|---|
| **`mb_id`(로그인 ID) 노출하지 않음** | Header에 필요 없고, 노출 면적만 늘어남 |
| **권한은 `capabilities`로 번역** | `level > 7` 같은 Legacy semantics가 TS로 새지 않음 |
| **Header가 실제로 쓰는 필드만** | 확정 전 `head.php`의 `$member[...]` 사용처 grep 필요 (§8) |
| 이메일, 연락처, 포인트 등 | Header에 보이지 않으면 넣지 않음 |

---

## 5. 보안 체크리스트

- [ ] **Same-origin 전용.** CORS 헤더를 붙이지 않는다. 다른 도메인에서 읽을 수 없어야 정상.
- [ ] **GET만 허용.** 상태 변경이 없으므로 CSRF 토큰 불필요.
- [ ] **`Cache-Control: no-store, private`.** CDN이나 프록시가 다른 사람의 viewer를 캐시하면 안 됨.
- [ ] **에러 시 내부 정보 노출 금지.** 예외 메시지, SQL, 경로를 응답에 넣지 않는다.
- [ ] **`.htaccess`**:
  ```apache
  Options -Indexes
  <LimitExcept GET>
      Require all denied
  </LimitExcept>
  <Files "_bootstrap.php">
      Require all denied
  </Files>
  ```

---

## 6. 배포 전 확인 (common.php 부수효과)

`common.php`는 홈페이지 렌더링용이라, JSON endpoint에서 원치 않는 일을 할 수 있다. 첫 배포 전에 SSH로 확인한다.

| 확인 항목 | 확인 방법 | 문제가 되면 |
|---|---|---|
| **방문자 기록(visit) 삽입 여부** | `grep -n "visit" common.php` | viewer 호출마다 방문 통계가 2배로 찍힘 → 상수 플래그로 건너뛰는 방법 검토 |
| IP 차단, 점검 모드 리다이렉트 | `grep -n "header('Location\|goto_url\|alert(" common.php` | JSON 대신 HTML/302가 나감 → 클라이언트가 실패로 처리하도록 설계(§TS 문서) |
| 모바일 감지 리다이렉트 | 같은 grep | 위와 동일 |
| 응답 시간 | `curl -w '%{time_total}' -o /dev/null -s https://도메인/v2-api/viewer.php` | 200ms 이상이면 원인 확인 |

---

## 7. 배포 방법 (Git-managed island)

**원칙:** `v2-api/` 디렉터리 밖은 절대 건드리지 않는다. 빌드나 Git 작업은 서버에서 하지 않는다.

```bash
#!/usr/bin/env bash
# scripts/deploy-bridge.sh  (nonsul-learn-html1 레포, 로컬에서 실행)
set -euo pipefail
HOST=nonsul-learn@43.202.37.184
REMOTE=/var/www/html2/v2-api          # TBD: 실제 web root 경로 확인
SHA=$(git rev-parse --short HEAD)

git diff --quiet || { echo "커밋 안 된 변경이 있음"; exit 1; }
for f in html2/v2-api/*.php; do php -l "$f"; done

# 1) 현재 운영본 백업 (롤백용)
ssh "$HOST" "mkdir -p ~/v2-api-backups && tar czf ~/v2-api-backups/\$(date +%Y%m%d-%H%M%S).tgz -C $REMOTE . 2>/dev/null || true"

# 2) 반영: --delay-updates로 모든 파일을 받은 뒤 한 번에 교체
rsync -avz --checksum --delay-updates --delete html2/v2-api/ "$HOST:$REMOTE/"
ssh "$HOST" "echo $SHA > $REMOTE/.release && php -l $REMOTE/viewer.php"

# 3) 스모크 테스트
./scripts/bridge-smoke.sh
```

- 처음 대화에서 제안했던 "releases 디렉터리 + 심볼릭 링크" 방식은 **수정합니다.** 심볼릭 링크를 쓰면 PHP의 `__DIR__`가 실제 경로(releases 쪽)로 해석돼서 include 경로가 꼬일 수 있습니다. 파일이 2~3개뿐이므로 `rsync --delay-updates`와 tar 백업이 더 단순하고 안전합니다.
- **롤백:** `ssh $HOST "tar xzf ~/v2-api-backups/<시각>.tgz -C $REMOTE"`
- **긴급 차단:** `v2-api/.htaccess`에 `Require all denied` 한 줄. V2 쪽은 viewer 실패 시 비로그인 Header로 동작하므로 사이트는 정상 유지된다.

### Drift 감지 (선택, 주 1회)

```bash
# Production에서 누가 직접 고친 파일이 있는지 (data/, v2-api/ 제외)
rsync -rcn --delete --exclude=data/ --exclude=v2-api/ \
  nonsul-learn@43.202.37.184:/var/www/html2/ ./html2/ --itemize-changes
```

---

## 8. 확정 전 남은 확인 (TBD)

```bash
# Header가 $member의 어떤 필드를 쓰는지
grep -n '\$member\[\|\$is_member\|\$is_admin\|mb_level' head.php _head.php tail.php mobile/head.php 2>/dev/null
# 실제 web root 절대경로, 세션 쿠키 설정
pwd; grep -n "G5_COOKIE_DOMAIN\|session_save_path\|session.save" config.php common.php data/dbconfig.php 2>/dev/null
```

이 결과로 `displayName`의 원본 필드, `admin` capability 유지 여부, 배포 경로를 확정한다.

---

## 9. 이후 Bridge 추가 규칙

새 endpoint가 필요할 때마다 아래 순서를 지킨다.

1. 기존 endpoint 재사용 가능? → 가능하면 Bridge 만들지 않음
2. Direct Read로 충분? (단순 SELECT + 포맷팅) → Bridge 만들지 않음
3. 세션, 권한, 2단계 이상 중첩된 PHP 함수 결과가 필요? → **Bridge 추가**
4. 쓰기, 결제, 트랜잭션? → **Bridge 금지, PHP URL Handoff**

파일명은 `v2-api/<contract>.php` (예: `course-access.php`). Contract는 TS 레포의 `src/legacy/contracts/`에 먼저 정의하고, PHP는 그 shape을 따른다.