# 강좌 상세페이지 3종 템플릿 통합 — Gate 1~2 통합 보고서

작성일: 2026-10-15
대상: 논술런 `/courses/[id]` 강좌 상세페이지에 인문논술·수리논술·약술형논술 디자인 3종 적용
범위: **Gate 1 (Content & Functional Parity) + Gate 2 (Integration Architecture)**
전제: Gate 0 (Source Discovery) **PASS** — `gate-0-verdict.md`

| Gate | 목표 | 판정 |
|---|---|---|
| Gate 1 | 기존 상세페이지의 모든 중요 정보·기능을 신규 템플릿에서 보존 | **PASS** |
| Gate 2 | 기존 구현을 최대한 재사용하며 3종 템플릿을 통합할 구조 확정 | **PASS (조건부)** |

> **Gate 번호 주의** — 이 문서의 `Gate 0~7`은 요청서가 정의한 워크스트림 자체 번호이며,
> `docs/harness/GATES.md`의 프로젝트 하네스 Gate(0~10)와 다른 체계다.
> 이 작업 전체는 하네스 기준 **Gate 8 (Public Frontend Migration — 강좌 상세)**에 해당하고 현재 `NOT STARTED`다.

---

## 요약 — 3분 안에 알아야 할 것

1. **정보 손실 0건.** 기존 화면 요소 31개 전부 신규 템플릿에 자리가 있다. 제거되는 1건은 요청서가 명시적으로 금지한 Eyebrow(`CourseDetail.tsx:53`의 `논술런`)다.
2. **재구현 0건.** 기존 컴포넌트 15개를 무변경 재사용하고, 수정은 2개(`page.tsx` 3줄 + 주문 로직 훅 추출)뿐이다.
3. **강좌 유형은 `ca_id` 앞 2자리로 유도한다** (`10` 인문 / `30` 수리 / `40` 약술). Contract에 유형 필드가 없지만 **Bridge 변경 없이 해결된다.**
4. **유형별 전용 블록은 3개뿐이다** (01 히어로 · 02-A 문제 공감 · 04 수업 루프). 나머지 11블록은 공용 컴포넌트 + 테마 토큰으로 커버된다.
5. **최대 위험은 주문 폼 전송 필드 변형이다.** 받는 쪽이 Legacy `cartupdate.php`라 필드 하나만 달라져도 결제가 조용히 깨진다.
6. **Critical 4건은 전부 "설계 결정"이며 해소 불가능한 누락이 아니다.** 사람이 D1~D3을 고르면 Gate 3에 진입한다.

---

# 제1부 · Gate 1 — Content & Functional Parity

## 1.1 기존 → 신규 콘텐츠 매핑 (31개 요소 전수)

범례 — `블록` = wireframe.md의 00~07 번호 · 보존 `○` 유지 / `△` 형태 변경(정보 동일) / `●` 결정 필요 / `✕` 제거

| # | 기존 화면 요소 | 데이터 | 신규 위치 | 보존 | 비고 |
|---:|---|---|---|:--:|---|
| 1 | 상단 HTML 블록 `#sit_hhtml` | `item.headHtml` | 07-E `LegacyContentBlock` (신설) | ● | D3. 현재 비어도 빈 div를 낸다 |
| 2 | 히어로 소제목 `논술런` | 하드코딩 | — | ✕ | **Eyebrow 금지** (요청서 §3) |
| 3 | 히어로 `<h1>` 강좌명 | `item.name` | 01 히어로 `{title}` + 00 고정 바 | △ | D2 (`<h1>` 주체) |
| 4 | 히어로 설명 | `item.basic` | 01 `{summary}` 기본값 | ○ | 카피 미작성 강좌의 fallback |
| 5 | 상품 이미지 갤러리 + 원본 팝업 | `item.images[]` → `legacyRoutes.courseLargeImage(id, no)` | **신규 블록 필요** | ● | 세 템플릿에 상품 이미지 영역이 **없다** → G-02 |
| 6 | `no_image.gif` 대체 | 상수 | 5와 동일 | ● | 5에 종속 |
| 7 | 별점 이미지 `s_star{n}.png` | `courseStarScore(reviewSummary)` | 07-B 탭 헤더 | △ | 이미지 → 토큰 색 별 아이콘 |
| 8 | `강의후기 (N건)` | `reviewSummary.count` | 07-B 탭 라벨 `강의 후기 [N]` | ○ | copy.md가 명시 |
| 9 | SNS 공유 (facebook/twitter) | `legacyRoutes.courseDetailLegacy(id)` | **신규 위치 필요** | ● | 공유 UI 자리 없음 → G-03 |
| 10 | `판매가격 / 전화문의` 행 | `item.priceOnInquiry` | 00 바 + 07-C 패널, `saleState` | ○ | `unknown`으로 매핑 |
| 11 | `수강료` 정가(취소선) + 판매가 | `item.listPrice`, `item.price` | 00 바 + 07-C `{listPrice}`/`{salePrice}` | △ | 취소선 조건 차이 → G-05 |
| 12 | hidden `#it_price` | `item.price` | 07-C 폼 내부 | ○ | 값·id 유지 |
| 13 | `신청기간` | `item.extra[3]` | 07-C `{applyPeriod}` (`enrollInfo`) | ○ | |
| 14 | `수강기간` `수강 시작 후 N일` | `item.extra[2]` | 07-A 정보 카드 + 07-C `{period}` | ○ | 문구 조립 규칙 유지 |
| 15 | `모집인원` `N명` | `item.extra[4]` | 07-C `{capacity}` (`enrollInfo`) | ○ | |
| 16 | `강의수` `N강` | `item.extra[5]` | 05 `총 {n}강` + 07-A 카드 + 07-C 행 | ○ | 3곳에서 쓴다 |
| 17 | 선택옵션 select | `options.subjects`, `items(type 0)` | 07-C `EnrollPanel` 내부 | ○ | **마크업만 교체, 로직 유지** |
| 18 | 추가옵션 select | `options.supplySubjects`, `items(type 1)` | 동일 | ○ | 운영 데이터 현재 0건 |
| 19 | 선택된 옵션 행 + 수량 ± + 금액 + 삭제 | `selected` state | 동일 | ○ | **전송 필드명 절대 유지** |
| 20 | 옵션 없는 강좌 사전 입력 행 | `item.name`, `item.buyMinQty` | 동일 | ○ | `io_id=""`, `io_value=강좌명` |
| 21 | 품절 안내문 `#sit_ov_soldout` | `isCourseSoldOut()` | 00 바 + 07-C 보조 문구 | ○ | copy.md §6 `sold_out` 문구 |
| 22 | `수강 신청하기` submit | `isCourseOrderable()` | 07-C CTA + 00 바 CTA(앵커) | ○ | 00 바는 `#enroll` 앵커, submit은 07-C 하나 |
| 23 | 이전 / 목록보기 / 다음 강의 | `findCourseSiblings()` | **신규 위치 필요** | ● | 형제 강좌 영역 없음 → G-04 |
| 24 | 탭 버튼 4개 | 상수 | 07-B `BoardTabs` | △ | 공지사항은 탭처럼 보이나 실제는 이동 → 유지 |
| 25 | `강의 정보 고시` 표 | `information.product_name` (수강대상) | 01 `{target}` + 07-A | ○ | **`target`의 1순위 출처** |
| 25b | 동일 | `information.model_name` (내용 및 특징) | 02 `{methodLine}` / 05 설명 fallback | ○ | |
| 26 | `상세 강의 소개` | `item.descriptionHtml` | 07-E `LegacyContentBlock` | ● | D3. **분량이 가장 큰 기존 콘텐츠** |
| 27 | 강의후기 목록 | `CourseReviewsState` | 07-B 후기 탭 | ○ | 컴포넌트 그대로 |
| 28 | 후기 쓰기 / 더 보기 | `legacyRoutes.*` | 동일 | ○ | |
| 29 | 강의문의 목록 | `CourseQuestionsState` | 07-B 문의 탭 | ○ | 컴포넌트 그대로 |
| 30 | 문의 쓰기 / 더 보기 | `legacyRoutes.*` | 동일 | ○ | |
| 31 | 하단 HTML 블록 | `item.tailHtml` | 07-E `LegacyContentBlock` | ● | D3 |

**집계: ○ 20 · △ 5 · ● 5 · ✕ 1 → 정보 손실 0건**

### 렌더되지 않는 Contract 필드 (현상 유지)

| 필드 | 이유 |
|---|---|
| `item.extra[1]` | Legacy `item.form.skin.php`도 `it_1`을 쓰지 않는다 |
| `item.category.name` | 본문에는 없다. `generateMetadata` title에만 |
| `reviewSummary.averageScore` | `courseStarScore()`로 별 번호(0~5)로만 변환 |
| `재입고알림` 버튼 | Bridge가 `it_stock_sms`를 주지 않아 조건 미완성 → 의도적 미구현 |
| `지인에게 추천하기` | 회원 전용 쓰기 → AGENTS.md §2 원칙 3에 따라 미구현 |

## 1.2 신규 템플릿 블록 → 데이터 출처

| 블록 | 요소 | 출처 | 판정 |
|---|---|---|---|
| 00 | `{title}` | `item.name` | **있음** |
| 00 | `{badge}` | — | **없음** |
| 00 | `{listPrice}`/`{salePrice}` | `item.listPrice`/`item.price` | **있음** |
| 00 | `{ctaLabel}` | — | 기본값 `수강 신청하기` |
| 00 | `saleState` | `priceOnInquiry`+`soldOut`+`inStock` | **있음** (`coming_soon` 제외 → G-06) |
| 01 | H1 공통 문구 | 템플릿 고정 | **있음** |
| 01 | `{heroMark}` | — | 기본값 있음 (유형별) |
| 01 | `{keywords}` | — | **없음** |
| 01 | `{summary}` | `item.basic` fallback | 부분 |
| 01 | `{target}` | `information.product_name` | **있음** |
| 01 | `{curriculumLink}` | — | 기본값 있음 |
| 01 | 강의 맛보기 | — | **없음** → off |
| 02 | 문제 항목 (인문4·수리3·약술4) | 템플릿 고정 | **있음** |
| 02 | `{methodLine}` | `information.model_name` fallback | 부분 |
| 02 | `{promise}` | 템플릿 기본값 | **있음** |
| 02 | 수강 전·후 3행 | 템플릿 고정 (첨삭 유무로 변형) | **있음** |
| 03 | 브랜드 수치 3개 | — | **없음** (외부 사실, 미검증) → off |
| 03 | 합격증 34장 | — | **없음** (자산·동의 미확인) → off |
| 03 | 글 사례 3건 | — | 예시 전용. 운영 사용 금지 |
| 04 | 수업 루프 3단계 제목 | 템플릿 고정 | **있음** |
| 04 | `steps[].desc` | — | **없음** |
| 04 | `instructor` | — | **없음.** Bridge에 강사 필드 자체가 없다 → G-08 |
| 05 | `총 {n}강` | `item.extra[5]` | **있음** |
| 05 | `lessons[]` | — | **없음.** 회차 정보 부재 → **G-01 핵심** |
| 06 | `session[]`, `{sessionDesc}` | — | **없음** → `showSession` off |
| 06 | `feedback` | — | **없음** → `featFeedback` off |
| 07-A | `recommend[]` 4항목 | — | **없음** |
| 07-A | `infoCards[]` | `extra[5]`, `extra[2]` 부분 | 부분 |
| 07-A | `notices[]` | — | **없음** |
| 07-B | 후기·문의·공지 | 기존 컴포넌트 | **있음** |
| 07-C | `{closing}` | — | **없음** (수리는 필드 자체 없음) |
| 07-C | 포함 태그 | — | **없음** |
| 07-C | `{refundNote}` | — | **없음** |
| 07-C | 주문 폼 | `options`, `form` | **있음** |
| 07-D | `faq[]` 답변 | — | **없음** (질문은 고정) |
| 07-D | 환불 기준 5항목 | copy.md §8 공통 정책 | **있음** |
| 07-D | `policyUrl` | `legacyRoutes.terms()`/`privacy()` | **있음** |

**집계: 기존 데이터로 채워짐 14 · 템플릿 고정 문구 9 · 출처 없음 20**

## 1.3 세 템플릿 구조 차이 — 공용/전용 판정

| 블록 | 인문 | 수리 | 약술 | 공용화 |
|---|---|---|---|---|
| 00 고정 바 | 투명→다크 | 투명→아이보리 | 항상 화이트 + `논술런` 워드마크 | **가능** |
| 01 히어로 | 좌측 700px 1열, `{heroMark}` **배경 블록** | H1 전체 폭 + 하단 7:5 | 좌 H1 + 우 정보(2px 좌측선) | **불가** |
| 02-A 문제 공감 | **4카드** auto-fit | **3 번호 행** (카드 금지 명시) | **4항목 2×2 격자** | **불가** |
| 02-B 수강 전·후 | 3행 flex | 3행 (상단 1px) | 머리행 2px + 3행 | **가능** |
| 03 신뢰 근거 | `BrandStats` **항상** | **조건부** | 조건부 (**범위 칩 없음**) | **가능** |
| 03 합격증 띠 | 동일 | 동일 | 동일 | **가능 — 완전 동일** |
| 04 수업 루프 | 3**카드** (패딩 32px) | 3열 목록, 상단 2px 선 | 3단계 + **에메랄드 화살표** | **불가** |
| 04 강사 | 사진 + 이력 3행 (소개 없음) | 사진 + **소개 1~2문장** + 이력 | 사진 + 소개 + 이력 + H3 `강사 소개` | **가능** |
| 05 커리큘럼 | 번호 96px (**시간 없음**) | 번호 72px + **오른쪽 시간** | 번호 80px + **오른쪽 시간** | **가능** |
| 06 매회 구성 | 가변 막대 56px | 가변 막대 56px | **3칸 고정** 1:2:1, 64px | **가능** |
| 06 첨삭 | 2단계 카드 | 2단계 카드 | 2단계 + 민트 `→` | **가능** |
| 07-A 추천 | **번호** 01~04 | 번호 | **체크 아이콘** | **가능** |
| 07-A 정보 카드 | 라벨+값+**보조줄** | 라벨+값+보조 | 라벨+값 (**보조줄 없음**) | **가능** |
| 07-B 탭 | 하단 2px + 내부 그림자 | 선형 탭 | 하단 2px 포레스트 | **가능** |
| 07-C 신청 | 중앙 H2 + `{closing}` + 640px | H2 + 패널 (**요약 없음**) | 중앙 H2 + `{closing}` + 680px | **가능** |
| 07-D FAQ | 800px `<details>` | 800px | 800px | **가능 — 거의 동일** |

**결론: 유형별 전용은 01·02-A·04 세 블록뿐. 나머지 11블록은 공용.**

## 1.4 Functional Parity — 반드시 보존해야 하는 Legacy 주문 계약

받는 쪽이 Legacy `cartupdate.php`다. **필드명·값·개수가 하나라도 달라지면 결제가 깨진다.**

| 항목 | 현재 값 | 보존 방법 |
|---|---|---|
| `<form name>` | `fitem` | 그대로 |
| `method` | `POST` (Bridge `form.method`) | Bridge 값 사용 |
| `action` | Bridge `form.action` → `resolveAction()` → `legacyRoutes.cartUpdate()` | 함수 그대로 |
| hidden `it_id[]` | `item.id` | 그대로 |
| hidden `sw_direct` | `1` (바로구매 고정) | 그대로. **장바구니 버튼 추가 금지** |
| hidden `url` | `""` | 그대로 |
| hidden `io_type[<itId>][]` | `0` 또는 `1` | 그대로 |
| hidden `io_id[<itId>][]` | Bridge `io_id` (다중 주제는 `chr(30)` 결합) | 그대로 |
| hidden `io_value[<itId>][]` | `주제:값`, 다중은 ` / ` 결합 | 생성 규칙 그대로 |
| `ct_qty[<itId>][]` | 수량 (최소 1) | 그대로 |
| hidden `#it_price` | `item.price` | id 포함 그대로 |
| `.io_price` / `.io_stock` | 옵션 금액 / 재고 | class 포함 그대로 |
| 옵션 없는 강좌 사전 입력 행 | `io_id=""`, `io_value=item.name`, `ct_qty=buyMinQty` | 그대로 |

## 1.5 기능별 보존 판정

| 기능 | 현재 동작 | 판정 |
|---|---|---|
| **URL** `/courses/[id]` | `courseIdSchema` 검증 → 통과만 Bridge 조회 | **유지** |
| **404** | `null` → `notFound()` | **유지** |
| **ISR** | `revalidate = 300` + `generateStaticParams()` 빈 배열 | **유지** (템플릿 선택이 `searchParams`를 읽으면 깨진다) |
| **Bridge 장애** | 본체 throw → 마지막 성공본 유지 (ADR 0007) | **유지** |
| **인증 필요 분류** | 서버 `redirect()` → Legacy | **유지** |
| **로그인 상태** | 상세페이지는 viewer를 **조회하지 않는다** | **유지** (AGENTS.md §6.3) |
| **장바구니** | **버튼 없음** (Legacy 스킨도 바로구매만) | **유지 = 부재** |
| **바로구매** | `sw_direct=1` submit + 검사 3단계 | **유지** (로직 그대로, 버튼만 템플릿 CTA) |
| 제출 검사 ① 전화문의 | `alert('전화로 문의해 주시면 감사하겠습니다.')` | **유지** |
| 제출 검사 ② 옵션 미선택 | `alert('상품의 선택옵션을 선택해 주십시오.')` | **유지** |
| 제출 검사 ③ 추적 | `track('begin_checkout', {courseId, salePrice})` | **유지** |
| 옵션 재고 부족 / 음수 금액 / 중복 | 각 alert 문구 | **유지** |
| 단계별 select 하위 초기화 | `onPickSelection()` | **유지** |
| 수량 ± / 직접 입력 (최소 1) | `changeQty`/`setQty` | **유지** |
| **가격·할인** | `formatPrice()` (원화, `Asia/Seoul`) | **유지** (취소선 조건만 G-05) |
| **품절** | `#sit_ov_soldout` + 버튼 제거 | **유지 (문구 변경)** |
| **전화문의** | `판매가격 / 전화문의` + 버튼 제거 | **유지 (표현 변경)** |
| **강사 정보** | **현재 없음** | **부재 유지** → 블록 숨김 |
| **교재·배송** | **현재 없음.** 교재는 선택옵션(`교재비`)으로만 존재 | **부재 유지** → off |
| **첨삭 안내** | **현재 없음** | **부재 유지** → off |
| **후기 / 문의** | 1페이지 + 쓰기(새 창) + 더 보기 | **유지** |
| **공지** | 탭 버튼이 Legacy 게시판으로 **이동** | **유지** |
| **환불 안내** | **현재 없음** | **신규 추가 — 공통 정책 문구만** |
| **SEO** | `generateMetadata` title/desc/canonical/OG | **유지** (단 `<h1>`은 D2) |
| **SNS 공유** | facebook / twitter 토글 | **결정 필요** → G-03 |
| **원본 이미지 팝업** | `largeimage.php` 새 창 | **결정 필요** → G-02 |
| **이전/다음/목록** | `findCourseSiblings()` + 분류 목록 링크 | **결정 필요** → G-04 |
| **별점** | `s_star{n}.png` | **유지 (표현 변경)** |
| **탭 해시 딥링크** | `#sit_use` / `#sit_qa` | **유지** — 외부 링크가 이미 존재할 수 있다 |
| **PC·모바일** | Legacy 스킨 반응형 | **개선** |
| **접근성** | `sound_only`, `aria-expanded`, alt | **개선** (44px 터치, `aria-pressed`, `role=tab`) |
| **빌드·타입·테스트** | `pnpm check` 통과 | **유지 필수** |

## 1.6 하지 말아야 할 것 (명시적 금지)

| 금지 | 이유 |
|---|---|
| 장바구니 버튼 추가 | 현재 없음. 요청서 §9 "없던 기능 개발 금지" |
| `track('course_view')` 추가 | canonical 목록엔 있으나 현재 호출 0건 → 신규 기능 |
| 강사 정보·합격 사례·브랜드 수치 **생성** | 요청서 §12. 검증되지 않은 사실 생성 금지 |
| `coming_soon` 상태 사용 | 데이터 출처 없음. copy.md도 "확인되지 않은 일정 생성 금지" |
| viewer 조회를 상세페이지 서버에 추가 | 캐시 오염 (AGENTS.md §6.3) |
| `searchParams`로 템플릿 선택 | ISR 파괴 (`page.tsx:25-28`) |
| Bridge에 회원별 값 추가 | AGENTS.md §7.2 |
| `재입고알림` 버튼 구현 | `it_stock_sms` 미제공. 조건 일부만 보면 오동작 |
| 후기/문의 쓰기 기능 V2 구현 | AGENTS.md §2 원칙 3. 링크만 |
| `legacy-course-detail.css`를 새 템플릿에서 import | `#sit_*`/`.shop_*` 선택자가 새 마크업에 섞인다 |

## 1.7 신규 템플릿이 요구하는 상호작용 (기능이 아니라 UI 동작)

| 동작 | 명세 | 접근성 요구 |
|---|---|---|
| 고정 바 스크롤 전환 (480px) | 데스크톱 배경·보더 등장 / 모바일 하단 fixed | `env(safe-area-inset-bottom)` |
| 앵커 이동 | `#curriculum` `#enroll` `#faq` `#method`, `scroll-margin-top:80px` | `prefers-reduced-motion`에서 해제 |
| 커리큘럼 펼치기 | 7강 이상 → 6강 + 펼치기 | `aria-expanded` |
| FAQ 아코디언 | `<details>`, 다중 열기, `+` 45도 회전 | 네이티브 |
| 합격증 자동 흐름 띠 | 34장×2, `translateX(0→-50%)` 60초 linear | 호버·포커스 정지, `aria-pressed`, 두 번째 묶음 `aria-hidden`, reduced-motion에서 수동 스크롤 |
| 탭 전환 | 기존 `CourseInfoTabs` 재사용 | `role="tablist"`/`role="tab"`/`aria-selected` 보강 |

## 1.8 Gap Analysis — 누락 10건

심각도: **Critical** 결정 없이 Gate 3 진입 불가 / **Major** Gate 3 가능, Gate 4 전 해소 / **Minor** 구현 중 판단

### G-01 · Critical — 템플릿 카피 20항목에 데이터 출처가 없다

`copy.md §7`의 강좌별 필드 중 Bridge가 주는 것은 **8개뿐**:
`title`(`item.name`) · `listPrice`/`salePrice` · `period`(`extra[2]`) · `applyPeriod`(`extra[3]`) ·
`capacity`(`extra[4]`) · `n`(`extra[5]`) · `target`(`information.product_name`) ·
`methodLine` 부분(`information.model_name`) · `summary` 부분(`item.basic`)

**출처가 전혀 없는 20항목**: `badge` · `keywords` · `steps[].desc`×3 · `instructor`(이름·소개·이력3·사진·맛보기) ·
**`lessons[]`(회차 라벨·제목·설명·쓰는 답안·점검 기준·시간)** · `session`/`sessionDesc` ·
`feedback` · `recommend[]`×4 · `infoCards[]` · `notices[]` · `closing` · `refundNote` ·
`faq[]` 답변 5~6 · `certificates[]` · `stats[]` · `proof[]`
(그 외 `curriculumLink`·`ctaLabel`·`promise`·`curriculumTitle`은 기본값으로 대체 가능)

**`lessons[]`와 `instructor`가 가장 치명적이다** — 05·04 블록은 wireframe이 "항상" 노출로 지정했는데 채울 데이터가 없다.

| 안 | 방법 | 장점 | 단점 |
|---|---|---|---|
| **A** | V2 콘텐츠 파일 `src/content/` 선례 | Bridge·PHP 변경 0. 즉시 시작 | 강좌마다 코드 배포 필요 |
| B | Bridge 확장 `course-template.v1` | 운영팀이 직접 수정 | PHP 작업 + AGENTS.md §7.1 전체 절차. 가장 느림 |
| C | `descriptionHtml` 파싱 | 추가 저장소 0 | **권고하지 않음.** 강좌마다 구조가 달라 깨진다. CLAUDE.md "추측으로 Contract 만들지 않는다"에 반함 |
| **D** | A로 시작 → 전체 확대 시점에 B 이관 재검토 | 즉시 시작 + 이관 경로 | 두 번 작업 |

**권고 D (A 먼저).** 근거: ① 요청서 §12 "신규 API나 DB를 불필요하게 만들지 않는다"
② Gate 7이 "대표 3 → 10 → 전체"로 확대하므로 초기 모수가 작다
③ `src/content/home.ts`(272행), `static-pages.ts`(233행)가 같은 패턴의 선례
④ provider 인터페이스로 두면 B 이관 시 호출부가 바뀌지 않는다 → **D1**

### G-02 · Critical — 상품 이미지 갤러리가 세 템플릿 모두에 없다

현재 `item.images[]`를 `#sit_pvi_big`에 전부 그리고 각 이미지가 `largeimage.php` 새 창으로 열린다.
세 템플릿의 이미지 영역은 **강사 사진과 합격증뿐**이다.

**권고**: 07-E `LegacyContentBlock`(G-10과 함께 신설) 안에 갤러리로 넣는다. 신설 블록이 1개로 끝나고 00~07 리듬을 깨지 않는다. `largeimage.php` 팝업 링크 유지. → **D3**

### G-03 · Major — SNS 공유 버튼의 자리가 없다

**권고**: 07-B 탭 헤더 우측 또는 07-C 패널 하단에 `LineButton` 한 개로 축소 배치.
절대 URL이 필요하므로 `legacyRoutes.courseDetailLegacy(id)`를 계속 쓴다. 제거하면 기능 회귀다.

### G-04 · Major — 이전/다음/목록 내비게이션의 자리가 없다

`findCourseSiblings()`는 Legacy SQL 2개를 정확히 재현한 로직이다(레이블 반전 포함).
**권고**: 07-D FAQ 다음, 푸터 직전에 1px 구분선 행으로 배치. `siblings.ts`는 **수정하지 않는다.**

### G-05 · Minor — 정가 취소선 표시 조건이 다르다

| | 조건 |
|---|---|
| 현재 | `!priceOnInquiry`면 `listPrice`를 **항상** 표시 (0이어도) |
| 템플릿 | copy.md §5 — "정가 없음 또는 판매가와 같음 → 숨김" |

**권고**: 템플릿 규칙 채택 (`listPrice > price`일 때만). 현재는 `listPrice=0`인 강좌에 `0원` 취소선을 보여주는 표시 오류다. 가격 **값**은 바꾸지 않으므로 요청서 §12 위반이 아니다. Gate 5 회귀 목록에 기록.

### G-06 · Minor — `saleState` 4개 중 3개만 매핑된다

`coming_soon`에 대응하는 Legacy 필드가 없다 → **타입에서 제외.**
또한 `unknown`의 copy.md 문구(`운영 데이터 확인 필요`)는 전화문의 강좌에 맞지 않는다 →
**기존 표현 `전화문의`를 유지**하는 쪽을 권고.

### G-07 · Major — `ca_id` `20` 대역의 정체가 불명확하다

`src/content/static-pages.ts:162`에 계열이 `['인문논술','상경논술','수리논술','약술형']`로 적혀 있는데
`상경논술`의 `ca_id`가 어디에도 없다 (`site.ts`는 `10`/`30`/`40`만, `legacy-url-map.md`에도 없음).

**영향**: Resolver 기본값을 legacy 템플릿으로 두면 매핑되지 않은 분류는 현재 화면을 그대로 쓴다 (안전한 fallback). **진행을 막지 않는다.** 운영 강좌 `ca_id` 분포 확인은 사람 작업.

### G-08 · Major — 강사 정보가 Bridge에 아예 없다

`contracts/course.ts:9` 변경 이력에 명시: `teacherName 삭제 (Bridge가 주지 않는다)`.
한편 `ca_id`는 강사별로 갈리므로 **앞 4자리로 강사를 식별할 수 있다.**
강사 소개는 이미 V2에 일부 있다 (`adapters/public-pages/index.ts:9`, `/teachers`).

**권고**: 강사 정보를 강좌별이 아니라 **강사별(`ca_id` 4자리) 콘텐츠**로 둔다. 여러 강좌가 공유하면 1곳만 쓴다. **검증되지 않은 이력은 생성하지 않고**, 없으면 04 강사 영역을 숨긴다.

### G-09 · Critical — 히어로 `<h1>`이 유형별로 전부 같아진다 (SEO)

세 design.md는 마케팅 헤드라인을 `H1`으로 지정한다. 그러면 인문논술 강좌 전체의 `<h1>`이
`읽는 데서 멈추지 말고, 정확한 답안으로 써보세요.`로 같아진다. 현재는 `item.name`(강좌마다 고유)다.
**명확한 SEO 회귀**이며, `<title>`은 강좌명을 유지하므로 title과 h1이 어긋나기도 한다.

**권고**: `<h1>` = 강좌명, 마케팅 헤드라인은 `<p class="hero-headline">`.
와이어프레임에 이미 히어로 CTA 옆 `강좌명 / 추천 대상` 블록이 있어 **화면 출력은 design.md와 동일**하다.
design.md "H1 히어로" 표기에서 벗어나므로 승인 필요 → **D2**

### G-10 · Critical — 기존 Legacy HTML 3종의 처리

| 필드 | 현재 | 특징 |
|---|---|---|
| `headHtml` | `<div id="sit_hhtml">`, **비어도 빈 div** | 운영 응답에서 빈 값 확인 |
| `descriptionHtml` | 탭 `상세 강의 소개` | **기존 강좌 설명의 본체. 분량 최대** |
| `tailHtml` | wrapper 없이, 비어있지 않을 때만 | |

**권고**: 07-E `LegacyContentBlock` 신설로 보존 + 카피 작업이 끝난 강좌만 `legacyContent: 'hidden'`으로 끈다. 전환 초기 정보 손실 0, 이후 점진적 정돈. → **D3**

### 누락 목록 요약

| ID | 심각도 | 내용 | Gate 3 진입을 막는가 |
|---|---|---|:--:|
| G-01 | Critical | 카피 20항목 데이터 출처 없음 | **예** → D1 |
| G-02 | Critical | 상품 이미지 갤러리 자리 없음 | **예** → D3 |
| G-09 | Critical | 히어로 `<h1>` SEO 회귀 | **예** → D2 |
| G-10 | Critical | 기존 Legacy HTML 3종 처리 | **예** → D3 |
| G-03 | Major | SNS 공유 자리 없음 | 아니오 (권고안 진행) |
| G-04 | Major | 이전/다음/목록 자리 없음 | 아니오 (권고안 진행) |
| G-07 | Major | `ca_id` 20 대역 불명 | 아니오 (legacy fallback 흡수) |
| G-08 | Major | 강사 데이터 없음 | 아니오 (블록 숨김) |
| G-05 | Minor | 정가 취소선 조건 차이 | 아니오 |
| G-06 | Minor | `coming_soon` 미매핑 | 아니오 |

## 1.9 신규 카피 vs 기존 정보 충돌 6건

| 충돌 | 내용 | 해소 |
|---|---|---|
| C-1 | `<h1>` 강좌명(기존) ↔ 마케팅 헤드라인(신규) | D2 |
| C-2 | `promise` "합격을 약속하지 않습니다" ↔ 기존 HTML에 홍보 문구가 있을 수 있음 | D3에서 함께 판단. 모순 문구 공존 금지 |
| C-3 | 정가 취소선 조건 | G-05 — 템플릿 규칙 채택 |
| C-4 | `수강기간` Legacy `수강 시작 후 N일` ↔ 예시 `시작 후 90일` | 기존 조립 규칙 유지 |
| C-5 | `coming_soon` ↔ 데이터 없음 | G-06 — 사용하지 않는다 |
| C-6 | 브랜드 수치 ↔ 강좌별 실적 오해 | copy.md의 `연구소·브랜드 전체 기준` 칩+주석 준수. 단 수치 미검증 → 기본 off |

## 1.10 강좌별 예외 정보의 표시 방법

| 예외 | 현재 | 신규 처리 |
|---|---|---|
| 선택옵션이 없는 강좌 | 스킨이 사전 입력 행 1개 (`io_id=""`) | **그대로** |
| 추가옵션이 있는 강좌 | 로직 있으나 운영 데이터 0건 (TBD) | **그대로.** 발견 시 실물 확인 |
| 전화문의 강좌 | `판매가격 / 전화문의` + 버튼 없음 | `saleState=unknown`, **문구 `전화문의` 유지** |
| 품절 강좌 | 안내문 + 버튼 없음 | `saleState=sold_out` + copy.md §6 문구 |
| 본인/성인 인증 분류 | 서버 `redirect()` → Legacy | **그대로.** 템플릿 렌더 전에 리다이렉트 |
| `extra` 값이 빈 강좌 | 해당 행 미렌더 | **그대로.** `enrollInfo` off |
| 후기 0건 | 별 숨김 + 안내문 | 탭 라벨 `강의 후기 0`, 별 숨김 |
| 카피 미작성 강좌 | — | **legacy 템플릿으로 남는다.** 빈 블록 금지 |
| `ca_id`가 `10`/`30`/`40`이 아닌 강좌 | — | 동일 — legacy 템플릿 |
| Bridge 장애 | 본체 throw → 마지막 성공본 | **그대로** (ADR 0007) |

**핵심 규칙: 데이터가 없으면 블록을 숨긴다. 빈 칸이나 임의 값을 넣지 않는다.**

## 1.11 Gate 1 판정 — PASS

PASS 조건: "필수 정보와 기능에 대한 매핑이 완료되어야 하며, 해결되지 않은 Critical 누락이 없어야 한다."

| 대상 | 결과 |
|---|---|
| 기존 화면 요소 31개 | **전부 매핑 완료** |
| 기존 기능 40개 항목 | **전부 보존 판정 완료** |
| Legacy 주문 계약 13개 필드 | **보존 방법 확정** (로직 추출만, 수정 0) |
| 신규 템플릿 요소 37개 | **데이터 출처 판정 완료** |
| 세 템플릿 구조 차이 16블록 | **공용/전용 구분 완료** |

Critical 4건이 식별되었으나 **"해결되지 않은 누락"이 아니다**:
자료가 없어서 막힌 것이 아니라 **둘 이상의 타당한 처리 방법이 있어 사람이 하나를 고르면 되는 설계 결정**이고,
4건 모두 권고안이 있으며 권고안대로 가면 **기존 정보·기능 손실이 0**이다.
즉 매핑되지 않은 필드는 없고, 최종 위치만 승인이 필요하다.

### 기능 회귀 위험 상위 3개

| 순위 | 위험 | 왜 위험한가 | 차단 방법 |
|---:|---|---|---|
| 1 | **주문 폼 전송 필드 변형** | 받는 쪽이 Legacy `cartupdate.php`. 필드 하나만 달라져도 **결제가 조용히 깨진다.** 옵션 분기가 많아 눈으로 못 잡는다 | 로직을 `useCourseOrder()`로 **추출만** 하고 수정 0. 기존 테스트가 추출 직후에도 통과. 전송 필드 스냅샷 테스트 추가 |
| 2 | **ISR 파괴** | 템플릿 선택이 `searchParams`를 읽거나 viewer를 보면 요청마다 SSR(`ƒ`)로 떨어지고 캐시 오염 | Resolver 입력을 `category.id` **하나로 제한.** 빌드 출력에서 ISR 유지 확인 |
| 3 | **`<h1>` SEO 회귀** | 같은 유형 강좌 전체의 `<h1>`이 동일 (G-09) | D2. 권고안이면 회귀 0 |

---

# 제2부 · Gate 2 — Integration Architecture

## 2.1 전체 구조

```
app/courses/[id]/page.tsx                        ← 변경 3줄
  │  revalidate / generateStaticParams / generateMetadata / 인증 redirect   전부 그대로
  │
  └─ <SiteShell>
       └─ <CourseDetailRouter course siblings reviews questions templateContent />
            │
            │  resolveCourseTemplate(course.item.category.id)   ← 순수 함수, 입력 1개
            │  getCourseTemplateContent(it_id, ca_id)           ← V2 콘텐츠 파일
            │  courseTemplatesEnabled                           ← env kill switch (기본 off)
            │
            ├─ 'humanities'   → <HumanitiesTemplate />   data-course-theme="humanities"
            ├─ 'math'         → <MathTemplate />         data-course-theme="math"
            ├─ 'short-answer' → <ShortAnswerTemplate />  data-course-theme="short-answer"
            └─ 'legacy'       → <CourseDetail />         ← 현재 구현 그대로, 무변경
```

### 핵심 설계 결정 3가지

1. **기존 `CourseDetail`을 건드리지 않고 fallback 템플릿으로 남긴다.** 롤백이 "Resolver가 `'legacy'`를 반환하게 하는 것"으로 끝난다. 코드를 되돌릴 필요가 없다.
2. **Resolver 입력은 `category.id` 하나.** `searchParams`·viewer·쿠키를 보지 않으므로 ISR이 유지된다.
3. **주문 로직은 `useCourseOrder()` 훅으로 추출**하고 네 템플릿이 공유한다. 로직 수정 0.

## 2.2 디렉터리 구조 (신규)

```
src/features/course-detail/
├── CourseDetail.tsx                 [무변경] legacy 템플릿
├── CourseOrderForm.tsx              [수정]  훅 사용으로 전환 (마크업·전송값 동일)
├── CourseOptionPicker.tsx           [무변경] 네 템플릿 공유
├── CourseInfoTabs.tsx               [무변경]
├── CourseReviewList.tsx             [무변경]
├── CourseQuestionList.tsx           [무변경]
├── siblings.ts                      [무변경]
├── legacy-course-detail.css         [무변경] legacy 템플릿만 import
├── legacy-inline-styles.ts          [무변경]
│
├── useCourseOrder.ts                [신규] 주문 상태·검증·제출
├── CourseDetailRouter.tsx           [신규] 템플릿 분기
│
└── templates/
    ├── resolveCourseTemplate.ts     [신규] ca_id 접두사 → 테마 키
    ├── types.ts                     [신규] CourseTemplateContent, buildTemplateProps
    │
    ├── content/
    │   ├── defaults.ts              copy.md 「빈 자리 기본값」
    │   ├── provider.ts              getCourseTemplateContent(itId, caId)
    │   ├── instructors/<caId4>.ts   강사 정보 (ca_id 4자리 단위, G-08)
    │   └── courses/<itId>.ts        강좌별 카피
    │
    ├── shared/                      ← 테마 무관. 토큰과 props로만 변형
    │   ├── course-template.css      예시 HTML 공용 CSS 2.8KB (토큰화)
    │   ├── CourseStickyBar.tsx      00
    │   ├── BeforeAfterRows.tsx      02-B
    │   ├── ProofSection.tsx         03 (BrandStats + CaseSection)
    │   ├── CertificateMarquee.tsx   03 — 세 템플릿 명세 완전 동일
    │   ├── InstructorProfile.tsx    04
    │   ├── CurriculumList.tsx       05
    │   ├── SessionPlan.tsx          06
    │   ├── FeedbackFlow.tsx         06
    │   ├── RecommendList.tsx        07-A
    │   ├── BeforeEnrollInfo.tsx     07-A
    │   ├── BoardTabs.tsx            07-B — CourseInfoTabs 래핑
    │   ├── EnrollPanel.tsx          07-C — useCourseOrder + 폼
    │   ├── FaqAccordion.tsx         07-D
    │   ├── LegacyContentBlock.tsx   07-E [신규 블록] head/description/tail + 상품 이미지
    │   └── CourseSiblingsNav.tsx    07-F [신규 위치] 이전/목록/다음
    │
    ├── humanities/{HumanitiesTemplate,HumanitiesHero,HumanitiesProblem,HumanitiesMethod}.tsx + theme.css
    ├── math/{MathTemplate,MathHero,MathProblem,MathMethod}.tsx + theme.css
    └── short-answer/{ShortAnswerTemplate,ShortHero,ShortProblem,ShortMethod}.tsx + theme.css
```

공용 15 / 유형별 3블록 × 3 = 9 / 신규 블록 2.

## 2.3 Template Resolver

```ts
// src/features/course-detail/templates/resolveCourseTemplate.ts

/**
 * Legacy `ca_id` 앞 2자리로 강좌 유형을 가른다.
 *
 * 근거: docs/discovery/legacy-url-map.md §강사별 ca_id, src/content/site.ts:30-53
 *   10 인문논술 (김윤환 1010, 임찬우 1020, 하태진 1030)
 *   30 수리논술 (김태훈 3020, 이현진 3040, 민준호 3050)
 *   40 약술논술 (구제범 4010, 배제형 4020, 이현진 4030)
 *
 * `ca_id`는 2자리씩 최대 6단계다 (categoryIdSchema). 예: 101060 → 10 / 1010 / 101060.
 * `siblings.ts`가 이미 `categoryId.slice(0, 4)`로 같은 종류의 접두사 묶기를 한다.
 *
 * 매핑되지 않은 대역(`20` 등 — G-07)은 'legacy' 다.
 * 모르는 분류에 템플릿을 추측해서 붙이지 않는다.
 */
export type CourseTemplateKey = 'humanities' | 'math' | 'short-answer' | 'legacy';

const BY_PREFIX: Record<string, Exclude<CourseTemplateKey, 'legacy'>> = {
  '10': 'humanities',
  '30': 'math',
  '40': 'short-answer',
};

export function resolveCourseTemplate(categoryId: string): CourseTemplateKey {
  return BY_PREFIX[categoryId.slice(0, 2)] ?? 'legacy';
}
```

**ISR 안전**: 입력이 `course.item.category.id` 하나이고 순수 함수다. `searchParams`·viewer·쿠키·`Date.now()`를 보지 않는다.

### 활성화 게이트 (Resolver와 분리)

Resolver가 유형을 알아도 **카피가 없으면 템플릿을 쓰지 않는다.** 빈 블록보다 현재 화면이 낫다.

```ts
const key = resolveCourseTemplate(course.item.category.id);
const content = getCourseTemplateContent(course.item.id, course.item.category.id);

const active =
  courseTemplatesEnabled &&          // env kill switch (server)
  key !== 'legacy' &&                // 유형 매핑
  content !== null;                  // 강좌별 opt-in

if (!active) return <CourseDetail ... />;   // 현재 화면 그대로
```

## 2.4 데이터 흐름

```
page.tsx (Server)
 ├─ getCourseDetail(id)             기존. CourseFull (Contract)
 ├─ getCourseReviewsState(id)       기존
 ├─ getCourseQuestionsState(id)     기존
 ├─ getCourses().catch(() => [])    기존 → findCourseSiblings()
 └─ getCourseTemplateContent(...)   신규. 동기. V2 콘텐츠 파일 (Bridge 호출 0)
        │
        └─ sanitizeLegacyHtml(headHtml / descriptionHtml / tailHtml)   기존 위치 유지 (server-only)
                │
                ▼
   <CourseDetailRouter>  →  <XxxTemplate>  →  shared/* + xxx/*
                                 │
                                 └─ <EnrollPanel> → useCourseOrder(course)  'use client'
```

**Bridge 호출 수 변화 0.** 템플릿 콘텐츠는 V2 안의 정적 import라 네트워크 왕복이 없다.

### Server / Client 경계

| 컴포넌트 | 경계 | 이유 |
|---|---|---|
| `CourseDetailRouter` | **Server** | `sanitizeLegacyHtml`이 `server-only`. 분기도 서버에서 끝낸다 |
| 유형별 `XxxTemplate` | **Server** | 조립만 |
| 01 · 02 · 03 BrandStats · 05(접힘 전) · 07-A · 07-E | **Server** | 정적 |
| `CourseStickyBar` | **Client** | 스크롤 480px 전환 |
| `CertificateMarquee` | **Client** | 정지 토글 `aria-pressed` |
| `CurriculumList` (7강 이상) | **Client** | 펼치기 `aria-expanded` |
| `EnrollPanel` + `CourseOptionPicker` | **Client** | 주문 폼 |
| `BoardTabs` / `CourseInfoTabs` | **Client** | 기존 그대로 |
| `FaqAccordion` | **Server** | `<details>` 네이티브. JS 불필요 |

AGENTS.md §6.3 "기본은 Server Component, `'use client'`는 최소 단위에만"을 지킨다.

## 2.5 CSS 격리 전략

### 범위 — `:root`가 아니라 루트 클래스

인문·약술 design.md 초안은 `:root[data-course-theme="humanities"]`를 제안하지만, 그러면 공통 헤더·푸터와 `legacy-course-detail.css`(`.shop_*`, `#sit_*`)까지 변수 범위에 들어간다.
**수리논술 design.md가 쓴 `.math-course-detail` 방식(루트 클래스)이 맞다.**

```css
/* templates/humanities/theme.css */
.ct-root[data-course-theme='humanities'] {
  --ct-bg-a: #050814;
  --ct-accent: #315EF5;
  --ct-accent-soft: #91ADFF;
  /* … design.md §9의 값을 공용 변수명으로 매핑 */
}
```

```tsx
<div className="ct-root" data-course-theme="humanities"> … </div>
```

효과:
- 공용 컴포넌트는 `var(--ct-accent)`만 쓰고 **한 번만 작성**된다
- 세 테마가 서로, 그리고 사이트 공통 스타일과 섞이지 않는다
- `bodyTone`(인문 dark/light)은 `data-body-tone` 속성 하나로 처리

### 변수 이름 수렴

design.md가 유형별로 다른 접두사(`--hm-*`, `--math-*`, `--sa-*`)를 쓴다. **공용 컴포넌트가 세 벌로 갈라지면 안 되므로** 공용 이름(`--ct-*`)으로 수렴시키고, 각 `theme.css`가 자기 팔레트를 대입한다. 원래 접두사는 주석으로 남겨 문서 추적을 유지한다.

### 격리 검증

| 위험 | 차단 |
|---|---|
| `legacy-course-detail.css`의 `#sit_*`가 새 마크업에 걸린다 | 새 템플릿은 `#sit_*`/`.shop_*`를 **쓰지 않는다**. 라우트 import를 유지해도 선택자가 안 만난다 |
| 새 템플릿 CSS가 헤더·푸터로 샌다 | 모든 선택자가 `.ct-root` 하위 |
| Bootstrap 전역 리셋과 충돌 | `.ct-root` 안에서 필요한 값을 명시적으로 덮는다 |
| `main.css` 체크섬 깨짐 | `src/design-system/legacy/main.css`를 **건드리지 않는다** |

### 파일 형식

기존 선례(`HeroCarousel.module.css`, `SiteFooter.module.css`)에 맞춰 **CSS Modules**.
단 테마 변수(`theme.css`)와 공용 유틸(`course-template.css`)은 전역 선택자가 필요하므로 `.ct-root` 범위의 일반 CSS로 둔다.

> 예시 HTML 마크업은 전체가 inline `style`이다. AGENTS.md §6.5(새 색상·간격 하드코딩 금지)를 지키려면 CSS로 옮겨야 한다. **분량이 가장 큰 작업이며 Gate 3 공정의 대부분이다.**

## 2.6 컴포넌트 재사용 판정

| 컴포넌트 | 행 | 판정 | 조치 |
|---|---:|---|---|
| `src/app/courses/[id]/page.tsx` | 145 | **재사용** | import 1줄 + 컴포넌트명 1곳 (총 3줄) |
| `CourseDetail.tsx` | 105 | **그대로 보존** | **무변경.** legacy fallback |
| `CourseOrderForm.tsx` | 771 | **로직 추출 + 마크업 유지** | 로직 → `useCourseOrder()`. 마크업·전송 필드·스타일 **동일** |
| `CourseOptionPicker.tsx` | 224 | **전면 재사용** | **무변경** |
| `CourseInfoTabs.tsx` | 189 | **재사용 + 래핑** | 무변경. `BoardTabs`가 감싼다 |
| `CourseReviewList.tsx` | 209 | **전면 재사용** | 무변경 |
| `CourseQuestionList.tsx` | 227 | **전면 재사용** | 무변경 |
| `siblings.ts` | 62 | **전면 재사용** | **무변경.** 손대면 순서가 깨진다 |
| `legacy-course-detail.css` | 347 | **그대로 보존** | legacy 전용 |
| `legacy-inline-styles.ts` | 137 | **legacy 전용 유지** | 새 템플릿은 쓰지 않는다 |
| `SiteShell`/`SiteHeader`/`SiteFooter` | — | **전면 재사용** | 세 wireframe이 "기존 공통 헤더·푸터 그대로" 명시 |
| `src/lib/format.ts` | 55 | **전면 재사용** | 원화·`Asia/Seoul` 단일 출처 |
| `src/lib/sanitize-legacy-html.ts` | 98 | **전면 재사용** | server-only. 호출 위치도 유지 |
| `src/legacy/handoff/routes.ts` | 132 | **전면 재사용** | Legacy URL 단일 출처 |
| `src/legacy/assets.ts` | 99 | **전면 재사용** | 상품 이미지·별점 자산 |
| `src/analytics` (`track`) | — | **전면 재사용** | `begin_checkout` 그대로 |
| 판단 순수함수 4개 | — | **전면 재사용** | `isCourseOrderable`/`isCourseSoldOut`/`courseStarScore`/`requiresLegacyCertification` |
| `design-system/primitives/` | — | **선택적** | Legacy Bootstrap 기반. 강제하지 않는다 |
| `tokens.css` (`--nonsul-*`) | — | **쓰지 않는다** | `main.css`에서 추출한 Legacy 값. 새 템플릿은 `--ct-*` |

| 구분 | 수 |
|---|---:|
| 무변경 재사용 | **15** |
| 최소 수정 | **2** |
| 신규 | 37 |
| **재구현** | **0** |

## 2.7 `useCourseOrder()` 추출 — 가장 중요한 작업

### 왜 추출하는가

`CourseOrderForm.tsx` 771행은 **로직 약 200행 + 마크업·스타일 약 570행**이다. 신규 `EnrollPanel`이 같은 폼을 그려야 하는데:

- 복사하면 → Legacy 전송 계약이 두 곳에 생긴다. 한쪽만 고치면 결제가 조용히 깨진다
- `CourseOrderForm`을 새 디자인으로 고치면 → legacy fallback이 사라져 롤백 경로가 없어진다

→ **로직을 한 곳에 두고 마크업만 두 벌로 만든다.**

### 추출 대상 (전부 이동, 수정 0)

| 이동할 것 | 현재 위치 |
|---|---|
| `SelectedOption` 인터페이스 | `:38-49` |
| `picked` / `supplyPicked` / `selected` state | `:72-75` |
| `selectionItems` / `supplyItems` / `thumbnails` memo | `:77-91` |
| `alreadyAdded()` | `:94-100` |
| `commitSelection()` | `:109-141` |
| `onPickSelection()` | `:143-153` |
| `onPickSupply()` | `:164-191` |
| `changeQty()` / `setQty()` / `removeOption()` | `:193-216` |
| `onSubmit()` | `:224-245` |
| `resolveAction()` | `:650-653` |
| `hasText()` | `:645-647` |

### 시그니처

```ts
// src/features/course-detail/useCourseOrder.ts
'use client';

export interface CourseOrderState {
  orderable: boolean;            // isCourseOrderable(item)
  soldOut: boolean;              // isCourseSoldOut(item)
  starScore: number;             // courseStarScore(reviewSummary)
  hasSelectableOptions: boolean;
  thumbnails: { image: string; no: number; url: string; width: number; height: number }[];
  selectionItems: CourseOptionItem[];
  supplyItems: CourseOptionItem[];
  picked: string[];
  supplyPicked: string[];
  selected: SelectedOption[];
  action: string;                // resolveAction(form.action)
  method: string;
  onPickSelection: (depth: number, raw: string) => void;
  onPickSupply: (depth: number, raw: string) => void;
  changeQty: (index: number, delta: number) => void;
  setQty: (index: number, raw: string) => void;
  removeOption: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function useCourseOrder(course: CourseFull): CourseOrderState;
```

### 검증 방법 (추출이 무해함을 증명)

1. 추출 **직후**, 마크업을 한 글자도 바꾸지 않은 상태로 `pnpm check` 통과
2. 기존 `tests/component/course-detail.test.tsx`가 **수정 없이** 통과
3. 추출 전/후 렌더 HTML diff — **차이 0**
4. **그 다음에** 새 템플릿 작업 시작

→ 커밋 2개로 분리: `refactor(course-detail): useCourseOrder 훅으로 주문 로직을 분리한다` (동작 변화 0)
→ `feat(course-detail): 3종 템플릿을 추가한다`. 회귀 시 어느 커밋인지 바로 안다.

### 신규 테스트 — 전송 필드 스냅샷

옵션 조합별로 `new FormData(form)` 엔트리를 그대로 비교한다.

| 시나리오 | mock id | 기대 |
|---|---|---|
| 선택옵션 있음 · 1개 선택 | `1001` | `it_id[]`, `sw_direct=1`, `url`, `io_type[1001][]=0`, `io_id[1001][]`, `io_value[1001][]`, `ct_qty[1001][]` |
| 선택옵션 있음 · 2개 선택 | `1001` | 옵션 필드 2쌍 |
| 선택옵션 없음 | `1002` | `io_id[1002][]=""`, `io_value[1002][]=<강좌명>`, `ct_qty[1002][]=buyMinQty` |
| 품절 | `1003` | submit 버튼 없음 |
| 전화문의 | `1004` | submit 시 alert, 전송 차단 |

**legacy 템플릿과 신규 템플릿에서 같은 결과가 나와야 한다.** 이것이 회귀 위험 1번의 차단 장치다.

## 2.8 공용 컴포넌트 명세 — 유형별 차이 흡수

| 컴포넌트 | 유형별 차이 | 흡수 방법 |
|---|---|---|
| `CourseStickyBar` | 배경 3종, 약술만 `논술런` 워드마크 | 색은 토큰. `wordmark?`, `alwaysOpaque?` |
| `BeforeAfterRows` | 머리행 선 두께 (없음/1px/2px) | 토큰 `--ct-table-head-border` |
| `ProofSection` | 인문 BrandStats **항상**, 수리·약술 조건부. 약술은 범위 칩 없음 | `statsMode: 'always' \| 'conditional'`, `scopeLabel?` |
| `CertificateMarquee` | **차이 없음** | props 없음. 색만 토큰 |
| `InstructorProfile` | 인문은 소개 없음. 약술만 H3 `강사 소개` | `intro?`, `heading?` |
| `CurriculumList` | 인문은 시간 없음. 번호 칸 96/72/80px | `duration?`, 토큰 `--ct-curriculum-num-width` |
| `SessionPlan` | 인문·수리 가변 막대, 약술 3칸 고정 1:2:1 | `barMode: 'ratio' \| 'fixed'` |
| `FeedbackFlow` | 약술만 민트 `→` | `showArrow?` |
| `RecommendList` | 인문·수리 번호 / 약술 체크 | `marker: 'number' \| 'check'` |
| `BeforeEnrollInfo` | 약술은 보조줄 없음 | `sub?` (있으면 그린다) |
| `EnrollPanel` | 패널 폭 640/flex5/680px, 수리는 `closing` 없음 | `closing?`, 폭은 토큰 |
| `FaqAccordion` / `BoardTabs` | 거의 동일 | 토큰만 |
| `LegacyContentBlock` / `CourseSiblingsNav` | 신규 | 유형 무관 |

**유형별 전용 3개(01·02-A·04)는 의도적으로 분리한다** — 레이아웃이 근본적으로 달라 props로 흡수하면 분기가 더 복잡해진다.

## 2.9 예시 HTML에서 가져올 것 / 버릴 것

| 가져옴 | 처리 |
|---|---|
| `.wrap` / `.sec` / `.num` | 색상 없음 → 거의 그대로. 폭·패딩만 토큰화 |
| `.btn` / `.btn-off` / `.btn-line` | 색을 `var(--ct-*)`로 |
| `:focus-visible` 규칙 | 그대로 (색만 토큰) |
| `.lnk` / `.tab` | 그대로 |
| `details` / `details[open] .pm` | **그대로** |
| 모바일 `@media (max-width:767px)` (`.sbar` 하단 fixed, `.sbar-name` 숨김, `.page` 하단 96px, `env(safe-area-inset-bottom)`) | **그대로.** 직접 쓰면 빠뜨리기 쉽다 |
| `@media (max-width:360px)` | 그대로 |
| `prefers-reduced-motion` 블록 | **그대로** |
| `.cert-view` / `.cert-track` / `@keyframes certFlow` + 호버·포커스 정지 + reduced-motion 수동 스크롤 | **그대로.** 품질이 높고 재작성 가치가 없다 |

| 버림 | 이유 |
|---|---|
| Inter `@font-face` 385KB | 웹폰트 전략 별도 결정 |
| `x-dc` 런타임 CSS / `<sc-if>` / `data-props` | 캔버스 전용 → React 조건부 렌더로 대체 |
| 마크업의 inline `style` 전부 | AGENTS.md §6.5 — CSS로 옮긴다 |
| 캔버스 고정 크기 (`width:880px;height:195px` 등) | design.md가 "반응형으로 교체" 지시 |
| 헤더·푸터 점선 자리표시자 | `SiteShell`이 소유 |
| 합격증 base64 0.8MB | 서버 자산으로 교체 |
| 예시 강좌 더미 데이터 | 실제 데이터로 취급하지 않는다 (요청서 §2) |

## 2.10 Data Mapping — 최소 변경 어댑터

```
CourseFull (Bridge, 변경 없음)  +  CourseTemplateContent (V2 콘텐츠 파일, 신규)
        │
        ▼
buildTemplateProps(course, content, siblings, reviews, questions)   ← 순수 함수
        │
        ▼
CourseTemplateProps  →  템플릿 컴포넌트
```

### Bridge → 템플릿 필드

| 템플릿 필드 | 출처 | 변환 | 조건 |
|---|---|---|---|
| `title` | `item.name` | 그대로 | 항상 |
| `salePrice` | `item.price` | `formatPrice()` | `!priceOnInquiry` |
| `listPrice` | `item.listPrice` | `formatPrice()` | **`listPrice > price`일 때만** (G-05) |
| `hasDiscount` | — | `item.listPrice > item.price` | — |
| `saleState` | `priceOnInquiry`/`soldOut`/`inStock` | §2.11 | 항상 |
| `period` | `item.extra[2]` | `수강 시작 후 {n}일` — **기존 조립 규칙 유지** | 값이 `''`이 아닐 때 |
| `applyPeriod` | `item.extra[3]` | 그대로 | 동일 |
| `capacity` | `item.extra[4]` | `{n}명` | 동일 |
| `lessonCount` (`n`) | `item.extra[5]` | `{n}강` | 동일 |
| `enrollInfo` | — | `hasText(extra[3]) \|\| hasText(extra[4])` | — |
| `target` | `information.product_name` | 그대로 | 있을 때 |
| `methodLine` fallback | `information.model_name` | 콘텐츠에 없을 때만 | — |
| `summary` fallback | `item.basic` | 콘텐츠에 없을 때만 | — |
| `reviewCount` | `reviewSummary.count` | 탭 라벨 | 항상 |
| `starScore` | `courseStarScore(reviewSummary)` | 0이면 숨김 | `> 0` |
| 상품 이미지 | `item.images[]` + `legacyItemThumbnail()` | `courseLargeImage(id, no)` 링크 | 07-E |
| 기존 HTML 3종 | `headHtml`/`descriptionHtml`/`tailHtml` | `sanitizeLegacyHtml()` (기존 위치) | 07-E |
| 주문 폼 | `options`, `form`, `buyMinQty` | `useCourseOrder()` | 07-C |
| 형제 강좌 | `findCourseSiblings()` | 그대로 | 07-F |
| 분류 목록 링크 | `item.category.id` | `legacyRoutes.courseList()` | 07-F |
| 후기·문의 | `CourseReviewsState`/`CourseQuestionsState` | 그대로 | 07-B |
| 공지 링크 | — | `legacyRoutes.notice()` | 07-B |
| 약관 링크 | — | `legacyRoutes.terms()`/`privacy()` | 07-D |
| 공유 링크 | `item.id` | `legacyRoutes.courseDetailLegacy()` | G-03 |
| 템플릿 키 | `item.category.id` | `resolveCourseTemplate()` | — |
| 강사 키 | `item.category.id.slice(0, 4)` | 강사 콘텐츠 조회 (G-08) | — |

**Legacy 컬럼명(`it_*`, `ca_*`, `io_*`)이 `src/legacy/` 밖으로 나가지 않는다** (AGENTS.md §2 원칙 5). 위 표의 좌변은 모두 canonical 이름이다.

## 2.11 `saleState` 유도

```ts
function resolveSaleState(item: CourseFullItem): 'available' | 'sold_out' | 'unknown' {
  if (isCourseSoldOut(item)) return 'sold_out';        // it_soldout || !inStock
  if (item.priceOnInquiry) return 'unknown';           // it_tel_inq
  return 'available';
}
```

`'coming_soon'`은 **타입에서 제외한다** (G-06).

| 상태 | 고정 바 | 신청 패널 | 보조 문구 |
|---|---|---|---|
| `available` | 활성 `{ctaLabel}` (앵커 `#enroll`) | 활성 submit | 없음 |
| `sold_out` | 비활성 `신청 마감` | 비활성 | `현재 신청할 수 없는 강좌입니다.` |
| `unknown` | 비활성 **`전화문의`** | 비활성 | 기존 표현 유지 |

`unknown`의 라벨은 copy.md의 `운영 데이터 확인 필요` 대신 **기존 `전화문의`를 쓴다.** 전화문의는 "데이터 미확인"이 아니라 확정된 판매 방식이고, 기존 표현을 바꾸면 사용자에게 혼란이다.

## 2.12 조건부 노출 플래그 유도

| 플래그 | 유도 | 기본 |
|---|---|---|
| `hasDiscount` | `item.listPrice > item.price` | 데이터 |
| `enrollInfo` | `hasText(extra[3]) \|\| hasText(extra[4])` | 데이터 |
| `lessonCount` | `Number(extra[5])` | 데이터 |
| `instructorPhoto` | 강사 콘텐츠에 승인된 사진 경로가 있을 때 | **off** |
| `previewVideo` | 콘텐츠에 맛보기 URL이 있을 때 | **off** |
| `showSession` | 콘텐츠에 `session[]`이 있을 때 | **off** |
| `featFeedback` | 콘텐츠에 `feedback`이 있을 때 | **off** |
| `featMaterial` | 콘텐츠에 교재/자료 정보가 있을 때 | **off** |
| `brandStats` | **승인된 수치 + 기준일·산정 방식**이 확인될 때 | **off** (미검증) |
| `showProof` | **승인된 합격증 자산 + 동의**가 있을 때 | **off** (미확인) |
| `bodyTone` (인문 전용) | 콘텐츠 또는 테마 기본값 | `dark` |

규칙:
- `showSession`과 `featFeedback`이 모두 off면 **06 블록 전체를 숨긴다**
- `brandStats`와 `showProof`가 모두 off면 **03 블록을 숨긴다**
- 인문은 BrandStats가 "항상"이지만 **수치가 미검증이므로 off를 기본으로 두고 승인 후 켠다** — 검증되지 않은 사실을 내보내지 않는 쪽이 문서 지시보다 우선한다 (요청서 §12)

## 2.13 콘텐츠 파일 스키마 (D1-A 안)

```ts
// src/features/course-detail/templates/content/types.ts

/** 강좌별 템플릿 카피. 모든 필드가 optional — 없으면 블록·요소를 숨긴다. */
export interface CourseTemplateContent {
  /** 어느 강좌의 카피인가. item.id 와 같아야 한다 (provider 가 검증). */
  courseId: string;

  // 00 · 01
  badge?: string;
  heroMark?: string;
  keywords?: string;
  summary?: string;          // 없으면 item.basic
  target?: string;           // 없으면 information.product_name
  curriculumLink?: string;   // 없으면 테마 기본값
  ctaLabel?: string;         // 없으면 '수강 신청하기'
  previewUrl?: string;
  previewDuration?: string;

  // 02
  methodLine?: string;       // 없으면 information.model_name
  promise?: string;          // 없으면 테마 기본값

  // 04
  methodLead?: string;
  steps?: [string, string, string];

  // 05
  curriculumTitle?: string;
  lessons?: CourseLesson[];

  // 06
  session?: { sessionTitle?: string; items: SessionItem[]; desc?: string };
  feedback?: {
    count: number; note?: string;
    uploadTime: string; uploadSub?: string;
    returnTime: string; returnSub?: string;
  };

  // 07
  recommend?: string[];
  infoCards?: { label: string; value: string; sub?: string }[];
  notices?: { kind: 'info' | 'caution'; text: string }[];
  closing?: string;
  refundNote?: string;
  faq?: { q: string; a: string }[];

  /** 기존 Legacy HTML을 계속 보여줄지 (G-10 / D3). 기본 'visible'. */
  legacyContent?: 'visible' | 'hidden';
}

export interface CourseLesson {
  label?: string;    // '1강' / '1주차'
  title: string;
  desc?: string;
  output?: string;   // 쓰는 답안 / 작성할 풀이
  check?: string;    // 점검 기준
  duration?: string; // 수리·약술만
}
```

```ts
// content/instructors/types.ts

/** 강사 정보. ca_id 앞 4자리 단위 (G-08). 여러 강좌가 공유한다. */
export interface InstructorContent {
  categoryPrefix: string;   // '1010' 등
  name: string;
  intro?: string;           // 수리·약술만
  career?: string[];        // 최대 3행. **검증된 것만.**
  photo?: { src: string; alt: string };
  previewUrl?: string;
}
```

```ts
// content/provider.ts — 동기. Bridge 호출 없음.
export function getCourseTemplateContent(
  courseId: string,
  categoryId: string,
): { course: CourseTemplateContent; instructor: InstructorContent | null } | null;
```

`null`을 반환하면 `CourseDetailRouter`가 legacy 템플릿을 쓴다.

## 2.14 데이터가 없을 때의 규칙

요청서 Gate 4 — "필수 데이터가 없을 때 임의 값을 표시하지 않는다."

| 상황 | 처리 |
|---|---|
| 콘텐츠 파일 없음 | **legacy 템플릿.** 빈 템플릿을 내보내지 않는다 |
| `lessons[]` 없음 | 05 블록 숨김 (wireframe은 "항상"이지만 데이터 없는 표를 그리지 않는다) |
| 강사 정보 없음 | 04 강사 영역 숨김. 수업 루프 3단계만 남는다 |
| `steps[].desc` 없음 | 단계 제목만 (제목은 템플릿 고정 문구) |
| `extra` 빈 값 | 해당 행·카드 숨김 (**기존 동작과 동일**) |
| 후기 0건 | 별 숨김, 탭 라벨 `강의 후기 0`, 안내 문구 |
| `images[]` 0장 | 기존처럼 `no_image.gif` — 단 07-E에 배치 |
| `headHtml` 빈 문자열 | 기존은 빈 div를 냈다. 신규는 **그리지 않는다** (빈 칸 금지) |
| Bridge 장애 | 본체 throw → 마지막 성공본 (ADR 0007, 변경 없음) |

> `headHtml` 빈 div 제거는 의도적 차이다. Legacy DOM 구조를 맞출 필요가 없는 새 템플릿에서는 빈 요소를 내보내지 않는 쪽이 wireframe §0 원칙에 맞는다. **legacy 템플릿에서는 그대로 유지한다.**

## 2.15 URL · SEO 유지

| 항목 | 처리 |
|---|---|
| 라우트 | `/courses/[id]` **변경 없음** |
| `revalidate = 300` | 리터럴 그대로. env를 바꾸면 리터럴도 같이 바꾼다 |
| `generateStaticParams()` | **빈 배열 반환 + 함수 유지.** 지우면 full route cache에서 빠진다 |
| `generateMetadata` | **변경 없음** — title `<강좌명> > <분류명>`, canonical, OG |
| `robots` | `enforceProxy` 조건 그대로 |
| `notFound()` / 인증 `redirect()` | 그대로 |
| `<h1>` | **D2.** 권고: `<h1>` = 강좌명, 헤드라인은 `<p>` |
| 신규 앵커 | `#curriculum` `#enroll` `#faq` `#method` `#cases`. 페이지 내부용 |
| 기존 해시 | `#sit_use` `#sit_qa` **반드시 유지** — 외부에 퍼진 링크일 수 있다. `BoardTabs`가 같은 id를 쓴다 |
| 구조화 데이터 | **추가하지 않는다** — 현재 없는 기능 (요청서 §9) |

## 2.16 기존 Legacy HTML 보존·정규화 판단

| 판단 | 결론 |
|---|---|
| 보존이 필요한가 | **필요하다.** `descriptionHtml`(`it_explan`)이 현재 강좌 설명의 본체다 |
| 정규화(파싱→구조화)가 필요한가 | **아니다.** HTML 구조가 강좌마다 다르고, CLAUDE.md가 "Legacy 실제 동작을 추측해서 Contract를 만들지 않는다"고 못박았다 |
| 어떻게 보존하는가 | 07-E `LegacyContentBlock`에 `sanitizeLegacyHtml()` 통과분을 그대로. 테마 컨테이너 안에서 타이포만 정돈 |
| 언제 끄는가 | 사람이 카피를 옮긴 강좌만 `legacyContent: 'hidden'` (강좌별, 되돌릴 수 있게) |

`sanitizeLegacyHtml`은 **현재 위치(서버)에서 그대로** 호출한다. 정책을 바꾸지 않는다.

## 2.17 ISR / 캐시 영향 분석

| 질문 | 답 |
|---|---|
| 템플릿 분기가 캐시 키에 영향을 주는가 | **아니다.** `category.id`는 `CourseFull`의 일부이고 이미 캐시 대상 |
| env 스위치를 켜고 끄면 | `revalidate` 주기 내 기존 캐시가 남는다. 즉시 반영은 재배포 |
| 콘텐츠 파일 변경 반영 | 정적 import이므로 **빌드 시 번들에 들어간다.** 배포해야 바뀐다 (A안의 단점) |
| viewer 상태가 섞일 위험 | 0. 템플릿 어디서도 viewer를 조회하지 않는다 |
| `generateStaticParams()` 빈 배열 | 그대로. 빌드 때 Bridge를 부르지 않는다 |

## 2.18 `page.tsx` 변경 범위 (전부)

```diff
- import { CourseDetail } from '@/features/course-detail/CourseDetail';
+ import { CourseDetailRouter } from '@/features/course-detail/CourseDetailRouter';

  import '@/features/course-detail/legacy-course-detail.css';

  …

-     <CourseDetail
+     <CourseDetailRouter
        course={course}
        siblings={findCourseSiblings(courses, course.item.id, course.item.category.id)}
        reviews={reviews}
        questions={questions}
      />
```

**3줄.** `revalidate`·`generateStaticParams`·`generateMetadata`·`resolveId`·인증 `redirect`·`Promise.all` 전부 그대로다.

## 2.19 Rollout — 두 단계 스위치

```
새 템플릿을 쓴다  =  COURSE_TEMPLATES === 'on'                  ← 전역 kill switch (env)
                 AND resolveCourseTemplate(ca_id) !== 'legacy'   ← 유형 매핑
                 AND getCourseTemplateContent(it_id) !== null     ← 강좌별 opt-in
```

| 레벨 | 수단 | 범위 | 반영 시점 |
|---|---|---|---|
| L1 전역 | `COURSE_TEMPLATES` env | 전체 | Vercel env 변경 + 재배포 |
| L2 유형 | `BY_PREFIX` | 유형 단위 | 코드 배포 |
| L3 강좌 | 콘텐츠 파일 존재 여부 | 강좌 1개 | 코드 배포 |

**기존 `CourseDetail.tsx`를 수정하지 않으므로 롤백에 "되돌리기"가 필요 없다.** 스위치를 끄면 지금 운영되는 그 코드가 그대로 실행된다.

### 신규 env

```ts
// src/env.server.ts  serverEnvSchema 에 추가
/**
 * 강좌 상세 3종 템플릿 kill switch. 'off' 면 모든 강좌가 기존 Legacy 스킨 화면이다.
 * 강좌별 활성화는 콘텐츠 파일 존재 여부로 하고, 이 스위치는 전역 차단만 한다.
 */
COURSE_TEMPLATES: z.enum(['on', 'off']).default('off'),
```
```ts
export const courseTemplatesEnabled: boolean = serverEnv.COURSE_TEMPLATES === 'on';
```

| 요구 | 처리 |
|---|---|
| 서버 env인가 | **예.** `NEXT_PUBLIC_`이 아니다 |
| 기본값 | **`'off'`** — 미등록 환경(로컬·CI·기존 Preview)은 현재 화면 |
| ISR 영향 | 없음. 렌더 시 서버에서 읽는 상수 |
| 동반 갱신 | `.env.example`, `docs/harness/HARNESS.md` 환경별 값 표, `tests/contract/env.test.ts` |

## 2.20 Gate 3~7 실행 순서

| 단계 | 내용 | 스위치 | 검증 |
|---|---|---|---|
| **3-0** | `useCourseOrder()` 추출 **단독 커밋** | — | `pnpm check` + 기존 테스트 무수정 통과 + 렌더 HTML diff 0 |
| **3-1** | 공용 CSS·토큰·`shared/` 15개 | — | L2 단위 테스트 |
| **3-2** | 유형별 01·02-A·04 (3×3) + 템플릿 루트 3개 | — | — |
| **3-3** | Router + Resolver + 콘텐츠 provider + fixture 2개 | `off` | L1: Resolver 분기 4종, `buildTemplateProps` |
| **3-4** | 로컬에서 세 템플릿 확인 | 로컬만 `on` | L3 e2e: 320/390/768/1024/1440px |
| **4** | 대표 강좌 3종 콘텐츠 파일 + 실데이터 확인 | Preview `on` | 필수 정보 누락 0 |
| **5** | 기능 회귀 검증 | Preview `on` | §2.22 체크리스트 |
| **6** | Preview 스테이징 + 롤백 리허설 | Preview `on` | §2.21 |
| **7** | 대표 3 → 10 → 전체 | Production `on` | 강좌별 검수 |

**3-0을 반드시 단독 커밋으로 분리한다.** 주문 로직 추출과 템플릿 추가가 한 커밋에 섞이면 결제 회귀 시 원인을 가를 수 없다.

### 대표 강좌 3종 선정 기준

| 유형 | 조건 |
|---|---|
| 인문논술 | `ca_id` 접두사 `10`. `extra[2]`·`extra[5]`가 채워져 있고 `descriptionHtml`에 커리큘럼이 있어 `lessons[]`로 옮길 수 있는 강좌 |
| 수리논술 | 접두사 `30`. 동일 |
| 약술형논술 | 접두사 `40`. 동일 |

공통: 판매 중(`available`), **선택옵션이 있는 강좌 1개 이상 포함** — 주문 폼 회귀를 실데이터로 확인하기 위해서다.

로컬 검증용 fixture 추가 (mock fixture의 `category.id`는 현재 `101060` 인문뿐):

| 신규 fixture | `category.id` | 용도 |
|---|---|---|
| `course-full.math.json` | `302010` 등 | 수리 템플릿 로컬 확인 |
| `course-full.short-answer.json` | `401010` 등 | 약술 템플릿 로컬 확인 |

fixture는 **Contract를 통과하는 예시값**이며 실제 강좌가 아니다.

## 2.21 롤백 절차

| 상황 | 절차 | 소요 |
|---|---|---|
| 특정 강좌 1개 | 콘텐츠 파일 삭제 또는 `legacyContent: 'visible'` 복구 → 배포 | 배포 1회 |
| 한 유형 전체 | `BY_PREFIX`에서 접두사 제거 → 배포 | 배포 1회 |
| 전체 (디자인·레이아웃) | Vercel `COURSE_TEMPLATES=off` → 재배포 | env + 재배포 |
| **주문·결제 이상** | ① `COURSE_TEMPLATES=off` ② Vercel 이전 deployment promote | 즉시 |
| V2 자체 장애 | 운영 kill switch `/etc/nonsulrun/v2.off` | 사람 (서버) |

하네스 `GATES.md:314` 롤백 우선순위를 따른다:
**kill switch → Vercel 이전 deployment promote → vhost backup → Bridge tar backup.**
**DB/데이터 변경을 롤백 수단으로 쓰지 않는다.**

### 캐시 주의

`revalidate = 300`이므로 스위치를 꺼도 **최대 5분간 기존 ISR 캐시가 남는다.**
긴급 상황에서는 **Vercel 이전 deployment promote가 가장 빠르다.**

### 롤백 리허설 (Gate 6 필수)

1. Preview `COURSE_TEMPLATES=on` → 대표 3종이 새 템플릿으로 보임
2. `off` + 재배포 → 같은 URL이 기존 화면으로 복귀
3. 콘텐츠 파일 1개만 삭제 + 배포 → 그 강좌만 기존 화면, 나머지 2개는 새 템플릿
4. 세 경우 모두 주문 폼 전송 필드 동일 확인 (DevTools Network, **실결제 금지**)

## 2.22 Gate 5 기능 회귀 체크리스트

| 대상 | 확인 |
|---|---|
| 강좌 URL | `/courses/[id]` 동일. 잘못된 id → 404. 인증 분류 → Legacy redirect |
| 로그인 상태 | 상세페이지 서버 HTML에 로그인 흔적 없음. 헤더만 클라이언트 조회 |
| 장바구니 | **버튼이 없어야 한다** (기존과 동일) |
| 바로구매 | `sw_direct=1`. 전송 필드 스냅샷이 legacy 템플릿과 **완전 일치** |
| 가격·할인 | 금액 값 동일. 취소선은 `listPrice > price`일 때만 (G-05 의도된 차이) |
| 강사 정보 | 데이터 없으면 영역 숨김. **생성 금지** |
| 교재·배송 | 선택옵션(`교재비`)으로만 존재. 카드에 하드코딩 금지 |
| 첨삭 안내 | 데이터 없으면 숨김 |
| 후기·문의·공지 | 목록·쓰기·더보기 링크 동일. `#sit_use`/`#sit_qa` 해시 딥링크 작동 |
| 환불 안내 | copy.md §8 공통 5항목 + `policyUrl` 링크 작동 |
| SEO | `<title>`·canonical·OG 동일. `<h1>`은 D2 결정대로 |
| PC·모바일 | 320/375/390/768/1024/1440px 가로 스크롤 0. 모바일 고정 바가 약관 링크를 가리지 않음 |
| 접근성 | 키보드만으로 CTA·탭·FAQ·커리큘럼 펼치기·합격증 정지 조작. 터치 44px. 대비 AA |
| 빌드·타입·테스트 | `pnpm check` 통과 |
| ISR | 빌드 출력에서 `/courses/[id]`가 ISR (`ƒ`가 아님) |
| Bridge 장애 | mock id `9999`로 확인 — 마지막 성공본 유지 |
| 4가지 상태 | 후기·문의의 loading/정상/빈값/unavailable |

### 접근성 — 기존 수준 이상

| 항목 | 기존 | 신규 요구 |
|---|---|---|
| 스크린리더 전용 | `.sound_only`, `.visually-hidden` | 계속 사용 |
| 탭 | `aria-expanded` | `role="tablist"`/`role="tab"`/`aria-selected`로 **보강** |
| 아코디언 | 없음 | `<details>` 네이티브 |
| 터치 영역 | 미규정 | **44px 이상** |
| 포커스 | Bootstrap 기본 | `focus-visible` 2px + offset 3px |
| 대비 | 미검증 | WCAG AA. 약술은 작은 에메랄드에 `#0D6749` |
| 움직임 | 없음 | `prefers-reduced-motion` 전면 지원 |
| 이미지 alt | 필수 | 합격증 `2026학년도 논술전형 합격증 N (개인정보 가림)` |
| 가로 스크롤 | 375px 금지 | 320~390px 금지 — **더 엄격** |

→ `tests/e2e/mobile.spec.ts`의 뷰포트에 **320px를 추가**해야 한다.

## 2.23 Gate 7 점진 확대

| 단계 | 대상 | 완료 조건 |
|---|---|---|
| 1 | 인문·수리·약술 대표 각 1개 (3개) | §2.22 전 항목 통과 |
| 2 | 대표 강좌 검수·수정 | 운영 담당 확인 |
| 3 | 10개로 확대 | 각 강좌 필수 정보 누락 0 |
| 4 | 전체 대상 강좌 | 유형별 일괄 |
| 5 | 신규 강좌 템플릿 자동 선택 | **Resolver가 이미 `ca_id`로 자동 판정한다.** 남는 작업은 콘텐츠 파일 작성 가이드 |
| 6 | 운영 문서·QA 갱신 | `docs/parity/course-detail.md` 신규, `docs/gates/` 기록 |

5단계 메모: 유형 선택은 자동이라 추가 개발이 없다. 단 **D1에서 A안을 유지하는 한 신규 강좌마다 코드 배포가 필요하다.** 전체 강좌(39개+) 적용 시점에 B안 이관을 재검토한다 — 그때가 ADR을 쓸 시점이다.

## 2.24 운영 영향 없음 보장

| 보장 | 근거 |
|---|---|
| 운영 데이터 변경 0 | 이 레포는 DB에 접속하지 않는다 (AGENTS.md §2 원칙 1). 읽기만 |
| 결제 영향 0 | 폼 전송 필드를 바꾸지 않는다. `cartupdate.php` 이후는 전부 Legacy |
| 가격 변경 0 | `item.price`/`listPrice`를 그대로 표시. 취소선 **표시 조건**만 변경 |
| Apache/PHP 설정 변경 0 | 이 작업에 서버 설정 변경이 없다 |
| Legacy URL 구조 변경 0 | `legacyRoutes` 그대로 |
| 테스트 중 실결제 0 | DevTools Network로 전송값만 확인. submit까지 가지 않는다 |

## 2.25 Contract 변경 여부

| 질문 | 답 |
|---|---|
| `course-full.v1`을 바꾸는가 | **아니다** |
| 새 Bridge endpoint가 필요한가 | **아니다** (D1에서 B안을 택하면 필요. A안 권고) |
| PHP 변경이 필요한가 | **아니다** |
| `contracts/bridge/*.schema.json` 변경 | **없음.** fixture 2개 **추가**만 |
| 새 env | `COURSE_TEMPLATES` 1개 |

→ CLAUDE.md "작업 시작 전 계획 승인" 대상 중 **env 추가 1건만** 해당한다. 이 문서가 그 계획이다.

## 2.26 Gate 2 판정 — PASS (조건부)

PASS 조건: "기존 기능을 불필요하게 재구현하지 않으면서 세 템플릿을 적용할 수 있는 구조가 확정되어야 한다."

| 항목 | 결과 |
|---|---|
| 기존 컴포넌트 재사용 범위 | **확정** — 무변경 15 / 최소 수정 2 / **재구현 0** |
| 유형별 템플릿 구조 | **확정** — 유형별 전용 **3블록뿐**, 나머지 11블록 공용 |
| Template Resolver | **확정** — `ca_id` 앞 2자리. 순수 함수, 입력 1개, ISR 안전 |
| 최소 변경 어댑터 | **확정** — `buildTemplateProps()`. **Contract 변경 0, 신규 API 0** |
| 디자인 토큰·CSS 격리 | **확정** — `.ct-root[data-course-theme]` + `--ct-*` 공용 변수명 |
| URL·SEO 유지 | **확정** — 라우트·메타데이터 무변경. `page.tsx` **변경 3줄** |
| 활성화·롤백 | **확정** — AND 2단 스위치. 기존 코드 미수정으로 "되돌리기" 불필요 |
| Legacy HTML 보존 판단 | **확정** — 보존하고 정규화하지 않는다. 07-E 블록. 강좌별로 끌 수 있다 |
| Gate 3~7 순서·테스트 계획 | **확정** — §2.20 · §2.22 |

### 왜 "조건부"인가

구조는 결정의 **답에 의존하지 않도록** 설계했다 — 콘텐츠 출처는 provider 인터페이스 뒤에 있고, `<h1>` 선택은 히어로 컴포넌트 한 곳의 문제다. 그래서 아키텍처 자체는 PASS다.

그러나 **D1~D3은 사람이 답해야 하고, 답에 따라 Gate 3에서 쓰는 코드가 달라진다.** 구조가 바뀌지는 않지만 구현물이 달라지므로, **결정 없이 Gate 3에 들어가지 않는다.**

---

# 제3부 · 결정 사항과 Gate 3 진입

## 3.1 사람이 결정해야 하는 것

### D1 · 템플릿 카피 ~20항목의 저장 위치 — Critical

| 선택지 | 내용 |
|---|---|
| **A (권고)** | V2 콘텐츠 파일 (`src/content/` 선례). PHP·Bridge 변경 0, 즉시 시작. 신규 강좌마다 코드 배포 |
| B | Bridge 확장 `course-template.v1`. 운영팀 직접 수정. PHP 작업 + AGENTS.md §7.1 전체 절차 |
| C | `descriptionHtml` 파싱 — **권고하지 않음** |
| **D (권고)** | A로 시작, 전체 확대 시점에 B 이관 재검토 |

### D2 · 히어로 `<h1>`의 주체 — Critical (SEO)

| 선택지 | 결과 |
|---|---|
| **1 (권고)** | `<h1>` = 강좌명, 헤드라인은 `<p class="hero-headline">`. **화면 출력 동일**, SEO·접근성 현상 유지 |
| 2 | `<h1>`에 헤드라인 + 강좌명 동시 포함 → 헤드라인 디자인이 깨진다 |
| 3 | design.md 그대로 → SEO 회귀 수용 |

### D3 · 기존 Legacy HTML 3종 + 상품 이미지 — Critical

| 선택지 | 내용 |
|---|---|
| 1 | 항상 보존 (끄지 않는다) |
| 2 | 카피를 옮긴 강좌만 전환, HTML은 쓰지 않는다 |
| **3 (권고)** | 07-E `LegacyContentBlock` 신설로 보존 + 카피 완료 강좌만 `legacyContent: 'hidden'` |
| 4 | 제거 — **Critical 콘텐츠 손실.** 권고하지 않음 |

`images[]`의 실제 내용(썸네일인지 상세 이미지 여러 장인지)은 Bridge 실응답 확인이 필요하다.

### D4 · 하네스 Gate 순서 — 거버넌스

이 작업은 하네스 **Gate 8**이고 `GATES.md:37` 기준 `NOT STARTED`다. 하네스 **Gate 6(홈 컷오버)과 7도 `NOT STARTED`**이며, `AGENTS.md §9`는 **"Gate 6 이전 리디자인 또는 클래스명 변경"을 금지 사항**으로 명시한다.

| 선택지 | 내용 |
|---|---|
| 1 | Gate 6 컷오버를 먼저 끝낸다 (문서 순서 준수) |
| **2 (권고)** | 병행 — kill switch 기본값이 `off`라 Gate 6 경로와 독립적이다. 예외를 ADR로 기록 |
| 3 | AGENTS.md §9 문구를 고쳐 강좌 상세를 제외 |

권고 2번. 단 **AGENTS.md §9 위반을 묵시적으로 넘기지 않고 ADR로 남겨야 한다.**

## 3.2 Gate 3 예상 변경 파일

### 수정 (2개)

| 파일 | 변경 |
|---|---|
| `src/app/courses/[id]/page.tsx` | **3줄** |
| `src/features/course-detail/CourseOrderForm.tsx` | 로직 → `useCourseOrder()`. 마크업·전송 필드·스타일 동일 |

### 신규 (37개)

| 그룹 | 파일 |
|---|---|
| 핵심 4 | `useCourseOrder.ts`, `CourseDetailRouter.tsx`, `templates/resolveCourseTemplate.ts`, `templates/types.ts` |
| 콘텐츠 4 | `content/types.ts`, `content/defaults.ts`, `content/provider.ts`, `content/instructors/types.ts` |
| 공용 16 | `shared/course-template.css` + 15개 컴포넌트 |
| 인문 5 | `humanities/{HumanitiesTemplate,HumanitiesHero,HumanitiesProblem,HumanitiesMethod}.tsx`, `theme.css` |
| 수리 5 | `math/{MathTemplate,MathHero,MathProblem,MathMethod}.tsx`, `theme.css` |
| 약술 5 | `short-answer/{ShortAnswerTemplate,ShortHero,ShortProblem,ShortMethod}.tsx`, `theme.css` |

### 하네스·설정 (6개)

| 파일 | 변경 |
|---|---|
| `src/env.server.ts` | `COURSE_TEMPLATES` + `courseTemplatesEnabled` |
| `.env.example` | 항목 추가 |
| `docs/harness/HARNESS.md` | 환경별 값 표 갱신 (AGENTS.md §10) |
| `tests/contract/env.test.ts` | 케이스 추가 |
| `tests/component/course-detail.test.tsx` | **전송 필드 스냅샷 테스트 추가** (legacy/신규 양쪽) |
| `tests/e2e/mobile.spec.ts` | 뷰포트에 **320px 추가** |

### fixture (2개 추가)

`contracts/bridge/fixtures/course-full.math.json`, `course-full.short-answer.json`
+ `adapters/course-detail/mock.ts`에 id 등록. **Contract·JSON Schema 변경 없음.**

### ADR (2개)

| 파일 | 내용 |
|---|---|
| `docs/decisions/0010-course-detail-template-redesign.md` | 유형별 템플릿 구조, Resolver, CSS 격리, kill switch, AGENTS.md §9 예외 (D4) |
| `docs/decisions/0011-course-template-content-source.md` | D1 결정 기록 |

### 변경하지 않는 파일 (명시)

`CourseDetail.tsx` · `CourseOptionPicker.tsx` · `CourseInfoTabs.tsx` · `CourseReviewList.tsx` ·
`CourseQuestionList.tsx` · `siblings.ts` · `legacy-course-detail.css` · `legacy-inline-styles.ts` ·
`src/legacy/**` 전체 · `contracts/bridge/*.schema.json` · `src/design-system/legacy/main.css` ·
`src/lib/**` · `src/analytics/**`

## 3.3 Gate 3 진입 가능 여부 — 조건부 가능

| 선행 조건 | 상태 |
|---|---|
| D1 콘텐츠 출처 결정 | **대기** |
| D2 `<h1>` 결정 | **대기** |
| D3 Legacy HTML·이미지 처리 결정 | **대기** |
| D4 Gate 순서 결정 | **대기** (병행 권고) |
| env 추가 계획 승인 (CLAUDE.md) | 이 문서가 계획. **승인 대기** |

### 결정 없이 지금 시작할 수 있는 작업

다음 3개는 **D1~D4 어느 답에도 영향받지 않는다.**

| 작업 | 이유 |
|---|---|
| **3-0 `useCourseOrder()` 추출** | 동작 변화 0. 기존 테스트가 그대로 통과해야 하는 순수 리팩터링. 어느 결정과도 무관하며 **Gate 3 최대 위험(결제 회귀)을 먼저 차단한다** |
| `shared/course-template.css` 토큰화 | 예시 HTML 공용 CSS를 `--ct-*`로 옮기는 기계적 작업 |
| `resolveCourseTemplate.ts` + L1 테스트 | 입력이 `ca_id` 하나. 분기 4종 테스트 |

→ **권고: 3-0을 먼저 단독 커밋으로 처리하고, 그 사이 D1~D4를 결정한다.**

## 3.4 남은 사람 작업 (Gate 4 전)

| # | 항목 | 왜 필요한가 | Gate 4를 막는가 |
|---:|---|---|:--:|
| 1 | 운영 39개 강좌의 `ca_id` 분포 확인 | 대표 강좌 3종 선정, G-07 해소 | **예** |
| 2 | `item.images[]`의 실제 내용 확인 | D3 확정 | **예** |
| 3 | 브랜드 수치(4,005명·15만 부·98%) 기준일·산정 방식 | 03 블록을 켤 수 있는지 | 아니오 (off 유지) |
| 4 | 합격증 34장 사용 동의·개인정보 가림·서버 자산 경로 | 03 합격 사례를 켤 수 있는지 | 아니오 (off 유지) |
| 5 | 강사별 검증된 이력 | 04 강사 영역 | 아니오 (숨김) |
| 6 | `/courses/[id]`가 메인 도메인에서 서빙되는지 | 운영 반영 확인. `pnpm smoke:prod` 또는 Apache | 아니오 |
| 7 | Vercel에 `COURSE_TEMPLATES` 등록 | Gate 6 스테이징 | 아니오 |

---

## 부록 · 참조 문서

| 문서 | 내용 |
|---|---|
| `source-inventory.md` | 템플릿 문서 9개 · HTML 3개 · 기존 구현 · 데이터 계층 · 유형 분류 · 스타일 체계 전수 조사 |
| `current-page-audit.md` | 렌더 트리 · 렌더되는 정보 31개 · Legacy 재현 로직 · 4가지 상태 · 코드로 강제되는 제약 |
| `html-reference-map.md` | 예시 HTML이 자기추출형 React 번들인 이유 · 재사용 가능 CSS 2.8KB · MD 문서 대조 · 더미 데이터 목록 |
| `gate-0-verdict.md` | Gate 0 판정 · 핵심 발견 5 · 사람 확인 필요 5건 |
| `content-parity-matrix.md` | 제1부 §1.1~1.3, §1.9 원본 |
| `functional-parity.md` | 제1부 §1.4~1.7 원본 |
| `gap-analysis.md` | 제1부 §1.8 원본 (G-01~G-10 상세) |
| `gate-1-verdict.md` | 제1부 §1.11 원본 |
| `integration-architecture.md` | 제2부 §2.1~2.5, §2.15~2.18 원본 |
| `component-reuse-plan.md` | 제2부 §2.6~2.9, §2.22 접근성 원본 |
| `data-mapping.md` | 제2부 §2.10~2.14, §2.20 대표 강좌·§2.25 원본 |
| `rollout-and-rollback-plan.md` | 제2부 §2.19~2.24 원본 |
| `gate-2-verdict.md` | 제2부 §2.26, 제3부 원본 |
