# Gate 1 — Gap Analysis

작성일: 2026-10-15
심각도: **Critical** 결정 없이 Gate 3 진입 불가 / **Major** Gate 3는 가능, Gate 4 전 해소 / **Minor** 구현 중 판단

## G-01 · Critical — 템플릿 카피 20항목에 데이터 출처가 없다

### 사실
`copy.md §7`이 정의한 강좌별 필드 중 Bridge(`course-full.v1`)가 주는 것은 다음뿐이다.

| 채워지는 것 (8) | 출처 |
|---|---|
| `title` | `item.name` |
| `listPrice` / `salePrice` | `item.listPrice` / `item.price` |
| `period` | `item.extra[2]` |
| `applyPeriod` | `item.extra[3]` |
| `capacity` | `item.extra[4]` |
| `n` (강의수) | `item.extra[5]` |
| `target` | `information.product_name` (수강대상) |
| `methodLine` (부분) | `information.model_name` (내용 및 특징) |
| `summary` (부분) | `item.basic` |

**출처가 전혀 없는 20항목**:
`badge` · `keywords` · `curriculumLink`(기본값 가능) · `ctaLabel`(기본값 가능) · `promise`(기본값 가능) ·
`steps[].desc` × 3 · `instructor`(이름·소개·이력3·사진·맛보기) · `curriculumTitle`(기본값 가능) ·
**`lessons[]`(회차 라벨·제목·설명·쓰는 답안·점검 기준·시간)** · `sessionTitle`/`session[]`/`sessionDesc` ·
`feedback`(횟수·업로드/확인 시간·예외) · `recommend[]` × 4 · `infoCards[]` · `notices[]` ·
`closing` · `refundNote` · `faq[]` 답변 5~6 · `certificates[]` · `stats[]`(검증 수치) · `proof[]`

이 중 **`lessons[]`(커리큘럼)과 `instructor`가 가장 치명적**이다. 05 블록과 04 블록은
`wireframe.md §1`에서 **"항상" 노출**로 지정되어 있는데 채울 데이터가 없다.

### 선택지

| 안 | 방법 | 장점 | 단점 |
|---|---|---|---|
| **A** | V2 콘텐츠 파일 — `src/content/courses/<it_id>.ts` (타입 있는 데이터) | Bridge·PHP 변경 0. 기존 `src/content/` 선례와 동일. 즉시 시작 가능 | 강좌가 늘면 사람이 파일을 쓴다. 운영팀이 코드 배포 없이 못 고친다 |
| **B** | Bridge 확장 — `course-template.v1` 새 endpoint | 운영팀이 DB/관리자에서 수정 | PHP 작업 + Contract 추가 + 저장 위치 설계. AGENTS.md §7.1 전체 절차. 가장 느리다 |
| **C** | `it_explan`(descriptionHtml) 파싱 | 추가 저장소 0 | **권장하지 않음.** HTML 구조가 강좌마다 다르고 깨지기 쉽다. "추측으로 Contract 만들지 않는다"(CLAUDE.md)에 반함 |
| **D** | A로 시작 → 강좌 수가 임계치를 넘으면 B로 이관 | 즉시 시작 + 이관 경로 확보 | 두 번 작업 |

### 권고
**D (A 먼저).** 근거:
1. 요청서 §12 "신규 API나 DB를 불필요하게 만들지 않는다"
2. 템플릿 Gate 7이 "대표 강좌 3개 → 10개 → 전체"로 단계 확대하므로 초기 모수가 작다
3. `src/content/home.ts`(272행), `static-pages.ts`(233행)가 이미 같은 패턴의 선례다
4. 콘텐츠 제공자를 인터페이스(`getCourseTemplateContent(id)`)로 두면 B 이관 시 호출부가 바뀌지 않는다

→ **결정 D1** (`gate-2-verdict.md`)

---

## G-02 · Critical — 상품 이미지 갤러리가 세 템플릿 모두에 없다

### 사실
현재 페이지는 `item.images[]`를 `#sit_pvi_big`에 전부 그리고, 각 이미지가
`legacyRoutes.courseLargeImage(id, no)` → Legacy `largeimage.php` 새 창으로 열린다.
이미지가 0장이면 `no_image.gif`를 그린다.

세 템플릿의 이미지 영역은 **강사 사진(4:5, 조건부)과 합격증 34장뿐**이다.
상품/강좌 이미지 자리가 설계되어 있지 않다.

운영 강좌의 `images[]`에 실제로 무엇이 들어 있는지(썸네일? 상세 이미지 여러 장?)는
Bridge 실응답 확인이 필요하다 → `gate-0-verdict.md` §4-C.

### 선택지
1. 01 히어로 우측 여백에 넣는다 — 수리는 `hero-space`(flex 5) 빈 칸이 이미 있고, 인문은 광원 영역이라 충돌
2. 07-E `LegacyContentBlock`(G-03과 함께 신설) 안에 갤러리로 넣는다
3. 02 블록 앞에 전용 갤러리 블록을 신설한다 (세 디자인 문서에 없는 블록 추가)
4. 제거한다 — **콘텐츠 손실.** `images[]`가 비어 있지 않은 강좌에서는 정보가 사라진다

### 권고
**2번.** 기존 Legacy 콘텐츠(`headHtml`/`descriptionHtml`/`tailHtml`)를 담는 블록과 같은 자리에
상품 이미지를 두면 신설 블록이 1개로 끝나고, 디자인 문서의 00~07 리듬을 깨지 않는다.
`largeimage.php` 팝업 링크는 그대로 유지한다.
단 `images[]`의 실제 내용 확인 후 확정 → **결정 D3에 포함**

---

## G-03 · Major — SNS 공유 버튼의 자리가 없다

현재 별점 옆 `#sit_btn_opt`에 facebook/twitter 토글이 있다. 세 템플릿에는 공유 UI가 없다.

**권고**: 07-B 탭 영역 헤더 우측 또는 07-C 패널 하단에 `LineButton` 한 개로 축소 배치.
절대 URL이 필요하므로 `legacyRoutes.courseDetailLegacy(id)`를 계속 쓴다.
공유 자체는 기존 기능이므로 제거하면 기능 회귀다. 위치만 재배치한다.

---

## G-04 · Major — 이전/다음/목록 강좌 내비게이션의 자리가 없다

`findCourseSiblings()`는 Legacy SQL 두 개를 정확히 재현한 로직이고(레이블 반전 포함),
`getCourses()` 실패 시에도 페이지가 살아남도록 설계되어 있다.

세 템플릿에는 해당 영역이 없다.

**권고**: 07-D FAQ 다음, 푸터 직전에 1px 구분선 행으로 배치. 템플릿 리듬을 해치지 않는다.
`siblings.ts`는 **수정하지 않는다.**

---

## G-05 · Minor — 정가 취소선 표시 조건이 다르다

| | 조건 |
|---|---|
| 현재 | `!priceOnInquiry`면 `listPrice`를 **항상** 표시 (값이 0이어도). `course-full.ts:88` 주석이 Legacy 동작임을 명시 |
| 템플릿 | `copy.md §5` — "정가 없음 또는 판매가와 같음 → 취소선 숨김" |

**권고**: 템플릿 규칙 채택 (`listPrice > price`일 때만 표시). 현재 동작은 `listPrice=0`인 강좌에
`0원` 취소선을 보여주는 표시 오류다. 가격 **값**은 바꾸지 않고 표시 조건만 바꾸므로
"운영 중인 강좌 가격 임의 변경"(요청서 §12)에 해당하지 않는다. 다만 Gate 5 회귀 목록에 기록한다.

---

## G-06 · Minor — `saleState`의 4개 값 중 3개만 매핑된다

| `saleState` | 데이터 조건 | 버튼 |
|---|---|---|
| `available` | `isCourseOrderable(item) === true` | 활성, `{ctaLabel}` |
| `sold_out` | `isCourseSoldOut(item) === true` | 비활성 `신청 마감` + "현재 신청할 수 없는 강좌입니다." |
| `unknown` | `item.priceOnInquiry === true` | 비활성 `운영 데이터 확인 필요` |
| `coming_soon` | **매핑 없음** | 사용하지 않는다 |

`coming_soon`에 대응하는 Legacy 필드가 없다. copy.md §6도 "확인되지 않은 일정 생성 금지"라고 적었다.
**→ Resolver가 이 값을 반환하지 않도록 타입에서 제외한다.**

`unknown`의 copy.md 문구가 "가격·판매 상태가 확인되기 전에는 신청 버튼을 활성화하지 않습니다"인데,
전화문의 강좌는 "가격 미확인"이 아니라 "전화로 문의"다. **전화문의 전용 문구가 필요하다** →
현재 문구 `전화문의`를 유지하는 쪽을 권고한다 (기존 표현 보존).

---

## G-07 · Major — `ca_id` `20` 대역의 정체가 불명확하다

`src/content/static-pages.ts:162`에 계열이 `['인문논술','상경논술','수리논술','약술형']`로 적혀 있는데
`상경논술`에 해당하는 `ca_id`가 어디에도 없다. 헤더·푸터 내비게이션에도 없다
(`site.ts`는 `10`/`30`/`40`만).

`docs/discovery/legacy-url-map.md`의 강사별 `ca_id` 표에도 `20`이 없다.

**영향**: Resolver가 `10`/`30`/`40`만 알면 `20`(혹은 다른 대역) 강좌는 템플릿이 없다.
**이것 자체는 막는 요인이 아니다** — Resolver의 기본값을 기존 Legacy 템플릿으로 두면
매핑되지 않은 분류는 지금 화면을 그대로 쓴다 (안전한 fallback).

**필요 작업**: 운영 39개 강좌의 `ca_id` 분포 확인 (사람). → `gate-0-verdict.md` §4-B, §4-C

---

## G-08 · Major — 강사 정보가 Bridge에 아예 없다

`course.v1` 변경 이력(`contracts/course.ts:9`)에 명시되어 있다: `teacherName 삭제 (Bridge가 주지 않는다)`.

한편 `ca_id`는 강사별로 갈린다(`1010` 김윤환, `3020` 김태훈 …). 즉 **`ca_id` 앞 4자리로
강사를 식별할 수 있다.** 강사 소개 데이터는 이미 V2에 일부 있다
(`src/legacy/adapters/public-pages/index.ts:9` `'인문논술 - 김윤환'`, `/teachers` 페이지).

**권고**: 강사 정보를 강좌별(`it_id`) 콘텐츠가 아니라 **강사별(`ca_id` 4자리) 콘텐츠**로 둔다.
13개 강좌가 같은 강사를 공유하면 1곳만 쓰면 된다. 결정 D1(A안)에 포함한다.
단 **검증되지 않은 이력을 생성하지 않는다** — 확인된 것만 넣고, 없으면 04 강사 영역을 숨긴다.

---

## G-09 · Critical — 히어로 `<h1>`이 유형별로 전부 같아진다 (SEO)

세 design.md는 히어로 마케팅 헤드라인을 `H1`으로 지정한다.
그러면 인문논술 13개 강좌의 `<h1>`이 모두
`읽는 데서 멈추지 말고, 정확한 답안으로 써보세요.`가 된다.

현재는 `<h1>` = `item.name` (강좌마다 고유)다. **명확한 SEO 회귀**다.
`generateMetadata`의 `<title>`은 강좌명을 유지하므로 title과 h1이 어긋나기도 한다.

### 선택지
1. `<h1>` = 강좌명, 마케팅 헤드라인은 `<p>`로 크게 — **시각 결과 동일**, 의미·SEO 보존
2. `<h1>` = 헤드라인 + 강좌명을 함께 포함 — 헤드라인 디자인이 깨진다
3. design.md 그대로 — SEO 회귀 수용

### 권고
**1번.** 와이어프레임에 이미 히어로 CTA 옆 `강좌명 / 추천 대상` 정보 블록이 있다.
그 강좌명을 `<h1>`으로 승격하고, 대형 헤드라인은 `<p class="hero-headline">`으로 둔다.
화면 출력은 design.md와 동일하고 접근성·SEO는 지금 수준을 유지한다.
design.md의 "H1 히어로" 표기에서 벗어나므로 **승인 필요** → **결정 D2**

---

## G-10 · Minor — 기존 Legacy HTML 3종의 처리

| 필드 | 현재 | 특징 |
|---|---|---|
| `item.headHtml` | `<div id="sit_hhtml">`, **값이 비어도 빈 div** | 운영 응답에서 빈 값 확인됨 |
| `item.descriptionHtml` | 탭 `상세 강의 소개` | **기존 강좌 설명의 본체.** 분량이 가장 크다 |
| `item.tailHtml` | wrapper 없이, 비어있지 않을 때만 | |

전부 `sanitizeLegacyHtml()`(server-only)을 거친다.

새 템플릿은 구조화된 블록으로 같은 정보를 대체하려 하지만, **강좌별 실제 내용이
이 HTML에만 있을 가능성이 높다.** 버리면 Critical 콘텐츠 손실이다.

### 선택지
1. 07-E `LegacyContentBlock` 신설 — 템플릿 스타일 컨테이너 안에 기존 HTML을 그대로 둔다. (G-02 이미지도 같이)
2. 유형별 템플릿 적용 강좌는 HTML을 쓰지 않는다 — 콘텐츠를 사람이 템플릿 필드로 옮긴 강좌만 전환
3. 둘 다 — 1을 기본으로 두고, 2가 완료된 강좌는 `legacyContent: 'hidden'`으로 끈다

### 권고
**3번.** 전환 초기엔 정보를 하나도 잃지 않고, 카피 작업이 끝난 강좌만 깔끔한 템플릿으로 간다.
→ **결정 D3**

---

## 11. 누락 목록 요약

| ID | 심각도 | 내용 | Gate 3 진입을 막는가 |
|---|---|---|:--:|
| G-01 | Critical | 카피 20항목 데이터 출처 없음 | **예** → D1 |
| G-02 | Critical | 상품 이미지 갤러리 자리 없음 | **예** → D3 |
| G-09 | Critical | 히어로 `<h1>` SEO 회귀 | **예** → D2 |
| G-10 | Critical | 기존 Legacy HTML 3종 처리 | **예** → D3 |
| G-03 | Major | SNS 공유 자리 없음 | 아니오 (권고안으로 진행) |
| G-04 | Major | 이전/다음/목록 자리 없음 | 아니오 (권고안으로 진행) |
| G-07 | Major | `ca_id` 20 대역 불명 | 아니오 (Legacy fallback으로 흡수) |
| G-08 | Major | 강사 데이터 없음 | 아니오 (블록 숨김) |
| G-05 | Minor | 정가 취소선 조건 차이 | 아니오 |
| G-06 | Minor | `coming_soon` 미매핑 | 아니오 |

**Critical 4건은 전부 "설계 결정"이며 "해소 불가능한 누락"이 아니다.**
각각에 권고안이 있고, 권고안대로 가면 기존 정보·기능의 손실이 0이다.
