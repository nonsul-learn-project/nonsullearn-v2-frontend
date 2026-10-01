# 논술런 V2 — 사전 준비물 & 하네스 기준 (v0.2)

> 작성: 2026-10-01
> 아키텍처: **방식 1 — Apache가 정문, V2 경로만 Vercel로 프록시**
> 대체: `02-nextjs-integration-and-harness.md` (정적 Export안)
> 유지: `01-php-bridge-design.md` (Bridge 설계, 일부 보완은 04 문서 참고)

---

## 0. 전체 구조 한 장

```text
Browser ── nonsulrun 도메인 (DNS 그대로 EC2)
             │
          Apache (정문)
             ├─ /lp/*, /courses/*, /_next/*, (컷오버 후) /    ── [P] 프록시 ──▶ Vercel (Next.js, ISR)
             │                                                                  │
             │                                                     서버→서버: 공개 Read Bridge
             │                                                                  ▼
             ├─ /v2-api/*.php   ── Thin PHP Bridge  ◀───────────────────────────┘
             │      (viewer: 브라우저 same-origin 호출 / courses: Vercel ISR이 호출)
             └─ 그 외 전부       ── 기존 PHP (로그인, 결제, PG callback, 강의실, 첨삭, 업로드, data/)
```

### 고정 원칙 5개

1. **결제, 로그인, 강의실, 업로드 경로는 Vercel을 절대 거치지 않는다.**
2. **Vercel은 PHP 세션 쿠키를 받지 않는다.** Apache가 프록시할 때 `Cookie` 헤더를 제거한다. 로그인 상태는 브라우저가 `/v2-api/viewer.php`로 직접 조회한다.
3. **Vercel은 MariaDB에 직접 접속하지 않는다.** 데이터는 공개 Read Bridge(JSON)로만 받는다. 3306 포트를 외부에 열지 않는다.
4. **모든 V2 경로는 Apache 설정의 kill switch 하나로 즉시 Legacy로 되돌릴 수 있어야 한다.**
5. **검색엔진에는 메인 도메인만 보인다.** Vercel origin 도메인은 noindex + 프록시 비밀 헤더가 없으면 메인 도메인으로 리다이렉트.

---

## 1. 사전 준비물 체크리스트

### 1.1 계정 / 권한

| 항목 | 확인 내용 | 상태 |
|---|---|---|
| Vercel | **Pro 플랜 필요 여부 확인.** Hobby 플랜은 상업적 사용이 제한됨 (이용약관 확인) | ☐ |
| Vercel 리전 | Function 리전을 서울(`icn1`)로 설정 가능한지 | ☐ |
| GitHub | `nonsullearn-v2-frontend` ↔ Vercel 연결, `nonsul-learn-html1` 접근 | ☐ |
| DNS 관리 권한 | origin 서브도메인(예: `v2-origin.도메인`) CNAME 추가 가능 | ☐ |
| AWS 콘솔 | EC2 상태, CloudWatch 경보 설정 권한 | ☐ |
| SSH + **sudo** | `nonsul-learn` 계정이 Apache 설정 수정/reload 권한이 있는지 (`sudo -l`) | ☐ |
| 테스트 계정 | 일반 회원(level 2), 첨삭 권한(level 8 이상) 각 1개 | ☐ |

### 1.2 서버에서 수집할 정보 (읽기만, 운영 중 실행 가능)

```bash
# Apache
apachectl -v; apachectl -V | grep -i mpm
apachectl -M 2>/dev/null | grep -E 'proxy_module|proxy_http|ssl_module|headers_module|rewrite_module'
apachectl -S                       # vhost 파일 위치, 443 설정
grep -rn "MaxRequestWorkers\|ServerLimit" /etc/apache2 /etc/httpd 2>/dev/null

# 리소스 기준선
nproc; free -m; df -h; uptime
curl -s http://169.254.169.254/latest/meta-data/instance-type   # IMDSv2면 토큰 필요

# Legacy 설정 (web root에서)
pwd
grep -n "G5_COOKIE_DOMAIN\|G5_DOMAIN\|G5_HTTPS_DOMAIN" config.php
grep -n "visit\|goto_url\|header('Location" common.php
grep -n '\$member\[\|\$is_member\|\$is_admin\|mb_level' head.php _head.php mobile/head.php 2>/dev/null

# 현재 추적 코드 (V2에서 똑같이 심어야 함)
grep -n "gtag\|googletagmanager\|fbq\|wcs_do\|wcs_add\|kakaoPixel" head.php _head.php tail.php head.sub.php tail.sub.php 2>/dev/null
```

| 산출물 | 용도 | 상태 |
|---|---|---|
| Apache 버전, **MPM 종류**, 모듈 활성화 여부 | 프록시 설정 가능 여부. prefork+mod_php면 프록시 요청도 무거운 프로세스를 점유하므로 워커 수 확인 | ☐ |
| vhost 파일 경로, TLS 인증서 방식(certbot 등) | 설정 삽입 위치 | ☐ |
| 인스턴스 타입, 메모리, CPU 크레딧 기준선 | 프록시 추가 전후 비교 | ☐ |
| 세션 쿠키 이름, 쿠키 도메인 | viewer 동작 전제 | ☐ |
| `common.php` 부수효과 (방문자 기록, 리다이렉트) | Bridge 설계 확정 | ☐ |
| Header가 쓰는 `$member` 필드 | viewer Contract 확정 | ☐ |
| **현재 추적 코드 목록 (GA4, GTM, Meta, Naver, Kakao 등)** | 컷오버 시 마케팅 데이터 끊김 방지 | ☐ |

### 1.3 Legacy URL 지도 (Handoff 대상)

| 기능 | Legacy URL | 상태 |
|---|---|---|
| 로그인 (복귀 파라미터 포함) | `/bbs/login.php?url=` | ☐ 확인 |
| 로그아웃 | `/bbs/logout.php` | ☐ |
| 회원가입 | | ☐ |
| 마이페이지 / 내 강의실 | | ☐ |
| 첨삭 | `/lecture/...` | ☐ |
| **강좌 상세 (현재)** | `/shop/item.php?it_id=...` 추정 | ☐ |
| 장바구니 / 수강 신청 / 결제 시작 | | ☐ |
| 강사 이미지 등 공개 자산 경로 | `/data/...` | ☐ |

### 1.4 결정할 것

| 결정 | 제안 기본값 |
|---|---|
| V2 URL 체계 | 랜딩 `/lp/[slug]`, 강좌 `/courses/[id]` |
| 기존 강좌 URL 처리 | 강좌별 컷오버 시 `shop/item.php?it_id=X` → `/courses/X` 301 |
| Vercel origin 도메인 | `v2-origin.<도메인>` (Vercel production에 연결) |
| preview 쿠키 이름 | `v2_preview=1` |
| kill switch 파일 | `/etc/nonsulrun/v2.off` (파일이 있으면 V2 전체 비활성) |
| 강좌 데이터 갱신 주기 | ISR 300초 (가격 변경 후 최대 5분 지연 허용 여부 확인) |

---

## 2. 하네스 구조

하네스 = **V2와 Legacy 사이 연결이 깨졌을 때 운영 전에, 또는 운영 즉시 알 수 있게 하는 검증 장치 묶음.**

```text
L1  Contract     CI, 매 커밋        fixture JSON ⇄ zod schema ⇄ PHP 응답 shape
L2  Component    CI, 매 커밋        mock 시나리오별 UI 동작
L3  Preview E2E  Vercel Preview     PR마다 Playwright (mock adapter)
L4  Smoke        배포 직후 자동      실제 Production 경로: Bridge + Proxy + 헤더
L5  Parity       컷오버 전 수동      Legacy 화면 vs V2 화면, 시나리오 체크리스트
L6  Monitor      운영 상시           bridge_error 비율, 5xx, Web Vitals, EC2 리소스
```

### 2.1 레포 내 위치

```text
nonsullearn-v2-frontend/
├── src/legacy/
│   ├── contracts/            viewer.ts, course.ts (zod)
│   │   └── fixtures/         *.json  ← L1의 단일 진실
│   ├── client/               bridge-fetch.ts (브라우저용), bridge-server.ts (ISR용)
│   ├── adapters/             viewer/{http,mock}.ts, course/{http,mock}.ts
│   └── handoff/routes.ts     Legacy URL 단일 출처
├── src/app/api/v2-health/    프록시 상태 진단 endpoint
├── tests/
│   ├── contract/             L1
│   ├── component/            L2
│   └── e2e/                  L3 (Playwright)
├── scripts/
│   ├── smoke-prod.sh         L4
│   └── parity/               L5 체크리스트 기록
└── docs/parity/*.md

nonsul-learn-html1/
├── html2/v2-api/             Bridge
└── scripts/{deploy-bridge.sh, bridge-smoke.sh}
```

---

## 3. 하네스 기준 (Pass / Fail)

### L1. Contract

| 기준 | Pass 조건 |
|---|---|
| fixture 유효성 | 모든 `fixtures/*.json`이 해당 schema 통과 |
| 금지 필드 | `mb_id`, `mb_email`, `mb_hp`, `mb_password` 등이 들어간 fixture는 **실패해야** 함 (schema `.strict()`) |
| 버전 | 응답 `v` 값이 TS가 아는 버전과 다르면 parse 실패 → `unavailable` 처리 |
| 공유 | PHP 스모크(L4)가 같은 fixture의 key 집합과 실제 응답 key 집합을 비교 |

### L2. Component

| 시나리오 (viewer) | Pass 조건 |
|---|---|
| `loading` | auth 영역 고정 폭 skeleton, 레이아웃 이동(CLS) 없음 |
| `anonymous` | 로그인 링크가 `legacyRoutes.login(현재경로)` |
| `member` | 이름 표시, 로그아웃 링크 |
| `corrector` | 첨삭 메뉴 노출 (`can.correction`만으로 판단) |
| `unavailable` | 로그인 버튼 표시, `bridge_error` 이벤트 1회 발생, 에러 UI 노출 없음 |

| 시나리오 (course) | Pass 조건 |
|---|---|
| 판매중 | 가격, 수강 신청 CTA → Legacy 결제 시작 URL |
| 품절 / 판매 종료 | CTA 비활성 + 안내 문구 |
| 존재하지 않음 | `notFound()` → 404 |

### L3. Preview E2E (Vercel Preview, mock adapter)

| 기준 | Pass 조건 |
|---|---|
| 주요 페이지 렌더 | `/`, `/lp/<샘플>`, `/courses/<샘플>` 200, 콘솔 에러 0 |
| 메타데이터 | `<title>`, description, OG, **canonical이 메인 도메인** |
| 모바일 | 375px 폭에서 가로 스크롤 없음 |
| 추적 | `track()` 호출 시 dataLayer에 canonical event push |

### L4. Smoke (배포 직후, Production)

```bash
# scripts/smoke-prod.sh — 하나라도 실패하면 배포 실패로 간주하고 롤백
BASE=https://<메인 도메인>

# Bridge
curl -fsS $BASE/v2-api/viewer.php | jq -e '.v==1 and .authenticated==false'
curl -fsSI $BASE/v2-api/viewer.php | grep -qi 'cache-control: no-store'
curl -fsS $BASE/v2-api/courses.php | jq -e '.v==1 and (.items|type=="array")'

# Proxy (preview 쿠키로 V2 경로 확인)
curl -fsS -b 'v2_preview=1' $BASE/api/v2-health \
  | jq -e '.proxied==true and .cookieForwarded==false'      # Vercel이 PHP 쿠키를 못 받는지
curl -fsS -b 'v2_preview=1;PHPSESSID=dummy' $BASE/api/v2-health | jq -e '.cookieForwarded==false'

# Legacy 무영향
curl -fsSI $BASE/bbs/login.php | head -1 | grep -q '200'
curl -fsSI $BASE/shop/ | head -1 | grep -qE '200|30[12]'

# Origin 직접 접근 차단
curl -sI https://v2-origin.<도메인>/ | grep -qiE '^location: https://<메인 도메인>|x-robots-tag: noindex'
```

| 기준 | Pass 조건 |
|---|---|
| Bridge | 위 jq 조건 모두 통과, 응답 200ms 이하 (EC2 내부 기준) |
| Proxy | `proxied: true`, `cookieForwarded: false` |
| Legacy | 로그인, 쇼핑 경로 정상 |
| Origin 노출 | 직접 접근 시 메인 도메인 리다이렉트 또는 noindex |
| 성능 | 프록시 경유 TTFB 600ms 이하 (서울 기준, 캐시 hit 상태) |

### L5. Parity (컷오버 전, 수동)

페이지마다 `docs/parity/<page>.md`에 기록. **전 항목 체크 전 컷오버 금지.**

| 시나리오 | 확인 |
|---|---|
| 비로그인 → 로그인 → 원래 페이지 복귀 | ☐ |
| 일반 회원 Header | ☐ |
| 첨삭 권한 Header / 메뉴 | ☐ |
| 로그아웃 후 상태 반영 | ☐ |
| 세션 만료(3시간) 후 비로그인 표시 | ☐ |
| Bridge 차단 시 사이트 정상, 로그인 버튼 노출 | ☐ |
| kill switch 시 Legacy 페이지로 즉시 복귀 | ☐ |
| 모바일 내비게이션 | ☐ |
| 수강 신청 CTA → Legacy 결제 → **결제 완료까지** (테스트 결제 또는 0원 상품) | ☐ |
| 추적 코드: GA4 실시간, Meta Pixel Helper, Naver 전환에서 이벤트 확인 | ☐ |
| 기존 URL 301 (강좌 페이지) | ☐ |

### L6. Monitor (운영)

| 지표 | 경보 기준 (초기값) |
|---|---|
| `bridge_error` 이벤트 / viewer 호출 | 1% 초과 |
| Vercel 5xx | 5분간 1% 초과 |
| Apache 프록시 502/504 | 발생 시 확인 |
| EC2 상태 검사 실패 | 즉시 (CloudWatch) |
| CPU 크레딧 잔액 (t 계열) | 기준선의 20% 미만 |
| Web Vitals (모바일) | LCP 2.5초, CLS 0.1 초과 |

---

## 4. Gate별 Definition of Done

| Gate | 통과 조건 |
|---|---|
| **P0 사전 준비** | §1 체크리스트 전부 ☑, 결정 사항 확정 |
| **G1 Foundation** | Vercel 배포 성공, lint/typecheck/build CI 통과, L1/L2 골격 동작 |
| **G1.3 Bridge** | `viewer.php`, `courses.php` 운영 반영, L4 Bridge 항목 통과 |
| **G1.4 Proxy** | preview 쿠키 전용 프록시 동작, L4 전체 통과, kill switch 시연 완료 |
| **첫 랜딩 운영** | `/lp/<slug>` 공개, L3/L4 통과, 추적 이벤트 확인 |
| **Homepage 컷오버** | L5 전 항목 ☑, 24시간 L6 경보 없음 |
| **Course Detail 컷오버 (강좌별)** | L5 + 결제 완료 시나리오 + 301 확인 |