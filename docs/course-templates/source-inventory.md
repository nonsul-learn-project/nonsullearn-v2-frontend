# Gate 0 — Source Inventory

작성일: 2026-10-15
조사 방법: 이 레포 파일 시스템 전수 조사 (`find`, `grep`). 운영 서버·외부 조회 없음.

## 1. 템플릿 문서 9개 — 전부 존재 (파일명은 예상과 다름)

요청서는 각 디렉터리에 `design.md` / `copy.md` / `wireframe.md`가 있을 것으로 예상했으나,
**실제 파일명은 한글이며 구분자가 디렉터리마다 다르다.** 파일을 이동하거나 이름을 바꾸지 않았다.

| 유형 | 역할 | 실제 경로 | 크기 |
|---|---|---|---|
| 인문논술 | design | `docs/templates/1/인문논술 템플릿/인문논술_공통템플릿_design.md` | 13,979 B / 246행 |
| 인문논술 | copy | `docs/templates/1/인문논술 템플릿/인문논술_공통템플릿_copy.md` | 24,791 B / 393행 |
| 인문논술 | wireframe | `docs/templates/1/인문논술 템플릿/인문논술_공통템플릿_wireframe.md` | 19,508 B / 282행 |
| 수리논술 | design | `docs/templates/1/수리논술 템플릿/수리논술_공통템플릿_design.md` | 11,459 B / 224행 |
| 수리논술 | copy | `docs/templates/1/수리논술 템플릿/수리논술 공통템플릿 copy.md` | 17,939 B / 349행 |
| 수리논술 | wireframe | `docs/templates/1/수리논술 템플릿/수리논술_공통템플릿_wireframe.md` | 18,982 B / 269행 |
| 약술형논술 | design | `docs/templates/1/약술논술 템플릿/약술형논술 공통템플릿 design.md` | 11,395 B / 221행 |
| 약술형논술 | copy | `docs/templates/1/약술논술 템플릿/약술형논술 공통템플릿 copy.md` | 18,940 B / 356행 |
| 약술형논술 | wireframe | `docs/templates/1/약술논술 템플릿/약술형논술 공통템플릿 wireframe.md` | 19,376 B / 263행 |

### 파일명 관찰 (수정하지 않음, 보고만)

1. `design.md` / `copy.md` / `wireframe.md`라는 이름의 파일은 **하나도 없다.** 전부 한글 접두사가 붙어 있다.
2. 구분자가 섞여 있다 — 인문논술은 전부 밑줄(`_`), 약술논술은 전부 공백, **수리논술은 같은 폴더 안에서 섞인다**
   (`수리논술_공통템플릿_design.md` vs `수리논술 공통템플릿 copy.md`).
3. 디렉터리명은 `약술논술 템플릿`인데 파일명은 `약술형논술`이다. 요청서 표기(`약술형논술`)와 디렉터리 표기가 다르다.
4. 요청서가 예로 든 `desgin.md`(오타형) 파일은 없다.
5. 공백이 포함된 경로이므로 스크립트/도구에서 반드시 인용부호로 감싸야 한다.

→ 코드에서 이 문서를 경로로 참조할 일은 없으므로 **이름을 바꾸지 않는 것을 권장한다.** 바꾸면 캔버스 원본과의 추적이 끊긴다.

## 2. 예시 HTML — `HTML/` 폴더 안 3개가 전부

`docs/` 전체를 `-name "*.html" -o -name "*.htm"`으로 전수 조사한 결과 **HTML 파일은 3개뿐**이며
모두 `docs/templates/1/HTML/` 안에 있다. `HTML/` 폴더 밖에 관련 예시 HTML은 **없다.**

| 파일 | 크기 | 행 | 비고 |
|---|---|---|---|
| `docs/templates/1/HTML/인문논술 상세페이지 템플릿.html` | 2,068,150 B | 390 | `<section>` 20개 |
| `docs/templates/1/HTML/수리논술 상세페이지 템플릿.html` | 2,114,836 B | 390 | `<section>` 22개 |
| `docs/templates/1/HTML/약술논술 상세페이지 템플릿.html` | 2,113,033 B | 390 | `<section>` 22개 |

구조·재사용성 분석은 [html-reference-map.md](html-reference-map.md)에 있다.

> 인문논술만 `<section>`이 20개인 것은 파일 손상이 아니다. 세 템플릿 모두 마크업이
> 두 번 들어 있고(정적 미리보기 + 템플릿 본문), 수리·약술은 02 블록이 02-A / 02-B로 쪼개져 있다.

## 3. 기존 Next.js 강좌 상세페이지

| 역할 | 파일 | 행 |
|---|---|---|
| 라우트 (ISR, metadata, 인증 handoff) | `src/app/courses/[id]/page.tsx` | 145 |
| 본문 조립 (Server Component) | `src/features/course-detail/CourseDetail.tsx` | 105 |
| 히어로 + 구입폼 + 옵션 + 형제강좌 (Client) | `src/features/course-detail/CourseOrderForm.tsx` | 771 |
| 선택·추가 옵션 select (Client) | `src/features/course-detail/CourseOptionPicker.tsx` | 224 |
| 탭 4개 (Client) | `src/features/course-detail/CourseInfoTabs.tsx` | 189 |
| 강의후기 목록 | `src/features/course-detail/CourseReviewList.tsx` | 209 |
| 강의문의 목록 | `src/features/course-detail/CourseQuestionList.tsx` | 227 |
| 이전/다음 강좌 계산 | `src/features/course-detail/siblings.ts` | 62 |
| Legacy 스킨 CSS 미러 (`style_2.css`) | `src/features/course-detail/legacy-course-detail.css` | 347 |
| 스킨 inline style 모음 | `src/features/course-detail/legacy-inline-styles.ts` | 137 |

상세 감사는 [current-page-audit.md](current-page-audit.md).

## 4. 데이터 계층

| Contract | 파일 | Bridge endpoint |
|---|---|---|
| `course-full.v1` (상세 본체) | `src/legacy/contracts/course-full.ts` (234행) | `GET /v2-api/course-detail.php?id=` |
| `course.v1` (목록 카드) | `src/legacy/contracts/course.ts` (108행) | `GET /v2-api/courses.php` |
| `course-community.v1` (후기·문의) | `src/legacy/contracts/course-community.ts` (121행) | `GET /v2-api/course-community.php` |
| `category-list.v1` (분류 목록) | `src/legacy/contracts/category-list.ts` (91행) | `GET /v2-api/category-list.php` |
| `viewer.v1` (로그인 상태, **브라우저 전용**) | `src/legacy/contracts/viewer.ts` (75행) | `GET /v2-api/viewer.php` |

JSON Schema 단일 원본은 `contracts/bridge/*.v1.schema.json`, fixture는 `contracts/bridge/fixtures/`.
Adapter는 `src/legacy/adapters/<name>/{http,mock,index}.ts`.

상세 상세페이지 fixture 4종 = mock id 4개 (`src/legacy/adapters/course-detail/mock.ts`):

| mock id | fixture | 시나리오 |
|---|---|---|
| `1001` | `course-full.basic.json` | 선택옵션 3개(품절 1개 포함), 후기 3건 |
| `1002` | `course-full.no-options.json` | 선택옵션 없음 |
| `1003` | `course-full.sold-out.json` | 품절 |
| `1004` | `course-full.price-on-inquiry.json` | 전화문의 |
| `9999` | — | Bridge 503 장애 |

## 5. 강좌 유형 분류 — **데이터로는 없고, `ca_id` 접두사로만 유도 가능**

코드 어디에도 `courseType` / `인문|수리|약술` 필드가 없다. `course-full.v1`의
`item.category`는 `{ id, name, requiresCertification, requiresAdultCertification }`뿐이다.

유형은 **Legacy `ca_id` 앞 2자리**로 갈린다. 근거 2곳:

| 유형 | `ca_id` 접두사 | 강사별 `ca_id` | 근거 |
|---|---|---|---|
| 인문논술 | `10` | 김윤환 1010, 임찬우 1020, 하태진 1030 | `docs/discovery/legacy-url-map.md:26`, `src/content/site.ts:30-35` |
| 수리논술 | `30` | 김태훈 3020, 이현진 3040, 민준호 3050 | `docs/discovery/legacy-url-map.md:27`, `src/content/site.ts:39-44` |
| 약술논술 | `40` | 구제범 4010, 배제형 4020, 이현진 4030 | `docs/discovery/legacy-url-map.md:28`, `src/content/site.ts:48-53` |

`ca_id`는 2자리씩 최대 6단계다 (`categoryIdSchema = /^[0-9]{2,10}$/`).
예: fixture의 `category.id = "101060"` → `10`(인문) / `1010`(김윤환) / `101060`(수능전 파이널).

`src/features/course-detail/siblings.ts`가 이미 `categoryId.slice(0, 4)`로 같은 종류의
접두사 묶기를 하고 있다 (Legacy `SUBSTRING(ca_id,1,4)` 재현).

### UNKNOWN — `20` 대역

`src/content/static-pages.ts:162`에 계열 목록이 `['인문논술','상경논술','수리논술','약술형']`로 적혀 있는데,
**`상경논술`에 해당하는 `ca_id`가 어디에도 없다.** 헤더/푸터 내비게이션에도 `20` 링크가 없다.
`20` 대역이 존재하는지, 존재하면 어느 템플릿을 쓰는지 사람 확인이 필요하다 → `gap-analysis.md` G-07.

## 6. 스타일 체계 — Tailwind 없음

| 수단 | 위치 | 비고 |
|---|---|---|
| Bootstrap 5.3.2 | `package.json` dependency | Legacy와 같은 버전 |
| Legacy `main.css` 미러 | `src/design-system/legacy/main.css` (362행) | **SHA256 고정.** `scripts/verify-legacy-css.mjs`가 검증, 직접 수정 금지 (AGENTS.md §9) |
| 디자인 토큰 | `src/design-system/tokens.css` | `--nonsul-*` 28개. `main.css`에서 추출한 값만 |
| 전역 baseline | `src/app/globals.css` (76행) | `.visually-hidden` 포함 |
| 라우트 전용 Legacy 스킨 CSS | `src/features/course-detail/legacy-course-detail.css` | `style_2.css` 미러. **체크섬 비고정** |
| CSS Modules | `HeroCarousel.module.css`, `SiteFooter.module.css` | 새 컴포넌트 스타일의 기존 선례 |
| 기능 전용 CSS | `legacy-category-list.css`, `legacy-public-pages.css`, `legacy-static-pages.css` | |
| inline style 객체 | `legacy-inline-styles.ts` + 각 컴포넌트 상단 `CSSProperties` 상수 | Legacy 스킨이 inline으로 넣던 값 |

**Tailwind / PostCSS 설정은 없다** (`package.json`, `next.config.*`에 참조 0건).
→ 새 템플릿 스타일은 **CSS Modules + CSS 커스텀 프로퍼티**가 기존 선례에 맞는 선택이다.

## 7. 구매 · 로그인 · SEO 현황

### 구매 (전부 Legacy 소유, V2는 폼만 그린다)

- `<form name="fitem" method="POST" action={Bridge가 준 /shop/cartupdate.php}>`
  → `resolveAction()`이 `legacyRoutes.cartUpdate()`로 치환 (`CourseOrderForm.tsx:650`)
- 전송 필드: `it_id[]`, `sw_direct=1`, `url`, `io_type[<itId>][]`, `io_id[<itId>][]`,
  `io_value[<itId>][]`, `ct_qty[<itId>][]`
- **장바구니 버튼은 없다.** Legacy 스킨도 바로구매(`sw_direct=1`)만 있다.
- 제출 전 검사 3단계가 Legacy `fitem_submit()`과 순서까지 같다 (`CourseOrderForm.tsx:218-245`)
- `track('begin_checkout', { courseId, salePrice })` 후 이동 (AGENTS.md §7.3)

### 로그인

- 상세페이지는 **viewer를 조회하지 않는다.** 서버 HTML에 로그인 상태가 섞이면 ISR/CDN 캐시가 오염된다 (AGENTS.md §6.3).
- 로그인 상태가 필요한 동작(후기 쓰기, 문의 쓰기)은 Legacy URL 링크로만 넘긴다 — 판단은 Legacy가 한다.
- 본인/성인 인증 필요 분류는 서버에서 Legacy로 `redirect()` (`page.tsx:121-123`).
- 헤더의 로그인 영역만 `ViewerProvider`로 **브라우저에서** 조회한다 (`src/features/header/AuthArea.tsx`).

### SEO

- `generateMetadata`: `title = "<강좌명> > <분류명>"`, `description = item.basic || item.name`,
  `alternates.canonical = <SITE_URL>/courses/<id>`, `openGraph` (`page.tsx:78-100`)
- `robots`는 `enforceProxy`(= `V2_ENFORCE_PROXY === 'true'`)일 때만 `index: true`.
  기본값은 `false`이고, 그때는 `layout.tsx`의 `noindex`를 상속한다.
- `src/app/robots.ts`는 **전체 `Disallow: /`** — 하네스 Gate 4 전 기준 그대로다.
- `revalidate = 300` (리터럴). `generateStaticParams()`는 **빈 배열을 반환하지만 함수는 존재해야 한다** — ISR 스위치.

### Analytics

`src/analytics/events.ts`의 canonical 이벤트 5개: `page_view`, `cta_click`, `course_view`,
`begin_checkout`, `bridge_error`.
상세페이지에서 실제로 발생하는 것은 **`begin_checkout` 하나뿐**이다.
`course_view`는 목록에만 있고 호출하는 코드가 없다 (`grep -rn "track("` 결과 4곳 확인).

## 8. 운영 반영 여부 — **레포에는 있고, 공개 노출은 미완료**

| 근거 | 값 | 의미 |
|---|---|---|
| `src/app/robots.ts` | `disallow: '/'` 전체 | 어느 배포도 검색 노출 안 함 |
| `V2_ENFORCE_PROXY` 기본값 | `'false'` | proxy secret 검사 off, 홈 index off (ADR 0009) |
| `docs/harness/GATES.md:35-37` | Gate 6 / 7 / 8 전부 `NOT STARTED` | 홈 컷오버조차 시작 전 |
| `AGENTS.md §11` | `main` = Production, Vercel 자동 배포 | 코드는 Vercel에 올라가 있다 |
| `AGENTS.md §2` Apache 표 | `/courses/*`가 Vercel 프록시 대상 목록에 있음 | 설정이 **적용되었는지는 레포에서 확인 불가** |

→ **코드·Vercel 배포는 존재한다. 메인 도메인에서 실제로 서빙되는지는 Apache vhost 상태에 달려 있고,
이 레포에서 확인할 방법이 없다** (운영 서버 대상 명령은 AGENTS.md §9 금지).
`pnpm smoke:prod` 또는 Apache 설정 확인은 사람이 해야 한다 → `gate-0-verdict.md` §4.

## 9. 테스트 하네스 현황 (강좌 상세 관련)

| 레벨 | 파일 |
|---|---|
| L1 contract | `tests/contract/course-full.test.ts`, `course.test.ts`, `course-http.test.ts`, `course-community.test.ts`, `bridge-fixtures.test.ts`, `handoff.test.ts` |
| L2 component | `tests/component/course-detail.test.tsx` |
| L3 e2e | `tests/e2e/course-detail.spec.ts`, `mobile.spec.ts`, `seo.spec.ts` |
| lint 경계 | `tests/lint/boundary.test.ts` |
| 스타일 체크섬 | `scripts/verify-legacy-css.mjs` (`main.css`만) |

`pnpm check` = `check:legacy-css` → `contract:fixtures` → `lint` → `typecheck` → `test` → `build`.
