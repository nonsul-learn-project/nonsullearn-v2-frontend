# 논술런 V2 — Gates & Definition of Done

> Gate 기준의 단일 진실은 본 문서다. Harness 상세는 [`HARNESS.md`](./HARNESS.md), 실행 순서는 [`EXECUTION-PLAN.md`](./EXECUTION-PLAN.md), Gate 증거는 `docs/gates/<Gate ID>.md`에 둔다.

## Mission

PHP를 제거하지 않는다. Legacy PHP/MariaDB Core를 안정적으로 유지하면서 Public Frontend(홈, 강좌 상세), UI/UX, Design System, SEO, Analytics, Attribution, Experiment의 ownership을 TypeScript로 점진 이동한다. **별도 마케팅 랜딩은 없다. 홈(`index.php`)이 랜딩 역할을 하며 Gate 5/6에서 이전한다.**

```text
Browser → Apache Front Door
  ├─ V2 routes → Vercel → Next.js + TypeScript
  ├─ /v2-api/* → Thin PHP Bridge → Legacy PHP Core → MariaDB
  └─ Legacy routes → Legacy PHP Core → MariaDB
```

## Core Principles

- Legacy PHP 소유: Authentication, PHP Session, 회원가입, Order/Checkout/PG/Payment callback/refund, LMS write logic, correction, admin, permission, price/sale semantics와 검증되지 않은 business logic.
- V2는 MariaDB에 직접 접속하지 않는다. `Existing Endpoint → 검증된 Public Read → Thin PHP Bridge → Legacy URL Handoff` 순으로 검토한다.
- `UNKNOWN`은 추측·재구현하지 않는다. migration에 필요한 dependency slice만 조사한다.
- V2 runtime에는 `DB_PASSWORD`, SSH key, PHP session secret, PG/SMTP/SMS credential을 넣지 않는다.

## 번호 대응표 및 상태

| 최종 Gate | 이름 | GATES&DOD 원래 | GATES 원래 | 상태 |
|---|---|---:|---:|---|
| Gate 0 | Legacy Preservation | 0 | 0 | PASS |
| Gate 0.5 | Production Discovery | 0.5 | 0.5 | SUBSTANTIALLY PASS |
| Gate 0.9 | Prerequisites | - | 0.9 | NOT STARTED |
| Gate 1 | V2 Foundation + Harness | 1 | 1 | NOT STARTED |
| Gate 2 | Design Parity Foundation (기존 디자인 추출) | 2 | 1.1 | NOT STARTED |
| Gate 3 | Legacy Integration Foundation (viewer + courses Bridge) | 3 | 1.2 | NOT STARTED |
| Gate 4 | Production Routing (preview 전용, kill switch) | 7 | 1.3 | NOT STARTED |
| Gate 5 | Tracking Parity & Homepage Internal Soak (preview 쿠키) | 5 일부 | 1.4 | NOT STARTED |
| Gate 6 | Homepage Cutover (canary → 100%) | 4 | 1.5 | NOT STARTED |
| Gate 7 | Analytics & Attribution Harness 완성 | 5 | 2 | NOT STARTED |
| Gate 8 | Public Frontend Migration (강좌 상세 등, 페이지별 반복) | 6 | 3 | NOT STARTED |
| Gate 9 | Growth & Optimization | 8 | - | NOT STARTED |
| Gate 10 | Optional Domain / Backend Ownership Expansion | 9 | - | NOT STARTED |

Gate 2와 Gate 3은 Gate 1 이후 병렬 진행 가능하다. Gate 4부터 Gate 10까지는 순차 진행한다.

| 상태 | 정의 |
|---|---|
| NOT STARTED | 작업과 증거가 시작되지 않았다. |
| IN PROGRESS | 진행 중이며 PASS 조건을 충족하지 않았다. |
| BLOCKED | `UNKNOWN`, 외부 승인 또는 검증 대기로 필수 조건이 막혔다. |
| SUBSTANTIALLY PASS | 비필수 잔여 항목만 남았으며 처리 시점을 기록했다. 다음 Gate 전제는 잔여로 둘 수 없다. |
| PASS | 모든 필수 항목과 PASS CONDITION을 증거로 확인했다. |

**증거 원칙:** `docs/gates/<Gate ID>.md`에 명령 출력, 스크린샷/링크, 날짜, 결정과 잔여 `UNKNOWN`이 없으면 PASS가 아니다.

## Global Definition of Done 및 DoD 3단계

| 카테고리 | 기준 |
|---|---|
| Code Quality | TypeScript strict, lint/typecheck/test/build PASS, dead code·불필요 dependency 없음 |
| Architecture | UI의 DB/raw PHP endpoint/vendor analytics 직접 호출 금지, Legacy dependency는 adapter boundary에 격리 |
| Security | secret commit, password/hash/session ID 노출 금지; Production write는 명시 승인 |
| UX | Desktop/Mobile, loading/error/empty/unavailable, keyboard, 접근성 baseline |
| SEO | Public page면 title, description, canonical, crawl/index behavior, Open Graph, semantic headings |
| Analytics | canonical event, Attribution Context, provider 분리, dedupe, Debug Harness |
| Legacy Parity | behavior inventory, destination/auth parity, business semantics 비추측, `UNKNOWN` 기록, rollback |

| 단계 | DoD |
|---|---|
| Task DoD | Global DoD 적용 항목, `pnpm check`, Contract/Adapter의 L1/L2, Legacy UI 4상태, 새 페이지 metadata/canonical/375px/L3, 새 env의 `.env.example`·`env.*.ts`·Harness 갱신, ADR/PR Gate 기록을 충족한다. |
| Slice DoD | Task DoD, L3, L4 S1~S9, 해당 L5 필수 항목, GA4/Meta 수신, rollback, `docs/runbook.md` 기록 및 적용되는 L6 soak을 충족한다. |
| Gate DoD | 모든 ● 항목, 적용 Slice DoD와 Harness, 증거 기록, 다음 Gate 전제를 충족한다. |

## Gate Promotion Rule · UNKNOWN Handling · Migration Unit

DoD 검증과 증거 기록 후에만 PASS로 승격한다. 현재 Gate와 무관한 runtime `UNKNOWN`은 blocker가 아니지만 Apache routing `UNKNOWN`은 Gate 4~6 blocker다. `UNKNOWN`이면 source-of-truth를 요청한다. 전체 PHP call graph/DB semantics/config 해독은 금지한다. 기본 단위는 **user-facing feature slice**이며 `Behavior → Dependency → Contract → Implementation → Parity → Analytics → Production`을 반복한다.

## Gate 0 — Legacy Preservation

**Objective:** Production과 Legacy source를 보존하고 파괴적 변경을 방지한다.

| 구분 | 항목 |
|---|---|
| ● | Production baseline 및 Legacy source Git 보존 |
| ● | MariaDB와 PHP Core 유지, destructive migration 없음 |
| ● | Production Safety 준수 |
| ○ | runtime dependency 증거 기록 |

Production Safety: 명시 승인 없이 DB schema/data 변경·삭제, Payment 호출, SMTP/SMS 발송, credential 변경, `chmod`/`chown`, service restart, OS upgrade, PHP 제거, PG callback 변경을 금지한다.

**DoD:** ● 항목과 Global DoD Security.  
**PASS CONDITION:** Legacy Core 변경 없이 V2 작업을 시작할 수 있다.

## Gate 0.5 — Production Discovery

**Objective:** V2에 필요한 Production Boundary를 파악한다.

| 구분 | 항목 |
|---|---|
| ● | web root, runtime, database, session source, homepage execution path, assets, payment dependency, runtime storage 조사 |
| ● | canonical homepage dependency slice와 Auth/session/PG 존재 기록 |
| ○ | deployed revision, teacher asset, Set-Cookie, handler/storage, VirtualHost/TLS/Rewrite/Proxy runtime 검증 |

**DoD:** 확인 사실과 잔여 runtime verification을 분리해 증거에 기록한다.  
**PASS CONDITION:** Local 구현 boundary와 cutover blocker가 분리된다.

## Gate 0.9 — Prerequisites

**Objective:** Gate 1~6의 구현·운영 검증에 필요한 사실과 권한을 확보한다.

| # | 항목 | 구분 |
|---|---|---|
| 1 | Header가 쓰는 `$member` 필드 및 `common.php` 부수효과 | ● |
| 2 | Apache 버전/MPM/모듈, vhost/TLS/sudo 권한 | ● |
| 3 | session cookie 이름·도메인 | ● |
| 4 | GA4/GTM/Meta/Naver/Kakao 추적 코드 목록 | ● |
| 5 | Legacy URL 지도 | ● |
| 6 | 인스턴스 메모리/CPU credit 기준선 및 CloudWatch alarm | ● |
| 7 | Vercel commercial plan, origin URL 체계, kill switch 경로 | ● |
| 8 | 일반/첨삭 테스트 계정 | ● |
| 9 | 홈과 V2 홈/강좌 사이 UTM/attribution 충돌 여부 | ● |
| 10 | `shop/ajax.list.php` 재사용 가능성 | ○ |

**DoD:** 모든 ● 항목의 근거 또는 blocker/source-of-truth를 `docs/gates/Gate-0.9.md`에 기록한다.  
**PASS CONDITION:** Gate 1~6의 runtime 검증을 추측 없이 수행할 수 있다.

## Gate 1 — V2 Foundation + Harness

**Objective:** 독립 개발·검증·배포 가능한 Next.js application과 L1~L6 Harness 기반을 만든다.

| 구분 | 항목 |
|---|---|
| ● | App Router, TS strict, pnpm, env validation, ESLint boundary, error/not-found, metadata/robots/sitemap |
| ● | `src/env.client.ts`, `src/env.server.ts`, `src/legacy/` contracts/fixtures/adapters/handoff 골격 |
| ● | L1/L2 CI, L3 Playwright 골격, middleware origin 보호, `/api/v2-health` |
| ● | Vercel Preview, `pnpm check` |
| ○ | Production deployment 준비(공개 cutover 제외) |

환경변수 상세의 단일 진실은 `.env.example`이다. `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_LEGACY_BASE_URL`, `NEXT_PUBLIC_LEGACY_ASSET_HOST`, `NEXT_PUBLIC_VIEWER_SOURCE`, `COURSE_SOURCE`, `LEGACY_BRIDGE_BASE`, `LEGACY_BRIDGE_TIMEOUT_MS`, `COURSE_REVALIDATE_SECONDS`, `V2_PROXY_SECRET`, `V2_ENFORCE_PROXY`, 추적 ID, `NEXT_PUBLIC_ANALYTICS_ENABLED`, `NEXT_PUBLIC_ATTRIBUTION_COOKIE_DOMAIN`을 사용한다.

**DoD:** Global DoD Code Quality/Architecture/Security 및 L1~L3 기반.  
**PASS CONDITION:** mock 기반 V2 페이지를 Vercel Preview로 검증할 수 있다.

## Gate 2 — Design Parity Foundation (기존 디자인 추출)

**Objective:** 기존 PHP 화면의 디자인을 그대로 재현할 수 있는 스타일 기반과 공통 셸 컴포넌트를 만든다.

| 구분 | 항목 |
|---|---|
| ● | Legacy Bootstrap 버전/로드 방식, 폰트, `main.css` 출처와 SHA256 기록 |
| ● | `src/design-system/legacy/`의 global CSS 로드 구조; 같은 Bootstrap CSS와 `main.css` 복사본 사용 |
| ● | 실제 Bootstrap 변수와 `main.css`에서 추출한 `tokens.css` 문서; 새 값 생성 금지 |
| ● | `SiteHeader`, `DesktopNav`, mock viewer 기반 `AuthArea`, `MobileNav`, `SiteFooter` |
| ● | `Container`, `Section`, `Button`, `Link`, `Heading`, `Text` primitive |
| ● | PHP → 컴포넌트 매핑 표 `docs/design/component-map.md` |
| ● | Header/Footer/MobileNav 열린 상태의 visual parity 스크립트와 legacy 기준 이미지(3 viewport) |
| ● | Footer 법적 표시 사항 글자 단위 일치 테스트 |
| ● | 키보드 접근, focus 표시, alt |
| ○ | production 비노출 `/_dev/ui` 컴포넌트 미리보기 |

**DoD:** Legacy와 동일한 Bootstrap 클래스·`main.css` 클래스 및 마크업 구조를 유지하고, Bootstrap JS 없이 React로 carousel/accordion/dropdown/offcanvas 동작을 재현한다. visual diff는 `maxDiffPixelRatio` 2%(TBD-조정 가능)를 초과하면 merge 차단이 아닌 diff 이미지 첨부 리뷰 필수로 시작한다.
**PASS CONDITION:** V2의 Header, Footer, MobileNav가 3개 viewport에서 legacy와 허용치 이내로 일치하고, 홈 섹션을 같은 기반 위에서 조립할 수 있다.

## Gate 3 — Legacy Integration Foundation (viewer + courses Bridge)

**Objective:** viewer/course read를 위한 최소 PHP boundary를 만든다.

| 구분 | 항목 |
|---|---|
| ● | endpoint audit, Contract/fixture, `ViewerAdapter`/`CourseAdapter`, `bridge-fetch.ts`/`bridge-server.ts` |
| ● | Bridge는 GET-only, output isolation, lint/review/controlled deployment/rollback과 L4 S1~S4 |
| ● | mock은 `src/legacy/adapters/<contract>/mock.ts`, fixture는 `src/legacy/contracts/fixtures/` |
| ● | secret/PII/transaction 변경 없음, 응답 key와 fixture key 정합 |
| ○ | existing endpoint 재사용 및 drift check |

Viewer: `Browser → ViewerAdapter(client) → /v2-api/viewer.php → common.php → $member → canonical JSON`. Apache가 Vercel proxy 시 Cookie를 제거하므로 Next.js server는 PHP session을 볼 수 없다. Course public data는 Vercel server(ISR)가 cookie 없이 `/v2-api/courses.php`를 호출한다.

```json
{ "v": 1, "authenticated": false }
{ "v": 1, "authenticated": true, "member": { "displayName": "...", "level": 2 }, "capabilities": { "correction": false, "admin": false } }
```

로그인 ID, 이메일, 연락처, session ID는 금지하고 UI는 `capabilities`만 사용한다.

**DoD:** Global DoD Architecture/Security/Parity.  
**PASS CONDITION:** viewer/course read가 adapter boundary에서 검증되고 PHP authority가 유지된다.

## Gate 4 — Production Routing (preview 전용, kill switch)

**Objective:** 외부 비노출 `/_v2/check`(noindex)와 preview cookie로 Vercel routing을 검증한다.

| 구분 | 항목 |
|---|---|
| ● | VirtualHost/Rewrite/Proxy runtime, route ownership matrix, `/v2-api/*` PHP 유지 |
| ● | `/_v2/check`, `/courses/*`, `/_next/*`, `/api/v2-health`만 proxy; 별도 마케팅 랜딩은 없으며 홈은 preview cookie 조건에서만 V2 |
| ● | 홈은 `v2_preview=1` cookie일 때만 V2 |
| ● | Payment/PG return/uploads/LMS/admin/auth 보호, L4 S5~S9 및 cookieForwarded false |
| ● | kill switch 시연, vhost rollback, resource 비교, runbook |
| ○ | Production smoke-test window |

**DoD:** route/session/rollback evidence.  
**PASS CONDITION:** preview routing이 보호 route 영향 없이 검증되고 Legacy 즉시 복귀가 가능하다.

## Gate 5 — Tracking Parity & Homepage Internal Soak (preview 쿠키)

**Objective:** V2 홈을 공개 전 내부 soak하여 추적과 핵심 handoff를 검증한다.

| 구분 | 항목 |
|---|---|
| ● | 홈 V2 완성, Legacy와 동일 추적 tag, `page_view`/`cta_click`/`begin_checkout`/`bridge_error` |
| ● | preview cookie 내부 soak: Header, 링크, 결제 이동, tracking 확인 |
| ● | 홈 → V2 home/course → PHP checkout의 UTM/attribution GA4 연속성 |
| ● | L5 홈 P1~P12 전부 PASS 및 debug/deduplication evidence |
| ● | purchase는 V2가 보내지 않으며 결제 상태 + 주문 ID로 Legacy가 확정 |
| ● | `HeroCarousel`, `StatsBar`, `CurriculumSection`, `WhySection`, `CompareTable`, `ProcessSteps`, `CeoMessage`, `BriefingPartners`, `Testimonials`, `FaqAccordion`을 `src/content/home.ts`의 타입 있는 문구·수치·FAQ·후기·링크 데이터로 조립 |
| ● | 홈 전체 visual parity: legacy/V2를 375×812, 768×1024, 1440×900에서 캡처 비교; carousel 자동전환·animation 정지 후 2%(TBD-조정 가능) 이내 |
| ○ | provider 추가 검증 |

**DoD:** Slice DoD 중 공개 canary 전 조건과 L5 홈 필수 항목.  
**PASS CONDITION:** 내부 soak에서 추적 parity, handoff, attribution 연속성이 증거로 확인된다.

## Gate 6 — Homepage Cutover (canary → 100%)

**Objective:** 신규 방문자 일부를 cookie로 고정한 canary부터 비율을 확대해 V2 홈을 100% 운영한다.

| 구분 | 항목 |
|---|---|
| ● | canary → 비율 확대 → 100% 순서, 비율과 기간은 TBD |
| ● | 단계마다 L6 경보 없음 및 컷오버 전 7일 평균 대비 전환율 -20% 이내 |
| ● | L4 재실행, L5 홈 P1~P12, tracking parity, kill switch/rollback 가능 |
| ● | 100% 후 7일간 rollback 없음 및 kill switch 사용 가능 |
| ● | 홈 전체 visual parity가 Gate 5의 3개 viewport 기준에서 허용치 이내; Gate 2의 리뷰 필수 정책을 컷오버 시 필수 통과로 강화 |
| ○ | homepage experiment |

캐러셀 parity는 automatic cycle, controls, indicators, touch, mobile, internal links를 포함한다.

**DoD:** Slice DoD 및 위 ● 항목.  
**PASS CONDITION:** V2 홈이 추적 단절 없이 100% 운영되고 rollback 없이 7일 경과한다.

## Gate 7 — Analytics & Attribution Harness 완성

**Objective:** vendor 독립 Marketing Measurement infrastructure를 완성한다.

| 구분 | 항목 |
|---|---|
| ● | `track()` canonical event와 GA4/GTM, Meta, Naver, Internal adapter |
| ● | `page_view`, `course_view`, `cta_click`, `consultation_start`, `begin_checkout`, `purchase` schema |
| ● | Attribution Context: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer`, `landing_page`, `campaign`, session attribution, conversion identifier |
| ● | begin_checkout/purchase dedupe, event/payload/provider/attribution/dedupe Debug Harness |
| ○ | experiment assignment 및 추가 provider |

**DoD:** UI provider call 없음, PII 없음, purchase backend confirmation rule.  
**PASS CONDITION:** funnel event를 중앙 관리·검증한다.

## Gate 8 — Public Frontend Migration (강좌 상세 등, 페이지별 반복)

**Objective:** 홈 이외 Public Frontend를 feature slice로 이전한다.

| 구분 | 항목 |
|---|---|
| ● | 우선순위: Course/Product Detail → Event/Promotion → Consultation → Course Listing → remaining Public Pages |
| ● | behavior/dependency/contract/UI/accessibility/SEO/analytics/attribution/parity/rollback |
| ● | course ISR, metadata, sale CTA/404, Bridge 장애 fallback, L5 전 항목과 301 |
| ○ | Search Console 색인 확인 |

Checkout은 Legacy PHP가 계속 소유한다.

**DoD:** 페이지별 Slice DoD와 Gate 증거.  
**PASS CONDITION:** Public Frontend ownership이 이동해도 Legacy Core가 정상이다.

## Gate 9 — Growth & Optimization

**Objective:** V2 개선을 funnel/attribution/conversion으로 측정한다.

| 구분 | 항목 |
|---|---|
| ● | funnel measurement, UTM/referrer/landing/session/checkout/purchase attribution validation |
| ● | controlled A/B test, SEO validation, CWV baseline, campaign measurement, dashboard-ready event |
| ○ | Hero/CTA/course positioning/price presentation/consultation experiment |

**DoD:** Global DoD Analytics/SEO/UX.  
**PASS CONDITION:** 개선 효과를 신뢰 가능한 측정으로 판단한다.

## Gate 10 — Optional Domain / Backend Ownership Expansion

**Objective:** 안정화 후에만 domain별 Backend ownership 확대를 판단한다. 필수 Gate가 아니다.

| 구분 | 항목 |
|---|---|
| ● | 사업적 이유, semantics, parity/security review, migration/rollback plan, observability, Production validation |
| ● | Direct MariaDB read는 검증된 read-only domain과 권한/connection security/parity/rollback이 있을 때만 조건부 검토 |
| ○ | Vercel-first ingress, PHP removal, 후보 domain 재평가 |

**DoD:** 개별 migration의 ● 항목과 Global DoD.  
**PASS CONDITION:** 필요한 domain만 안전하게 TypeScript ownership으로 이전한다.

## Gate 기록 템플릿

```md
# Gate <ID> — <이름>
Status: NOT STARTED | IN PROGRESS | BLOCKED | SUBSTANTIALLY PASS | PASS
## Scope / Objective
## Required items
## Evidence
## UNKNOWN / Blockers
## Rollback
## Promotion decision
```

## Rollback Trigger 및 우선순위

L4 S1~S9 실패, P10 결제 실패, cookieForwarded true, critical parity/security regression, L6 경보 또는 Gate 6 전환율 조건 실패 시 원인 분석 전에 rollback한다. 순서는 **kill switch → Vercel 이전 deployment promote → vhost backup 복원 → Bridge tar backup 복원**이다. DB/data 변경을 rollback 수단으로 사용하지 않는다.

## Final Architecture 및 Success Criteria

Apache Front Door 아래 V2 route는 Vercel/Next.js, `/v2-api/*`와 Legacy route는 PHP/Legacy Core/MariaDB로 유지한다. 홈은 Gate 5/6의 대상이며 성공은 PHP 파일 수가 아니라 Public Frontend, SEO, Analytics, Attribution, Experiment의 TypeScript ownership과 Checkout/Auth/LMS/Payment 안정성, 점진 route migration, 빠른 Vercel deployment, 측정 가능한 Growth improvement의 동시 달성이다.
