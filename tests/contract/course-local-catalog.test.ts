import { describe, expect, it } from 'vitest';

import { getCategoryListMock } from '@/legacy/adapters/category-list/mock';
import { getCourseDetailMock } from '@/legacy/adapters/course-detail/mock';

describe('development course catalog', () => {
  it('links every visible category item to an available detail fixture', () => {
    for (const category of ['1010', '3020', '4010']) {
      const page = getCategoryListMock(category, 1);
      for (const item of page.items) expect(getCourseDetailMock(item.id)).not.toBeNull();
    }
  });

  it('filters catalog entries by category and paginates humanities fixtures', () => {
    expect(getCategoryListMock('1010', 1).items.map((item) => item.id)).toEqual(['1001']);
    expect(getCategoryListMock('1010', 2).items.map((item) => item.id)).toEqual(['1002']);
    expect(getCategoryListMock('1010', 3).items).toEqual([]);
    expect(getCategoryListMock('3020', 1).items.map((item) => item.id)).toEqual(['mock-math-001']);
    expect(getCategoryListMock('4010', 1).items.map((item) => item.id)).toEqual(['mock-short-001']);
  });

  it('keeps real-list IDs missing instead of fabricating a detail response', () => {
    expect(getCourseDetailMock('1791259062')).toBeNull();
    expect(getCourseDetailMock('1787805378')).toBeNull();
  });
});
