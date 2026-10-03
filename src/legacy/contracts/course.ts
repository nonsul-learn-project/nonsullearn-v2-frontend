/**
 * Course Contract v1 — 강좌 공개 정보.
 *
 * **단일 원본은 `contracts/bridge/` 의 JSON Schema 다.** 이 파일은 그 스키마의 zod 사본이며,
 * 필드·타입·nullable·strict 까지 같아야 한다. `tests/contract/bridge-fixtures.test.ts` 가
 * 두 검증기의 판정이 일치하는지 fixture 전체로 확인한다.
 *
 * Gate 3 에서 Gate 1 draft 를 Contract v1 로 교체했다. 바뀐 점:
 *   teacherName  삭제      (Bridge 가 주지 않는다)
 *   imageUrl  →  image     (Legacy DB 기준 **상대 경로**. 호스트 결합은 `legacyAssetUrl()` 이 한다)
 *   salePrice →  price
 *   saleStatus(enum) → soldOut + priceOnInquiry (boolean 2개)
 *   id 에 `^[A-Za-z0-9_-]{1,20}$` 추가
 *   단건 envelope 의 `item` 은 더 이상 nullable 이 아니다 (없는 강좌는 404 + error envelope)
 *
 * AGENTS.md §7.2: 사람마다 다른 값(회원별 가격, 수강 여부)은 이 공개 Contract 에 넣지 않는다.
 */

import { z } from 'zod';

export const COURSE_CONTRACT_VERSION = 1;

/**
 * Legacy `it_id`. Bridge 가 `^[A-Za-z0-9_-]{1,20}$` 로 좁혀서 준다.
 * 경로 탈출(`..%2F`)은 Bridge 가 400 `invalid_id` 로 막는다.
 */
export const courseIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,20}$/);

export const courseSchema = z
  .object({
    id: courseIdSchema,
    title: z.string().min(1),
    summary: z.string(),
    /** 판매가(원 단위 정수). `priceOnInquiry` 면 0 이다. */
    price: z.number().int().nonnegative(),
    /** 정가. 할인이 없으면 null. */
    listPrice: z.number().int().nonnegative().nullable(),
    /** 영카트 '전화문의' 상품. true 면 UI 는 가격 대신 "전화문의"를 보여준다. */
    priceOnInquiry: z.boolean(),
    soldOut: z.boolean(),
    /**
     * Legacy DB 기준 **상대 경로**(`/data/item/...`)이거나 null.
     * 절대 URL 은 Contract 위반이다 — adapter 가 변환하지 않고, 렌더 시 `legacyAssetUrl()` 이 붙인다.
     */
    image: z
      .string()
      // `^/(?!/)` — `//host/path` 는 protocol-relative **절대** URL 이므로 막는다.
      // 통과시키면 Bridge 가 준 값이 다른 호스트를 가리킬 수 있다.
      .regex(/^\/(?!\/)/, { message: 'Legacy DB 기준 상대 경로여야 한다 (절대 URL 금지)' })
      .nullable(),
    categoryId: z.string().min(1),
  })
  .strict();

export type Course = z.infer<typeof courseSchema>;

/** `GET /v2-api/courses.php` */
export const courseListResponseSchema = z
  .object({
    v: z.literal(COURSE_CONTRACT_VERSION),
    items: z.array(courseSchema),
  })
  .strict();

/**
 * `GET /v2-api/courses.php?id=<it_id>`
 *
 * `item` 은 null 이 될 수 없다. 없는 강좌는 404 + `bridgeErrorResponseSchema` 이고,
 * 그 구분은 http adapter 가 status 로 한다 (404 → null).
 */
export const courseItemResponseSchema = z
  .object({
    v: z.literal(COURSE_CONTRACT_VERSION),
    item: courseSchema,
  })
  .strict();

export type CourseListResponse = z.infer<typeof courseListResponseSchema>;
export type CourseItemResponse = z.infer<typeof courseItemResponseSchema>;

/** Bridge 의 4xx/5xx 본문. HTTP 상태와 짝을 이룬다. */
export const BRIDGE_ERROR_CODES = [
  'method_not_allowed',
  'bridge_misconfigured',
  'bridge_unavailable',
  'invalid_id',
  'not_found',
] as const;

export const bridgeErrorResponseSchema = z
  .object({
    v: z.literal(COURSE_CONTRACT_VERSION),
    error: z.enum(BRIDGE_ERROR_CODES),
  })
  .strict();

export type BridgeErrorCode = (typeof BRIDGE_ERROR_CODES)[number];
export type BridgeErrorResponse = z.infer<typeof bridgeErrorResponseSchema>;

/** AGENTS.md §6.4: 강좌 UI 도 4가지 상태를 모두 처리한다. */
export type CourseState =
  | { status: 'loading' }
  | { status: 'ready'; course: Course }
  | { status: 'missing' }
  | { status: 'unavailable' };

export type CourseListState =
  { status: 'loading' } | { status: 'ready'; courses: Course[] } | { status: 'unavailable' };
