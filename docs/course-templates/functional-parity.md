# Gate 1 — Functional Parity

작성일: 2026-10-15
원칙: **기존 기능 로직은 변경하지 않는다. 마크업만 바꾼다.**
요청서 §9 — "기존에 존재하지 않는 기능을 새로 개발하지 말 것."

## 1. 반드시 바이트 단위로 보존해야 하는 것 — Legacy 주문 계약

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
| hidden `io_id[<itId>][]` | Bridge `io_id` (여러 주제는 `chr(30)` 결합) | 그대로 |
| hidden `io_value[<itId>][]` | `주제:값`, 다중은 ` / ` 결합 | 생성 규칙 그대로 |
| `ct_qty[<itId>][]` | 수량 (최소 1) | 그대로 |
| hidden `#it_price` | `item.price` | id 포함 그대로 |
| `.io_price` / `.io_stock` | 옵션 금액 / 재고 | class 포함 그대로 |
| 옵션 없는 강좌 사전 입력 행 | `io_id=""`, `io_value=item.name`, `ct_qty=buyMinQty` | 그대로 |

→ **구현 전략**: 이 계약을 품은 로직을 `useCourseOrder()` 훅으로 **추출만** 하고
한 글자도 바꾸지 않는다. 마크업은 훅 밖에서 테마별로 그린다. → `component-reuse-plan.md` §2

## 2. 기능별 보존 판정

| 기능 | 현재 동작 | 신규 | 판정 |
|---|---|---|---|
| **URL** `/courses/[id]` | `courseIdSchema` 검증 → 통과만 Bridge 조회 | 변경 없음 | **유지** |
| **404** | `null` → `notFound()` | 변경 없음 | **유지** |
| **ISR** | `revalidate = 300` 리터럴 + `generateStaticParams()` 빈 배열 | 변경 없음 | **유지** (주의: 템플릿 선택이 `searchParams`를 읽으면 ISR이 깨진다) |
| **Bridge 장애** | 본체는 throw → 마지막 성공본 유지 (ADR 0007) | 변경 없음 | **유지** |
| **인증 필요 분류** | 서버 `redirect()` → Legacy | 변경 없음 | **유지** |
| **로그인 상태** | 상세페이지는 viewer를 **조회하지 않는다** | 변경 없음 | **유지** (AGENTS.md §6.3) |
| **장바구니** | **버튼 없음** (Legacy 스킨도 바로구매만) | 추가하지 않는다 | **유지 = 부재** |
| **바로구매** | `sw_direct=1` submit + 검사 3단계 | 로직 그대로, 버튼만 템플릿 CTA | **유지** |
| 제출 검사 ① 전화문의 | `alert('전화로 문의해 주시면 감사하겠습니다.')` | 그대로 | **유지** |
| 제출 검사 ② 옵션 미선택 | `alert('상품의 선택옵션을 선택해 주십시오.')` | 그대로 | **유지** |
| 제출 검사 ③ 추적 | `track('begin_checkout', {courseId, salePrice})` | 그대로 | **유지** |
| 옵션 재고 부족 | `alert('...재고가 부족하여 구매할 수 없습니다.')` | 그대로 | **유지** |
| 옵션 음수 금액 | `alert('구매금액이 음수인 상품은 구매할 수 없습니다.')` | 그대로 | **유지** |
| 옵션 중복 | `alert('<값> 은(는) 이미 추가하신 옵션상품입니다.')` | 그대로 | **유지** |
| 단계별 select 하위 초기화 | `onPickSelection()` | 그대로 | **유지** |
| 수량 ± / 직접 입력 | `changeQty`/`setQty` (최소 1) | 그대로 | **유지** |
| 옵션 삭제 | `removeOption` | 그대로 | **유지** |
| **가격·할인** | `formatPrice()` (원화, `Asia/Seoul`) | 그대로 | **유지** (취소선 조건만 G-05) |
| **품절** | `#sit_ov_soldout` 문구 + 버튼 제거 | `saleState=sold_out` + copy.md 문구 | **유지 (문구 변경)** |
| **전화문의** | `판매가격 / 전화문의` 행 + 버튼 제거 | `saleState=unknown` | **유지 (표현 변경)** |
| **강사 정보** | **현재 없음** | 템플릿 04 블록에 자리 있으나 데이터 없음 | **부재 유지** → `instructorPhoto` off, 블록 숨김 |
| **교재·배송** | **현재 없음.** 교재는 선택옵션(`교재비: 교재 포함/미포함`)으로만 존재 | `featMaterial` 카드에 하드코딩 금지 | **부재 유지** → off |
| **첨삭 안내** | **현재 없음** | `featFeedback` off | **부재 유지** |
| **후기** | 1페이지 + 쓰기(새 창) + 더 보기 | 컴포넌트 그대로, 07-B 탭 안 | **유지** |
| **문의** | 1페이지 + 쓰기 + 더 보기 | 동일 | **유지** |
| **공지** | 탭 버튼이 Legacy 게시판으로 **이동** | 동일 (탭처럼 보이지만 이동) | **유지** |
| **환불 안내** | **현재 없음** | 07-D FAQ + copy.md §8 공통 5항목 | **신규 추가 — 공통 정책 문구만** |
| **SEO** | `generateMetadata` title/desc/canonical/OG, `enforceProxy` 조건 robots | 변경 없음 | **유지** (단 `<h1>`은 D2) |
| **SNS 공유** | facebook / twitter 토글 | 템플릿에 자리 없음 | **결정 필요** → G-03 |
| **원본 이미지 팝업** | `largeimage.php` 새 창 | 템플릿에 자리 없음 | **결정 필요** → G-02 |
| **이전/다음/목록** | `findCourseSiblings()` + 분류 목록 링크 | 템플릿에 자리 없음 | **결정 필요** → G-04 |
| **별점** | `s_star{n}.png` 이미지 | 탭 헤더 | **유지 (표현 변경)** |
| **탭 해시 딥링크** | `#sit_use` / `#sit_qa` → 해당 탭 열림 | 유지해야 함 | **유지** — 외부 링크가 이미 존재할 수 있다 |
| **PC·모바일** | Legacy 스킨 반응형 | 템플릿 명세 (고정 바 모바일 하단 fixed) | **개선** |
| **접근성** | `sound_only`, `aria-expanded`, alt | 템플릿 명세가 더 엄격 (44px 터치, `aria-pressed`, `role=tab`) | **개선** |
| **빌드·타입·테스트** | `pnpm check` 통과 | 유지 필수 | **유지** |

## 3. 새 템플릿이 추가로 요구하는 상호작용

전부 신규지만 **기능이 아니라 UI 동작**이므로 "없던 기능 개발"에 해당하지 않는다.

| 동작 | 명세 | 접근성 요구 |
|---|---|---|
| 고정 바 스크롤 전환 (480px) | 데스크톱 배경·보더 등장 / 모바일 하단 fixed | `env(safe-area-inset-bottom)` |
| 앵커 이동 | `#curriculum` `#enroll` `#faq` `#method`, `scroll-margin-top:80px`, `scroll-behavior:smooth` | `prefers-reduced-motion`에서 해제 |
| 커리큘럼 펼치기 | 7강 이상 → 6강 + 펼치기 버튼 | `aria-expanded` |
| FAQ 아코디언 | `<details>`, 다중 열기, `+` 45도 회전 | 네이티브 |
| 합격증 자동 흐름 띠 | 34장×2, `translateX(0→-50%)` 60초 linear | 호버·포커스 정지, `aria-pressed` 토글, 두 번째 묶음 `aria-hidden`, `prefers-reduced-motion`에서 수동 스크롤 |
| 탭 전환 | 기존 `CourseInfoTabs` 재사용 | `role="tablist"`/`role="tab"`/`aria-selected` 보강 |

## 4. 하지 말아야 할 것 (명시적 금지)

| 금지 | 이유 |
|---|---|
| 장바구니 버튼 추가 | 현재 없음. 요청서 §9 "없던 기능 개발 금지" |
| `track('course_view')` 추가 | canonical 목록엔 있으나 현재 호출 0건. 신규 기능 |
| 강사 정보·합격 사례·브랜드 수치 **생성** | 요청서 §12. 검증되지 않은 사실 생성 금지 |
| `coming_soon` 상태 사용 | 데이터 출처 없음. copy.md도 "확인되지 않은 일정 생성 금지" |
| viewer 조회를 상세페이지 서버에 추가 | 캐시 오염 (AGENTS.md §6.3) |
| `searchParams`로 템플릿 선택 | ISR 파괴 (`page.tsx:25-28`) |
| Bridge에 회원별 값 추가 | AGENTS.md §7.2 |
| `재입고알림` 버튼 구현 | `it_stock_sms` 미제공. 조건 일부만 보면 오동작 |
| 후기/문의 쓰기 기능 V2 구현 | AGENTS.md §2 원칙 3. 링크만 |
| `legacy-course-detail.css`를 새 템플릿에서 import | `#sit_*`/`.shop_*` 선택자가 새 마크업에 섞인다 |
