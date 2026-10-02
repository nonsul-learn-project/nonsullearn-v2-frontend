# nonsullearn-v2-frontend

논술런의 사용자 경험 영역(홈, 강좌 상세)을 Next.js + TypeScript로 옮기는 레포다.
Legacy PHP/MariaDB Production은 그대로 유지한다. 로그인, 결제, 강의실, 첨삭, 관리자는 계속 PHP가 소유한다.

> Preserve the Core. Replace the Experience.

작업 계약서는 [`AGENTS.md`](./AGENTS.md), 검증 기준은 [`docs/harness/HARNESS.md`](./docs/harness/HARNESS.md),
단계별 통과 기준은 [`docs/harness/GATES.md`](./docs/harness/GATES.md)다. 별도 마케팅 랜딩은 없고 홈이 랜딩 역할을 한다.

## 요구 사항

- Node.js 22 (`.nvmrc` 참고 — `nvm use`)
- pnpm (`corepack enable pnpm` — 버전은 `package.json`의 `packageManager`가 고정한다)

## 환경변수

환경변수의 단일 진실은 [`.env.example`](./.env.example)이고, 검증 스키마는
`src/env.client.ts` / `src/env.server.ts`다. `.env.local`은 커밋되지 않으며 레포에 포함돼 있지 않다.
처음 받았으면 복사해서 만든다.

```bash
cp .env.example .env.local
```

기본값은 전부 mock이라 Legacy 서버 없이 로컬에서 돈다.
`src/env.*.ts`는 import 시점에 env를 검증하므로, 값이 빠지면 `pnpm build`가 그 자리에서 실패한다.
환경별 실제 값은 [`docs/runbook/vercel-setup.md`](./docs/runbook/vercel-setup.md)의 표를 따른다.

## 로컬 실행

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000) — 내부 확인용 페이지는 `/_v2/check`다 (noindex).

mock 시나리오는 URL 쿼리로 전환한다.

- `?viewer=anonymous|member|corrector|admin|unavailable|slow`
- `?course=on-sale|sold-out|missing|error`

## 검증

```bash
pnpm check          # lint + typecheck + test + build  ← 작업 완료 전 반드시 통과
pnpm test:contract  # L1 Contract
pnpm test:component # L2 Component
pnpm test:e2e       # L3 Playwright (로컬 mock)
```

`pnpm smoke:prod`(L4)와 `pnpm test:visual`(Gate 2)은 사람이 실행한다. 에이전트는 운영 도메인에 요청하지 않는다.

## 레포 구조

```text
src/app/            라우트. 데이터 로딩 + 화면 조립만
src/features/       사용자 기능 단위 (header, home, course-detail ...)
src/components/     여러 feature가 공유하는 조합 컴포넌트만 (순수 UI)
src/design-system/  tokens.css, legacy CSS 복사본, primitive  (Gate 2에서 채움)
src/content/        타입 있는 문구·수치·FAQ·후기·링크 데이터  (Gate 5에서 채움)
src/legacy/         ★ Legacy Integration Boundary — 유일한 Legacy 접점
src/analytics/      track(), canonical event, attribution
src/lib/            포맷 등 프레임워크 무관 유틸
tests/              contract(L1), component(L2), lint(경계), e2e(L3)
docs/harness/       GATES.md, HARNESS.md, EXECUTION-PLAN.md
docs/gates/         Gate별 통과 증거
docs/decisions/     ADR
```

`app/`, `features/`, `components/`는 `@/legacy`(index)만 import한다. 내부 경로 직접 import는 ESLint가 막는다.
`process.env` 직접 접근은 `src/env.client.ts`, `src/env.server.ts`에서만 허용한다.

## 하지 않는 것

이 레포는 MariaDB에 접속하지 않고, PHP 세션 쿠키를 읽거나 전달하지 않으며,
로그인·결제·장바구니·강의 재생·첨삭·관리자 기능을 구현하지 않는다. 자세한 금지 목록은 `AGENTS.md` §9다.
