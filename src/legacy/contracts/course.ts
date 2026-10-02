// DRAFT — Gate 3에서 courses.php 응답으로 확정. TBD(legacy) 필드 존재 가능
//
// 지금 이 schema는 Gate 1 하네스를 세우기 위한 draft다. 실제 Bridge 응답을 보고 확정하기 전까지
// 필드 의미를 추측해 늘리지 않는다 (AGENTS.md §7.2, CLAUDE.md "추측해서 Contract를 만들지 않는다").
//
// Gate 3에서 확인할 것 (근거: docs/discovery/legacy-url-map.md 마지막 줄):
//   - `get_shop_item_with_category`가 돌려주는 필드 중 공개해도 되는 것의 범위
//   - `it_use`/`ca_use`, soldout, 전화문의, 가격 계산 semantics (Legacy가 소유)
//   - 강좌 상세는 hit UPDATE와 `ck_it_id` 쿠키 부수효과가 있다 → Bridge는 읽기 전용이어야 한다
//
// AGENTS.md §7.2: 사람마다 다른 값(회원별 가격, 수강 여부)은 이 공개 Contract에 넣지 않는다.

import { z } from 'zod';

export const COURSE_CONTRACT_VERSION = 1;

/** Legacy의 판매 상태를 canonical 값으로 좁힌 것. 계산 규칙 자체는 Legacy가 소유한다. */
export const saleStatusSchema = z.enum(['on_sale', 'sold_out', 'inquiry', 'unavailable']);

export type SaleStatus = z.infer<typeof saleStatusSchema>;

export const courseSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    summary: z.string(),
    teacherName: z.string(),
    imageUrl: z.string().nullable(),
    /** 정가. 할인이 없으면 null. */
    listPrice: z.number().int().nonnegative().nullable(),
    /** 실제 판매가. 원 단위 정수. */
    salePrice: z.number().int().nonnegative(),
    saleStatus: saleStatusSchema,
    categoryId: z.string().min(1),
  })
  .strict();

export type Course = z.infer<typeof courseSchema>;

export const courseListResponseSchema = z
  .object({
    v: z.literal(COURSE_CONTRACT_VERSION),
    items: z.array(courseSchema),
  })
  .strict();

export const courseItemResponseSchema = z
  .object({
    v: z.literal(COURSE_CONTRACT_VERSION),
    item: courseSchema.nullable(),
  })
  .strict();

export type CourseListResponse = z.infer<typeof courseListResponseSchema>;
export type CourseItemResponse = z.infer<typeof courseItemResponseSchema>;

/** AGENTS.md §6.4: 강좌 UI도 4가지 상태를 모두 처리한다. */
export type CourseState =
  | { status: 'loading' }
  | { status: 'ready'; course: Course }
  | { status: 'missing' }
  | { status: 'unavailable' };

export type CourseListState =
  { status: 'loading' } | { status: 'ready'; courses: Course[] } | { status: 'unavailable' };
