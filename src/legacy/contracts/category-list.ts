/**
 * Category List Contract v1 — Legacy `shop/list.php?ca_id=` 와 같은 분류 목록.
 *
 * 단일 원본은 `contracts/bridge/category-list.v1.schema.json` 이다.
 * `GET /v2-api/category-list.php?id=<ca_id>&page=<n>`
 */

import { z } from 'zod';

export const CATEGORY_LIST_CONTRACT_VERSION = 1;

/** Legacy DB 기준 상대 경로. 호스트 결합은 렌더 시 `legacyAssetUrl()` 이 한다. */
const relativeImageSchema = z
  .string()
  .regex(/^\/(?!\/)/, { message: 'Legacy DB 기준 상대 경로여야 한다 (절대 URL 금지)' });

export const categoryListCategorySchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    /** `ca_head_html`. sanitize 후 `#sct_hhtml` 에 넣는다. */
    headHtml: z.string(),
    /** `ca_tail_html`. sanitize 후 `#sct_thtml` 에 넣는다. */
    tailHtml: z.string(),
    /** 어느 스킨으로 그리는지. V2 는 `list.10.skin.php` 만 재현한다. */
    skin: z.string(),
    customHeadInclude: z.boolean(),
    customTailInclude: z.boolean(),
  })
  .strict();

export const categoryListPaginationSchema = z
  .object({
    page: z.number().int().min(1),
    perPage: z.number().int().min(1),
    totalCount: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    /** Legacy `cf_write_pages`. 번호를 몇 개까지 늘어놓는지. */
    pagesShown: z.number().int().min(1),
  })
  .strict();

/** Legacy `item_icon()` 이 `it_type1~5` 와 쿠폰 유무로 그리는 배지. */
export const categoryListBadgesSchema = z
  .object({
    hit: z.boolean(),
    recommend: z.boolean(),
    new: z.boolean(),
    popular: z.boolean(),
    discount: z.boolean(),
    coupon: z.boolean(),
  })
  .strict();

export const categoryListItemSchema = z
  .object({
    id: z.string().regex(/^[A-Za-z0-9_-]{1,20}$/),
    name: z.string().min(1),
    /** `it_basic`. Legacy 가 HTML 그대로 출력한다. */
    basicHtml: z.string(),
    image: relativeImageSchema.nullable(),
    /** `priceOnInquiry` 면 Legacy 가 "전화문의" 를 쓰고 금액을 쓰지 않는다. */
    price: z.number().int().nonnegative().nullable(),
    /** 소비자가. 값이 없으면 Legacy 가 `span.sct_dict` 를 아예 그리지 않는다. */
    listPrice: z.number().int().nonnegative().nullable(),
    priceOnInquiry: z.boolean(),
    soldOut: z.boolean(),
    averageScore: z.number().nonnegative().nullable(),
    /** `get_star()` 결과(0~5). 0 이면 Legacy 가 별을 그리지 않는다. */
    star: z.number().int().nonnegative().nullable(),
    badges: categoryListBadgesSchema,
  })
  .strict();

export const categoryListResponseSchema = z
  .object({
    v: z.literal(CATEGORY_LIST_CONTRACT_VERSION),
    category: categoryListCategorySchema,
    pagination: categoryListPaginationSchema,
    items: z.array(categoryListItemSchema),
  })
  .strict();

export type CategoryListCategory = z.infer<typeof categoryListCategorySchema>;
export type CategoryListPagination = z.infer<typeof categoryListPaginationSchema>;
export type CategoryListBadges = z.infer<typeof categoryListBadgesSchema>;
export type CategoryListItem = z.infer<typeof categoryListItemSchema>;
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;

/** Legacy `ca_id` 는 숫자 2자리씩 최대 6단계다. */
export const categoryIdSchema = z.string().regex(/^[0-9]{2,10}$/);
