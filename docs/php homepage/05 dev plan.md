# 논술런 V2 — 환경변수 구조 & 개발 계획 (v0.3)

> 작성: 2026-10-01
> 아키텍처: 방식 1 (Apache 정문 + Vercel, Thin PHP Bridge)
> 짝 문서: `03-prerequisites-and-harness.md`, `04-implementation-plan.md`
> 첨부: `v2-frontend.env.example` → V2 레포 `.env.example` / `legacy-deploy.env.example` → Legacy 레포 `scripts/deploy.env.example`

---

## 1. 환경변수 설계 원칙

1. **V2 레포에는 DB, SSH, PHP 세션 관련 값이 없다.** 처음 문서(§16)의 `DB_*`, `SESSION_SECRET`, `LEGACY_SSH_*`는 방식 1에서 V2 레포에서 빠졌다. Vercel은 DB에 접속하지 않고 세션을 보지 않기 때문이다.
2. **SSH 정보는 Legacy 레포의 로컬 배포 설정에만** 있다 (`deploy.env`, gitignore).
3. **`NEXT_PUBLIC_*`에는 비밀값을 넣지 않는다.** 브라우저 번들에 그대로 들어간다.
4. **모든 값은 빌드 시점에 검증한다.** 잘못된 env로 배포되면 런타임이 아니라 빌드가 실패해야 한다.
5. **Adapter 소스(`mock`/`http`)는 env로 전환한다.** 코드 분기 없이 환경별로 다른 데이터 소스를 쓴다.

### 1.1 레포별 env 위치

```text
nonsullearn-v2-frontend/
├── .env.example          ← 커밋 (값은 예시)
├── .env.local            ← gitignore (로컬 개발)
└── src/env.ts            ← zod 검증, 앱은 process.env 대신 이것만 import

nonsul-learn-html1/
└── scripts/
    ├── deploy.env.example  ← 커밋
    └── deploy.env          ← gitignore (SSH, 서버 경로)
```

### 1.2 환경별 값

| 변수 | 로컬 | Vercel Preview | Vercel Production |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | 메인 도메인 | 메인 도메인 |
| `NEXT_PUBLIC_LEGACY_BASE_URL` | 메인 도메인 | 메인 도메인 | **빈 값** (상대경로) |
| `NEXT_PUBLIC_VIEWER_SOURCE` | `mock` | `mock` | `http` |
| `COURSE_SOURCE` | `mock` | `http` | `http` |
| `LEGACY_BRIDGE_BASE` | 메인 도메인`/v2-api` | 동일 | 동일 |
| `V2_PROXY_SECRET` | 아무 값 | Preview용 별도 값 | **운영 비밀값** (Apache와 동일) |
| `V2_ENFORCE_PROXY` | `false` | `false` | (무시, production은 항상 강제) |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` | `false` | `true` |
| `NEXT_PUBLIC_ATTRIBUTION_COOKIE_DOMAIN` | 빈 값 | 빈 값 | `.메인도메인` |
| 추적 ID들 | 빈 값 | 빈 값 (또는 테스트 속성) | Legacy와 동일 ID |

Preview에서 `COURSE_SOURCE=http`인 이유: 강좌 데이터는 공개 정보라 Preview에서도 실제 데이터로 화면을 검증할 수 있다. 반면 viewer는 vercel.app 도메인에 PHP 세션이 없으므로 mock만 가능하다.

### 1.3 `src/env.ts`

```ts
import { z } from 'zod';

const bool = z.enum(['true', 'false']).transform((v) => v === 'true');
const optional = z.string().optional().transform((v) => (v ? v : undefined));

const server = z.object({
  COURSE_SOURCE: z.enum(['mock', 'http']),
  LEGACY_BRIDGE_BASE: z.string().url().refine((v) => !v.endsWith('/'), '끝에 / 금지'),
  LEGACY_BRIDGE_TIMEOUT_MS: z.coerce.number().int().min(500).max(10000).default(3000),
  COURSE_REVALIDATE_SECONDS: z.coerce.number().int().min(30).default(300),
  V2_PROXY_SECRET: z.string().min(16),
  V2_ENFORCE_PROXY: bool.default('false'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).default('development'),
});

const client = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_LEGACY_BASE_URL: z.string().url().or(z.literal('')).default(''),
  NEXT_PUBLIC_LEGACY_ASSET_HOST: z.string().min(1),
  NEXT_PUBLIC_VIEWER_SOURCE: z.enum(['mock', 'http']),
  NEXT_PUBLIC_ANALYTICS_ENABLED: bool.default('false'),
  NEXT_PUBLIC_GTM_ID: optional,
  NEXT_PUBLIC_GA4_ID: optional,
  NEXT_PUBLIC_META_PIXEL_ID: optional,
  NEXT_PUBLIC_NAVER_WCS_ID: optional,
  NEXT_PUBLIC_KAKAO_PIXEL_ID: optional,
  NEXT_PUBLIC_ATTRIBUTION_COOKIE_DOMAIN: optional,
  NEXT_PUBLIC_ATTRIBUTION_COOKIE_DAYS: z.coerce.number().int().default(30),
});

// NEXT_PUBLIC_* 는 번들러가 정적으로 치환하므로 키를 하나씩 직접 적어야 함
export const clientEnv = client.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_LEGACY_BASE_URL: process.env.NEXT_PUBLIC_LEGACY_BASE_URL,
  NEXT_PUBLIC_LEGACY_ASSET_HOST: process.env.NEXT_PUBLIC_LEGACY_ASSET_HOST,
  NEXT_PUBLIC_VIEWER_SOURCE: process.env.NEXT_PUBLIC_VIEWER_SOURCE,
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  NEXT_PUBLIC_NAVER_WCS_ID: process.env.NEXT_PUBLIC_NAVER_WCS_ID,
  NEXT_PUBLIC_KAKAO_PIXEL_ID: process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID,
  NEXT_PUBLIC_ATTRIBUTION_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_ATTRIBUTION_COOKIE_DOMAIN,
  NEXT_PUBLIC_ATTRIBUTION_COOKIE_DAYS: process.env.NEXT_PUBLIC_ATTRIBUTION_COOKIE_DAYS,
});

// server 값은 서버 코드에서만 import (src/env.server.ts 로 분리하고 'server-only' import 권장)
export const serverEnv = typeof window === 'undefined' ? server.parse(process.env) : (null as never);

// Production 안전 규칙: 잘못된 조합이면 빌드 실패
if (serverEnv && serverEnv.VERCEL_ENV === 'production') {
  if (clientEnv.NEXT_PUBLIC_VIEWER_SOURCE !== 'http') throw new Error('production은 VIEWER_SOURCE=http');
  if (serverEnv.COURSE_SOURCE !== 'http') throw new Error('production은 COURSE_SOURCE=http');
  if (serverEnv.V2_PROXY_SECRET.length < 32) throw new Error('운영 V2_PROXY_SECRET은 32자 이상');
}
```

실제 구현에서는 `env.client.ts` / `env.server.ts`로 파일을 나누고, 서버 파일 첫 줄에 `import 'server-only'`를 넣어 브라우저 번들 유입을 막는다.

### 1.4 비밀값 관리

| 값 | 보관 위치 | 교체 시 |
|---|---|---|
| `V2_PROXY_SECRET` | Vercel env (Production) + Apache vhost | 둘 다 바꾸고 Vercel 재배포 → Apache reload. 순서가 어긋나면 잠깐 308 발생하므로 트래픽 적은 시간에 |
| SSH 키 | 개발자 노트북 `~/.ssh` | AWS 키페어 교체 |
| 테스트 계정 세션 | 셸 `export`로만 일시 사용 | 저장 금지 |

`.gitignore`에 반드시 포함: `.env*.local`, `.env`, `scripts/deploy.env`, `*.pem`

---

## 2. 개발 계획

혼자 진행하는 기준. 기간은 하루 4~6시간 작업 가정의 대략치.

### 전체 일정 개요

```text
Week 1  ▶ P0 사전 준비 · P1 Foundation · Harness 골격
Week 2  ▶ P2 Bridge 배포 · P3 Proxy 개통 (preview 전용)
Week 3  ▶ P4 첫 랜딩 운영 · Analytics 최소 parity
Week 4  ▶ P5 Homepage parity · 컷오버
Week 5~ ▶ P6 Course Detail (강좌별 점진)
```

---

### Sprint 1 (Week 1) — 사전 준비 & Foundation

**Day 1: P0 사전 준비 (SSH 읽기 전용)**
- [ ] `03` 문서 §1.2 명령 실행, 결과를 `nonsul-learn-html1/docs/discovery/runtime-2026-10.md`에 기록
- [ ] Header 필드, MPM, 모듈, 추적 코드, Legacy URL 지도 확정
- [ ] Vercel 플랜, origin 도메인, URL 체계 결정
- [ ] CloudWatch 경보 2개 설정

**Day 2: 프로젝트 생성**
- [ ] `create-next-app` (App Router, TS, ESLint, `src/` 디렉터리)
- [ ] pnpm, Node LTS 버전 고정 (`.nvmrc`, `packageManager` 필드)
- [ ] `tsconfig` strict, `@/` alias
- [ ] `.env.example`, `src/env.client.ts`, `src/env.server.ts`
- [ ] Prettier, ESLint boundary 규칙(`no-restricted-imports`)
- [ ] Vercel 연결, 리전 `icn1`, 환경별 env 등록

**Day 3: Legacy Integration 골격**
- [ ] `src/legacy/contracts/` viewer.ts, course.ts (zod, `.strict()`)
- [ ] `fixtures/` viewer 4종(anonymous, member, corrector, invalid), course 3종(on-sale, sold-out, invalid)
- [ ] `client/bridge-fetch.ts`(브라우저), `client/bridge-server.ts`(서버, timeout, `next: { revalidate }`)
- [ ] `adapters/viewer`, `adapters/course` (mock + http), `handoff/routes.ts`
- [ ] `src/legacy/index.ts` 공개 API 정리

**Day 4: Harness L1, L2, 운영 장치**
- [ ] Vitest 설정, L1 contract 테스트, L2 컴포넌트 테스트(`AuthArea` 5개 시나리오)
- [ ] `middleware.ts` (origin 보호), `/api/v2-health`
- [ ] `metadataBase`, `robots.ts`, `sitemap.ts` 골격
- [ ] GitHub Actions: `lint → typecheck → test` (PR 필수 체크)

**Day 5: Base Layout + Design System 최소 단위**
- [ ] 토큰(색, 타이포, 간격, breakpoint), Container, Button, Link primitive
- [ ] Header(mock viewer), Footer, 모바일 내비게이션
- [ ] 샘플 페이지 `/_v2/check`, `/courses/sample` (mock)
- [ ] Playwright L3 골격: 3개 페이지 200, 콘솔 에러 0, canonical 확인

**Sprint 1 종료 조건:** Vercel Preview URL에서 mock 데이터로 샘플 페이지 동작, CI 전부 통과

---

### Sprint 2 (Week 2) — Bridge & Proxy

**Day 1~2: P2 Bridge (Legacy 레포)**
- [ ] `common.php` 부수효과 확인 → `_bootstrap.php` 확정 (방문자 기록 우회 여부 결정)
- [ ] `viewer.php` 작성 (Header 필드 기준)
- [ ] `shop/ajax.list.php` 분석 → 재사용 불가 시 `courses.php` 작성 (PHP 기존 함수로 판매상태/가격 계산)
- [ ] `.htaccess`, `scripts/deploy-bridge.sh`, `bridge-smoke.sh`, `drift-check.sh`
- [ ] 배포 → 스모크 → V2 fixture와 실제 응답 key 비교

**Day 3: V2 ↔ 실제 Bridge 연결**
- [ ] Preview에서 `COURSE_SOURCE=http`로 실제 강좌 데이터 렌더링 확인
- [ ] Bridge 실패 시나리오: 타임아웃, HTML 응답, contract 불일치 → `unavailable` / ISR 유지 확인

**Day 4~5: P3 Proxy 개통**
- [ ] vhost 백업, kill switch 디렉터리 생성 (`/etc/nonsulrun/`)
- [ ] `04` 문서 §2.1 설정 반영 (홈은 preview 쿠키 조건)
- [ ] `apachectl configtest` → reload → `smoke-prod.sh`
- [ ] **`cookieForwarded:false` 확인** (실패 시 즉시 롤백)
- [ ] kill switch 시연, 결과를 `docs/runbook.md`에 기록
- [ ] 프록시 전후 EC2 메모리/CPU 비교

**Sprint 2 종료 조건:** 메인 도메인 `/_v2/check`이 Vercel에서 서빙되고, L4 스모크 전부 통과, Legacy 경로 무영향

---

### Sprint 3 (Week 3) — 첫 랜딩 운영 & Analytics

- [ ] `src/analytics/`: `track(event, props)` → GTM dataLayer / GA4 / Meta / Naver / Kakao 어댑터
- [ ] canonical event: `page_view`, `cta_click`, `course_view`, `begin_checkout`
- [ ] UTM/Referrer 저장 (메인 도메인 first-party 쿠키), Legacy 결제 페이지에서 읽히는지 확인
- [ ] 홈 → V2 홈/강좌 → PHP 결제 attribution 연속성 확인
- [ ] CTA → Legacy 상담/결제 URL, `begin_checkout` 발생 확인
- [ ] 광고 소량 집행, 48시간 L6 관찰 (bridge_error, 5xx, Web Vitals, EC2)

**Sprint 3 종료 조건:** 랜딩 → Legacy 결제 → 구매 이벤트까지 GA4/Meta에서 한 흐름으로 확인

---

### Sprint 4 (Week 4) — Homepage

- [ ] 홈 V2 구현 (Hero, Carousel, Teacher, Static Content, Header viewer `http`)
- [ ] Legacy 홈의 추적 태그와 동일하게 V2 홈 설정
- [ ] `v2_preview=1` 쿠키로 L5 parity 체크리스트 전부 수행, `docs/parity/homepage.md` 기록
- [ ] 컷오버: 홈 `RewriteCond` 제거 → reload → 스모크
- [ ] 24시간 L6 관찰, 이상 시 kill switch

**Sprint 4 종료 조건:** 홈이 V2로 운영, 24시간 경보 없음, 전환 지표가 컷오버 전과 비슷한 수준

---

### Sprint 5~ — Course Detail (강좌별)

강좌 하나당 반복하는 단위:

```text
강좌 선택 → V2 상세 페이지 확인(Preview) → L5 parity(결제 완료까지)
→ Apache 301 추가 → 스모크 → 48시간 관찰 → 다음 강좌
```

- [ ] `/courses/[id]` ISR, `generateMetadata`(제목, 설명, OG 이미지)
- [ ] 판매 상태별 CTA, 404 처리
- [ ] 301 목록 관리 방식 결정 (`RewriteMap` 파일)
- [ ] Search Console에서 기존 URL → 새 URL 색인 이동 확인

---

## 3. 작업 규칙

### 브랜치 / PR

- `main` = Production. Vercel이 자동 배포.
- 작업은 `feat/*`, `fix/*` 브랜치 → PR → Preview URL 확인 → merge.
- PR 필수 체크: lint, typecheck, test (L1, L2), build.
- Legacy 레포의 Bridge 변경은 `bridge/*` 브랜치 → merge 후 `deploy-bridge.sh`로 수동 배포.

### 커밋 / 문서

- Contract를 바꾸는 PR은 V2 레포의 schema + fixture, Legacy 레포의 PHP를 **같은 날 함께** 반영. 필드 삭제나 의미 변경이면 `v` 버전 증가.
- 운영 조작(Apache 변경, 컷오버, kill switch 사용)은 `docs/runbook.md`에 날짜와 함께 한 줄 기록.

### AI 코딩 에이전트에 줄 규칙 (`CLAUDE.md` / `AGENTS.md`)

```md
- Legacy 접근은 src/legacy/index.ts 공개 API만 사용. PHP URL, mb_* 필드명을 컴포넌트에 쓰지 않는다.
- process.env 직접 사용 금지. src/env.client.ts / src/env.server.ts 만 import.
- 새 Legacy 데이터가 필요하면 contracts/ 에 schema + fixture 먼저 작성하고 테스트를 추가한 뒤 adapter 구현.
- 결제, 로그인, 강의실 기능은 구현하지 않는다. legacyRoutes 로 링크만 건다.
- 운영 서버(SSH) 명령은 제안만 하고 실행하지 않는다.
```

---

## 4. 바로 할 일

1. 첨부한 `v2-frontend.env.example`을 V2 레포 `.env.example`로, `legacy-deploy.env.example`을 Legacy 레포 `scripts/deploy.env.example`로 넣기
2. Sprint 1 Day 1 (P0 수집) 실행
3. 결과 공유 → Contract v1, Apache 설정 확정
