# 논술런 V2 — PHP ↔ Next.js 연결 방식 & Integration Harness 계획서 (Draft v0.1)

> 작성: 2026-10-01
> 범위: Gate 1 ~ 1.4 (Homepage까지), 이후 Feature Slice에 반복 적용
> 관련 문서: `01-php-bridge-design.md`

---

## 1. 결론 먼저

> **Homepage 단계에서는 Next.js를 "서버"로 띄우지 않는다.**
> `output: 'export'`로 정적 파일을 빌드하고, **기존 Apache가 같은 도메인에서 직접 서빙**한다.
> 로그인 상태는 브라우저가 same-origin으로 `/v2-api/viewer.php`를 호출해서 채운다.

```text
Browser ── nonsulrun 도메인 (Apache, 정문 그대로)
             │
             ├─ /                → V2 정적 index.html     (preview 쿠키가 있을 때만, 컷오버 후 전체)
             ├─ /_next/*         → V2 정적 asset (JS/CSS)
             ├─ /v2-api/*.php    → Thin PHP Bridge          (PHPSESSID 자동 첨부)
             └─ 그 외 전부        → 기존 PHP (bbs/, shop/, lecture/, PG callback, data/)
```

### 왜 이 방식이 지금 가장 효율적인가

| 기준 | 정적 Export + Apache | Next 서버(pm2) + Apache 프록시 | Vercel 정문 |
|---|---|---|---|
| 서버 추가 메모리 | **0** | Node 상주 200~400MB | 0 |
| 오늘 같은 과부하 위험 | 증가 없음 | 작은 EC2에서 증가 | 없음 |
| Auth | 쿠키 그대로 (same-origin) | 쿠키 그대로 | **쿠키 도메인 문제 발생** |
| PG callback, 업로드 경로 | 영향 없음 | 영향 없음 | 전부 Vercel을 경유하게 됨 |
| 새로 관리할 런타임 | 없음 | pm2/systemd, 로그, 재시작 | Vercel 프로젝트 |
| 롤백 | Rewrite 한 줄 제거 | 프록시 한 줄 제거 | DNS 변경 |
| 제약 | SSR/ISR/middleware/`next/image` 최적화 불가 | 없음 | 없음 |

Homepage는 정적 콘텐츠와 Header 로그인 상태가 전부라서, 정적 Export의 제약에 걸리는 것이 없다. 오늘 서버가 응답 불능 상태였던 만큼, **같은 인스턴스에 상주 프로세스를 추가하지 않는 것**이 중요하다.

### Node 런타임으로 올라가는 시점

다음 중 하나가 생기면 그때 Next 서버(같은 서버 pm2 또는 별도 인스턴스)를 도입한다. **Feature/Adapter 코드는 바뀌지 않는다.**

- 요청마다 서버에서 렌더링해야 하는 gated 페이지 (수강 상태 기반 화면 등)
- ISR이 필요한 Course Detail (DB Direct Read + 주기적 갱신)
- Edge/Server 측 A/B 분기, middleware

---

## 2. 레포 구조 (`nonsullearn-v2-frontend`)

```text
src/
├── app/                          # 라우트. 화면 조립만
│   ├── layout.tsx
│   └── page.tsx                  # Homepage
├── features/                     # 사용자 기능 단위
│   └── header/
│       ├── Header.tsx
│       ├── AuthArea.tsx          # useViewer()만 사용
│       └── nav-items.ts
├── components/                   # Design System primitive (Legacy를 모름)
├── legacy/                       # ★ Legacy Integration Boundary — 유일한 Legacy 접점
│   ├── contracts/
│   │   ├── viewer.ts             # zod schema + 타입 (Canonical Contract)
│   │   └── fixtures/             # Contract 예시 JSON (TS 테스트와 PHP 스모크가 공유)
│   │       ├── viewer.anonymous.json
│   │       ├── viewer.member.json
│   │       └── viewer.corrector.json
│   ├── client/
│   │   └── bridge-fetch.ts       # fetch + timeout + envelope 검증 (공통)
│   ├── adapters/
│   │   └── viewer/
│   │       ├── index.ts          # source 선택 (http | mock)
│   │       ├── http.ts           # /v2-api/viewer.php 호출
│   │       └── mock.ts           # 시나리오별 mock
│   ├── handoff/
│   │   └── routes.ts             # Legacy URL 단일 출처 (login, logout, checkout, lms ...)
│   └── index.ts                  # 외부에 공개하는 것: useViewer, ViewerProvider, legacyRoutes
├── analytics/                    # Gate 2 (track() → canonical event)
└── lib/
```

### Boundary 규칙 (lint로 강제)

```js
// eslint.config.mjs (일부)
{
  files: ['src/app/**', 'src/features/**', 'src/components/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['@/legacy/*/**', '@/legacy/client/*', '@/legacy/adapters/*'],
          message: 'Legacy는 @/legacy (index)로만 접근합니다.' },
      ],
    }],
  },
}
```

- Component는 PHP URL, `mb_*` 컬럼명, `level > 7` 같은 판단을 **직접 알지 못한다.**
- Legacy URL 문자열은 `legacy/handoff/routes.ts` 한 곳에만 존재한다.

---

## 3. 핵심 코드 스케치

### 3.1 Contract (`legacy/contracts/viewer.ts`)

```ts
import { z } from 'zod';

export const ViewerSchema = z.discriminatedUnion('authenticated', [
  z.object({ v: z.literal(1), authenticated: z.literal(false) }),
  z.object({
    v: z.literal(1),
    authenticated: z.literal(true),
    member: z.object({ displayName: z.string(), level: z.number().int() }),
    capabilities: z.object({ correction: z.boolean(), admin: z.boolean() }),
  }),
]);

export type ViewerPayload = z.infer<typeof ViewerSchema>;

// UI가 실제로 다루는 상태: 로딩/실패를 명시적으로 포함
export type ViewerState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'member'; displayName: string; can: { correction: boolean; admin: boolean } }
  | { status: 'unavailable' };   // Bridge 실패 → UI는 비로그인처럼 보이되, 이벤트로 기록
```

`level` 숫자는 Contract에는 있지만 **UI 상태(`ViewerState`)로는 넘기지 않는다.** UI는 `can.correction`만 본다.

### 3.2 Bridge client (`legacy/client/bridge-fetch.ts`)

```ts
export async function bridgeFetch<T>(path: string, schema: z.ZodType<T>, timeoutMs = 3000): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  });
  // common.php가 리다이렉트/HTML을 내보낸 경우도 실패로 처리
  if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
    throw new BridgeError('bad_response', res.status);
  }
  const parsed = schema.safeParse(await res.json());
  if (!parsed.success) throw new BridgeError('contract_mismatch', res.status);
  return parsed.data;
}
```

### 3.3 Adapter 선택 (`legacy/adapters/viewer/index.ts`)

```ts
const source = process.env.NEXT_PUBLIC_VIEWER_SOURCE ?? 'http'; // 'http' | 'mock'

export const loadViewer: () => Promise<ViewerState> =
  source === 'mock' ? loadViewerMock : loadViewerHttp;
```

- `http.ts`: `bridgeFetch('/v2-api/viewer.php', ViewerSchema)` → `ViewerState`로 변환. 예외는 `{ status: 'unavailable' }`.
- `mock.ts`: `?viewer=anonymous|member|corrector|unavailable|slow` 쿼리로 시나리오 전환 (개발용).

### 3.4 Handoff (`legacy/handoff/routes.ts`)

```ts
export const legacyRoutes = {
  login:  (returnTo = '/') => `/bbs/login.php?url=${encodeURIComponent(returnTo)}`,
  logout: () => `/bbs/logout.php`,
  correction: () => `/lecture/...`,   // TBD: head.php에서 실제 링크 확인
  myPage: () => `/bbs/...`,           // TBD
} as const;
```

### 3.5 Header 동작

| ViewerState | Header 표시 |
|---|---|
| `loading` | auth 영역 고정 폭 skeleton (레이아웃 흔들림 없음) |
| `anonymous` | 로그인 / 회원가입 |
| `member` | 이름, 로그아웃, (`can.correction`이면) 첨삭 메뉴 |
| `unavailable` | 로그인 버튼 (안전한 기본값) + `bridge_error` 이벤트 기록 |

---

## 4. Integration Harness — 검증 구조

"하네스"는 V2와 Legacy 사이의 연결이 **깨졌을 때 바로 알 수 있게 하는 장치들**의 묶음이다. 4층으로 구성한다.

```text
L1  Contract Test     (CI, 매 커밋)     fixture JSON ⇄ zod schema
L2  Adapter/UI Test   (CI, 매 커밋)     mock 시나리오별 Header 렌더링
L3  Bridge Smoke      (배포 직후)       실제 Production /v2-api/viewer.php 호출
L4  Parity Check      (컷오버 전, 수동)  Legacy Header vs V2 Header 시나리오 비교
```

### L1. Contract Test — 양쪽이 같은 shape을 보는지

- `contracts/fixtures/*.json`이 **유일한 진실.** TS 테스트와 PHP 스모크가 같은 파일을 기준으로 삼는다.
- Vitest: 모든 fixture가 `ViewerSchema.parse()`를 통과하는지, 잘못된 fixture(`mb_id` 포함 등)는 실패하는지.

### L2. Adapter / UI Test

- Vitest + Testing Library로 `AuthArea`를 mock 시나리오 5개(`anonymous`, `member`, `corrector`, `unavailable`, `slow`)로 렌더링.
- 확인: 로그인 링크의 `returnTo`, 첨삭 메뉴 노출 조건, skeleton 폭 고정.

### L3. Bridge Smoke — 배포한 PHP가 Contract를 지키는지

```bash
#!/usr/bin/env bash
# scripts/bridge-smoke.sh
set -euo pipefail
BASE=${BASE:-https://<논술런 도메인>}

# 1) 쿠키 없이 → 비로그인 Contract
body=$(curl -fsS -H 'Accept: application/json' "$BASE/v2-api/viewer.php")
echo "$body" | jq -e '.v == 1 and .authenticated == false' >/dev/null

# 2) 헤더 검증
curl -fsSI "$BASE/v2-api/viewer.php" | grep -qi 'cache-control: no-store'
curl -fsSI "$BASE/v2-api/viewer.php" | grep -qi 'application/json'

# 3) GET 외 차단
[ "$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/v2-api/viewer.php")" != "200" ]

# 4) (선택) 테스트 계정 세션 쿠키가 있으면 로그인 Contract
if [ -n "${SMOKE_PHPSESSID:-}" ]; then
  curl -fsS -b "PHPSESSID=$SMOKE_PHPSESSID" "$BASE/v2-api/viewer.php" \
    | jq -e '.authenticated == true and (.member | has("displayName")) and (has("mb_id") | not)' >/dev/null
fi
echo "bridge smoke OK"
```

### L4. Parity Check (Gate 1.4)

`v2_preview=1` 쿠키를 가진 브라우저로 Legacy와 V2를 나란히 비교한다.

| 시나리오 | 계정 | 확인 |
|---|---|---|
| 비로그인 | - | 로그인/회원가입 링크, 로그인 후 원래 페이지 복귀 |
| 일반 회원 | 테스트 계정 (level 2) | 이름 표시, 로그아웃 후 V2 홈 복귀 |
| 첨삭 권한 | level 8 이상 | 첨삭 메뉴 노출, 링크가 Legacy로 이동 |
| 세션 만료 | 3시간 경과 또는 세션 삭제 | 비로그인 Header로 전환 |
| Bridge 차단 | `.htaccess`로 v2-api 차단 | 사이트 정상, 로그인 버튼 노출 |
| 모바일 | 같은 시나리오 | 모바일 내비게이션 |

통과 기록은 `docs/parity/homepage.md`에 남긴다.

---

## 5. 로컬 개발 흐름

브라우저 쿠키는 localhost로 전달되지 않기 때문에, 로컬에서 Production 세션을 쓰려 하지 않는다.

| 단계 | 방법 |
|---|---|
| UI 개발 (대부분의 시간) | `NEXT_PUBLIC_VIEWER_SOURCE=mock`, `?viewer=corrector` 등으로 상태 전환 |
| Bridge 로직 개발 | 로컬 PHP(`php -S`) + 로컬 DB 덤프 없이도 `viewer.php`는 fixture와 비교하는 단위 확인으로 충분 |
| 실제 연결 확인 | 배포 후 Production에서 `v2_preview` 쿠키로 확인 (L3, L4) |

---

## 6. 빌드 & 배포 (V2 정적 파일)

**서버에서 빌드하지 않는다.** 로컬이나 GitHub Actions에서 빌드하고 결과물만 올린다.

```bash
#!/usr/bin/env bash
# scripts/deploy-web.sh  (nonsullearn-v2-frontend)
set -euo pipefail
HOST=nonsul-learn@43.202.37.184
ROOT=/var/www/v2-web                 # html2 밖. Legacy 파일과 섞이지 않음
SHA=$(git rev-parse --short HEAD)

pnpm lint && pnpm typecheck && pnpm test && pnpm build   # next.config: output: 'export'
rsync -avz --delete out/ "$HOST:$ROOT/releases/$SHA/"
ssh "$HOST" "ln -sfn $ROOT/releases/$SHA $ROOT/current"  # 정적 파일이라 심볼릭 링크 문제 없음
```

롤백: `ln -sfn $ROOT/releases/<이전 SHA> $ROOT/current`

### Apache 설정 초안 (vhost 확인 후 확정)

```apache
# V2 정적 자산
Alias /_next/ /var/www/v2-web/current/_next/
<Directory /var/www/v2-web/current>
    Options -Indexes +FollowSymLinks
    Require all granted
</Directory>
<LocationMatch "^/_next/static/">
    Header set Cache-Control "public, max-age=31536000, immutable"
</LocationMatch>

# Homepage: preview 쿠키가 있을 때만 V2 (컷오버 시 RewriteCond 제거)
Alias /_v2/ /var/www/v2-web/current/
RewriteEngine On
RewriteCond %{HTTP_COOKIE} (^|;\s*)v2_preview=1
RewriteRule ^/?$ /_v2/index.html [PT,L]
<Location /_v2/>
    Header set Cache-Control "no-cache"
</Location>
```

- Legacy 경로(`bbs/`, `shop/`, PG callback, `data/`)는 규칙에 걸리지 않으므로 영향이 없다.
- 컷오버: `RewriteCond` 한 줄 삭제 → `apachectl configtest && systemctl reload apache2`
- 롤백: `RewriteRule` 한 줄 주석 처리 → reload

---

## 7. 실행 순서

| 단계 | 작업 | 산출물 | SSH 필요 |
|---|---|---|---|
| 1 | Header 필드 grep, web root / vhost / 쿠키 설정 확인 | Contract v1 확정 | ○ (읽기만) |
| 2 | Gate 1: Next Foundation (`output: 'export'`, lint, typecheck, vitest) | 빌드 통과 | |
| 3 | `src/legacy/` 골격 + contracts + fixtures + mock adapter + L1/L2 테스트 | Harness 동작 | |
| 4 | Gate 1.1~1.2: Design System, 정적 Homepage, Header (mock) | Homepage UI | |
| 5 | Gate 1.3: `_bootstrap.php`, `viewer.php`, 부수효과 확인, `deploy-bridge.sh`, L3 스모크 | Bridge 운영 반영 | ○ |
| 6 | `deploy-web.sh` + Apache Alias/Rewrite (preview 쿠키 전용) | V2 홈 본인만 노출 | ○ |
| 7 | Gate 1.4: L4 Parity 체크리스트 통과 → 컷오버 | V2 Homepage 운영 | ○ |

단계 2~4는 SSH 없이 진행 가능하다.

---

## 8. 운영 안전장치 (오늘 장애에서 얻은 것)

- 운영 서버에서 **빌드, 전체 트리 grep, 압축, VS Code Remote를 하지 않는다.** 분석은 로컬 `nonsul-learn-html1` 레포에서.
- 상주 프로세스 추가 전에 `free -m`, CloudWatch CPU 크레딧, 메모리 사용량을 기준선으로 기록한다.
- 배포 스크립트는 반드시 `apachectl configtest` / `php -l` 통과 후에만 반영한다.
- CloudWatch 경보(상태 검사 실패, CPU 크레딧 잔액 낮음)를 걸어서 다음 장애는 먼저 알 수 있게 한다.

---

## 9. 열린 질문

1. Header가 쓰는 회원 필드: `mb_name` vs `mb_nick`, 포인트/쪽지 표시 여부
2. `common.php`의 방문자 기록, 리다이렉트 부수효과
3. 실제 web root 절대경로, Apache vhost 파일 위치, `mod_rewrite` / `mod_headers` 활성화 여부
4. 세션 쿠키 이름(PHPSESSID 기본인지)과 `G5_COOKIE_DOMAIN`
5. 첨삭 메뉴, 마이페이지의 실제 Legacy URL
6. 인스턴스 타입 (t3.micro 등) — Node 런타임 도입 시점 판단 기준