# AGENTS.md — nonsullearn-v2-frontend

> 이 문서는 이 레포에서 일하는 모든 AI 코딩 에이전트와 사람을 위한 **작업 계약서**다.
> 도구별 추가 규칙은 `CLAUDE.md` 등에 있지만, 충돌하면 이 문서가 우선한다.
> 검증 기준은 `docs/HARNESS.md`, 단계별 통과 기준은 `docs/GATES.md`.

---

## 1. 프로젝트 한 줄 요약

**논술런(온라인 논술 인강 플랫폼)의 Legacy PHP/MariaDB Production을 그대로 유지하면서, 사용자 경험과 마케팅 영역(랜딩, 홈, 강좌 상세)만 Next.js + TypeScript로 옮기는 레포.**

> Preserve the Core. Replace the Experience.

PHP 제거는 목표가 아니다. 결제, 로그인, 강의실은 계속 PHP가 소유한다.

---

## 2. 아키텍처 (방식 1)

```text
Browser ── 메인 도메인 (DNS → EC2)
             │
          Apache (정문)
             ├─ /lp/*, /courses/*, /_next/*, /api/v2-health, (컷오버 후) /
             │        └─ [P] 프록시 (Cookie 제거, X-V2-Proxy-Secret 추가) ─▶ Vercel (이 레포)
             ├─ /v2-api/*.php  ─ Thin PHP Bridge (nonsul-learn-html1 레포)
             └─ 그 외 전부      ─ Legacy PHP (로그인, 결제, PG, 강의실, 첨삭, 업로드)
```

| 데이터 | 경로 | 호출 주체 |
|---|---|---|
| 로그인 상태 (viewer) | `/v2-api/viewer.php` | **브라우저** (same-origin, PHP 세션 쿠키 자동) |
| 강좌 공개 정보 | `/v2-api/courses.php` | **Vercel 서버** (ISR, 쿠키 없음) |
| 로그인, 결제, 강의실 | Legacy URL로 이동 (Handoff) | 링크만 |

### 절대 원칙

1. **이 레포는 MariaDB에 접속하지 않는다.** DB 드라이버(`mysql2`, `prisma` 등)를 추가하지 않는다.
2. **이 레포는 PHP 세션 쿠키를 읽거나 전달하지 않는다.** 서버 코드에서 `cookies()`로 `PHPSESSID`를 다루지 않는다.
3. **결제, 로그인, 회원가입, 강의 재생, 첨삭, 관리자 기능을 구현하지 않는다.** `legacyRoutes`로 링크만 건다.
4. **SSH는 애플리케이션 경로가 아니다.** 런타임 코드에 SSH, 서버 IP, 파일 경로가 등장하면 안 된다.
5. **Legacy 명명(`mb_*`, `it_*`, `g5_*`)은 `src/legacy/` 밖으로 나가지 않는다.**

---

## 3. 소유권 경계

| V2 (이 레포) 소유 | Legacy PHP 소유 (건드리지 않음) |
|---|---|
| 마케팅 랜딩, 홈, 강좌 상세 UI | 로그인, 세션, 회원가입 |
| Design System, 반응형 | 장바구니, 주문, 결제, PG callback, 환불 |
| SEO, 메타데이터, sitemap | 강의 재생, 내 강의실, LMS |
| Analytics, UTM/Attribution, 실험 | 첨삭, 관리자 |
| Legacy Adapter, Contract | 권한 체계, 가격/판매상태 계산 semantics |

애매하면: **쓰기(write)가 있거나 돈이 오가면 PHP 소유.**

---

## 4. 레포 구조

```text
src/
├── app/                        # 라우트. 데이터 로딩 + 화면 조립만
│   ├── page.tsx                # 홈
│   ├── lp/[slug]/page.tsx      # 마케팅 랜딩
│   ├── courses/[id]/page.tsx   # 강좌 상세 (ISR)
│   ├── api/v2-health/route.ts  # 프록시 진단
│   ├── robots.ts, sitemap.ts
│   └── layout.tsx
├── features/                   # 사용자 기능 단위 (header, course-detail, landing ...)
├── components/                 # Design System primitive. Legacy/도메인을 모름
├── legacy/                     # ★ Legacy Integration Boundary (유일한 Legacy 접점)
│   ├── contracts/              # zod schema + 타입
│   │   └── fixtures/           # Contract 예시 JSON (하네스의 단일 진실)
│   ├── client/                 # bridge-fetch.ts (브라우저), bridge-server.ts (서버)
│   ├── adapters/               # <contract>/{http,mock,index}.ts
│   ├── handoff/routes.ts       # Legacy URL 단일 출처
│   └── index.ts                # 외부 공개 API (여기 export된 것만 사용 가능)
├── analytics/                  # track(), canonical events, provider adapters, attribution
├── env.client.ts               # NEXT_PUBLIC_* 검증
├── env.server.ts               # 서버 env 검증 ('server-only')
└── middleware.ts               # origin 보호 (프록시 secret 검사)
tests/
├── contract/   component/   e2e/
scripts/
└── smoke-prod.sh
docs/
├── HARNESS.md   GATES.md   runbook.md
├── gates/      # Gate별 통과 기록 (증거)
├── parity/     # 페이지별 parity 체크 기록
└── decisions/  # ADR (중요한 설계 결정)
```

---

## 5. 명령어

```bash
pnpm install
pnpm dev                 # 로컬 (viewer/course = mock)
pnpm lint
pnpm typecheck
pnpm test                # contract + component
pnpm test:contract       # L1
pnpm test:component      # L2
pnpm test:e2e            # L3 (Playwright, mock)
pnpm build
pnpm check               # lint + typecheck + test + build  ← 작업 완료 전 반드시 통과
pnpm smoke:prod          # L4 (운영 대상, 사람이 실행)
```

mock 시나리오 전환(로컬): URL에 `?viewer=anonymous|member|corrector|unavailable|slow`, `?course=on-sale|sold-out|missing|error`.

---

## 6. 코딩 규칙

### 6.1 TypeScript
- `strict: true`. `any` 금지 (불가피하면 `unknown` + 좁히기). `@ts-ignore` 금지, `@ts-expect-error`는 이유 주석과 함께만.
- 외부에서 들어오는 모든 데이터(Bridge 응답, URL 파라미터, 쿠키)는 **zod로 parse한 뒤** 사용.
- 날짜, 금액 포맷은 `src/lib/format.ts` 유틸만 사용 (원화, `Asia/Seoul`).

### 6.2 Import 경계 (ESLint로 강제)
- `app/`, `features/`, `components/` → `@/legacy` (index)만 import. `@/legacy/client/*`, `@/legacy/adapters/*` 직접 import 금지.
- `components/` → `@/legacy`, `@/analytics` import 금지 (순수 UI).
- `process.env` 직접 접근 금지. `@/env.client`, `@/env.server`만 사용.
- 클라이언트 컴포넌트에서 `@/env.server` import 금지.

### 6.3 Next.js
- 기본은 Server Component. `'use client'`는 상호작용이 필요한 최소 단위에만.
- 강좌 페이지는 ISR (`revalidate = env.COURSE_REVALIDATE_SECONDS`). 요청마다 SSR(`force-dynamic`)은 `/api/v2-health` 외 금지.
- viewer는 **클라이언트에서만** 조회 (`ViewerProvider`). 서버 렌더링 결과에 로그인 상태가 섞이면 캐시가 오염된다.
- 이미지: `next/image`. Legacy 자산은 `NEXT_PUBLIC_LEGACY_ASSET_HOST` remotePatterns 경유.
- 메타데이터: 모든 페이지 `generateMetadata` 또는 `metadata`. canonical은 `NEXT_PUBLIC_SITE_URL` 기준.

### 6.4 UI 상태
- Legacy 의존 상태는 **4가지를 모두 처리**: `loading`, 정상, 빈 값/없음, `unavailable`.
- Bridge 실패는 예외가 아니라 상태다. 페이지가 깨지거나 에러 화면이 뜨면 안 된다.
- viewer `unavailable` → 비로그인처럼 보이게(로그인 버튼) + `bridge_error` 이벤트.
- 권한 판단은 `viewer.can.*`만 사용. `level` 숫자 비교를 UI에서 하지 않는다.

### 6.5 스타일 / 접근성
- Design System 토큰 사용, 임의 색상/간격 하드코딩 금지.
- 모바일(375px) 우선. 가로 스크롤 금지.
- 인터랙티브 요소는 키보드 접근 가능, 이미지 alt 필수.

---

## 7. Legacy Integration 작업 절차

### 7.1 새 Legacy 데이터가 필요할 때

```text
1. Existing Endpoint First   기존 PHP endpoint로 해결 가능한가? (docs/decisions/에 확인 결과 기록)
2. Contract 먼저             src/legacy/contracts/<name>.ts  (zod .strict(), v 버전 필드)
3. Fixture                   fixtures/<name>.<scenario>.json  정상/빈값/금지필드(invalid) 최소 3개
4. 테스트                     tests/contract/<name>.test.ts  → 실패 확인
5. Adapter                   adapters/<name>/{mock,http,index}.ts
6. index.ts export           공개 API에 추가
7. UI                        features/ 에서 사용, 4가지 상태 처리
8. Bridge 요청서             PHP 쪽 변경이 필요하면 docs/decisions/bridge-<name>.md 작성
                             (PHP 코드 작성/배포는 nonsul-learn-html1 레포 작업)
```

### 7.2 Contract 규칙
- 응답 envelope: `{ "v": 1, ... }`. 필드 추가 = 버전 유지, **삭제/의미 변경 = 버전 증가**.
- Canonical 이름 사용 (`displayName`, `salePrice`), Legacy 컬럼명 금지.
- 개인 식별 정보(로그인 ID, 이메일, 전화번호) 필드 금지.
- 사람마다 다른 값(회원별 가격, 수강 여부)은 공개 Bridge(`courses`)에 넣지 않는다.

### 7.3 Handoff
- Legacy로 가는 모든 링크는 `legacyRoutes.*()`로 생성. 문자열 URL 하드코딩 금지.
- 로그인 링크에는 현재 경로를 복귀 파라미터로 전달.
- Handoff 클릭은 `track('cta_click' | 'begin_checkout', ...)` 후 이동.

---

## 8. Analytics 규칙

- 모든 이벤트는 `track(event, props)` 경유. 컴포넌트에서 `gtag`, `fbq`, `wcs` 직접 호출 금지.
- 이벤트 이름은 `src/analytics/events.ts`의 canonical 목록만 (`page_view`, `cta_click`, `course_view`, `begin_checkout`, `bridge_error` ...). 새 이벤트는 목록에 먼저 추가.
- `purchase`는 Legacy 결제 완료 페이지가 소유. V2에서 발생시키지 않는다.
- UTM/Referrer는 첫 진입 시 first-party 쿠키(메인 도메인)에 저장. 개인정보 저장 금지.
- `NEXT_PUBLIC_ANALYTICS_ENABLED=false`면 콘솔 출력만.

---

## 9. 금지 사항 (위반 시 PR 거절)

- DB 접속 코드, DB 드라이버 의존성 추가
- PHP 세션 쿠키 읽기/전달, 자체 로그인/JWT 구현
- 결제, PG, 장바구니, 강의 재생 로직 구현
- `src/legacy/` 밖에서 Legacy URL 문자열, `mb_*`/`it_*` 필드명 사용
- `process.env` 직접 접근, `NEXT_PUBLIC_*`에 비밀값
- `.env*`, `*.pem`, 세션값, 비밀값 커밋
- 운영 서버 대상 명령(SSH, Apache 설정 변경, 스모크 제외 운영 요청) **실행**. 제안은 가능하나 실행은 사람이 한다
- 테스트를 통과시키기 위해 fixture/schema를 실제 Legacy 응답과 다르게 바꾸기
- 하네스 테스트 삭제, `skip`, 기준 완화 (사람 승인 없이)
- 기존 Legacy URL 구조 변경을 전제로 한 코드 (301은 Apache 소관)

---

## 10. 작업 완료 기준 (Task DoD)

모든 작업은 아래를 만족해야 "완료"다. 상세 기준은 `docs/GATES.md` §3.

- [ ] `pnpm check` 통과
- [ ] 변경한 Contract/Adapter에 대응하는 L1/L2 테스트 존재
- [ ] Legacy 의존 UI는 4가지 상태 처리
- [ ] 새 페이지: 메타데이터, canonical, 모바일 레이아웃, L3 e2e 1개 이상
- [ ] 새 env: `.env.example`, `env.*.ts` 스키마, Vercel 환경별 값 표(`docs/HARNESS.md`) 갱신
- [ ] 설계 결정이 있었다면 `docs/decisions/`에 ADR
- [ ] PR 설명에: 무엇을, 왜, 어떻게 검증했는지, 관련 Gate

---

## 11. 브랜치 / 커밋 / PR

- `main` = Production (Vercel 자동 배포). 직접 push 금지.
- 브랜치: `feat/*`, `fix/*`, `chore/*`, `docs/*`.
- 커밋: Conventional Commits (`feat(legacy): add course contract v1`).
- PR 필수 체크: lint, typecheck, test, build. Preview URL에서 화면 확인.
- Contract 변경 PR은 제목에 `[contract]` 표시, Bridge 레포 변경 필요 여부 명시.

---

## 12. 관련 레포

| 레포 | 역할 | 이 레포와의 관계 |
|---|---|---|
| `nonsul-learn-html1` | Legacy PHP 소스 baseline + `html2/v2-api/` Bridge | Contract 변경 시 PHP 쪽 동반 수정, 배포는 그 레포 스크립트로 |
| (운영 서버) | Apache + PHP + MariaDB | 이 레포에서 직접 접근하지 않음 |

---

## 13. 용어

| 용어 | 의미 |
|---|---|
| Bridge | `/v2-api/*.php`. Legacy 결과를 Canonical JSON으로 번역하는 얇은 PHP 파일 |
| Contract | Bridge 응답의 zod schema. V2와 PHP가 공유하는 약속 |
| Adapter | Contract를 채우는 구현 (mock / http) |
| Handoff | Legacy PHP 화면으로 링크 이동 |
| Parity | Legacy 화면과 V2 화면의 사용자 관점 동작 일치 |
| Kill switch | 운영 서버 `/etc/nonsulrun/v2.off`. 존재하면 V2 경로 전부 Legacy로 |
| Origin | `v2-origin.<도메인>`. 직접 접근 시 메인 도메인으로 리다이렉트 |