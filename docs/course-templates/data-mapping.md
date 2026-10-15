# Gate 2 — Data Mapping

작성일: 2026-10-15
목표: 기존 강좌 데이터를 새 템플릿에 연결하는 **최소 변경 어댑터** 명세.
**Bridge Contract 변경 0. 신규 API 0. DB 접근 0.**

## 1. 어댑터 위치

```
CourseFull (Bridge, 변경 없음)
        +
CourseTemplateContent (V2 콘텐츠 파일, 신규)
        │
        ▼
buildTemplateProps(course, content, siblings, reviews, questions)   ← 순수 함수
        │
        ▼
CourseTemplateProps  →  템플릿 컴포넌트
```

`buildTemplateProps`는 `templates/types.ts`에 둔다. 순수 함수이므로 L1 테스트가 쉽다.

## 2. Bridge → 템플릿 필드 (데이터가 있는 것)

| 템플릿 필드 | 출처 | 변환 | 조건 |
|---|---|---|---|
| `title` | `item.name` | 그대로 | 항상 |
| `salePrice` | `item.price` | `formatPrice()` | `!priceOnInquiry` |
| `listPrice` | `item.listPrice` | `formatPrice()` | **`listPrice > price`일 때만** (G-05) |
| `hasDiscount` | — | `item.listPrice > item.price` | — |
| `saleState` | `priceOnInquiry` / `soldOut` / `inStock` | 아래 §3 | 항상 |
| `period` | `item.extra[2]` | `수강 시작 후 {n}일` — **기존 조립 규칙 유지** | 값이 `''`이 아닐 때 |
| `applyPeriod` | `item.extra[3]` | 그대로 | 동일 |
| `capacity` | `item.extra[4]` | `{n}명` | 동일 |
| `lessonCount` (`n`) | `item.extra[5]` | `{n}강` | 동일 |
| `enrollInfo` | — | `hasText(extra[3]) \|\| hasText(extra[4])` | — |
| `target` | `information.product_name` (수강대상) | 그대로 | 있을 때 |
| `methodLine` fallback | `information.model_name` (내용 및 특징) | 콘텐츠 파일에 `methodLine`이 없을 때만 | — |
| `summary` fallback | `item.basic` | 콘텐츠 파일에 `summary`가 없을 때만 | — |
| `reviewCount` | `reviewSummary.count` | 탭 라벨 `강의 후기 [N]` | 항상 |
| `starScore` | `courseStarScore(reviewSummary)` | 0이면 숨김 | `> 0` |
| 상품 이미지 | `item.images[]` + `legacyItemThumbnail()` | `legacyRoutes.courseLargeImage(id, no)` 링크 | 07-E (G-02) |
| 기존 HTML 3종 | `headHtml` / `descriptionHtml` / `tailHtml` | `sanitizeLegacyHtml()` (기존 위치) | 07-E (G-10) |
| 주문 폼 | `options`, `form`, `item.buyMinQty` | `useCourseOrder()` | 07-C |
| 형제 강좌 | `findCourseSiblings()` | 그대로 | 07-F |
| 분류 목록 링크 | `item.category.id` | `legacyRoutes.courseList()` | 07-F |
| 후기·문의 | `CourseReviewsState` / `CourseQuestionsState` | 그대로 | 07-B |
| 공지 링크 | — | `legacyRoutes.notice()` | 07-B |
| 약관 링크 (`policyUrl`) | — | `legacyRoutes.terms()` / `privacy()` | 07-D |
| 공유 링크 | `item.id` | `legacyRoutes.courseDetailLegacy()` (절대 URL 필요) | G-03 |
| 템플릿 키 | `item.category.id` | `resolveCourseTemplate()` | — |
| 강사 키 | `item.category.id.slice(0, 4)` | 강사 콘텐츠 조회 (G-08) | — |

**Legacy 컬럼명(`it_*`, `ca_*`, `io_*`)이 `src/legacy/` 밖으로 나가지 않는다** (AGENTS.md §2 원칙 5).
위 표의 좌변은 모두 canonical 이름이다.

## 3. `saleState` 유도

```ts
function resolveSaleState(item: CourseFullItem): 'available' | 'sold_out' | 'unknown' {
  if (isCourseSoldOut(item)) return 'sold_out';        // it_soldout || !inStock
  if (item.priceOnInquiry) return 'unknown';           // it_tel_inq
  return 'available';
}
```

`'coming_soon'`은 **타입에서 제외한다.** 대응 데이터가 없고 copy.md §6도
"확인되지 않은 일정 생성 금지"를 요구한다 (G-06).

| 상태 | 고정 바 | 신청 패널 | 보조 문구 |
|---|---|---|---|
| `available` | 활성 `{ctaLabel}` (앵커 `#enroll`) | 활성 submit | 없음 |
| `sold_out` | 비활성 `신청 마감` | 비활성 | `현재 신청할 수 없는 강좌입니다.` |
| `unknown` | 비활성 **`전화문의`** | 비활성 | 기존 표현 유지 |

`unknown`의 라벨은 copy.md의 `운영 데이터 확인 필요` 대신 **기존 `전화문의`를 쓴다.**
전화문의는 "데이터 미확인"이 아니라 확정된 판매 방식이고, 기존 표현을 바꾸면 사용자에게 혼란이다 (G-06).

## 4. 조건부 노출 플래그 유도

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

규칙: **`showSession`과 `featFeedback`이 모두 off면 06 블록 전체를 숨긴다.**
**`brandStats`와 `showProof`가 모두 off면 03 블록을 숨긴다** (수리·약술). 인문은 BrandStats가
"항상"이지만 **수치가 미검증이므로 off를 기본으로 두고**, 승인 후 켠다 — 검증되지 않은 사실을
내보내지 않는 쪽이 문서 지시보다 우선한다 (요청서 §12).

## 5. 콘텐츠 파일 스키마 (D1-A 안)

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
  steps?: [string, string, string];   // 3단계 설명

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
  recommend?: string[];                       // 4항목
  infoCards?: { label: string; value: string; sub?: string }[];
  notices?: { kind: 'info' | 'caution'; text: string }[];
  closing?: string;
  refundNote?: string;
  faq?: { q: string; a: string }[];

  /** 기존 Legacy HTML을 계속 보여줄지 (G-10 / 결정 D3). 기본 'visible'. */
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
// src/features/course-detail/templates/content/instructors/types.ts

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

### provider

```ts
// content/provider.ts  — 동기. Bridge 호출 없음.
export function getCourseTemplateContent(
  courseId: string,
  categoryId: string,
): { course: CourseTemplateContent; instructor: InstructorContent | null } | null;
```

`null`을 반환하면 `CourseDetailRouter`가 legacy 템플릿을 쓴다 (`integration-architecture.md` §3).

## 6. 데이터가 없을 때의 규칙

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
| `headHtml` 빈 문자열 | 기존은 빈 div를 냈다. 신규는 **그리지 않는다** (빈 칸 금지 원칙) |
| Bridge 장애 | 본체 throw → 마지막 성공본 (ADR 0007, 변경 없음) |

> `headHtml` 빈 div 제거는 의도적 차이다. Legacy DOM 구조를 맞출 필요가 없는
> 새 템플릿에서는 빈 요소를 내보내지 않는 쪽이 wireframe §0 원칙에 맞는다.
> legacy 템플릿에서는 **그대로 유지한다.**

## 7. 대표 강좌 3종 선정 기준 (템플릿 Gate 4·7)

운영 강좌의 실제 `ca_id` 분포 확인 후 확정한다 (`gate-0-verdict.md` §4-C).

| 유형 | 조건 |
|---|---|
| 인문논술 | `ca_id` 접두사 `10`. `extra[2]`(수강기간)·`extra[5]`(강의수)가 채워져 있고, `descriptionHtml`에 커리큘럼이 적혀 있어 `lessons[]`로 옮길 수 있는 강좌 |
| 수리논술 | 접두사 `30`. 동일 조건 |
| 약술형논술 | 접두사 `40`. 동일 조건 |

공통: 판매 중(`available`), 선택옵션이 있는 강좌(교재 포함/미포함 등) 1개 이상 포함 —
주문 폼 회귀를 실데이터로 확인하기 위해서다.

로컬 검증은 기존 mock id로 먼저 한다. 단 **mock fixture의 `category.id`는 `101060`(인문)뿐**이므로
수리·약술 템플릿을 로컬에서 보려면 fixture를 추가해야 한다 → Gate 3 작업 항목:

| 신규 fixture | `category.id` | 용도 |
|---|---|---|
| `course-full.math.json` | `302010` 등 | 수리 템플릿 로컬 확인 |
| `course-full.short-answer.json` | `401010` 등 | 약술 템플릿 로컬 확인 |

fixture는 **Contract를 통과하는 예시값**이며 실제 강좌가 아니다
(기존 `course-full.basic.json`도 `"하네스용 예시 강좌입니다. 실제 강좌가 아닙니다."`라고 명시).

## 8. Contract 변경 여부

| 질문 | 답 |
|---|---|
| `course-full.v1`을 바꾸는가 | **아니다** |
| 새 Bridge endpoint가 필요한가 | **아니다** (D1에서 B안을 택하면 필요. A안 권고) |
| PHP 변경이 필요한가 | **아니다** |
| `contracts/bridge/*.schema.json` 변경 | **없음.** fixture 2개 **추가**만 |
| 새 env | `COURSE_TEMPLATES` 1개 (`rollout-and-rollback-plan.md`) |

→ CLAUDE.md "작업 시작 전 계획 승인" 대상 중 **Contract 변경·의존성 추가·`middleware`/`env`/`next.config` 변경**에서
**env 추가 1건만** 해당한다. 이 문서가 그 계획이다.
