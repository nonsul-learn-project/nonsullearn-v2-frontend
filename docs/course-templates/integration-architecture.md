# Gate 2 — Integration Architecture

작성일: 2026-10-15
원칙: **기존 구현을 재구현하지 않는다.** 로직은 추출만, 마크업만 신규.

## 1. 전체 구조

```
app/courses/[id]/page.tsx                        ← 변경 최소 (import 2줄 + 컴포넌트 1개 교체)
  │  revalidate / generateStaticParams / generateMetadata / 인증 redirect   전부 그대로
  │
  └─ <SiteShell>
       └─ <CourseDetailRouter course siblings reviews questions templateContent />
            │
            │  resolveCourseTemplate(course.item.category.id)   ← 순수 함수, 입력 1개
            │
            ├─ 'humanities'   → <HumanitiesTemplate />   data-course-theme="humanities"
            ├─ 'math'         → <MathTemplate />         data-course-theme="math"
            ├─ 'short-answer' → <ShortAnswerTemplate />  data-course-theme="short-answer"
            └─ 'legacy'       → <CourseDetail />         ← 현재 구현 그대로, 무변경
```

**핵심 설계 결정 3가지**

1. **기존 `CourseDetail`은 건드리지 않고 fallback 템플릿으로 남긴다.** 롤백이 "Resolver가
   `'legacy'`를 반환하게 하는 것"으로 끝난다. 코드를 되돌릴 필요가 없다.
2. **Resolver 입력은 `category.id` 하나.** `searchParams`·viewer·쿠키를 보지 않으므로 ISR이 유지된다.
3. **주문 로직은 `useCourseOrder()` 훅으로 추출**하고 네 템플릿이 공유한다. 로직 수정 0.

## 2. 디렉터리 구조 (신규)

```
src/features/course-detail/
├── CourseDetail.tsx                 [무변경] legacy 템플릿
├── CourseOrderForm.tsx              [수정]  훅 사용으로 전환 (마크업·전송값 동일)
├── CourseOptionPicker.tsx           [무변경] 네 템플릿이 공유
├── CourseInfoTabs.tsx               [무변경]
├── CourseReviewList.tsx             [무변경]
├── CourseQuestionList.tsx           [무변경]
├── siblings.ts                      [무변경]
├── legacy-course-detail.css         [무변경] legacy 템플릿만 import
├── legacy-inline-styles.ts          [무변경]
│
├── useCourseOrder.ts                [신규] 주문 상태·검증·제출 (CourseOrderForm에서 추출)
├── CourseDetailRouter.tsx           [신규] 템플릿 분기
│
└── templates/
    ├── resolveCourseTemplate.ts     [신규] ca_id 접두사 → 테마 키
    ├── types.ts                     [신규] CourseTemplateContent, CourseTemplateProps
    │
    ├── content/
    │   ├── defaults.ts              copy.md 「빈 자리 기본값」
    │   ├── provider.ts              getCourseTemplateContent(itId, caId)
    │   ├── instructors/<caId4>.ts   강사 정보 (ca_id 4자리 단위, G-08)
    │   └── courses/<itId>.ts        강좌별 카피
    │
    ├── shared/                      ← 테마 무관. 토큰과 props로만 변형
    │   ├── course-template.css      예시 HTML의 공용 CSS 2.8KB (토큰화)
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
    ├── humanities/
    │   ├── HumanitiesTemplate.tsx
    │   ├── theme.css                → --ct-* 매핑
    │   ├── HumanitiesHero.tsx       01 전용
    │   ├── HumanitiesProblem.tsx    02-A 전용 (4카드)
    │   └── HumanitiesMethod.tsx     04 전용 (3카드)
    ├── math/
    │   ├── MathTemplate.tsx
    │   ├── theme.css
    │   ├── MathHero.tsx             01 전용 (H1 전체폭 + 7:5)
    │   ├── MathProblem.tsx          02-A 전용 (3 번호행, 딥 오베르진 풀블리드)
    │   └── MathMethod.tsx           04 전용 (3열 + 상단 2px 선)
    └── short-answer/
        ├── ShortAnswerTemplate.tsx
        ├── theme.css
        ├── ShortHero.tsx            01 전용 (좌 H1 + 우 정보, 2px 좌측선)
        ├── ShortProblem.tsx         02-A 전용 (2×2 격자)
        └── ShortMethod.tsx          04 전용 (3단계 + 에메랄드 화살표)
```

공용 15 / 유형별 3블록 × 3 = 9 / 신규 블록 2. 유형별 전용은 **01·02-A·04 세 블록뿐**이다
(근거: `content-parity-matrix.md` §3).

## 3. Template Resolver

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
 * 매핑되지 않은 대역(`20` 등 — gap-analysis G-07)은 'legacy' 다.
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

ISR 안전: 입력이 `course.item.category.id` 하나이고 순수 함수다.
`searchParams`·viewer·쿠키·`Date.now()`를 보지 않는다.

### 활성화 게이트 (Resolver와 분리)

Resolver가 유형을 알아도 **카피가 없으면 템플릿을 쓰지 않는다.** 빈 블록을 내보내는 것보다
현재 화면이 낫다 (`gate-1-verdict.md` §3).

```ts
// CourseDetailRouter 안
const key = resolveCourseTemplate(course.item.category.id);
const content = getCourseTemplateContent(course.item.id, course.item.category.id);

const active =
  courseTemplatesEnabled &&          // env kill switch (server)
  key !== 'legacy' &&
  content !== null;                  // 카피 파일이 있는 강좌만

if (!active) return <CourseDetail ... />;   // 현재 화면 그대로
```

`courseTemplatesEnabled`는 `src/env.server.ts`의 `COURSE_TEMPLATES`(`'on' | 'off'`, 기본 `'off'`)에서 온다.
자세한 내용은 `rollout-and-rollback-plan.md`.

## 4. 데이터 흐름

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
| 유형별 `XxxTemplate` | **Server** | 조립만 한다 |
| 01 히어로 · 02 · 03 BrandStats · 05(접힘 전) · 07-A · 07-E | **Server** | 정적 |
| `CourseStickyBar` | **Client** | 스크롤 480px 전환 |
| `CertificateMarquee` | **Client** | 정지 토글 `aria-pressed` |
| `CurriculumList` (7강 이상) | **Client** | 펼치기 `aria-expanded` |
| `EnrollPanel` + `CourseOptionPicker` | **Client** | 주문 폼 |
| `BoardTabs` / `CourseInfoTabs` | **Client** | 기존 그대로 |
| `FaqAccordion` | **Server** | `<details>` 네이티브. JS 불필요 |

AGENTS.md §6.3 "기본은 Server Component, `'use client'`는 최소 단위에만"을 지킨다.

## 5. CSS 격리 전략

### 5-1. 범위

테마 변수를 `:root`에 올리지 않는다. design.md 초안은 `:root[data-course-theme="humanities"]`를
제안하지만(인문·약술), 그러면 공통 헤더·푸터와 `legacy-course-detail.css`(`.shop_*`, `#sit_*`)까지
변수 범위에 들어간다. **수리논술 design.md가 쓴 `.math-course-detail` 방식(루트 클래스)이 맞다.**

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

이렇게 하면:
- 공용 컴포넌트는 `var(--ct-accent)`만 쓰고 **한 번만 작성**된다
- 세 테마가 서로, 그리고 사이트 공통 스타일과 섞이지 않는다
- `bodyTone`(인문 dark/light)은 `data-body-tone` 속성 하나 추가로 처리한다

### 5-2. 변수 이름 매핑

design.md가 유형별로 다른 접두사(`--hm-*`, `--math-*`, `--sa-*`)를 쓴다.
**공용 컴포넌트가 세 벌로 갈라지면 안 되므로** 공용 이름(`--ct-*`)으로 수렴시키고,
각 `theme.css`가 자기 팔레트를 `--ct-*`에 대입한다. 원래 접두사는 주석으로 남겨 문서 추적을 유지한다.

### 5-3. 격리 검증

| 위험 | 차단 |
|---|---|
| `legacy-course-detail.css`의 `#sit_*`가 새 마크업에 걸린다 | 새 템플릿은 `#sit_*`/`.shop_*` id·class를 **쓰지 않는다**. 라우트에서 이 CSS import를 유지해도 선택자가 안 만난다 |
| 새 템플릿 CSS가 헤더·푸터로 샌다 | 모든 선택자가 `.ct-root` 하위 |
| Bootstrap 전역 리셋과 충돌 | `.ct-root` 안에서 필요한 값을 명시적으로 덮는다 |
| `main.css` 체크섬 깨짐 | `src/design-system/legacy/main.css`를 **건드리지 않는다** |

### 5-4. 파일 형식

기존 선례(`HeroCarousel.module.css`, `SiteFooter.module.css`)에 맞춰 **CSS Modules**를 쓴다.
단 테마 변수 정의(`theme.css`)와 공용 유틸(`course-template.css`)은 전역 선택자가 필요하므로
`.ct-root` 범위의 **일반 CSS**로 두고 템플릿 컴포넌트에서 import한다.

> 예시 HTML 마크업은 전체가 inline `style`이다. AGENTS.md §6.5(새 색상·간격 하드코딩 금지)를
> 지키려면 CSS로 옮겨야 한다. 분량이 가장 큰 작업이며 Gate 3 공정의 대부분이다 (`html-reference-map.md` §7).

## 6. URL · SEO 유지

| 항목 | 처리 |
|---|---|
| 라우트 | `/courses/[id]` **변경 없음** |
| `revalidate = 300` | 리터럴 그대로. env를 바꾸면 리터럴도 같이 바꾼다 (`page.tsx:30-33`) |
| `generateStaticParams()` | **빈 배열 반환 + 함수 유지.** 지우면 full route cache에서 빠진다 (`page.tsx:48-63`) |
| `generateMetadata` | **변경 없음** — title `<강좌명> > <분류명>`, canonical `/courses/<id>`, OG |
| `robots` | `enforceProxy` 조건 그대로 |
| `notFound()` / 인증 `redirect()` | 그대로 |
| `<h1>` | **결정 D2.** 권고: `<h1>` = 강좌명, 마케팅 헤드라인은 `<p>` |
| 신규 앵커 | `#curriculum` `#enroll` `#faq` `#method` `#cases`. 페이지 내부용이며 URL 구조에 영향 없음 |
| 기존 해시 | `#sit_use` `#sit_qa` **반드시 유지** — 외부에 이미 퍼진 링크일 수 있다. `BoardTabs`가 같은 id를 쓴다 |
| 구조화 데이터 | **추가하지 않는다** — 현재 없는 기능 (요청서 §9) |

## 7. 기존 Legacy HTML 보존·정규화 판단

요청서 Gate 2 작업 9번.

| 판단 | 결론 |
|---|---|
| 보존이 필요한가 | **필요하다.** `descriptionHtml`(`it_explan`)이 현재 강좌 설명의 본체다. 버리면 Critical 손실 (G-10) |
| 정규화(파싱해서 구조화 필드로 변환)가 필요한가 | **아니다.** HTML 구조가 강좌마다 다르고, CLAUDE.md가 "Legacy 실제 동작을 추측해서 Contract를 만들지 않는다"고 못박았다. 자동 파싱은 깨지기 쉽다 |
| 어떻게 보존하는가 | 07-E `LegacyContentBlock`에 `sanitizeLegacyHtml()` 통과분을 그대로 넣는다. 테마 컨테이너 안에서 타이포만 정돈한다 |
| 언제 끄는가 | 사람이 카피를 템플릿 필드로 옮긴 강좌만 `legacyContent: 'hidden'`으로 끈다 (강좌별, 되돌릴 수 있게) |

`sanitizeLegacyHtml`은 **현재 위치(서버)에서 그대로** 호출한다. 정책을 바꾸지 않는다.

## 8. ISR / 캐시 영향 분석

| 질문 | 답 |
|---|---|
| 템플릿 분기가 캐시 키에 영향을 주는가 | **아니다.** `category.id`는 `CourseFull`의 일부이고 이미 캐시 대상이다 |
| env 스위치를 켜고 끄면 | 배포 시 `revalidate` 주기 내 기존 캐시가 남는다. 즉시 반영이 필요하면 재배포 또는 주기 경과를 기다린다 → `rollout-and-rollback-plan.md` §4 |
| 콘텐츠 파일 변경이 반영되는가 | 정적 import이므로 **빌드 시 번들에 들어간다.** 배포해야 바뀐다 (A안의 단점, G-01) |
| viewer 상태가 섞일 위험 | 0. 템플릿 어디서도 viewer를 조회하지 않는다 |
| `generateStaticParams()` 빈 배열 | 그대로. 빌드 때 Bridge를 부르지 않는다 (`page.tsx:55-59`가 과거 배포 실패 원인을 기록) |

## 9. `page.tsx` 변경 범위 (전부)

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

**3줄.** `revalidate`·`generateStaticParams`·`generateMetadata`·`resolveId`·인증 `redirect`·
`Promise.all` 전부 그대로다. 요청서의 "최소 변경 원칙"을 라우트 수준에서 만족한다.
