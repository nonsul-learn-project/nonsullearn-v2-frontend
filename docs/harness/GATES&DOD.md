# 논술런 V2 — GATES & DEFINITION OF DONE

> **Document:** `GATES&DOD.md`  
> **Architecture:** Apache Front Door + Vercel Next.js Experience Layer + Thin PHP Bridge + Legacy PHP Core + MariaDB  
> **Migration Strategy:** Progressive Frontend Ownership  
> **Primary V2 Repository:** `nonsullearn-v2-frontend`  
> **Legacy Repository:** `nonsul-learn-html1`

---

# 0. Mission

논술런 V2의 목표는 PHP를 제거하는 것이 아니다.

> **기존 PHP/MariaDB Core를 안정적으로 유지하면서 사용자 경험, 마케팅, SEO, Analytics, Attribution 및 신규 Frontend 기능의 ownership을 TypeScript로 이동한다.**

최종적으로 다음 구조를 지향한다.

```text
Browser
   ↓
nonsulrun.com
   ↓
Apache Front Door
   │
   ├── V2 Routes
   │      ↓
   │    Vercel
   │      ↓
   │   Next.js + TypeScript
   │
   ├── /v2-api/*
   │      ↓
   │   Thin PHP Bridge
   │      ↓
   │   Legacy PHP Core
   │      ↓
   │    MariaDB
   │
   └── Legacy Routes
          ↓
        PHP Core
          ↓
        MariaDB
```

---

# 1. Core Architecture Principles

## 1.1 Experience Layer

TypeScript가 우선 소유한다.

- Homepage
- Landing Pages
- Course / Product Detail
- Public Frontend
- UI / UX
- Responsive
- Design System
- SEO / Metadata
- Analytics
- Attribution
- Experiment
- 신규 Marketing 기능

---

## 1.2 Legacy Core

별도 Migration 결정 전까지 PHP가 계속 소유한다.

- Authentication
- PHP Session
- Order
- Checkout
- PG
- Payment Approval
- Payment Callback
- Cancel / Refund
- 기존 관리자
- LMS business/write logic
- 첨삭
- 기존 권한
- 검증되지 않은 Legacy Business Logic

---

## 1.3 Database

기존 MariaDB:

```text
nonsullearndb
```

를 유지한다.

현재 프로젝트의 목표가 아닌 것:

```text
PostgreSQL Migration
Firebase Migration
DB 전면 재설계
Password Migration
```

---

## 1.4 Legacy Integration Priority

V2에서 Legacy 기능이 필요할 경우 다음 순서로 해결한다.

```text
1. Existing Endpoint 재사용
        ↓
2. Pure TS Ownership 가능한가?
        ↓
3. 검증된 Public Read인가?
        ↓
4. Thin PHP Bridge
        ↓
5. Legacy URL Handoff
```

Transaction 및 Critical Business Logic은 PHP를 우선한다.

---

# 2. Repository Ownership

## V2

```text
nonsullearn-v2-frontend
```

소유:

```text
Next.js
TypeScript
Frontend
Design System
SEO
Analytics
Attribution
Experiment
Legacy Client / Adapter
Vercel Deployment
```

권장 구조:

```text
src/
├── app/
├── components/
├── design-system/
├── features/
├── analytics/
├── legacy/
│   ├── contracts/
│   ├── adapters/
│   ├── client/
│   └── repositories/
├── config/
└── lib/
```

---

## Legacy

```text
nonsul-learn-html1
```

소유:

```text
Legacy PHP
Production Baseline
Legacy Discovery
Thin PHP Bridge
Legacy Runtime Contracts
```

신규 Bridge 후보:

```text
html2/
└── v2-api/
```

`v2-api/`는 가능한 한 Git-managed 영역으로 운영한다.

---

# 3. Environment Contract

V2 `.env.example`은 최소한으로 유지한다.

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000

LEGACY_BASE_URL=http://localhost
LEGACY_INTEGRATION_MODE=mock

NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_NAVER_WCS_ID=

NEXT_PUBLIC_ANALYTICS_ENV=development
NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

V2 Runtime에 기본적으로 넣지 않는다.

```text
DB_PASSWORD
SSH_PRIVATE_KEY
PHP Session Secret
PG Credentials
SMTP Credentials
SMS Credentials
```

`LEGACY_BASE_URL`은 server-only다.

---

# 4. Gate Status

```text
Gate 0     Legacy Preservation           PASS
Gate 0.5   Production Discovery          SUBSTANTIALLY PASS

Gate 1     V2 Foundation                 NEXT
Gate 2     Design System & App Shell
Gate 3     Legacy Integration Foundation
Gate 4     Homepage Migration
Gate 5     Analytics & Attribution
Gate 6     Public Frontend Migration
Gate 7     Production Routing & Cutover
Gate 8     Growth & Optimization
Gate 9     Optional Domain Migration
```

---

# GATE 0 — LEGACY PRESERVATION

## Objective

Production과 기존 Legacy source를 보존하고 파괴적 변경을 방지한다.

## Completed

확인된 주요 Production 구성:

```text
Canonical Web Root → html2
Apache
PHP 8.3 계열
MariaDB 10.11 계열
nonsullearndb
66 tables
html2/data/
회원/password data
PG assets/callback
cron/runtime dependencies
```

## Production Safety

명시적 승인 없이 금지:

```text
DB schema 변경
데이터 수정/삭제
Payment 호출
SMTP/SMS 발송
Credential 변경
chmod/chown
Service Restart
OS Upgrade
PHP 제거
PG Callback 변경
```

## DOD

- [x] Production baseline 보존
- [x] Legacy source Git 보존
- [x] destructive migration 없음
- [x] MariaDB 유지 결정
- [x] PHP Core 유지 결정

**STATUS: PASS**

---

# GATE 0.5 — PRODUCTION DISCOVERY

## Objective

V2를 구축하는 데 필요한 Production Boundary를 파악한다.

## Confirmed

```text
Web Root
Runtime
Database
Session source behavior
Homepage execution path
Public assets
Payment dependencies
Runtime storage
```

Canonical Homepage:

```text
/
↓
html2/index.php
↓
common.php
↓
_head.php
↓
head.php
↓
page
↓
_tail.php
↓
tail.php
```

## Runtime Verification Pending

```text
실제 deployed homepage revision
실제 teacher asset
실제 Set-Cookie
session handler/storage
Apache VirtualHost
TLS configuration
RewriteRule
Reverse Proxy configuration
```

이들은 Production Cutover blocker이며 V2 local implementation blocker는 아니다.

## DOD

- [x] canonical web root 확인
- [x] PHP/MariaDB version 확인
- [x] DB 확인
- [x] Homepage dependency slice 조사
- [x] Auth/session source 조사
- [x] Payment/PG 존재 확인
- [ ] Apache runtime verification
- [ ] Session runtime verification
- [ ] Production routing verification

**STATUS: SUBSTANTIALLY PASS**

---

# GATE 1 — V2 FOUNDATION

## Objective

`nonsullearn-v2-frontend`를 독립적으로 개발·검증·배포 가능한 Next.js application으로 만든다.

이 Gate부터 주 개발 장소는:

```text
nonsullearn-v2-frontend
```

이다.

---

## 1.1 Bootstrap

구현:

```text
Next.js
TypeScript
App Router
src/
ESLint
Typecheck
Production Build
.gitignore
.env.example
```

---

## 1.2 Project Structure

```text
src/
├── app/
├── components/
├── design-system/
├── features/
├── analytics/
├── legacy/
├── config/
└── lib/
```

---

## 1.3 Application Foundation

구현:

```text
Root Layout
Global CSS
Error Boundary
not-found
Metadata Foundation
Font Foundation
Responsive Container
```

---

## 1.4 Environment Validation

환경변수를 코드 전체에서 직접 읽지 않는다.

```text
process.env
    ↓
src/config/env.ts
    ↓
Application
```

필수 ENV 누락 시 명확하게 실패하거나 개발 fallback을 사용한다.

---

## 1.5 Vercel Foundation

구축:

```text
GitHub
↓
Vercel
↓
Preview Deployment
↓
Production Deployment
```

Production route cutover는 아직 하지 않는다.

---

## DOD — Gate 1

다음 명령이 모두 성공해야 한다.

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

그리고:

- [ ] V2 repository 독립 실행 가능
- [ ] App Router 동작
- [ ] strict TypeScript
- [ ] `.env.example` 존재
- [ ] secret commit 없음
- [ ] root layout 존재
- [ ] error/not-found 처리
- [ ] metadata foundation 존재
- [ ] Vercel Preview Deployment 성공
- [ ] Production Legacy에 변경 없음

**PASS CONDITION**

> 독립적인 V2 페이지를 Git → Vercel로 안전하게 build/deploy할 수 있다.

---

# GATE 2 — DESIGN SYSTEM & APP SHELL

## Objective

페이지마다 임의 CSS/Component를 복제하지 않도록 최소 Design System을 구축한다.

---

## 2.1 Design Tokens

구현:

```text
Color
Typography
Spacing
Radius
Shadow
Container
Breakpoint
Z-index
Motion
```

---

## 2.2 Primitive Components

필요한 만큼만 만든다.

```text
Container
Section
Stack
Button
Link
Heading
Text
```

거대한 Component Library를 선행 구축하지 않는다.

---

## 2.3 Site Shell

구현:

```text
SiteHeader
DesktopNavigation
MobileNavigation
SiteFooter
MainContent
```

---

## 2.4 Responsive Foundation

Mobile-first 또는 명확한 breakpoint contract를 적용한다.

최소 검증:

```text
Mobile
Tablet
Desktop
Wide Desktop
```

---

## 2.5 Accessibility Baseline

기본 요구:

```text
Semantic HTML
Keyboard Navigation
Visible Focus
Alt Text
Heading Hierarchy
Color Contrast
Reduced Motion 고려
```

---

## DOD — Gate 2

- [ ] Design Token source 존재
- [ ] typography 일관성 확보
- [ ] spacing scale 사용
- [ ] responsive container 존재
- [ ] Header/Footer component화
- [ ] Mobile Navigation 동작
- [ ] keyboard 기본 사용 가능
- [ ] arbitrary CSS duplication 최소화
- [ ] lint/typecheck/build PASS

**PASS CONDITION**

> Homepage 및 이후 Public Page를 동일한 UI foundation 위에서 만들 수 있다.

---

# GATE 3 — LEGACY INTEGRATION FOUNDATION

## Objective

Next.js와 Legacy PHP 사이에 최소하고 명확한 Boundary를 만든다.

PHP 전체 API화를 하지 않는다.

---

## 3.1 Integration Strategy

우선순위:

```text
Existing Endpoint
↓
Thin Bridge
↓
URL Handoff
```

Direct DB Read는 별도 검증 없이는 기본값으로 사용하지 않는다.

---

## 3.2 Existing Endpoint Audit

Homepage에 필요한 dependency slice만 조사한다.

최우선:

```text
Viewer / Session
```

검색 대상:

```text
AJAX
JSON
Mobile API
Member endpoint
Session endpoint
```

기존 기능이 존재하면 재사용한다.

---

## 3.3 PHP Bridge v1

기존 endpoint가 없다면:

```text
html2/v2-api/
```

아래 최소 Bridge를 추가한다.

```text
viewer.php
```

역할:

```text
PHP Session
↓
existing common.php
↓
existing $member
↓
sanitize
↓
canonical JSON
```

새로운 Auth를 구현하지 않는다.

---

## 3.4 Viewer Contract

V2 canonical contract:

```ts
export interface HomepageViewer {
  authenticated: boolean;

  member: {
    id: string;
    name: string;
    level: number;
  } | null;
}
```

금지:

```text
Password
Password Hash
Session ID
Contact Information
불필요한 PII
```

---

## 3.5 TypeScript Legacy Layer

```text
src/legacy/
├── contracts/
│   └── viewer.ts
├── adapters/
│   └── session-adapter.ts
├── client/
│   └── legacy-client.ts
└── mocks/
    └── anonymous-viewer.ts
```

Component에서 PHP endpoint를 직접 호출하지 않는다.

---

## 3.6 Development Fallback

Legacy unavailable 시:

```text
Development
↓
Mock Adapter
↓
Anonymous Viewer
```

를 사용할 수 있다.

사용자 identity를 추측하거나 임의 생성하지 않는다.

---

## 3.7 Bridge Deployment Rule

Bridge source of truth:

```text
nonsul-learn-html1
```

Production에는 동일한 검증된 파일만 배포한다.

```text
Git
↓
Review
↓
PHP Syntax Check
↓
Controlled Deployment
↓
Smoke Test
```

Production에서 직접 작성하는 것을 기본 workflow로 삼지 않는다.

---

## DOD — Gate 3

- [ ] Existing viewer endpoint 존재 여부 확인
- [ ] canonical Viewer Contract 확정
- [ ] PHP가 Auth authority로 유지됨
- [ ] 필요 시 read-only Viewer Bridge 구현
- [ ] Bridge Git commit 존재
- [ ] `php -l` PASS
- [ ] TypeScript contract 구현
- [ ] LegacyClient 구현
- [ ] SessionAdapter 구현
- [ ] Mock mode 구현
- [ ] authenticated/anonymous response 검증
- [ ] secret/PII 노출 없음
- [ ] Production transaction 변경 없음

**PASS CONDITION**

```text
Next.js
↓
SessionAdapter
↓
PHP
↓
existing session/member logic
↓
canonical Viewer JSON
```

이 end-to-end 흐름이 검증된다.

---

# GATE 4 — HOMEPAGE MIGRATION

## Objective

현재 canonical PHP Homepage의 사용자-visible behavior를 Next.js가 소유한다.

PHP HTML을 line-by-line JSX로 번역하지 않는다.

---

## 4.1 Homepage Components

예:

```text
Homepage
├── SiteHeader
├── HeroCarousel
├── Main Sections
├── Teacher Section
└── SiteFooter
```

---

## 4.2 Authentication Parity

검증:

```text
Anonymous
Authenticated
Member Level
Level > 7
```

기존 Navigation behavior를 보존한다.

---

## 4.3 Legacy Handoff

아직 migration하지 않은 기능:

```text
Login
Logout
Checkout
MyPage
LMS
Correction
```

은 기존 PHP route로 이동한다.

---

## 4.4 Carousel Parity

현재 Bootstrap carousel의 user-visible behavior를 재현한다.

검증:

```text
Automatic Cycle
Controls
Indicators
Touch
Mobile
Internal Links
```

---

## 4.5 Assets

Legacy public asset을 사용할 경우:

```text
accessible
stable URL
fallback
alt
```

을 검증한다.

---

## 4.6 SEO

Homepage:

```text
title
description
canonical
Open Graph
robots
structured metadata 필요 여부
```

를 구현한다.

---

## 4.7 Performance

기본 측정:

```text
LCP
CLS
INP
Image optimization
Font loading
JS payload
```

---

## DOD — Gate 4

- [ ] anonymous parity
- [ ] authenticated parity
- [ ] level-based navigation parity
- [ ] mobile navigation parity
- [ ] hero/carousel parity
- [ ] legacy destinations 유지
- [ ] asset fallback 존재
- [ ] responsive 완료
- [ ] metadata 완료
- [ ] accessibility baseline PASS
- [ ] lint/typecheck/build PASS
- [ ] PHP business logic 변경 없음

**PASS CONDITION**

> 기존 Homepage 대신 V2 Homepage를 사용자에게 제공해도 핵심 기능 차이가 없다.

---

# GATE 5 — ANALYTICS & ATTRIBUTION HARNESS

## Objective

Marketing Measurement를 V2의 핵심 Infrastructure로 만든다.

Vendor API를 UI component에서 직접 호출하지 않는다.

---

## 5.1 Canonical Analytics Architecture

```text
UI
↓
track()
↓
Canonical Event
↓
Analytics Layer
├── GA4 / GTM
├── Meta
├── Naver
└── Internal Attribution
```

---

## 5.2 Canonical Events

최소:

```text
page_view
course_view
cta_click
consultation_start
begin_checkout
purchase
```

---

## 5.3 Attribution Context

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
referrer
landing_page
campaign
session attribution
conversion identifier
```

---

## 5.4 Provider Adapters

```text
GA4/GTM Adapter
Meta Adapter
Naver Adapter
Internal Adapter
```

UI는 provider 이름을 몰라야 한다.

---

## 5.5 Deduplication

특히:

```text
begin_checkout
purchase
```

중복 전송 방지.

Purchase는 thank-you URL 방문만으로 확정하지 않는다.

```text
backend payment state
+
order/event identifier
```

를 기준으로 확정한다.

---

## 5.6 Debug Harness

Development에서:

```text
event
payload
provider
attribution
dedupe state
```

를 검증할 수 있어야 한다.

PII를 analytics payload에 임의 포함하지 않는다.

---

## DOD — Gate 5

- [ ] canonical event schema
- [ ] `track()` abstraction
- [ ] attribution context
- [ ] UTM capture
- [ ] referrer capture
- [ ] landing attribution
- [ ] GA4/GTM adapter
- [ ] Meta adapter
- [ ] Naver adapter
- [ ] Internal adapter
- [ ] deduplication
- [ ] debug validation
- [ ] UI에 vendor-specific call 없음
- [ ] purchase backend confirmation rule 존재

**PASS CONDITION**

> 핵심 Funnel Event를 vendor와 독립적으로 중앙 관리하고 검증할 수 있다.

---

# GATE 6 — PUBLIC FRONTEND MIGRATION

## Objective

사업적으로 변화가 빠른 Public Frontend를 TypeScript ownership으로 점진 이전한다.

---

## Migration Priority

```text
Homepage
   ↓
Marketing Landing
   ↓
Course / Product Detail
   ↓
Event / Promotion
   ↓
Consultation
   ↓
Course Listing
   ↓
Remaining Public Pages
```

---

## Feature Slice Rule

각 페이지마다:

```text
1. User-visible behavior 정의
2. Legacy dependency 확인
3. Existing endpoint 검색
4. 필요한 Contract 정의
5. 최소 Integration
6. V2 UI 구현
7. Analytics 연결
8. Parity 검증
9. Route Cutover
```

를 반복한다.

---

## Course Read Bridge

필요할 경우:

```text
/v2-api/courses/...
```

형태의 read-only Bridge를 추가한다.

PHP business semantics를 TS에서 추측하여 복제하지 않는다.

---

## Checkout

```text
Next.js
↓
track(begin_checkout)
↓
Legacy PHP Checkout
↓
PG
↓
PHP Callback/Approval
↓
MariaDB
```

유지.

---

## DOD — Gate 6

페이지별:

- [ ] user behavior inventory
- [ ] dependency slice 조사
- [ ] canonical contract
- [ ] responsive UI
- [ ] accessibility
- [ ] SEO
- [ ] analytics
- [ ] attribution
- [ ] Legacy Handoff 검증
- [ ] parity 검증
- [ ] production route 검증
- [ ] rollback 가능

**PASS CONDITION**

> 주요 Public Frontend의 ownership이 TypeScript로 이동하고 Legacy Core는 정상적으로 유지된다.

---

# GATE 7 — PRODUCTION ROUTING & PROGRESSIVE CUTOVER

## Objective

Apache를 Front Door로 유지하면서 route 단위로 Vercel ownership을 확대한다.

---

## 7.1 Target Architecture

```text
DNS
 ↓
Apache
 │
 ├── V2 Routes ─────→ Vercel
 │
 ├── /v2-api/* ─────→ PHP
 │
 └── Legacy Routes ─→ PHP
```

---

## 7.2 Route Ownership Matrix

명시적으로 관리한다.

예:

```text
/                  → Vercel
/landing/*         → Vercel
/course/*          → Vercel

/v2-api/*          → PHP
/bbs/*             → PHP
/shop/*            → PHP
/lms/*             → PHP
```

실제 route는 Production 검증 후 확정한다.

---

## 7.3 Critical Route Protection

다음 route가 Vercel로 잘못 프록시되지 않도록 한다.

```text
Payment Callback
PG Return
Uploads
LMS
Admin
PHP Bridge
Auth
```

---

## 7.4 Rollback

페이지 단위로:

```text
Vercel
↓ rollback
PHP Legacy
```

가 가능해야 한다.

Big Bang Cutover 금지.

---

## 7.5 Session Validation

실제 Production에서:

```text
Anonymous
Login
Authenticated
Logout
Return
```

flow를 검증한다.

---

## DOD — Gate 7

- [ ] Apache VirtualHost 확인
- [ ] Rewrite/Proxy configuration 확인
- [ ] Route Ownership Matrix 존재
- [ ] `/v2-api/*` PHP 유지
- [ ] Payment callback 보호
- [ ] Upload route 보호
- [ ] LMS 보호
- [ ] Auth session end-to-end 검증
- [ ] V2 route Vercel 전달
- [ ] Legacy route PHP 유지
- [ ] rollback 테스트
- [ ] 기존 PG flow 영향 없음

**PASS CONDITION**

> 동일한 Production domain에서 V2와 PHP가 사용자에게 하나의 서비스처럼 공존한다.

---

# GATE 8 — GROWTH & OPTIMIZATION

## Objective

V2의 사업적 가치를 실제 Growth 지표로 연결한다.

---

## 8.1 Funnel

측정:

```text
Landing
↓
Course View
↓
CTA
↓
Consultation
↓
Checkout
↓
Purchase
```

---

## 8.2 Attribution Quality

검증:

```text
UTM preservation
Referrer
Landing attribution
Session attribution
Checkout handoff
Purchase attribution
Cross-page continuity
```

---

## 8.3 Experiment Infrastructure

구현:

```text
Experiment ID
Variant
Exposure Event
Conversion Event
Assignment
Deduplication
```

---

## 8.4 A/B Testing

우선순위:

```text
Hero
CTA
Course positioning
Price presentation
Consultation funnel
Landing structure
```

단, 실험 때문에 결제/가격 business logic 자체를 임의 변경하지 않는다.

---

## 8.5 SEO

지속 최적화:

```text
Metadata
Structured Data
Internal Links
Indexability
Canonical
Sitemap
Core Web Vitals
Content Architecture
```

---

## 8.6 Performance

목표:

```text
Core Web Vitals
Image Delivery
Caching
ISR
Bundle Reduction
Server Rendering Strategy
```

---

## DOD — Gate 8

- [ ] funnel measurement
- [ ] attribution validation
- [ ] conversion dedupe
- [ ] experiment assignment
- [ ] exposure tracking
- [ ] conversion tracking
- [ ] first controlled A/B test
- [ ] SEO validation
- [ ] CWV baseline
- [ ] campaign measurement
- [ ] dashboard-ready canonical events

**PASS CONDITION**

> V2 개선이 Conversion/Funnel/Attribution 지표로 측정 가능하다.

---

# GATE 9 — OPTIONAL DOMAIN / BACKEND OWNERSHIP EXPANSION

## Objective

V2가 충분히 안정화된 이후에만 추가 Backend Migration의 사업적 가치를 판단한다.

**Gate 9는 프로젝트 성공의 필수조건이 아니다.**

---

## 9.1 Candidate Domains

필요한 경우에만 검토:

```text
Course Read
↓
Public Content
↓
Auth
↓
MyPage
↓
LMS
↓
Correction
↓
Admin
↓
Commerce
↓
Payment
```

순서는 실제 위험도/가치에 따라 재평가한다.

Payment는 마지막 단계 후보로 취급한다.

---

## 9.2 Direct MariaDB Read

검증된 read domain에 대해서만:

```text
Next.js / TS Service
↓
Repository
↓
MariaDB
```

ownership을 검토할 수 있다.

조건:

```text
Legacy semantics 완전 확인
Read-only
권한 검증
Connection security
Rollback 가능
Parity test
```

---

## 9.3 Vercel-first Ingress

필요할 경우에만:

```text
현재

DNS
↓
Apache
├─ Vercel
└─ PHP
```

에서:

```text
향후

DNS
↓
Vercel
├─ Next.js
└─ Legacy Origin
```

전환을 검토한다.

필수 아님.

---

## 9.4 PHP Removal

PHP 제거율은 KPI가 아니다.

안정적인 PHP Core가 사업적/운영상 문제가 없다면 유지할 수 있다.

---

## DOD — Gate 9

Gate 9 자체의 PASS를 강제하지 않는다.

개별 migration마다:

- [ ] 명확한 사업적 이유
- [ ] Legacy semantics 확인
- [ ] parity tests
- [ ] security review
- [ ] migration plan
- [ ] rollback plan
- [ ] observability
- [ ] Production validation

이 있어야 한다.

**PASS CONDITION**

> Backend ownership 확대가 필요하다고 판단된 domain만 안전하게 TypeScript로 이전된다.

---

# 5. Global Definition of Done

모든 Gate와 Feature는 다음 Global DOD를 따른다.

## Code Quality

- [ ] TypeScript strict
- [ ] lint PASS
- [ ] typecheck PASS
- [ ] build PASS
- [ ] dead code 없음
- [ ] 불필요한 dependency 없음

---

## Architecture

- [ ] UI에서 DB 직접 접근 없음
- [ ] UI에서 PHP raw endpoint 직접 접근 없음
- [ ] UI에서 vendor analytics 직접 호출 없음
- [ ] Legacy dependency가 adapter/repository boundary에 격리됨
- [ ] Legacy naming이 business/frontend 전체로 퍼지지 않음

---

## Security

- [ ] secret Git commit 없음
- [ ] password/hash/session ID 노출 없음
- [ ] 최소 PII
- [ ] Production write는 명시적 승인
- [ ] Payment credential 변경 없음
- [ ] Runtime SSH를 application protocol로 사용하지 않음

---

## UX

- [ ] Desktop
- [ ] Mobile
- [ ] Loading
- [ ] Error
- [ ] Empty/Fallback
- [ ] Keyboard
- [ ] Accessibility baseline

---

## SEO

Public page라면:

- [ ] title
- [ ] description
- [ ] canonical
- [ ] crawl/index behavior
- [ ] Open Graph
- [ ] semantic headings

---

## Analytics

Conversion 관련 UI라면:

- [ ] canonical event 사용
- [ ] attribution context 연결
- [ ] provider-specific code 없음
- [ ] duplicate event 방지
- [ ] debug validation

---

## Legacy Parity

Migration page라면:

- [ ] 기존 주요 user behavior inventory 존재
- [ ] 주요 destination 유지
- [ ] Auth behavior 유지
- [ ] business semantics 추측 없음
- [ ] UNKNOWN은 명시
- [ ] rollback 가능

---

# 6. Gate Promotion Rule

다음 Gate로 넘어가기 위한 원칙:

```text
현재 Gate DOD
↓
검증
↓
PASS
↓
다음 Gate
```

단, Legacy Runtime UNKNOWN이 현재 Gate와 무관하면 blocker로 만들지 않는다.

예:

```text
PG callback 세부 동작 UNKNOWN
```

은 Homepage UI 개발을 막지 않는다.

반대로:

```text
Apache routing UNKNOWN
```

은 Production Cutover Gate에서는 blocker다.

---

# 7. UNKNOWN Handling

기존 동작이 불명확하면 추측하지 않는다.

```text
UNKNOWN
```

으로 기록한다.

그리고 해당 기능을 실제 migration할 때 dependency slice만 조사한다.

금지:

```text
10,000+ 파일 전체 분석
모든 Legacy Config 해독
전체 PHP Call Graph 생성
전체 DB semantics 재구성
```

---

# 8. Migration Unit

Migration의 기본 단위는 시스템 전체가 아니다.

> **User-facing Feature Slice**

이다.

```text
Feature
↓
Behavior
↓
Dependency
↓
Contract
↓
Implementation
↓
Parity
↓
Analytics
↓
Production
```

이 사이클을 반복한다.

---

# 9. Current Execution Queue

현재 바로 실행할 순서:

```text
NOW
│
├── Gate 1
│   └── nonsullearn-v2-frontend Foundation
│
├── Gate 2
│   └── Design System + App Shell
│
├── Gate 3
│   ├── Viewer dependency audit
│   ├── Existing endpoint search
│   ├── 필요 시 PHP Bridge
│   └── SessionAdapter
│
├── Gate 4
│   └── Homepage Migration
│
├── Gate 5
│   └── Analytics / Attribution Harness
│
└── Gate 6+
    └── Public Frontend Expansion
```

현재 기본 작업 장소:

```text
nonsullearn-v2-frontend
```

Legacy repo로 이동하는 경우:

```text
Legacy dependency 조사
PHP Bridge
Legacy contract 검증
```

이 필요한 경우에 한정한다.

---

# 10. Current Immediate Task

## Gate 1 — V2 Foundation

다음 구현부터 시작한다.

```text
nonsullearn-v2-frontend
│
├── Next.js / TypeScript 확인
├── App Router
├── src structure
├── env contract
├── lint/typecheck/build
├── root layout
├── global CSS
├── error/not-found
├── metadata
├── config/env
└── Vercel Preview
```

Gate 1에서는 하지 않는다.

```text
Homepage 완성
PHP Bridge
Payment
Auth Migration
Analytics Provider integration
Apache Production 변경
DB migration
```

Gate 1의 목표는 단 하나다.

> **V2가 앞으로 모든 Public Frontend 개발을 받아낼 수 있는 안정적인 실행 기반이 되는 것.**

---

# 11. Final Architecture

```text
                         USERS
                           │
                           ↓
                    nonsulrun.com
                           │
                           ↓
                    APACHE FRONT DOOR
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ↓                ↓                 ↓
      V2 ROUTES        V2 BRIDGE        LEGACY ROUTES
          │                │                 │
          ↓                ↓                 ↓
       VERCEL             PHP               PHP
          │                │                 │
          ↓                └────────┬────────┘
       NEXT.JS                      │
          │                         ↓
          │                  LEGACY PHP CORE
          │                         │
          │                         ↓
          │                      MariaDB
          │
          ├── UI / UX
          ├── Design System
          ├── SEO
          ├── Analytics
          ├── Attribution
          ├── Experiment
          └── Marketing
```

---

# 12. Final Success Criteria

이 프로젝트의 성공은:

```text
PHP 파일 수 감소
```

로 측정하지 않는다.

성공 기준은:

```text
Public Frontend → TypeScript Ownership
Marketing → TypeScript Ownership
Analytics → TypeScript Ownership
Attribution → TypeScript Ownership
SEO → TypeScript Ownership
Experiment → TypeScript Ownership

+

Legacy Checkout/Auth/LMS/Payment 안정성 유지

+

점진적 Route Migration 가능

+

빠른 Vercel Deployment

+

측정 가능한 Growth Improvement
```

이다.

최종 원칙:

> **Preserve the Core. Replace the Experience.**

그리고 모든 Migration 결정은 다음 질문으로 판단한다.

> **이 기능을 TypeScript가 소유하는 것이 사용자 경험, 성장, 측정 가능성 또는 개발 생산성을 실제로 개선하는가?**

그렇다면 이전한다.

그렇지 않고 PHP가 안정적으로 처리하고 있다면 유지한다.