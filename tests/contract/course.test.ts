import { describe, expect, it } from 'vitest';

import {
  COURSE_CONTRACT_VERSION,
  courseItemResponseSchema,
  courseListResponseSchema,
  courseSchema,
  saleStatusSchema,
} from '@/legacy/contracts/course';

/**
 * L1 — Course Contract v1 (DRAFT). Gate 3에서 courses.php 응답으로 확정한다.
 * 지금 고정하는 것은 envelope 모양, `.strict()`, Legacy 컬럼명 거부다.
 */

const course = {
  id: 'fixture-1001',
  title: '예시 강좌',
  summary: '설명',
  teacherName: '예시강사',
  imageUrl: null,
  listPrice: 330000,
  salePrice: 264000,
  saleStatus: 'on_sale',
  categoryId: '1010',
} as const;

describe('버전', () => {
  it('v 는 z.literal(1) 이다', () => {
    expect(COURSE_CONTRACT_VERSION).toBe(1);
    expect(courseItemResponseSchema.safeParse({ v: 1, item: course }).success).toBe(true);
    expect(courseItemResponseSchema.safeParse({ v: 2, item: course }).success).toBe(false);
  });
});

describe('.strict() — Legacy 원본 컬럼명을 거부한다', () => {
  it.each([
    'it_id',
    'it_name',
    'it_price',
    'it_amount',
    'it_use',
    'ca_id',
    'ca_use',
    'g5_shop_item',
  ])('%s 가 있으면 parse 실패한다', (field) => {
    expect(courseSchema.safeParse({ ...course, [field]: 'x' }).success).toBe(false);
  });

  it('envelope 에 알 수 없는 필드가 있으면 실패한다', () => {
    expect(courseItemResponseSchema.safeParse({ v: 1, item: course, total: 1 }).success).toBe(
      false,
    );
    expect(courseListResponseSchema.safeParse({ v: 1, items: [], total: 0 }).success).toBe(false);
  });
});

describe('회원별 값은 Contract 에 없다 (AGENTS.md §7.2)', () => {
  it.each(['memberPrice', 'enrolled', 'isPurchased', 'myProgress'])(
    '%s 가 있으면 parse 실패한다',
    (field) => {
      expect(courseSchema.safeParse({ ...course, [field]: true }).success).toBe(false);
    },
  );
});

describe('필드 규칙', () => {
  it('saleStatus 는 canonical 4개만 받는다', () => {
    for (const status of ['on_sale', 'sold_out', 'inquiry', 'unavailable']) {
      expect(saleStatusSchema.safeParse(status).success).toBe(true);
    }
    for (const status of ['soldout', 'SOLD_OUT', 'on-sale', '판매중']) {
      expect(saleStatusSchema.safeParse(status).success).toBe(false);
    }
  });

  it('imageUrl 과 listPrice 는 nullable 이다', () => {
    expect(courseSchema.safeParse({ ...course, imageUrl: null, listPrice: null }).success).toBe(
      true,
    );
  });

  it('salePrice 는 null 이 될 수 없다', () => {
    expect(courseSchema.safeParse({ ...course, salePrice: null }).success).toBe(false);
  });

  it('가격은 음수가 될 수 없다', () => {
    expect(courseSchema.safeParse({ ...course, salePrice: -1 }).success).toBe(false);
    expect(courseSchema.safeParse({ ...course, listPrice: -1 }).success).toBe(false);
  });

  it('가격은 정수다 (원 단위)', () => {
    expect(courseSchema.safeParse({ ...course, salePrice: 264000.5 }).success).toBe(false);
  });

  it('id 와 categoryId 는 빈 문자열이 될 수 없다', () => {
    expect(courseSchema.safeParse({ ...course, id: '' }).success).toBe(false);
    expect(courseSchema.safeParse({ ...course, categoryId: '' }).success).toBe(false);
  });
});

describe('envelope', () => {
  it('단건은 item: null 을 허용한다 (없는 강좌)', () => {
    expect(courseItemResponseSchema.safeParse({ v: 1, item: null }).success).toBe(true);
  });

  it('목록은 빈 배열을 허용한다', () => {
    expect(courseListResponseSchema.safeParse({ v: 1, items: [] }).success).toBe(true);
  });

  it('목록 안의 항목도 strict 검사를 받는다', () => {
    expect(
      courseListResponseSchema.safeParse({ v: 1, items: [{ ...course, it_price: 1 }] }).success,
    ).toBe(false);
  });
});
