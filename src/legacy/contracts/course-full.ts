/**
 * Course Full Contract v1 — `shop/item.php` 를 그릴 수 있는 강좌 단건.
 *
 * **단일 원본은 `contracts/bridge/course-full.v1.schema.json` 이다.** 이 파일은 그 스키마의
 * zod 사본이며, 필드·타입·nullable·strict 까지 같아야 한다.
 * `tests/contract/bridge-fixtures.test.ts` 가 두 검증기의 판정이 fixture 전체에서 일치하는지 본다.
 *
 * `contracts/course.ts` 의 `course-detail.v1` 과 **다른 endpoint** 다:
 *
 *   `GET /v2-api/courses.php?id=`      → `course-detail.v1`  목록 카드용 축약형
 *   `GET /v2-api/course-detail.php?id=` → `course-full.v1`   상세 페이지용 (이 파일)
 *
 * 둘을 합치지 않는 이유는 ISR 캐시 단위가 다르기 때문이다. 목록은 39개를 한 번에 받고,
 * 상세는 강좌마다 따로 재생성한다.
 *
 * AGENTS.md §7.2: 사람마다 다른 값(회원별 가격, 수강 여부)은 이 공개 Contract 에 없다.
 * `price` 는 `get_price()` 결과이며 Legacy 도 회원별 할인을 적용하지 않는다.
 */

import { z } from 'zod';

import { courseIdSchema } from './course';

export const COURSE_FULL_CONTRACT_VERSION = 1;

/**
 * Legacy DB 기준 **상대 경로**. 절대 URL 은 Contract 위반이다 —
 * 호스트 결합은 렌더 시 `legacyAssetUrl()`/`legacyItemThumbnail()` 이 한다.
 */
const relativeImageSchema = z
  .string()
  // `^/(?!/)` — `//host/path` 는 protocol-relative **절대** URL 이므로 막는다.
  .regex(/^\/(?!\/)/, { message: 'Legacy DB 기준 상대 경로여야 한다 (절대 URL 금지)' });

export const courseCategorySchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    /** `ca_cert_use`. Legacy `shop_member_cert_check()` 가 본인인증을 요구한다. */
    requiresCertification: z.boolean(),
    /** `ca_adult_use`. Legacy 가 성인인증을 요구한다. */
    requiresAdultCertification: z.boolean(),
  })
  .strict();

/**
 * `iteminfo.lib.php` 의 `lecture` 그룹. 다른 그룹은 전부 주석 처리돼 있어 이 두 키뿐이다.
 * 제목은 PHP 쪽 lib 에 있으므로 V2 가 들고 있어야 한다 (`COURSE_INFORMATION_TITLES`).
 */
export const courseInformationSchema = z
  .object({
    product_name: z.string().optional(),
    model_name: z.string().optional(),
  })
  .strict();

/** `item.info.skin.php` 가 쓰는 제목. 렌더 순서도 이 순서다. */
export const COURSE_INFORMATION_TITLES = [
  ['product_name', '수강대상'],
  ['model_name', '내용 및 특징'],
] as const;

/**
 * Legacy `it_1` ~ `it_5`.
 *
 * `item.form.skin.php` 는 `3`(신청기간), `2`(수강기간, 일), `4`(모집인원, 명), `5`(강의수, 강) 만
 * 쓰고 **`1` 은 쓰지 않는다**. Contract 에는 Bridge 가 주는 대로 담아 두고, 화면에 넣을지는
 * 스킨이 결정한다.
 */
export const courseExtraSchema = z
  .object({
    1: z.string().optional(),
    2: z.string().optional(),
    3: z.string().optional(),
    4: z.string().optional(),
    5: z.string().optional(),
  })
  .strict();

export const courseFullItemSchema = z
  .object({
    id: courseIdSchema,
    name: z.string().min(1),
    basic: z.string(),
    category: courseCategorySchema,
    /** 판매가(원 단위 정수). `priceOnInquiry` 면 Bridge 가 0 을 준다. */
    price: z.number().int().nonnegative(),
    /** 정가(`it_cust_price`). Legacy 스킨은 값이 0 이어도 취소선으로 함께 보여준다. */
    listPrice: z.number().int().nonnegative(),
    /** 영카트 '전화문의'(`it_tel_inq`) 상품. true 면 주문 불가다. */
    priceOnInquiry: z.boolean(),
    /** `it_soldout` 플래그. */
    soldOut: z.boolean(),
    /** 재고 기준 구매 가능 여부. Legacy `is_soldout()` 은 이 둘을 합쳐서 판단한다. */
    inStock: z.boolean(),
    buyMinQty: z.number().int().min(1),
    images: z.array(relativeImageSchema),
    descriptionHtml: z.string(),
    headHtml: z.string(),
    tailHtml: z.string(),
    information: courseInformationSchema,
    extra: courseExtraSchema,
  })
  .strict();

/**
 * 선택옵션(`type: 0`) / 추가옵션(`type: 1`) 한 줄.
 *
 * `id` 는 Legacy `io_id` 를 그대로 받은 값이다. 여러 주제가 있으면 `chr(30)` 으로 이어져 있고,
 * `parts` 는 그것을 쪼갠 것이다. 폼 전송 시 `io_id` 에는 `id` 를 **그대로** 넣는다.
 */
export const courseOptionItemSchema = z
  .object({
    type: z.union([z.literal(0), z.literal(1)]),
    id: z.string().min(1),
    parts: z.array(z.string()),
    /** 옵션 추가금. 음수일 수 있다 (Legacy 는 합계가 음수면 거부한다). */
    price: z.number().int(),
    /** `io_stock_qty > 0`. false 면 Legacy select 가 재고 부족으로 거부한다. */
    available: z.boolean(),
  })
  .strict();

export const courseOptionsSchema = z
  .object({
    /** `it_option_subject` 를 `,` 로 쪼갠 것. 선택옵션 select 하나당 하나. */
    subjects: z.array(z.string().min(1)),
    /** `it_supply_subject`. 추가옵션 주제. */
    supplySubjects: z.array(z.string().min(1)),
    items: z.array(courseOptionItemSchema),
  })
  .strict();

export const courseReviewSummarySchema = z
  .object({
    count: z.number().int().nonnegative(),
    averageScore: z.number().nonnegative().nullable(),
  })
  .strict();

/**
 * Legacy 장바구니 endpoint. action/method 를 **Bridge 가 소유한다** —
 * V2 가 `/shop/cartupdate.php` 를 하드코딩하면 Legacy 가 경로를 바꿀 때 조용히 깨진다.
 */
export const courseFormSchema = z
  .object({
    action: z.literal('/shop/cartupdate.php'),
    method: z.literal('POST'),
  })
  .strict();

/** `GET /v2-api/course-detail.php?id=<it_id>` */
export const courseFullResponseSchema = z
  .object({
    v: z.literal(COURSE_FULL_CONTRACT_VERSION),
    item: courseFullItemSchema,
    options: courseOptionsSchema,
    reviewSummary: courseReviewSummarySchema,
    form: courseFormSchema,
  })
  .strict();

export type CourseCategory = z.infer<typeof courseCategorySchema>;
export type CourseInformation = z.infer<typeof courseInformationSchema>;
export type CourseExtra = z.infer<typeof courseExtraSchema>;
export type CourseFullItem = z.infer<typeof courseFullItemSchema>;
export type CourseOptionItem = z.infer<typeof courseOptionItemSchema>;
export type CourseOptions = z.infer<typeof courseOptionsSchema>;
export type CourseReviewSummary = z.infer<typeof courseReviewSummarySchema>;
export type CourseForm = z.infer<typeof courseFormSchema>;
export type CourseFullResponse = z.infer<typeof courseFullResponseSchema>;

/** 상세 페이지가 받는 한 덩어리. envelope 의 `v` 만 떼어낸 모양이다. */
export type CourseFull = Omit<CourseFullResponse, 'v'>;

/** AGENTS.md §6.4: 상세 페이지도 4가지 상태를 모두 처리한다. */
export type CourseFullState =
  | { status: 'loading' }
  | { status: 'ready'; course: CourseFull }
  | { status: 'missing' }
  | { status: 'unavailable' };

// ---------------------------------------------------------------------------
// Legacy 스킨의 판단을 한곳에 모은다
// ---------------------------------------------------------------------------

/**
 * Legacy `is_soldout($it_id)` 에 해당한다 (`html2/lib/shop.lib.php:1929`).
 *
 * `it_soldout` 플래그와 재고를 **둘 다** 본다. 한쪽만 보면 Legacy 와 화면이 갈린다.
 */
export function isCourseSoldOut(item: CourseFullItem): boolean {
  return item.soldOut || !item.inStock;
}

/**
 * Legacy `shop/item.php:197` 의 `$is_orderable`.
 *
 * ```php
 * $is_orderable = true;
 * if(!$it['it_use'] || $it['it_tel_inq'] || $is_soldout) $is_orderable = false;
 * ```
 *
 * `it_use` 는 Bridge 쿼리(`it_use='1'`)가 이미 걸러 주므로 여기서 볼 수 없다.
 *
 * false 면 Legacy 는 **선택옵션 select, `#sit_sel_option`, 수강신청 버튼을 전부 렌더하지 않는다.**
 */
export function isCourseOrderable(item: CourseFullItem): boolean {
  return !item.priceOnInquiry && !isCourseSoldOut(item);
}

/**
 * Legacy `shop_member_cert_check()` 가 막는 강좌인가.
 *
 * V2 서버는 로그인/인증 상태를 볼 수 없다 (AGENTS.md §6.3 — 서버 HTML 에 로그인 상태를 넣으면
 * 캐시가 오염된다). 그래서 판단을 Legacy 에 넘긴다.
 */
export function requiresLegacyCertification(category: CourseCategory): boolean {
  return category.requiresCertification || category.requiresAdultCertification;
}

/**
 * Legacy `get_star_image()` — 평균 점수를 별 이미지 번호(0~5)로 바꾼다.
 *
 * ```php
 * $star = round($score); if ($star > 5) $star = 5; else if ($star < 0) $star = 0;
 * ```
 *
 * 후기가 없으면 Legacy 는 0 이고, 스킨이 `if ($star_score)` 로 별을 아예 숨긴다.
 */
export function courseStarScore(summary: CourseReviewSummary): number {
  if (summary.averageScore === null) return 0;
  return Math.min(5, Math.max(0, Math.round(summary.averageScore)));
}
