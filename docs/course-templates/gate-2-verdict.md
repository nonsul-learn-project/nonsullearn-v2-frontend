# Gate 2 판정 — Integration Architecture

작성일: 2026-10-15

## 판정: **PASS (조건부)**

PASS 조건: "기존 기능을 불필요하게 재구현하지 않으면서 세 템플릿을 적용할 수 있는 구조가 확정되어야 한다."

### 구조 확정 여부

| 항목 | 결과 |
|---|---|
| 기존 컴포넌트 재사용 범위 | **확정** — 무변경 15개 / 최소 수정 2개 / **재구현 0개** |
| 유형별 템플릿 구조 | **확정** — 유형별 전용은 01·02-A·04 **3블록뿐**, 나머지 11블록은 공용 |
| Template Resolver | **확정** — `ca_id` 앞 2자리. 순수 함수, 입력 1개, ISR 안전 |
| 최소 변경 어댑터 | **확정** — `buildTemplateProps()` 순수 함수. **Contract 변경 0, 신규 API 0** |
| 디자인 토큰·CSS 격리 | **확정** — `.ct-root[data-course-theme]` 범위 + `--ct-*` 공용 변수명 |
| URL·SEO 유지 | **확정** — 라우트·메타데이터 무변경. `page.tsx` **변경 3줄** |
| 활성화·롤백 | **확정** — AND 2단 스위치. 기존 `CourseDetail`을 수정하지 않아 "되돌리기"가 불필요 |
| Legacy HTML 보존 판단 | **확정** — 보존하고 정규화하지 않는다. 07-E 블록. 강좌별로 끌 수 있다 |
| Gate 3~7 순서·테스트 계획 | **확정** — `rollout-and-rollback-plan.md` §3·§5 |

### 왜 "조건부"인가

구조는 결정의 **답에 의존하지 않도록** 설계했다 — 콘텐츠 출처는 provider 인터페이스 뒤에 있고,
`<h1>` 선택은 히어로 컴포넌트 한 곳의 문제다. 그래서 아키텍처 자체는 PASS다.

그러나 **D1~D3은 사람이 답해야 하고, 답에 따라 Gate 3에서 쓰는 코드가 달라진다.**
구조가 바뀌지는 않지만 구현물이 달라지므로, **결정 없이 Gate 3에 들어가지 않는다.**

## 1. 확정된 아키텍처 (요약)

```
page.tsx  ──[3줄 변경]──▶ CourseDetailRouter
                              │
                              │ resolveCourseTemplate(category.id)   ca_id 앞 2자리
                              │ getCourseTemplateContent(it_id)      V2 콘텐츠 파일
                              │ courseTemplatesEnabled               env kill switch
                              │
                              ├─ 'humanities' ─┐
                              ├─ 'math' ───────┤  .ct-root[data-course-theme]
                              ├─ 'short-answer'┘  유형별 01·02-A·04 + 공용 11블록 + 신규 2블록
                              │
                              └─ 'legacy' ─────── CourseDetail.tsx  [무변경]
```

공통 기반: `useCourseOrder()`(추출), `CourseOptionPicker`·`CourseInfoTabs`·`CourseReviewList`·
`CourseQuestionList`·`siblings.ts`·`format.ts`·`sanitize-legacy-html.ts`·`legacyRoutes`·
`assets.ts`·`track()` **전부 무변경 재사용**.

## 2. 사람이 결정해야 하는 것

### D1 · 템플릿 카피 ~20항목의 저장 위치 — **Critical**

`copy.md §7`이 요구하는 강좌별 필드 중 Bridge가 주는 것은 8개뿐이다 (G-01).
`lessons[]`(커리큘럼)과 `instructor`가 특히 비어 있다.

| 선택지 | 내용 |
|---|---|
| **A (권고)** | `src/content/` 선례대로 V2 콘텐츠 파일. PHP·Bridge 변경 0, 즉시 시작 가능. 신규 강좌마다 코드 배포 필요 |
| B | Bridge 확장(`course-template.v1` 신규 endpoint). 운영팀이 직접 수정 가능. PHP 작업 + AGENTS.md §7.1 전체 절차 |
| C | `descriptionHtml` 파싱 — **권고하지 않음.** 강좌마다 구조가 달라 깨진다 |
| D (권고) | **A로 시작하고, 전체 강좌 확대 시점에 B 이관을 재검토** |

권고: **D (A 먼저)**. 근거는 `gap-analysis.md` G-01.

### D2 · 히어로 `<h1>`의 주체 — **Critical (SEO)**

design.md는 마케팅 헤드라인을 `H1`으로 지정한다. 그러면 인문논술 강좌 전체의 `<h1>`이
`읽는 데서 멈추지 말고, 정확한 답안으로 써보세요.`로 같아진다. 현재는 강좌명이다.

| 선택지 | 결과 |
|---|---|
| **1 (권고)** | `<h1>` = 강좌명(히어로 CTA 옆 정보 블록에 이미 자리가 있다), 헤드라인은 `<p class="hero-headline">`. **화면 출력 동일**, SEO·접근성 현상 유지 |
| 2 | `<h1>`에 헤드라인 + 강좌명 동시 포함 → 헤드라인 디자인이 깨진다 |
| 3 | design.md 그대로 → SEO 회귀 수용 |

권고: **1번.** design.md "H1 히어로" 표기에서 벗어나므로 승인이 필요하다.

### D3 · 기존 Legacy HTML 3종 + 상품 이미지 — **Critical**

`headHtml` / `descriptionHtml` / `tailHtml`에 현재 강좌 설명의 본체가 들어 있고,
`images[]`(상품 이미지 + `largeimage.php` 팝업)도 세 템플릿에 자리가 없다 (G-02, G-10).

| 선택지 | 내용 |
|---|---|
| **3 (권고)** | 07-E `LegacyContentBlock` 신설 — 기존 HTML + 상품 이미지를 테마 컨테이너 안에 보존. 카피 작업이 끝난 강좌만 `legacyContent: 'hidden'`으로 끈다 |
| 1 | 항상 보존 (끄지 않는다) |
| 2 | 카피를 옮긴 강좌만 전환, HTML은 쓰지 않는다 |
| 4 | 제거 — **Critical 콘텐츠 손실.** 권고하지 않음 |

권고: **3번.** 전환 초기 정보 손실 0, 이후 점진적 정돈.
`images[]`의 실제 내용(썸네일인지 상세 이미지 여러 장인지)은 Bridge 실응답 확인이 필요하다.

### D4 · 하네스 Gate 순서 — **승인 완료**

이 작업은 하네스 **Gate 8**이고 `docs/harness/GATES.md:37` 기준 `NOT STARTED`다.
하네스 **Gate 6(홈 컷오버)과 7도 `NOT STARTED`**이며,
`AGENTS.md §9`는 **"Gate 6 이전 리디자인 또는 클래스명 변경"을 금지 사항**으로 명시한다.

| 선택지 | 내용 |
|---|---|
| 1 | Gate 6 컷오버를 먼저 끝낸다 (문서 순서 준수) |
| 2 | 병행한다 — `COURSE_TEMPLATES=off` 기본값이 있으므로 Gate 6에 영향이 없다. AGENTS.md §9의 예외를 ADR로 기록 |

2026-10-16: 사용자가 2안을 명시 승인했다. 범위와 유지되는 제한은 `adr-0001-gate-4-template-exception.md`에 기록한다.
| 3 | AGENTS.md §9 문구를 고쳐 강좌 상세를 제외한다 |

권고: **2번.** kill switch 기본값이 `off`라 홈 컷오버 경로와 독립적이다.
단 **AGENTS.md §9 위반을 묵시적으로 넘기지 않고 ADR로 남겨야 한다** →
`docs/decisions/0010-course-detail-template-redesign.md`.

## 3. Gate 3 예상 변경 파일

### 수정 (2개)

| 파일 | 변경 |
|---|---|
| `src/app/courses/[id]/page.tsx` | **3줄** — import 1, 컴포넌트명 1곳 |
| `src/features/course-detail/CourseOrderForm.tsx` | 로직 → `useCourseOrder()` 이동. **마크업·전송 필드·스타일 동일** |

### 신규 (37개)

| 그룹 | 파일 |
|---|---|
핵심 | `useCourseOrder.ts`, `CourseDetailRouter.tsx`, `templates/resolveCourseTemplate.ts`, `templates/types.ts` |
콘텐츠 | `content/types.ts`, `content/defaults.ts`, `content/provider.ts`, `content/instructors/types.ts` |
공용 (15) | `shared/course-template.css`, `CourseStickyBar`, `BeforeAfterRows`, `ProofSection`, `CertificateMarquee`, `InstructorProfile`, `CurriculumList`, `SessionPlan`, `FeedbackFlow`, `RecommendList`, `BeforeEnrollInfo`, `BoardTabs`, `EnrollPanel`, `FaqAccordion`, `LegacyContentBlock`, `CourseSiblingsNav` |
인문 | `humanities/{HumanitiesTemplate,HumanitiesHero,HumanitiesProblem,HumanitiesMethod}.tsx`, `theme.css` |
수리 | `math/{MathTemplate,MathHero,MathProblem,MathMethod}.tsx`, `theme.css` |
약술 | `short-answer/{ShortAnswerTemplate,ShortHero,ShortProblem,ShortMethod}.tsx`, `theme.css` |

### 하네스·설정 (6개)

| 파일 | 변경 |
|---|---|
| `src/env.server.ts` | `COURSE_TEMPLATES: z.enum(['on','off']).default('off')` + `courseTemplatesEnabled` |
| `.env.example` | 항목 추가 |
| `docs/harness/HARNESS.md` | 환경별 값 표 갱신 (AGENTS.md §10) |
| `tests/contract/env.test.ts` | 케이스 추가 |
| `tests/component/course-detail.test.tsx` | **전송 필드 스냅샷 테스트 추가** (legacy/신규 양쪽) |
| `tests/e2e/mobile.spec.ts` | 뷰포트에 **320px 추가** |

### fixture (2개 추가)

`contracts/bridge/fixtures/course-full.math.json` (`category.id` `30xxxx`),
`course-full.short-answer.json` (`40xxxx`) + `adapters/course-detail/mock.ts`에 id 등록.
**Contract·JSON Schema는 변경하지 않는다.**

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

## 4. Gate 3 진입 가능 여부

### **조건부 가능** — D1·D2·D3 답변 후 진입

| 선행 조건 | 상태 |
|---|---|
| D1 콘텐츠 출처 결정 | **대기** |
| D2 `<h1>` 결정 | **대기** |
| D3 Legacy HTML·이미지 처리 결정 | **대기** |
| D4 Gate 순서 결정 | **대기** (병행 권고) |
| env 추가 계획 승인 (CLAUDE.md "작업 시작 전") | 이 문서가 계획. **승인 대기** |

### 결정 없이 지금 시작할 수 있는 작업

다음 3개는 **D1~D4 어느 답에도 영향받지 않는다.** 승인하면 즉시 착수 가능하다.

| 작업 | 이유 |
|---|---|
| **3-0 `useCourseOrder()` 추출** | 동작 변화 0. 기존 테스트가 그대로 통과해야 하는 순수 리팩터링. 어느 결정과도 무관하며 Gate 3 최대 위험(결제 회귀)을 먼저 차단한다 |
| `shared/course-template.css` 토큰화 | 예시 HTML의 공용 CSS를 `--ct-*`로 옮기는 기계적 작업 |
| `resolveCourseTemplate.ts` + L1 테스트 | 입력이 `ca_id` 하나. 분기 4종 테스트 |

→ **권고: 3-0을 먼저 단독 커밋으로 처리하고, 그 사이 D1~D4를 결정한다.**

## 5. 남은 사람 작업 (Gate 4 전)

| # | 항목 | 왜 필요한가 |
|---|---|---|
| 1 | 운영 39개 강좌의 `ca_id` 분포 확인 | 대표 강좌 3종 선정, G-07(`20` 대역) 해소 |
| 2 | `item.images[]`의 실제 내용 확인 | D3 확정 |
| 3 | 브랜드 수치(4,005명·15만 부·98%) 기준일·산정 방식 | 03 블록을 켤 수 있는지. 미확인이면 off 유지 |
| 4 | 합격증 34장 사용 동의·개인정보 가림·서버 자산 경로 | 03 합격 사례를 켤 수 있는지 |
| 5 | 강사별 검증된 이력 | 04 강사 영역. 없으면 숨김 |
| 6 | `/courses/[id]`가 메인 도메인에서 서빙되는지 | `pnpm smoke:prod` 또는 Apache 확인 |
| 7 | Vercel에 `COURSE_TEMPLATES` 등록 | Gate 6 스테이징 |

1·2는 Gate 4를 막는다. 3·4·5는 해당 블록만 막고(off로 진행 가능) 전체를 막지 않는다.
