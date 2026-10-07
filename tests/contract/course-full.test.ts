import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  COURSE_FULL_CONTRACT_VERSION,
  COURSE_INFORMATION_TITLES,
  courseFullResponseSchema,
  courseOptionItemSchema,
  courseStarScore,
  isCourseOrderable,
  isCourseSoldOut,
  requiresLegacyCertification,
  type CourseFullItem,
} from '@/legacy/contracts/course-full';

/**
 * L1 — `course-full.v1` Contract (HARNESS.md §3).
 *
 * fixture 와 JSON Schema 의 교차 검증은 `bridge-fixtures.test.ts` 가 한다. 여기서는
 * **Legacy 스킨의 판단**(주문 가능 여부, 품절, 별점, 인증)이 Legacy PHP 와 같은지 고정한다.
 * 그 판단이 틀리면 화면이 Legacy 와 갈린다.
 */

const FIXTURE_DIR = 'contracts/bridge/fixtures';

function fixture(name: string): unknown {
  return JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), 'utf8'));
}

function itemFrom(name: string): CourseFullItem {
  return courseFullResponseSchema.parse(fixture(name)).item;
}

describe('course-full.v1 envelope', () => {
  it('정상 fixture 를 모두 받는다', () => {
    for (const name of [
      'course-full.basic.json',
      'course-full.no-options.json',
      'course-full.sold-out.json',
      'course-full.price-on-inquiry.json',
    ]) {
      expect(courseFullResponseSchema.safeParse(fixture(name)).success, name).toBe(true);
    }
  });

  it('v 는 1 이다', () => {
    expect(courseFullResponseSchema.parse(fixture('course-full.basic.json')).v).toBe(
      COURSE_FULL_CONTRACT_VERSION,
    );
  });

  it('모르는 필드를 거부한다 (.strict)', () => {
    // Legacy 컬럼명이 새면 Contract 위반이다 (AGENTS.md §7.2).
    expect(
      courseFullResponseSchema.safeParse(fixture('course-full.legacy-column.invalid.json'))
        .success,
    ).toBe(false);
  });

  it('images 에 절대 URL 을 거부한다', () => {
    // 호스트 결합은 V2 의 legacyAssetUrl() 이 한다. Bridge 는 상대 경로만 준다.
    const result = courseFullResponseSchema.safeParse(
      fixture('course-full.absolute-image.invalid.json'),
    );
    expect(result.success).toBe(false);
  });

  it('protocol-relative 이미지(`//host/path`)도 거부한다', () => {
    const payload = fixture('course-full.basic.json') as {
      item: { images: string[] };
    };
    payload.item.images = ['//evil.test/data/item/1/a.jpg'];
    expect(courseFullResponseSchema.safeParse(payload).success).toBe(false);
  });

  it('form.action 은 Legacy 장바구니 경로로 고정이다', () => {
    const payload = fixture('course-full.basic.json') as {
      form: { action: string };
    };
    payload.form.action = '/shop/somewhere-else.php';
    expect(courseFullResponseSchema.safeParse(payload).success).toBe(false);
  });
});

describe('옵션 Contract', () => {
  it('io_type 은 0(선택옵션) 또는 1(추가옵션)뿐이다', () => {
    const base = { id: 'A', parts: ['A'], price: 0, available: true };
    expect(courseOptionItemSchema.safeParse({ ...base, type: 0 }).success).toBe(true);
    expect(courseOptionItemSchema.safeParse({ ...base, type: 1 }).success).toBe(true);
    expect(courseOptionItemSchema.safeParse({ ...base, type: 2 }).success).toBe(false);
  });

  it('옵션 추가금은 음수를 허용한다 (Legacy 는 합계로만 거부한다)', () => {
    expect(
      courseOptionItemSchema.safeParse({
        type: 0,
        id: '할인',
        parts: ['할인'],
        price: -5000,
        available: true,
      }).success,
    ).toBe(true);
  });
});

describe('isCourseSoldOut — Legacy is_soldout()', () => {
  it('it_soldout 플래그가 켜지면 품절이다', () => {
    expect(isCourseSoldOut(itemFrom('course-full.sold-out.json'))).toBe(true);
  });

  it('플래그가 꺼져 있어도 재고가 없으면 품절이다', () => {
    // Legacy is_soldout() 은 it_soldout 과 재고를 둘 다 본다 (shop.lib.php:1929).
    const item = { ...itemFrom('course-full.basic.json'), soldOut: false, inStock: false };
    expect(isCourseSoldOut(item)).toBe(true);
  });

  it('둘 다 정상이면 품절이 아니다', () => {
    expect(isCourseSoldOut(itemFrom('course-full.basic.json'))).toBe(false);
  });
});

describe('isCourseOrderable — Legacy item.php:197-199', () => {
  it('정상 판매 강좌는 주문 가능하다', () => {
    expect(isCourseOrderable(itemFrom('course-full.basic.json'))).toBe(true);
  });

  it('전화문의 강좌는 주문 불가다', () => {
    // Legacy: `if(!$it['it_use'] || $it['it_tel_inq'] || $is_soldout) $is_orderable = false;`
    expect(isCourseOrderable(itemFrom('course-full.price-on-inquiry.json'))).toBe(false);
  });

  it('품절 강좌는 주문 불가다', () => {
    expect(isCourseOrderable(itemFrom('course-full.sold-out.json'))).toBe(false);
  });
});

describe('courseStarScore — Legacy get_star_image()', () => {
  it('후기가 없으면 0 이고 스킨이 별을 숨긴다', () => {
    expect(courseStarScore({ count: 0, averageScore: null })).toBe(0);
  });

  it('round 로 반올림한다', () => {
    expect(courseStarScore({ count: 3, averageScore: 4.4 })).toBe(4);
    expect(courseStarScore({ count: 3, averageScore: 4.5 })).toBe(5);
    expect(courseStarScore({ count: 3, averageScore: 4.666666666666667 })).toBe(5);
  });

  it('5 를 넘기지 않는다', () => {
    expect(courseStarScore({ count: 1, averageScore: 7 })).toBe(5);
  });
});

describe('requiresLegacyCertification', () => {
  it('본인인증 또는 성인인증이 필요하면 true 다', () => {
    const base = {
      id: '101060',
      name: '수능전 파이널',
      requiresCertification: false,
      requiresAdultCertification: false,
    };
    expect(requiresLegacyCertification(base)).toBe(false);
    expect(requiresLegacyCertification({ ...base, requiresCertification: true })).toBe(true);
    expect(requiresLegacyCertification({ ...base, requiresAdultCertification: true })).toBe(true);
  });
});

describe('강의 정보 고시 제목', () => {
  it('iteminfo.lib.php 의 lecture 그룹과 같다', () => {
    // html2/lib/iteminfo.lib.php:548-553 — 다른 그룹은 전부 주석 처리돼 있다.
    expect(COURSE_INFORMATION_TITLES).toEqual([
      ['product_name', '수강대상'],
      ['model_name', '내용 및 특징'],
    ]);
  });
});
