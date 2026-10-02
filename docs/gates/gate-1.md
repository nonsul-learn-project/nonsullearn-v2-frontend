# Gate 1 — V2 Foundation + Harness

작성일: 2026-10-02
브랜치: `feat/gate-1-foundation` (`main` = `ef1e274` 에서 분기)
근거 파일: `docs/harness/GATES.md` Gate 1, `docs/harness/HARNESS.md` §3~§6, `AGENTS.md`, `docs/gate1/Prompt gate1 foundation.md`
상태: **IN PROGRESS — Vercel Preview 대기**

## 필수(●) 항목별 결과

| # | 항목 | 결과 | 판정 | 증거 |
|---:|---|---|---|---|
| 1 | App Router | `src/app/`, Next 16.3.7 App Router. 빌드 라우트 6개 | DONE | `cb332c9`, 빌드 출력 아래 |
| 2 | TS strict | `strict: true` + `noUncheckedIndexedAccess: true` | DONE | `tsconfig.json`, `tests/contract/scaffold.test.ts` |
| 3 | pnpm | `packageManager: "pnpm@12.8.1"`, `pnpm-lock.yaml`, `package-lock.json` 제거 | DONE | `cb332c9` |
| 4 | env validation | zod 12변수. production 금지 조합이 **빌드를 실패시킨다** | DONE | `ed1b8ff`, 아래 "production 가드 실증" |
| 5 | ESLint boundary | 경계 규칙 4종. 위반 샘플을 ESLint API 로 lint 해 동작 증명 | DONE | `1645d0c`, `tests/lint/boundary.test.ts` 32개 |
| 6 | error / not-found | 최소 마크업. 내부는 `next/link`, Legacy 는 `legacyRoutes` | DONE | `218e367`, L3 `seo.spec.ts` |
| 7 | metadata / robots / sitemap | `metadataBase` = `NEXT_PUBLIC_SITE_URL`. production 만 allow. sitemap 빈 배열 | DONE | `218e367`, `tests/contract/robots.test.ts` 8개 |
| 8 | `src/env.client.ts`, `src/env.server.ts` | 작성. server 쪽 첫 줄 `import 'server-only'` | DONE | `ed1b8ff` |
| 9 | `src/legacy/` contracts / fixtures / adapters / handoff | viewer v1 + course v1(DRAFT), fixture 13개, adapter 2종, `legacyRoutes` 13경로 | DONE | `80f6545` |
| 10 | L1 CI | 225개 (`tests/contract/`). CI job `check` | DONE | `80f6545`, `c61ef65` |
| 11 | L2 CI | 33개 (`tests/component/`). CI job `check` | DONE | `8ff2c82`, `c61ef65` |
| 12 | L3 Playwright 골격 | 20개 통과 (Chromium, `build && start`). CI job `e2e` | DONE | `8ff2c82`, `c61ef65` |
| 13 | middleware origin 보호 | `src/proxy.ts` — 308 + `X-Robots-Tag: noindex` + 상수시간 비교 | DONE | `218e367`, `tests/contract/proxy.test.ts` 10개 |
| 14 | `/api/v2-health` | `{proxied, cookieForwarded, sha, env}`. 쿠키·헤더 원문 미노출 | DONE | `218e367`, `tests/contract/v2-health.test.ts` 14개 |
| 15 | `pnpm check` | 전 Phase 종료 시 통과. 최종 290개 테스트 + build | DONE | 아래 "pnpm check 출력" |
| 16 | **Vercel Preview** | **미실행 — 사람 작업** | **PENDING** | `docs/runbook/vercel-setup.md` |

## 선택(○) 항목

| 항목 | 결과 | 판정 |
|---|---|---|
| Production deployment 준비 (공개 cutover 제외) | `vercel.json` (`regions: ["icn1"]`), runbook 작성. **연결은 하지 않음** — origin 도메인이 Gate 0.9 결정 #6 대기 | PARTIAL |

## Phase별 커밋

| Phase | 커밋 | 변경 파일 | `pnpm check` |
|---|---|---:|---|
| 1 Scaffold | `cb332c9` | 13 | PASS (7) |
| 2 Env contract | `ed1b8ff` | 15 | PASS (28) |
| 3 구조 + 경계 규칙 | `1645d0c` | 19 | PASS (55) |
| 4 Legacy + L1 | `80f6545` | 44 | PASS (225) |
| 5 운영 장치 | `218e367` | 12 | PASS (257) |
| 6 검증 페이지 + L2/L3 | `8ff2c82` | 16 | PASS (290) + L3 20 |
| 7 CI + Vercel 준비 | `c61ef65` | 3 | PASS (290) |
| 8 Gate 기록 | (이 커밋) | — | PASS (290) |

## 설치된 실제 버전

| 패키지 | 버전 |
|---|---|
| Next.js | 16.3.7 |
| React / React DOM | 19.2.4 |
| TypeScript | 5.9.3 |
| Node | v22.23.2 (`.nvmrc` = `22`, `engines.node` = `>=22.23.2`) |
| pnpm | 12.8.1 (corepack) |
| zod | 4.6.5 |
| Vitest | 3.2.7 |
| Playwright | 1.63.0 |
| ESLint | 9.39.4 |
| eslint-config-next | 16.3.7 |
| @testing-library/react | 16.3.3 |
| jsdom | 26.1.0 |
| Prettier | 3.9.9 |
| server-only | 0.0.1 |

## 테스트 현황 — 290개 전부 통과

| 층 | 파일 | 개수 |
|---|---|---:|
| **L1** | `tests/contract/fixtures.test.ts` | 36 |
| L1 | `tests/contract/handoff.test.ts` | 32 |
| L1 | `tests/contract/bridge-fetch.test.ts` | 29 |
| L1 | `tests/contract/viewer.test.ts` | 23 |
| L1 | `tests/contract/course.test.ts` | 23 |
| L1 | `tests/contract/adapters.test.ts` | 22 |
| L1 | `tests/contract/env.test.ts` | 21 |
| L1 | `tests/contract/v2-health.test.ts` | 14 |
| L1 | `tests/contract/proxy.test.ts` | 10 |
| L1 | `tests/contract/robots.test.ts` | 8 |
| L1 | `tests/contract/scaffold.test.ts` | 7 |
| | **L1 소계** | **225** |
| **L2** | `tests/component/AuthArea.test.tsx` | 24 |
| L2 | `tests/component/analytics.test.ts` | 6 |
| L2 | `tests/component/analytics.types.test.ts` | 3 |
| | **L2 소계** | **33** |
| **lint 경계** | `tests/lint/boundary.test.ts` | 32 |
| | **Vitest 합계** | **290** |
| **L3** | `tests/e2e/` 4파일 (Playwright Chromium) | **20** |

L4(`scripts/smoke-prod.sh`)는 골격만 작성했고 **실행하지 않았다** (`bash -n` 문법 검사만).
L5/L6 은 Gate 5 이후 범위다. `pnpm test:visual` 은 Gate 2 안내 문구만 출력한다.

### HARNESS.md §4 viewer 6 시나리오 대응

| HARNESS 시나리오 | 구현 Pass 조건 | 결과 |
|---|---|---|
| `loading` | 고정 폭(12rem) placeholder, 링크 0개 | PASS |
| `anonymous` | 로그인 링크 = `legacyRoutes.login(현재경로)` | PASS |
| `member` | 정보수정·로그아웃 링크 (**표시 이름 아님** — ADR 0003) | PASS |
| `corrector` | 첨삭제출현황 노출, 관리자 미노출 | PASS |
| `member`(비첨삭) | 첨삭·관리자 둘 다 미노출 | PASS |
| `unavailable` | 로그인 버튼, 에러 UI 없음, `bridge_error` 정확히 1회 | PASS |

## 증거 — `pnpm check` 출력

```text
$ pnpm lint && pnpm typecheck && pnpm test && pnpm build
$ eslint .
$ tsc --noEmit
$ vitest run
 Test Files  15 passed (15)
      Tests  290 passed (290)
$ next build
▲ Next.js 16.3.7 (Turbopack)
✓ Compiled successfully
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /_v2/check
├ ƒ /api/v2-health
├ ○ /robots.txt
└ ○ /sitemap.xml

ƒ Proxy (Middleware)
```

`/_v2/check` 가 라우트 목록에 있다 = `src/app/%5Fv2/check/` 트릭이 동작한다.
`ƒ Proxy (Middleware)` = `src/proxy.ts` 가 인식됐다.

## 증거 — production 가드 실증

`src/env.server.ts` 의 금지 조합이 실제로 빌드를 실패시키는지 직접 확인했다.

```text
VERCEL_ENV=production COURSE_SOURCE=mock NEXT_PUBLIC_VIEWER_SOURCE=mock → EXIT=1
  production env 금지 조합:
    - NEXT_PUBLIC_VIEWER_SOURCE=mock — production에서는 http 여야 한다 (mock 금지)
    - COURSE_SOURCE=mock — production에서는 http 여야 한다 (mock 금지)

VERCEL_ENV=production V2_PROXY_SECRET=<17자>                           → EXIT=1
  production env 금지 조합:
    - V2_PROXY_SECRET 길이 17 — production에서는 32자 이상이어야 한다

VERCEL_ENV=production COURSE_SOURCE=http VIEWER=http SECRET=<40자>     → EXIT=0
```

## 증거 — L3 가 잡은 실제 결함

`tests/e2e/mobile.spec.ts` 가 `/_v2/check` 의 375px 가로 스크롤을 잡았다 (`scrollWidth = 406 > 375`).
원인은 create-next-app 이 남긴 `main { display: grid; place-content: center }` 로,
grid track 이 max-content 로 잡혀 긴 문자열이 뷰포트를 넘겼다.
**기준을 완화하지 않고** `src/app/globals.css` 를 고쳤다. 커밋 `8ff2c82`.

## 결정 기록 (ADR)

| ADR | 내용 |
|---|---|
| [0003](../decisions/0003-viewer-no-display-name.md) | Viewer Contract v1 에서 `displayName` 제외. `HARNESS.md` §4 L2 `member` 행과 어긋남을 기록 |
| [0004](../decisions/0004-legacy-public-api-split.md) | Legacy 공개 API 를 `@/legacy` + `@/legacy/server` 로 분리. `AGENTS.md` §4/§6.2 와 어긋남을 기록 |

## 문서와 다르게 구현한 부분

| # | 문서 | 실제 | 이유 |
|---:|---|---|---|
| 1 | `AGENTS.md`/`GATES.md`/`HARNESS.md` — `middleware.ts` | `src/proxy.ts` | Next 16 에서 `middleware` 규약이 deprecated 이고 둘이 같이 있으면 빌드가 실패한다. 같은 파일을 가리킨다 |
| 2 | `AGENTS.md` §4/§6.2 — `@/legacy` (index) 하나 | `@/legacy` + `@/legacy/server` | 단일 barrel 은 `'use client'` 컴포넌트에서 `server-only` 때문에 빌드가 깨진다. ADR 0004 |
| 3 | `HARNESS.md` §4 L2 `member` — "표시 이름" | 로그아웃·정보수정 링크로 검증 | Viewer Contract v1 에 `displayName` 이 없다. ADR 0003 |
| 4 | `GATES.md` Gate 1 env 목록 — 추적 ID, `NEXT_PUBLIC_ATTRIBUTION_COOKIE_DOMAIN` 포함 | 넣지 않음 | Gate 5 에서 측정 신규 도입 시 추가. 근거: `docs/discovery/tracking-inventory.md` (현재 Legacy 추적 태그 0건, 결정 #11) |
| 5 | `AGENTS.md` §4 — `src/legacy/bridge-fetch.ts` (루트) | `src/legacy/client/bridge-fetch.ts` | `AGENTS.md` 내부 불일치. §6.2 가 전제하는 `@/legacy/client/*` 를 따랐다 |
| 6 | 기술 기준 — Node "현재 Active LTS" | Node 22 (`.nvmrc`) | 설치돼 있고 Vercel 이 지원하는 버전. 사람 결정 |
| 7 | `HARNESS.md` §9 — Preview `course source = http` | Gate 1 Preview 는 `mock` | Bridge 가 Gate 3 에 배포된다. runbook 에 전환 시점 명시 |

## PASS 조건 체크리스트

PASS CONDITION: "mock 기반 V2 페이지를 Vercel Preview 로 검증할 수 있다"

- [x] `pnpm check` 통과 (lint, typecheck, test 290, build)
- [x] L1/L2 가 CI job `check` 에서 돈다
- [x] L3 Playwright 20개 통과, CI job `e2e` 에서 돈다
- [x] `src/proxy.ts` origin 보호와 `/api/v2-health` 동작 확인
- [x] ESLint 경계 규칙이 실제로 발동함을 테스트로 증명
- [x] production env 금지 조합이 빌드를 실패시킴을 실증
- [ ] **Vercel 레포 import 와 환경변수 등록** → `docs/runbook/vercel-setup.md` §1~§2
- [ ] **Preview URL 에서 5개 항목 확인** → `docs/runbook/vercel-setup.md` §5
- [ ] `main` push 와 PR 생성 (로컬 커밋까지만 되어 있다)

레포 트랙 작업은 끝났고 Vercel Preview 검증만 남았으므로 **IN PROGRESS** 다.
Preview 확인 결과를 위 체크리스트와 함께 이 문서에 추가하면 PASS 로 승격한다.

## 사람이 할 후속 작업

| # | 할 일 | 문서 |
|---:|---|---|
| 1 | `main` push (로컬 `main` 이 `origin/main` 보다 3커밋 앞서 있다) 후 `feat/gate-1-foundation` push, PR 생성 | `AGENTS.md` §11 |
| 2 | Vercel 레포 import, 환경별 env 등록, `openssl rand -hex 32` 로 production secret 생성 | `docs/runbook/vercel-setup.md` §1~§2 |
| 3 | Preview URL 에서 5개 항목 확인 | `docs/runbook/vercel-setup.md` §5 |
| 4 | Vercel 상업적 사용 가능 플랜 확정 (Gate 0.9 결정 #5) | `docs/discovery/decisions-needed.md` |
| 5 | origin 도메인 체계 확정 (Gate 0.9 결정 #6) — Gate 4 전제 | 동일 |
| 6 | `HARNESS.md` §4 L2 `member` 행의 "표시 이름" 처리 여부 결정 | ADR 0003 |
| 7 | `AGENTS.md` §4/§6.2 를 `@/legacy/server` 포함으로 갱신할지 결정 | ADR 0004 |
| 8 | Bridge PHP (`viewer.php`, `courses.php`) 작성·배포 — Gate 3 | `EXECUTION-PLAN.md` Step 2-B |
| 9 | `GATES.md` §번호 대응표의 Gate 1 상태 행(`NOT STARTED`) 갱신. 이번 작업 범위가 `EXECUTION-PLAN.md` 현황판으로 한정돼 있어 건드리지 않았다 | `GATES.md:30` |
