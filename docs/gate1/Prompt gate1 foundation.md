# 작업: Gate 1 — V2 Foundation + Harness 구현

## 0. 시작 전 필수

1. 아래 문서를 **전부 읽고** 시작한다. 규칙이 충돌하면 `AGENTS.md`가 우선한다.
   - `AGENTS.md`, `CLAUDE.md`
   - `docs/harness/GATES.md` (Gate 1 항목과 DoD)
   - `docs/harness/HARNESS.md` (L1~L3 기준)
   - `docs/harness/EXECUTION-PLAN.md`
   - `docs/decisions/*`, `docs/design/component-map.md`
2. Discovery 결과 (Legacy 레포, 읽기 전용): `../nonsul-learn-html1/docs/discovery/`
   - `legacy-url-map.md`, `viewer-contract-v1.md`가 있으면 그 내용을 우선 사용한다. 없으면 이 프롬프트의 값을 사용한다.
3. 브랜치: `feat/gate-1-foundation` (main에서 분기). **main에 직접 커밋하거나 push하지 않는다.**

## 범위

- 이 작업은 **Gate 1만** 한다. Design parity(Gate 2), Bridge PHP(Gate 3), Apache(Gate 4), 홈 화면(Gate 5)은 하지 않는다.
- UI는 **기능 검증용 최소 마크업**만 만든다. 스타일, Bootstrap, legacy CSS 적용은 Gate 2 범위다.
- Legacy 레포, 운영 서버, 운영 도메인은 건드리지 않는다.

## 기술 기준

| 항목 | 기준 |
|---|---|
| Framework | Next.js 최신 stable, App Router, `src/` 디렉터리 |
| Language | TypeScript `strict: true`, `noUncheckedIndexedAccess: true` |
| Package manager | pnpm (최신 stable). `package.json`의 `packageManager` 필드로 고정 |
| Node | 현재 Active LTS. `.nvmrc`와 `engines`로 고정 |
| Validation | zod |
| Lint/Format | ESLint flat config (Next 기본 + 경계 규칙), Prettier |
| Unit/Component test | Vitest + Testing Library + jsdom |
| E2E | Playwright (Chromium만) |

- 버전은 설치 시점의 실제 값을 쓰고, 최종 보고에 기록한다. 추측해서 적지 않는다.
- 의존성은 이 목록 외에 추가하지 않는다. 꼭 필요하면 보고서에 이유와 함께 "추가 제안"으로만 적는다.

## Phase 0 — 현재 상태 감사 (코드 변경 없음)

- `ls -la`, `package.json`, `src/`, 설정 파일 유무를 확인한다.
- **이미 Next.js 등이 설치돼 있으면 덮어쓰지 않는다.** 아래 Phase의 요구사항과 비교해 부족한 부분만 채우고, 충돌(예: npm/yarn lock, pages router, 다른 테스트 도구)은 목록으로 만들어 **멈추고 보고**한다.
- 비어 있거나 문서만 있으면 Phase 1부터 진행한다.

## Phase 1 — Scaffold

- `create-next-app` 상당 구성 (App Router, TS, ESLint, `src/`, import alias `@/*`). Tailwind는 **설치하지 않는다.**
- 기존 `docs/`, `AGENTS.md`, `CLAUDE.md`, `.github/` 등은 보존한다.
- `package.json` scripts (이름 고정):
  ```json
  {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:contract": "vitest run tests/contract",
    "test:component": "vitest run tests/component",
    "test:e2e": "playwright test",
    "test:visual": "node -e \"console.log('test:visual: Gate 2에서 구현')\"",
    "smoke:prod": "bash scripts/smoke-prod.sh",
    "format": "prettier --write .",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
  ```
- `.gitignore`: `.env`, `.env*.local`, `*.pem`, `/playwright-report`, `/test-results`, `.vercel`
- 기본 홈(`src/app/page.tsx`)은 "V2 Foundation" 텍스트만 있는 placeholder. **운영 홈이 아님**을 주석으로 명시.
- **커밋:** `chore(scaffold): next.js app router foundation`

## Phase 2 — Env contract

- `src/env.client.ts`, `src/env.server.ts` (서버 파일 첫 줄 `import 'server-only'`).
- 변수 (기존 `.env.example`이 있으면 그것을 기준으로 맞추고, 없으면 아래로 생성):

  | 변수 | 범위 | 규칙 |
  |---|---|---|
  | `NEXT_PUBLIC_SITE_URL` | client | URL |
  | `NEXT_PUBLIC_LEGACY_BASE_URL` | client | URL 또는 빈 문자열 (운영은 빈 문자열 = 상대경로) |
  | `NEXT_PUBLIC_LEGACY_ASSET_HOST` | client | hostname |
  | `NEXT_PUBLIC_VIEWER_SOURCE` | client | `mock` \| `http` |
  | `NEXT_PUBLIC_ANALYTICS_ENABLED` | client | `true` \| `false`, 기본 false |
  | `COURSE_SOURCE` | server | `mock` \| `http` |
  | `LEGACY_BRIDGE_BASE` | server | URL, 끝 `/` 금지 |
  | `LEGACY_BRIDGE_TIMEOUT_MS` | server | 500~10000, 기본 3000 |
  | `COURSE_REVALIDATE_SECONDS` | server | ≥30, 기본 300 |
  | `V2_PROXY_SECRET` | server | 최소 16자 |
  | `V2_ENFORCE_PROXY` | server | `true` \| `false`, 기본 false |
  | `VERCEL_ENV` | server | `development` \| `preview` \| `production`, 기본 development |

  추적 ID 변수(GTM/GA4/Meta/Naver/Kakao)와 attribution 쿠키 변수는 **이번에 넣지 않는다** (Gate 5에서 측정 신규 도입 시 추가). `.env.example`에 이미 있으면 주석으로 "Gate 5"라고 표시만 한다.
- **production 금지 조합 시 빌드 실패:**
  - `VERCEL_ENV=production`인데 `NEXT_PUBLIC_VIEWER_SOURCE !== 'http'` 또는 `COURSE_SOURCE !== 'http'`
  - production인데 `V2_PROXY_SECRET` 32자 미만
- `NEXT_PUBLIC_*`는 번들러 치환을 위해 키를 하나씩 명시적으로 읽는다.
- 테스트: `tests/contract/env.test.ts` — 정상 조합 통과, 금지 조합 실패.
- `.env.example` 갱신, `.env.local`은 만들지 않는다 (사용 방법만 README에).
- **커밋:** `feat(env): zod-validated env contract with production guards`

## Phase 3 — 디렉터리 구조 + 경계 규칙

- 생성 (각 폴더에 `index.ts` 또는 README 한 줄로 목적 명시):
  ```text
  src/
  ├── app/
  ├── features/
  ├── design-system/        # Gate 2에서 채움 (legacy/, tokens.css, primitives)
  ├── components/           # 여러 기능이 공유하는 조합 컴포넌트만
  ├── content/              # Gate 5에서 home.ts
  ├── legacy/
  │   ├── contracts/fixtures/
  │   ├── client/
  │   ├── adapters/
  │   ├── handoff/
  │   └── index.ts          # 유일한 공개 API
  ├── analytics/
  └── lib/
  ```
- ESLint `no-restricted-imports` (AGENTS.md §6.2 그대로):
  - `src/app/**`, `src/features/**`, `src/components/**`, `src/design-system/**` → `@/legacy/*/**`, `@/legacy/client/*`, `@/legacy/adapters/*` 금지 (`@/legacy`만 허용)
  - `src/design-system/**`, `src/components/**` → `@/legacy`, `@/analytics` 금지
  - 전체 `src/**` (env 파일 제외) → `process.env` 직접 접근 금지 (`no-restricted-properties` 또는 `no-restricted-syntax`)
  - 클라이언트 컴포넌트에서 `@/env.server` import 금지 (`server-only`로 1차 보장, lint는 가능한 범위에서)
- 경계 규칙이 **실제로 동작하는지** 증명하는 테스트: `tests/lint/boundary.test.ts`에서 위반 샘플 코드를 ESLint API로 lint해 에러가 나는지 확인.
- **커밋:** `feat(structure): source layout and import boundary rules`

## Phase 4 — Legacy Integration 골격 + L1

### Contract (`src/legacy/contracts/`)

**viewer.ts — Viewer Contract v1 (Discovery F9 기준, `displayName` 없음):**
```ts
// { v: 1, authenticated: false }
// { v: 1, authenticated: true, capabilities: { correction: boolean, admin: boolean } }
```
- `z.discriminatedUnion('authenticated', ...)`, 각 object `.strict()`, `v: z.literal(1)`.
- UI 상태 타입: `ViewerState = { status: 'loading' } | { status: 'anonymous' } | { status: 'member'; can: { correction: boolean; admin: boolean } } | { status: 'unavailable' }`

**course.ts — Course Contract v1 (draft, Gate 3에서 확정):**
- 필드: `id`, `title`, `summary`, `teacherName`, `imageUrl`(nullable), `listPrice`(number|null), `salePrice`(number), `saleStatus`(`on_sale` | `sold_out` | `inquiry` | `unavailable`), `categoryId`
- 목록 응답: `{ v: 1, items: Course[] }`, 단건: `{ v: 1, item: Course | null }`
- 파일 상단 주석: `// DRAFT — Gate 3에서 courses.php 응답으로 확정. TBD(legacy) 필드 존재 가능`

### Fixtures (`src/legacy/contracts/fixtures/`, HARNESS.md §2 규칙)
- viewer: `anonymous`, `member`, `corrector`, `admin`, `invalid.has-mb_id`, `invalid.wrong-version`, `invalid.has-displayName`
- course: `on-sale`, `sold-out`, `list`, `invalid.extra-field`
- 실제 회원 정보 금지. 문자열은 가상값.

### Client (`src/legacy/client/`)
- `bridge-fetch.ts` (브라우저): same-origin, `credentials: 'same-origin'`, `cache: 'no-store'`, timeout, `Content-Type`이 JSON이 아니면 실패 (Discovery: 없는 경로는 `ErrorDocument 404 /index.php`로 HTML이 옴), schema parse 실패도 실패. 실패는 타입 있는 `BridgeError`.
- `bridge-server.ts` (서버, `server-only`): `LEGACY_BRIDGE_BASE` + path, timeout, `next: { revalidate }` 옵션 지원.

### Adapters (`src/legacy/adapters/`)
- `viewer/{mock,http,index}.ts`: mock은 `?viewer=anonymous|member|corrector|admin|unavailable|slow` 시나리오. http는 `/v2-api/viewer.php` 호출 → `ViewerState`로 변환, 모든 실패 → `unavailable`.
- `course/{mock,http,index}.ts`: mock은 fixture, http는 `/courses.php` 경로 placeholder (Gate 3에서 확정).
- 소스 선택은 env (`NEXT_PUBLIC_VIEWER_SOURCE`, `COURSE_SOURCE`)로만.
- `ViewerProvider` + `useViewer()` (client): 마운트 후 1회 조회, 결과 캐시는 메모리만.

### Handoff (`src/legacy/handoff/routes.ts`)
`NEXT_PUBLIC_LEGACY_BASE_URL` + 경로. Discovery `legacy-url-map.md` 기준, 없으면 아래 값:

| 함수 | 경로 |
|---|---|
| `login(returnTo)` | `/bbs/login.php?url=<encodeURIComponent>` |
| `logout()` | `/bbs/logout.php` |
| `register()` | `/bbs/register.php` |
| `memberEdit()` | `/bbs/member_confirm.php?url=register_form.php` |
| `myLecture()` | `/lecture/mypage.php` |
| `correctionStatus()` | `/bbs/board.php?bo_table=correcting` |
| `notice()` | `/bbs/board.php?bo_table=notice` |
| `briefing()` | `/bbs/board.php?bo_table=briefing` |
| `courseList(caId)` | `/shop/list.php?ca_id=<caId>` |
| `courseDetail(itId)` | `/shop/item.php?it_id=<itId>` |
| `aboutCeo()` / `aboutTeacher()` / `aboutCorrection()` | `/ceo_message` / `/teacher` / `/correction.php` |
| `admin()` | `/uAdmin` |

- 쿼리 값은 반드시 인코딩. 임의 외부 URL 생성 불가 (returnTo는 `/`로 시작하는 경로만 허용, 아니면 `/`).

### `src/legacy/index.ts` 공개 API
`ViewerProvider`, `useViewer`, `ViewerState`, `legacyRoutes`, `getCourse`, `getCourses`, 타입. 그 외 export 금지.

### L1 테스트 (`tests/contract/`)
HARNESS.md L1 표 전부:
- fixture 자동 순회: 정상은 parse 성공, `invalid.*`는 실패
- `.strict()` 확인, 금지 필드(`mb_id`, `mb_email`, `mb_hp`, `mb_password`, `displayName`) 거부
- 모든 contract에 정상 ≥1, invalid ≥1 fixture 존재
- `legacyRoutes`: 인코딩, returnTo 외부 URL 차단
- `bridge-fetch`: HTML 응답 → 실패, 잘못된 JSON → 실패, timeout → 실패 (fetch mock)

- **커밋:** `feat(legacy): contracts, fixtures, adapters, handoff routes with L1 tests`

## Phase 5 — 운영 장치

- **파일 이름은 설치된 Next.js 버전의 규약을 따른다.** Next.js 16 이상은 `src/proxy.ts`(구 middleware), 그 이전은 `src/middleware.ts`. 문서(AGENTS/GATES/HARNESS)에 `middleware.ts`로 적힌 곳은 수정하지 말고 보고서 6번에 "문서는 middleware.ts, 실제는 proxy.ts"로 기록한다. 아래 설명의 "middleware"는 이 파일을 뜻한다.
- `src/proxy.ts` 또는 `src/middleware.ts`: production(`VERCEL_ENV=production` 또는 `V2_ENFORCE_PROXY=true`)에서 `X-V2-Proxy-Secret`이 일치하지 않으면 `NEXT_PUBLIC_SITE_URL` + 같은 path/query로 **308**. 프록시를 거치지 않은 응답에는 `X-Robots-Tag: noindex`. `_next/static`, favicon 등 정적 경로는 matcher에서 제외. 비밀값 비교는 길이 차이로 새지 않게 상수 시간 비교.
- `src/app/api/v2-health/route.ts`: `force-dynamic`, `Cache-Control: no-store`, 응답 `{ proxied: boolean, cookieForwarded: boolean, sha: string|null, env: string }`. **쿠키 값이나 헤더 원문은 절대 응답에 넣지 않는다.**
- `src/app/layout.tsx`: `metadataBase = NEXT_PUBLIC_SITE_URL`, `lang="ko"`, 기본 title template.
- `src/app/robots.ts`: production만 allow, 그 외 전부 disallow.
- `src/app/sitemap.ts`: 현재 V2가 운영하는 페이지가 없으므로 빈 배열 또는 홈만(주석으로 Gate 5에서 확장 명시).
- `src/app/not-found.tsx`, `src/app/error.tsx`: 최소 마크업, 홈/로그인 링크는 `legacyRoutes` 사용.
- 테스트 (Vitest): middleware 308/통과/noindex, v2-health가 쿠키 존재 여부만 boolean으로 반환.
- **커밋:** `feat(ops): origin protection middleware, health endpoint, metadata, robots`

## Phase 6 — 검증 페이지 + L2 + L3 + analytics 골격

- `src/analytics/`: `events.ts` canonical 이름 union (`page_view`, `cta_click`, `course_view`, `begin_checkout`, `bridge_error`), `track(event, props)` — `NEXT_PUBLIC_ANALYTICS_ENABLED=false`면 console 출력만, provider 연결 없음 (Gate 5).
- `src/features/header/AuthArea.tsx` (client): `useViewer()` 상태별 렌더 — loading: 고정 폭 placeholder / anonymous: 회원가입, 로그인 / member: 정보수정, 로그아웃, (`can.correction`) 첨삭제출현황, (`can.admin`) 관리자 / unavailable: 로그인 버튼 + `track('bridge_error')` 1회. **스타일 없음** (Gate 2에서 legacy 마크업/클래스로 교체 예정이라는 주석).
- `src/app/_v2/check/page.tsx`: `robots: noindex`, AuthArea, 현재 env 이름, viewer source 표시. 개발 확인용.
  - Next.js에서 `_`로 시작하는 폴더는 private folder라 라우팅되지 않는다. **실제 URL이 `/_v2/check`가 되도록** route segment를 구성한다 (예: `src/app/%5Fv2/check/page.tsx`). 동작을 Playwright로 확인한다.
- L2 (`tests/component/`): HARNESS.md L2 viewer 표 6개 시나리오 (loading, anonymous, member, corrector, member-비첨삭, unavailable). login 링크가 `legacyRoutes.login(현재경로)`인지, `bridge_error`가 정확히 1회인지.
- L3 (`tests/e2e/`, Playwright): `pnpm build && pnpm start`를 webServer로, mock env:
  - `/_v2/check` 200, 콘솔 error 0, `noindex` 메타 존재
  - `?viewer=corrector`에서 첨삭 링크 노출
  - 375×812에서 가로 스크롤 없음
  - `/does-not-exist` → 404 페이지
  - `/robots.txt`가 non-production에서 disallow
- `scripts/smoke-prod.sh`: HARNESS.md L4 S1~S11 스크립트 골격 (Gate 3/4에서 사용). **실행하지 않는다.**
- **커밋:** `feat(harness): v2 check page, analytics skeleton, L2 component and L3 e2e tests`

## Phase 7 — CI + Vercel 준비 (Vercel 연결 자체는 사람이 함)

- `.github/workflows/ci.yml`: PR과 push(main 제외 브랜치 포함)에서
  - job `check`: pnpm 설치(캐시), `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` (mock env를 workflow env로 주입, 비밀값 불필요한 값만)
  - job `e2e`: Playwright Chromium 설치 후 `pnpm test:e2e`
  - 기존 `.github/workflows/`(예: secret-scan)가 있으면 유지
- `vercel.json`: `"regions": ["icn1"]` (그 외 설정은 최소)
- `docs/runbook/vercel-setup.md`: 사람이 할 단계
  1. Vercel에서 GitHub 레포 import (Framework: Next.js, pnpm 자동 감지 확인)
  2. 환경별 env 등록 표 (Development / Preview / Production 값 — `.env.example`과 HARNESS.md §9 기준. Production은 `V2_PROXY_SECRET` 32자 이상 생성 방법 포함: `openssl rand -hex 32`)
  3. Production 배포는 **아직 연결하지 않음** (origin 도메인은 Gate 0.9 결정 대기). Preview만 사용
  4. 플랜: 상업적 사용 가능 플랜 확인은 Gate 0.9 결정 항목
  5. Preview URL에서 확인할 것: `/_v2/check`, `/api/v2-health`, `/robots.txt`
- **커밋:** `ci: github actions check and e2e, vercel region config and runbook`

## Phase 8 — Gate 1 기록

- `docs/gates/gate-1.md` (GATES.md 기록 템플릿 사용):
  - Gate 1 항목별 결과/증거 (명령 출력 요약, 테스트 개수, 커밋 해시)
  - Vercel Preview 관련 항목은 `PENDING (사람: docs/runbook/vercel-setup.md)`
  - 상태: Vercel 외 전부 통과 시 `IN PROGRESS — Vercel Preview 대기`
- `docs/harness/EXECUTION-PLAN.md` 진행 현황판의 Gate 1 행만 상태 갱신.
- **커밋:** `docs(gates): gate 1 evidence record`

## 각 Phase 공통 규칙

- Phase 끝마다 `pnpm check` 실행. **실패하면 고치고 다시 실행.** 통과 전에는 다음 Phase로 가지 않는다.
- 테스트를 통과시키려고 fixture/schema/기준을 완화하지 않는다. 기준이 틀렸다고 판단되면 멈추고 보고한다.
- `AGENTS.md` §9 금지 사항 준수 (DB 드라이버, 세션 쿠키, 결제/로그인 구현, `process.env` 직접 접근, 비밀값 커밋 등).
- 운영 도메인(`nonsul-learn.com`)에 요청하지 않는다. `NEXT_PUBLIC_SITE_URL` 등 env 예시값으로만 쓴다.
- 커밋 메시지는 Conventional Commits. push는 브랜치까지만 하고 PR 생성은 사람에게 맡긴다 (push 권한이 없으면 로컬 커밋까지만).

## 멈추고 보고해야 하는 경우

- Phase 0에서 기존 설치와 충돌 발견
- 의존성 추가가 필요한데 목록에 없을 때
- `/_v2/check` 라우트를 Next.js에서 만들 수 없을 때 (대안을 제안하고 멈춤)
- 문서(GATES/HARNESS/AGENTS) 기준과 구현이 충돌할 때

## 최종 보고 형식

1. Phase별 결과 (커밋 해시, 변경 파일 수, `pnpm check` 결과)
2. 설치된 실제 버전: Next.js, React, TypeScript, Node, pnpm, zod, Vitest, Playwright, ESLint
3. 테스트 현황: L1 / L2 / L3 / lint-boundary / env 각 개수와 통과 여부
4. Gate 1 항목 대비 체크리스트 (● 필수 항목별 ✅/⏳/❌)
5. 사람이 할 일 (Vercel 연결, env 등록, PR 생성)
6. 문서와 다르게 구현한 부분과 이유 (없으면 "없음")
7. 추가 제안 (의존성 등)