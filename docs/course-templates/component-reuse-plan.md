# Gate 2 — Component Reuse Plan

작성일: 2026-10-15
기준: 요청서 §12 "기존 Next.js 컴포넌트를 가능한 한 재사용한다."

## 1. 기존 컴포넌트 재사용 판정

| 컴포넌트 | 행 | 판정 | 조치 |
|---|---:|---|---|
| `src/app/courses/[id]/page.tsx` | 145 | **재사용** | import 1줄 + 컴포넌트명 1곳 (총 3줄) |
| `CourseDetail.tsx` | 105 | **그대로 보존** | **무변경.** legacy fallback 템플릿으로 계속 쓴다 |
| `CourseOrderForm.tsx` | 771 | **로직 추출 + 마크업 유지** | 로직 → `useCourseOrder()`. 마크업·전송 필드·스타일 **동일** |
| `CourseOptionPicker.tsx` | 224 | **전면 재사용** | **무변경.** 네 템플릿이 공유 |
| `CourseInfoTabs.tsx` | 189 | **재사용 + 래핑** | 무변경. `BoardTabs`가 테마 컨테이너로 감싼다 |
| `CourseReviewList.tsx` | 209 | **전면 재사용** | 무변경 (스타일은 상속되는 토큰으로 조정 가능) |
| `CourseQuestionList.tsx` | 227 | **전면 재사용** | 무변경 |
| `siblings.ts` | 62 | **전면 재사용** | **무변경.** Legacy SQL 재현 로직 — 손대면 순서가 깨진다 |
| `legacy-course-detail.css` | 347 | **그대로 보존** | legacy 템플릿 전용. 새 템플릿은 선택자를 공유하지 않는다 |
| `legacy-inline-styles.ts` | 137 | **legacy 전용 유지** | 새 템플릿은 쓰지 않는다 |
| `SiteShell` / `SiteHeader` / `SiteFooter` | — | **전면 재사용** | 세 wireframe.md가 "기존 공통 헤더·푸터를 그대로 쓴다"고 명시 |
| `src/lib/format.ts` (`formatPrice`, `formatOptionPrice`) | 55 | **전면 재사용** | 원화·`Asia/Seoul` 단일 출처 |
| `src/lib/sanitize-legacy-html.ts` | 98 | **전면 재사용** | server-only. 호출 위치도 유지 |
| `src/legacy/handoff/routes.ts` | 132 | **전면 재사용** | Legacy URL 단일 출처. 하드코딩 금지 |
| `src/legacy/assets.ts` (`legacyAssetUrl`, `legacyItemThumbnail`) | 99 | **전면 재사용** | 상품 이미지·별점 자산 |
| `src/analytics` (`track`) | — | **전면 재사용** | `begin_checkout` 그대로 |
| `isCourseOrderable` / `isCourseSoldOut` / `courseStarScore` / `requiresLegacyCertification` | — | **전면 재사용** | `contracts/course-full.ts`의 순수 함수. Legacy 스킨 판단의 단일 출처 |
| `design-system/primitives/` | — | **선택적** | Legacy Bootstrap 기반이라 새 템플릿 타이포 스케일과 맞지 않는다. 강제하지 않는다 |
| `tokens.css` (`--nonsul-*`) | — | **쓰지 않는다** | `main.css`에서 추출한 Legacy 값이다. 새 템플릿은 자체 `--ct-*` 팔레트 |

### 집계

| 구분 | 수 |
|---|---:|
| 무변경 재사용 | **15** |
| 최소 수정 | **2** (`page.tsx` 3줄, `CourseOrderForm` 로직 추출) |
| 신규 | 템플릿 컴포넌트 26개 + 훅 1 + Resolver 1 + Router 1 |
| 재구현 | **0** |

**기존 기능 로직을 재구현하는 파일은 0개다.**

## 2. `useCourseOrder()` 추출 — 가장 중요한 작업

### 왜 추출하는가

`CourseOrderForm.tsx` 771행은 **로직 약 200행 + 마크업·스타일 약 570행**이다.
신규 `EnrollPanel`이 같은 폼을 그려야 하는데:

- 복사하면 → Legacy 전송 계약이 두 곳에 생긴다. 한쪽만 고치면 결제가 조용히 깨진다
- `CourseOrderForm`을 새 디자인으로 고치면 → legacy fallback이 사라져 롤백 경로가 없어진다

→ **로직을 한 곳에 두고 마크업만 두 벌로 만든다.**

### 추출 대상 (전부 `CourseOrderForm.tsx`에서 이동, 수정 0)

| 이동할 것 | 현재 위치 |
|---|---|
| `SelectedOption` 인터페이스 | :38-49 |
| `picked` / `supplyPicked` / `selected` state | :72-75 |
| `selectionItems` / `supplyItems` / `thumbnails` memo | :77-91 |
| `alreadyAdded()` | :94-100 |
| `commitSelection()` | :109-141 |
| `onPickSelection()` | :143-153 |
| `onPickSupply()` | :164-191 |
| `changeQty()` / `setQty()` / `removeOption()` | :193-216 |
| `onSubmit()` | :224-245 |
| `resolveAction()` | :650-653 |
| `hasText()` | :645-647 |

### 훅 시그니처

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
2. 기존 `tests/component/course-detail.test.tsx`가 수정 없이 통과
3. 추출 전/후 렌더 HTML을 diff — 차이 0이어야 한다
4. **그 다음에** 새 템플릿 작업을 시작한다

→ 커밋을 두 개로 쪼갠다: `refactor(course-detail): useCourseOrder 훅으로 주문 로직을 분리한다`
(동작 변화 0) → `feat(course-detail): 3종 템플릿을 추가한다`.
회귀가 생기면 어느 커밋인지 바로 안다.

### 새로 추가할 테스트 (Gate 3)

**전송 필드 스냅샷 테스트**. 옵션 조합별로 `new FormData(form)`의 엔트리를 그대로 비교한다.

| 시나리오 | mock id | 기대 |
|---|---|---|
| 선택옵션 있음 · 1개 선택 | `1001` | `it_id[]`, `sw_direct=1`, `url`, `io_type[1001][]=0`, `io_id[1001][]`, `io_value[1001][]`, `ct_qty[1001][]` |
| 선택옵션 있음 · 2개 선택 | `1001` | 옵션 필드가 2쌍 |
| 선택옵션 없음 | `1002` | `io_id[1002][]=""`, `io_value[1002][]=<강좌명>`, `ct_qty[1002][]=buyMinQty` |
| 품절 | `1003` | submit 버튼 없음 |
| 전화문의 | `1004` | submit 시 alert, 전송 차단 |

**legacy 템플릿과 신규 템플릿에서 같은 결과가 나와야 한다.** 이것이 G-01 위험 1번의 차단 장치다.

## 3. 공용 컴포넌트 명세 (shared/)

`content-parity-matrix.md` §3의 차이를 props로 흡수한다.

| 컴포넌트 | 유형별 차이 | 흡수 방법 |
|---|---|---|
| `CourseStickyBar` | 배경(투명→다크 / 투명→아이보리 / 항상 화이트), 약술만 `논술런` 워드마크 | 색은 토큰. `wordmark?: boolean`, `alwaysOpaque?: boolean` |
| `BeforeAfterRows` | 머리행 선 두께 (인문 없음 / 수리 1px / 약술 2px) | 토큰 `--ct-table-head-border` |
| `ProofSection` | 인문은 BrandStats **항상**, 수리·약술은 조건부. 약술은 범위 칩 없음 | `statsMode: 'always' \| 'conditional'`, `scopeLabel?: string` |
| `CertificateMarquee` | **차이 없음** (세 design.md 명세 동일) | props 없음. 색만 토큰 |
| `InstructorProfile` | 인문은 소개 문장 없음. 약술만 H3 `강사 소개` | `intro?: string`, `heading?: string` |
| `CurriculumList` | 인문은 강의 시간 없음. 번호 칸 폭 96/72/80px | `duration?: string`, 폭은 토큰 `--ct-curriculum-num-width` |
| `SessionPlan` | 인문·수리는 시간 비율 가변 막대, 약술은 3칸 고정 1:2:1 | `barMode: 'ratio' \| 'fixed'` |
| `FeedbackFlow` | 약술만 민트 `→` 화살표 | `showArrow?: boolean` |
| `RecommendList` | 인문·수리 번호 / 약술 체크 아이콘 | `marker: 'number' \| 'check'` |
| `BeforeEnrollInfo` | 약술은 카드 보조줄 없음 | `sub?: string` (있으면 그린다) |
| `EnrollPanel` | 패널 폭 640/flex5/680px, 수리는 `closing` 없음 | `closing?: string`, 폭은 토큰 |
| `FaqAccordion` | 거의 동일 | 토큰만 |
| `BoardTabs` | 선택 탭 밑줄 스타일 | 토큰 |
| `LegacyContentBlock` | 신규 | 유형 무관 |
| `CourseSiblingsNav` | 신규 | 유형 무관 |

**유형별 전용은 3개뿐**: 01 히어로 · 02-A 문제 공감 · 04 수업 루프.
세 유형의 레이아웃이 근본적으로 다르다(1열/전체폭7:5/좌우분할, 4카드/3번호행/2×2격자,
3카드/3열선/3단계화살표). props로 흡수하면 분기가 더 복잡해지므로 **의도적으로 분리한다.**

## 4. 예시 HTML에서 가져올 것

`html-reference-map.md` §4의 공용 CSS 2.8KB를 `shared/course-template.css`로 옮긴다.

| 가져옴 | 처리 |
|---|---|
| `.wrap` / `.sec` / `.num` | 색상 없음 → 거의 그대로. 폭·패딩만 토큰화 |
| `.btn` / `.btn-off` / `.btn-line` | 색을 `var(--ct-*)`로 |
| `:focus-visible` 규칙 | 그대로 (색만 토큰) |
| `.lnk` / `.tab` | 그대로 |
| `details` / `details[open] .pm` | **그대로** |
| 모바일 `@media (max-width:767px)` 블록 (`.sbar` 하단 fixed, `.sbar-name` 숨김, `.page` 하단 96px, `env(safe-area-inset-bottom)`) | **그대로.** 직접 쓰면 빠뜨리기 쉽다 |
| `@media (max-width:360px)` | 그대로 |
| `prefers-reduced-motion` 블록 | **그대로** |
| `.cert-view` / `.cert-track` / `@keyframes certFlow` + 호버·포커스 정지 + reduced-motion 수동 스크롤 | **그대로.** 품질이 높고 재작성 가치가 없다 |

| 버림 | 이유 |
|---|---|
| Inter `@font-face` 385KB | 웹폰트 전략 별도 결정 |
| `x-dc` 런타임 CSS | 캔버스 전용 |
| 마크업의 inline `style` 전부 | AGENTS.md §6.5 — CSS로 옮긴다 |
| 캔버스 고정 크기 (`width:880px;height:195px` 등) | design.md가 "반응형으로 교체" 지시 |
| 헤더·푸터 점선 자리표시자 | `SiteShell`이 소유 |
| 합격증 base64 0.8MB | 서버 자산으로 교체 |

## 5. 신규 컴포넌트 집계

| 그룹 | 개수 |
|---|---:|
`shared/` 공용 블록 | 15 |
유형별 전용 (3블록 × 3유형) | 9 |
유형별 템플릿 루트 | 3 |
Router · Resolver · 훅 | 3 |
콘텐츠 타입·기본값·provider | 3 |
CSS (`course-template.css` + `theme.css` × 3) | 4 |
| **합계** | **37** |

## 6. 접근성 — 기존 수준 이상

| 항목 | 기존 | 신규 요구 (design.md §8) |
|---|---|---|
| 스크린리더 전용 텍스트 | `.sound_only`, `.visually-hidden` | 계속 사용 |
| 탭 | `aria-expanded` | `role="tablist"`/`role="tab"`/`aria-selected`로 **보강** |
| 아코디언 | 없음 | `<details>` 네이티브 |
| 터치 영역 | 미규정 | **44px 이상** |
| 포커스 | Bootstrap 기본 | `focus-visible` 2px + offset 3px |
| 대비 | 미검증 | WCAG AA (본문 4.5:1, 큰 글씨 3:1). 약술은 작은 에메랄드에 `#0D6749` 사용 |
| 움직임 | 없음 | `prefers-reduced-motion` 전면 지원 |
| 이미지 alt | 필수 | 합격증은 `2026학년도 논술전형 합격증 N (개인정보 가림)` |
| 가로 스크롤 | 375px 금지 (`tests/e2e/mobile.spec.ts`) | 320~390px 금지 — **더 엄격** |

→ `tests/e2e/mobile.spec.ts`의 뷰포트에 **320px를 추가**해야 한다.
