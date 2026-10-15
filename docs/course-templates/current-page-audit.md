# Gate 0 — 기존 Next.js 강좌 상세페이지 감사

작성일: 2026-10-15
대상: `/courses/[id]` (Legacy `shop/item.php?it_id=<id>` 와 같은 화면)

## 1. 렌더 트리

```
app/courses/[id]/page.tsx                      Server, ISR revalidate=300
│  ├─ courseIdSchema.safeParse(id)             실패 → notFound() (Bridge 때리지 않음)
│  ├─ getCourseDetail(id)                      null → notFound(), 실패 → throw (ADR 0007)
│  ├─ requiresLegacyCertification(category)    true → redirect(Legacy shop/item.php)
│  └─ Promise.all[ getCourseReviewsState, getCourseQuestionsState, getCourses().catch(()=>[]) ]
│
└─ SiteShell                                   공통 헤더 + 푸터
   └─ CourseDetail                             Server — sanitizeLegacyHtml() 3곳 + 후기/문의 본문
      ├─ <div id="sit_hhtml">                  item.headHtml — 값이 비어도 빈 div를 낸다
      ├─ <div id="sit">
      │  ├─ <section class="shop_hero_section">  히어로
      │  │   ├─ .hero_sub_title  "논술런"         ← 하드코딩. Eyebrow에 해당 (§4 참고)
      │  │   ├─ <h1 class="hero_title">          item.name
      │  │   └─ .hero_desc                       item.basic
      │  ├─ CourseOrderForm                      Client — 폼·가격·옵션·형제강좌
      │  │   ├─ #sit_pvi_big                     item.images[] → largeimage.php 팝업
      │  │   ├─ #sit_star_sns                    별점 + 후기 건수 + SNS 공유
      │  │   ├─ .sit_info > table.sit_ov_tbl     가격 / extra[3,2,4,5]
      │  │   ├─ CourseOptionPicker               선택옵션 select (type 0)
      │  │   ├─ CourseSupplyPicker               추가옵션 select (type 1)
      │  │   ├─ #sit_sel_option                  선택된 옵션 행 + 수량 ± + 삭제
      │  │   ├─ #sit_ov_soldout                  품절 안내
      │  │   ├─ #sit_ov_btn > .sit_btn_buy        "수강 신청하기" (submit)
      │  │   └─ .sit_siblings                    이전 / 목록보기 / 다음
      │  └─ CourseInfoTabs                       Client — 탭 4개
      │      ├─ #sit_inf    강의 정보             information 표 + descriptionHtml
      │      ├─ #sit_use    강의후기             CourseReviewList
      │      ├─ #sit_qa     강의문의             CourseQuestionList
      │      └─ #btn_sit_dex 공지사항            location.href = legacyRoutes.notice()
      └─ tailHtml                               wrapper 없이, 비어 있지 않을 때만
```

## 2. 렌더되는 모든 정보 — 전수 조사

| # | 화면 요소 | 데이터 출처 | 코드 위치 | 조건 |
|---:|---|---|---|---|
| 1 | 상단 HTML 블록 | `item.headHtml` | `CourseDetail.tsx:46` | 항상 (빈 div라도) |
| 2 | 히어로 소제목 `논술런` | 하드코딩 | `CourseDetail.tsx:53` | 항상 |
| 3 | 히어로 `<h1>` | `item.name` | `CourseDetail.tsx:54` | 항상 |
| 4 | 히어로 설명 | `item.basic` | `CourseDetail.tsx:55` | 항상 |
| 5 | 상품 이미지 갤러리 + 원본 팝업 링크 | `item.images[]` → `legacyRoutes.courseLargeImage(id, no)` | `CourseOrderForm.tsx:269-300` | 이미지 있을 때 |
| 6 | `no_image.gif` 대체 | 상수 | `CourseOrderForm.tsx:264-268` | 이미지 0장일 때 |
| 7 | 별점 이미지 `s_star{n}.png` | `courseStarScore(reviewSummary)` | `CourseOrderForm.tsx:320-333` | `starScore > 0` |
| 8 | `강의후기 (N건)` | `reviewSummary.count` | `CourseOrderForm.tsx:334-336` | 항상 |
| 9 | SNS 공유 (facebook / twitter) | `legacyRoutes.courseDetailLegacy(id)` | `CourseOrderForm.tsx:374-396` | 항상 (토글) |
| 10 | `판매가격 / 전화문의` 행 | `item.priceOnInquiry` | `CourseOrderForm.tsx:413-418` | `priceOnInquiry` |
| 11 | `수강료` 정가(취소선) + 판매가 | `item.listPrice`, `item.price` | `CourseOrderForm.tsx:419-428` | `!priceOnInquiry` |
| 12 | hidden `#it_price` | `item.price` | `CourseOrderForm.tsx:424` | `!priceOnInquiry` |
| 13 | `신청기간` | `item.extra[3]` | `CourseOrderForm.tsx:430-435` | 값이 빈 문자열이 아닐 때 |
| 14 | `수강기간` — `수강 시작 후 N일` | `item.extra[2]` | `CourseOrderForm.tsx:436-441` | 동일 |
| 15 | `모집인원` — `N명` | `item.extra[4]` | `CourseOrderForm.tsx:442-447` | 동일 |
| 16 | `강의수` — `N강` | `item.extra[5]` | `CourseOrderForm.tsx:448-453` | 동일 |
| 17 | 선택옵션 select | `options.subjects`, `options.items(type 0)` | `CourseOrderForm.tsx:462-473` | `orderable && subjects.length > 0` |
| 18 | 추가옵션 select | `options.supplySubjects`, `options.items(type 1)` | `CourseOrderForm.tsx:475-486` | `orderable && supplySubjects.length > 0` |
| 19 | 선택된 옵션 행 (`io_type`/`io_id`/`io_value`/`ct_qty` + 수량 ± + 금액 + 삭제) | `selected` state | `CourseOrderForm.tsx:493-543` | `orderable && 선택옵션 있음 && 1개 이상 선택` |
| 20 | 옵션 없는 강좌용 사전 입력 행 (`io_id=""`, `io_value=강좌명`, `ct_qty=buyMinQty`) | `item.name`, `item.buyMinQty` | `CourseOrderForm.tsx:549-566` | `orderable && 선택옵션 없음` |
| 21 | 품절 안내문 `#sit_ov_soldout` | `isCourseSoldOut(item)` | `CourseOrderForm.tsx:570-574` | `soldOut` |
| 22 | `수강 신청하기` submit 버튼 | `isCourseOrderable(item)` | `CourseOrderForm.tsx:577-586` | `orderable` |
| 23 | 이전 강의 / 목록보기 / 다음 강의 | `findCourseSiblings()`, `item.category.id` | `CourseOrderForm.tsx:600-640` | 항상 (없으면 비활성 문구) |
| 24 | 탭 버튼 4개 | 상수 | `CourseInfoTabs.tsx:84-111` | 항상 |
| 25 | `강의 정보 고시` 표 (수강대상 / 내용 및 특징) | `information.product_name`, `information.model_name` | `CourseInfoTabs.tsx:120-134` | 해당 키가 `undefined`가 아닐 때 |
| 26 | `상세 강의 소개` | `item.descriptionHtml` | `CourseInfoTabs.tsx:136-149` | 빈 문자열이 아닐 때 |
| 27 | 강의후기 목록 (별점·작성자·제목·본문·날짜·관리자 답변) | `CourseReviewsState` | `CourseReviewList.tsx` | 4상태 전부 처리 |
| 28 | `강의후기 쓰기` (새 창) / `강의후기 더 보기 (N건)` | `legacyRoutes.courseReviewForm/courseReviews` | `CourseReviewList.tsx:50,202` | 쓰기 항상 / 더보기 `hasMore` |
| 29 | 강의문의 목록 (작성자·제목·질문·답변·답변여부·날짜) | `CourseQuestionsState` | `CourseQuestionList.tsx` | 4상태 전부 처리 |
| 30 | `강의문의 쓰기` / `강의문의 더 보기 (N건)` | `legacyRoutes.courseQuestionForm/courseQuestions` | `CourseQuestionList.tsx:49,217` | 동일 |
| 31 | 하단 HTML 블록 | `item.tailHtml` | `CourseDetail.tsx:71` | 비어 있지 않을 때만 |

### 렌더되지 않는 Contract 필드

| 필드 | 이유 |
|---|---|
| `item.extra[1]` | Legacy `item.form.skin.php`도 `it_1`을 쓰지 않는다 (`course-full.ts:64-69` 주석) |
| `item.category.name` | 본문에는 없다. `generateMetadata`의 title에만 쓴다 |
| `reviewSummary.averageScore` | 직접 노출하지 않고 `courseStarScore()`로 별 이미지 번호(0~5)로만 변환 |
| `재입고알림` 버튼 | Bridge가 `it_stock_sms`를 주지 않아 조건을 완성할 수 없다 → 의도적 미구현 (`CourseOrderForm.tsx:587-595` TBD) |
| `지인에게 추천하기` | 회원 전용 쓰기 기능 → AGENTS.md §2 원칙 3에 따라 미구현 (`CourseOrderForm.tsx:398-404` TBD) |

## 3. 기능 동작 (Legacy 재현 로직)

| 기능 | Legacy 원본 | V2 구현 | 비고 |
|---|---|---|---|
| 선택옵션 단계별 select + 하위 초기화 | `shop.js:105-116` | `onPickSelection()` | 하위 단계 값 비우기 포함 |
| 선택옵션 커밋 (`io_id` = `parts.join(chr(30))`) | `shop.js:280-330` | `commitSelection()` | 재고 부족 / 음수 금액 거부 alert 포함 |
| 중복 옵션 거부 | `same_option_check()` `shop.js:441-456` | `alreadyAdded()` | `io_value` 동일성 기준, alert 문구 동일 |
| 추가옵션 (`io_id` = `주제+chr(30)+값`) | `shop.override.js:3-44` | `onPickSupply()` | **운영 39개 강좌 전부 `supplySubjects`가 비어 실물 미검증** (TBD) |
| 수량 ± / 직접 입력 (최소 1) | `shop.js` | `changeQty()`, `setQty()` | |
| 옵션 삭제 | `shop.override.js` | `removeOption()` | |
| 제출 검사 3단계 | `fitem_submit()` `item.form.skin.php:280-301` | `onSubmit()` | ① 전화문의 → alert ② 옵션 미선택 → alert ③ `begin_checkout` track |
| 품절 / 주문가능 판단 | `is_soldout()`, `$is_orderable` | `isCourseSoldOut()`, `isCourseOrderable()` | `contracts/course-full.ts:192-210` |
| 이전/다음 강좌 | `item.php:139-163` SQL | `findCourseSiblings()` | **레이블이 거꾸로인 것이 Legacy 의도** — "이전"은 `it_id`가 큰 쪽 |
| 탭 전환 | jQuery `show/hide` | `useState` + inline `display` | `class="selected"` 유지 |
| 해시 딥링크 (`#sit_use`) | `item.info.skin.php:226-229` | `useSyncExternalStore(hashchange)` | 서버 HTML은 항상 첫 탭 |
| 공지사항 탭 | `onclick location.href` | `window.location.href = legacyRoutes.notice()` | 탭이 아니라 **이동 버튼** |
| SNS 공유 | `get_sns_share_link()` | 토글 + facebook/twitter 링크 2개 | 절대 URL 필요 → `courseDetailLegacy()` |
| 본인/성인 인증 강좌 | `shop_member_cert_check()` | 서버 `redirect()` → Legacy | 세션을 볼 수 없으므로 판단 자체를 위임 |

## 4. Eyebrow 위반 — 현재 1건

`CourseDetail.tsx:53`

```tsx
<span className="hero_sub_title">논술런</span>
<h1 className="hero_title">{item.name}</h1>
```

`<h1>` 바로 위의 장식용 한글 소형 라벨이며, 요청서 §3이 금지한 Eyebrow에 정확히 해당한다.
세 템플릿 구현 시 **제거 대상**이다.

> 약술형논술 design.md가 고정 바 왼쪽에 두는 `논술런` 워드마크는 헤드라인 위가 아니므로 Eyebrow가 아니다. 유지 가능.

## 5. 4가지 상태 처리 현황 (AGENTS.md §6.4)

| 데이터 | loading | 정상 | 빈 값 | unavailable |
|---|---|---|---|---|
| 강좌 본체 (`getCourseDetail`) | — (서버 렌더) | ○ | `null` → `notFound()` | **의도적으로 throw** → ISR이 마지막 성공본 유지 (ADR 0007) |
| 후기 (`getCourseReviewsState`) | ○ | ○ | ○ 안내문 | ○ 안내문 |
| 문의 (`getCourseQuestionsState`) | ○ | ○ | ○ 안내문 | ○ 안내문 |
| 강좌 목록 (형제강좌용) | — | ○ | ○ | `.catch(() => [])` → 형제 링크만 포기 |

→ 새 템플릿도 **이 네 가지를 그대로 유지해야 한다.** 특히 강좌 본체를 `unavailable` 상태로 바꾸면
Bridge가 흔들릴 때 캐시된 좋은 HTML이 빈 화면으로 덮인다 (ADR 0007이 명시적으로 금지).

## 6. 지켜야 하는 제약 (코드로 강제됨)

| 제약 | 강제 수단 |
|---|---|
| `app/`·`features/`는 `@/legacy` 또는 `@/legacy/server`만 import | `eslint.config.mjs:95-101` `no-restricted-imports` |
| Client Component에서 `@/legacy/server` import 금지 | `server-only` 패키지 |
| `components/`·`design-system/`은 `@/legacy`·`@/analytics` import 금지 | `eslint.config.mjs:103-108` |
| `process.env` 직접 접근 금지 | `no-restricted-syntax` (`eslint.config.mjs:63-67`) |
| `searchParams` 읽기 금지 (ISR 유지) | `page.tsx:25-28` 주석 + 빌드 출력 확인 |
| `main.css` 수정 금지 | `scripts/verify-legacy-css.mjs` SHA256 |
| Bridge 응답은 zod parse 후 사용 | adapter 구조 + `tests/contract/` |

`legacy-course-detail.css`는 체크섬으로 고정되어 **있지 않다** (`verify-legacy-css.mjs`는 `main.css`만 검사).
라우트 전용 import이므로 새 템플릿에서 import하지 않는 방식으로 격리할 수 있다.
