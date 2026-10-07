import { describe, expect, it } from 'vitest';

import {
  BRIDGE_ERROR_CODES,
  bridgeErrorResponseSchema,
  COURSE_CONTRACT_VERSION,
  courseItemResponseSchema,
  courseListResponseSchema,
  courseSchema,
} from '@/legacy/contracts/course';

/**
 * L1 — Course Contract v1. 단일 원본은 `contracts/bridge/courses-list.v1.schema.json` 과
 * `course-detail.v1.schema.json` 이다 (fixture 대조는 bridge-fixtures.test.ts).
 *
 * 여기서는 fixture 가 담지 않는 경계값을 고정한다: `.strict()`, 금지 필드, 가격·id 규칙.
 */

const course = {
  id: '1001',
  title: '예시 강좌',
  summary: '설명',
  price: 264000,
  listPrice: 330000,
  priceOnInquiry: false,
  soldOut: false,
  image: '/data/item/1001/thumb.jpg',
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

  it('Gate 1 draft 에 있던 필드는 더 이상 받지 않는다', () => {
    // Contract v1 에서 teacherName 은 사라지고 imageUrl/salePrice/saleStatus 는 이름이 바뀌었다.
    for (const field of ['teacherName', 'imageUrl', 'salePrice', 'saleStatus']) {
      expect(courseSchema.safeParse({ ...course, [field]: 'x' }).success).toBe(false);
    }
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

describe('필수 필드', () => {
  it.each([
    'id',
    'title',
    'summary',
    'price',
    'listPrice',
    'priceOnInquiry',
    'soldOut',
    'image',
    'categoryId',
  ])('%s 가 없으면 실패한다', (field) => {
    const partial: Record<string, unknown> = { ...course };
    delete partial[field];
    expect(courseSchema.safeParse(partial).success).toBe(false);
  });
});

describe('가격', () => {
  it('price 는 nullable 이다', () => {
    expect(courseSchema.safeParse({ ...course, price: null }).success).toBe(true);
  });

  it('listPrice 는 nullable 이다 (할인 없음)', () => {
    expect(courseSchema.safeParse({ ...course, listPrice: null }).success).toBe(true);
  });

  it('음수가 될 수 없다', () => {
    expect(courseSchema.safeParse({ ...course, price: -1 }).success).toBe(false);
    expect(courseSchema.safeParse({ ...course, listPrice: -1 }).success).toBe(false);
  });

  it('정수다 (원 단위)', () => {
    expect(courseSchema.safeParse({ ...course, price: 264000.5 }).success).toBe(false);
  });

  it('전화문의 상품은 price 가 0 이다', () => {
    const inquiry = { ...course, priceOnInquiry: true, price: 0, listPrice: null };
    expect(courseSchema.safeParse(inquiry).success).toBe(true);
  });
});

describe('판매 상태는 boolean 2개다 (enum 아님)', () => {
  it('soldOut 과 priceOnInquiry 는 boolean 만 받는다', () => {
    for (const field of ['soldOut', 'priceOnInquiry']) {
      expect(courseSchema.safeParse({ ...course, [field]: 'true' }).success).toBe(false);
      expect(courseSchema.safeParse({ ...course, [field]: 1 }).success).toBe(false);
    }
  });

  it('네 조합 모두 유효하다', () => {
    for (const soldOut of [true, false]) {
      for (const priceOnInquiry of [true, false]) {
        expect(courseSchema.safeParse({ ...course, soldOut, priceOnInquiry }).success).toBe(true);
      }
    }
  });
});

describe('id', () => {
  it('Legacy it_id 모양만 받는다', () => {
    for (const id of ['1001', 'abc-123', 'A_b-9', 'x'.repeat(20)]) {
      expect(courseSchema.safeParse({ ...course, id }).success).toBe(true);
    }
  });

  it('빈 문자열, 너무 긴 값, 경로 문자는 거부한다', () => {
    for (const id of ['', 'x'.repeat(21), '../etc', '10 01', '1001/', '한글']) {
      expect(courseSchema.safeParse({ ...course, id }).success).toBe(false);
    }
  });

  it('categoryId 는 빈 문자열이 될 수 없다', () => {
    expect(courseSchema.safeParse({ ...course, categoryId: '' }).success).toBe(false);
  });
});

describe('image 는 상대 경로이거나 null 이다', () => {
  it('상대 경로를 받는다', () => {
    expect(courseSchema.safeParse({ ...course, image: '/data/item/x.jpg' }).success).toBe(true);
  });

  it('null 을 받는다', () => {
    expect(courseSchema.safeParse({ ...course, image: null }).success).toBe(true);
  });

  it('절대 URL 과 상대 경로 아닌 값은 거부한다', () => {
    for (const image of [
      'https://nonsul-learn.com/data/item/x.jpg',
      'http://example.test/x.jpg',
      '//cdn.example.test/x.jpg',
      'data/item/x.jpg',
    ]) {
      expect(courseSchema.safeParse({ ...course, image }).success).toBe(false);
    }
  });
});

describe('envelope', () => {
  it('단건의 item 은 null 이 될 수 없다 (없는 강좌는 404 + error)', () => {
    expect(courseItemResponseSchema.safeParse({ v: 1, item: null }).success).toBe(false);
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

describe('error envelope', () => {
  it('Bridge 가 쓰는 코드 5개만 받는다', () => {
    for (const code of BRIDGE_ERROR_CODES) {
      expect(bridgeErrorResponseSchema.safeParse({ v: 1, error: code }).success).toBe(true);
    }
    for (const code of ['boom', 'NOT_FOUND', 'notfound', '']) {
      expect(bridgeErrorResponseSchema.safeParse({ v: 1, error: code }).success).toBe(false);
    }
  });

  it('error 와 데이터를 동시에 담지 않는다', () => {
    expect(
      bridgeErrorResponseSchema.safeParse({ v: 1, error: 'not_found', item: course }).success,
    ).toBe(false);
  });
});
