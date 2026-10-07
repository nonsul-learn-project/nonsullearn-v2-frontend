import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  courseCommunityResponseSchema,
  LEGACY_COMMUNITY_ROWS,
} from '@/legacy/contracts/course-community';
import { findCourseSiblings } from '@/features/course-detail/siblings';
import { formatLegacyListDate, formatNumber, formatOptionPrice, formatPrice } from '@/lib/format';
import type { Course } from '@/legacy';

/**
 * L1 — `course-community.v1` Contract + 상세 페이지가 쓰는 순수 계산.
 */

const FIXTURE_DIR = 'contracts/bridge/fixtures';

function fixture(name: string): unknown {
  return JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), 'utf8'));
}

describe('course-community.v1', () => {
  it('reviews / questions / empty fixture 를 모두 받는다', () => {
    for (const name of [
      'course-community.reviews.json',
      'course-community.questions.json',
      'course-community.empty.json',
    ]) {
      expect(courseCommunityResponseSchema.safeParse(fixture(name)).success, name).toBe(true);
    }
  });

  it('type 으로 갈라지는 union 이다', () => {
    const reviews = courseCommunityResponseSchema.parse(fixture('course-community.reviews.json'));
    expect(reviews.type).toBe('reviews');
    if (reviews.type !== 'reviews') throw new Error('unreachable');
    expect(reviews.items[0]?.score).toBe(5);

    const questions = courseCommunityResponseSchema.parse(
      fixture('course-community.questions.json'),
    );
    expect(questions.type).toBe('questions');
    if (questions.type !== 'questions') throw new Error('unreachable');
    expect(questions.items[1]?.answered).toBe(false);
  });

  it('개인 식별 정보(mb_id)가 섞이면 거부한다', () => {
    // AGENTS.md §7.2. authorName 은 Legacy get_text(is_name) 이고 mb_id 가 아니다.
    expect(
      courseCommunityResponseSchema.safeParse(
        fixture('course-community.leaks-mb_id.invalid.json'),
      ).success,
    ).toBe(false);
  });

  it('후기 답변은 null 이거나 완전한 객체다 (부분 객체 금지)', () => {
    const payload = fixture('course-community.reviews.json') as {
      items: { reply: unknown }[];
    };
    payload.items[0] = { ...payload.items[0], reply: { subject: '제목만' } };
    expect(courseCommunityResponseSchema.safeParse(payload).success).toBe(false);
  });

  it('Legacy 페이지 크기는 5 다', () => {
    // html2/shop/itemuse.php:69, html2/shop/itemqa.php:69 — 둘 다 `$rows = 5`.
    expect(LEGACY_COMMUNITY_ROWS).toBe(5);
  });
});

describe('format — Legacy number_format / display_price', () => {
  it('천 단위 쉼표를 넣는다', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(110000)).toBe('110,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(-30000)).toBe('-30,000');
  });

  it('display_price 와 같다', () => {
    expect(formatPrice(110000)).toBe('110,000원');
    expect(formatPrice(0)).toBe('0원');
  });

  it('옵션 추가금은 0 이상이면 + 를 붙인다', () => {
    // shop.override.js:65-69
    expect(formatOptionPrice(0)).toBe('+0원');
    expect(formatOptionPrice(30000)).toBe('+30,000원');
    expect(formatOptionPrice(-5000)).toBe('-5,000원');
  });

  it('목록 날짜는 substr($time, 2, 8) 과 같다', () => {
    // itemuse.skin.php:44
    expect(formatLegacyListDate('2026-09-30 11:21:00')).toBe('26-09-30');
  });
});

describe('findCourseSiblings — Legacy item.php:139-163', () => {
  /** `categoryId` 앞 4자가 같은 것만 형제다. */
  function course(id: string, categoryId: string): Course {
    return {
      id,
      title: `강좌 ${id}`,
      summary: '',
      price: 1000,
      listPrice: null,
      priceOnInquiry: false,
      soldOut: false,
      image: null,
      categoryId,
    };
  }

  const courses = [
    course('1000000001', '101060'),
    course('1000000003', '101061'),
    course('1000000005', '101060'),
    course('1000000007', '101099'),
    // 다른 그룹(1011 ≠ 1010)이므로 형제가 아니다.
    course('1000000009', '101160'),
  ];

  it('"이전 강의"는 it_id 가 더 큰 쪽의 최솟값이다', () => {
    // Legacy: `where it_id > '$it_id' ... order by it_id asc limit 1`
    expect(findCourseSiblings(courses, '1000000003', '101061').previous).toBe('1000000005');
  });

  it('"다음 강의"는 it_id 가 더 작은 쪽의 최댓값이다', () => {
    // Legacy: `where it_id < '$it_id' ... order by it_id desc limit 1`
    expect(findCourseSiblings(courses, '1000000005', '101060').next).toBe('1000000003');
  });

  it('분류 앞 4자가 다르면 형제가 아니다', () => {
    expect(findCourseSiblings(courses, '1000000009', '101160')).toEqual({
      previous: null,
      next: null,
    });
  });

  it('양끝은 한쪽이 null 이다', () => {
    expect(findCourseSiblings(courses, '1000000001', '101060').next).toBeNull();
    expect(findCourseSiblings(courses, '1000000007', '101099').previous).toBeNull();
  });
});
