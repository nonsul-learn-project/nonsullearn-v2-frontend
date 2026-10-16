import { describe, expect, it } from 'vitest';

import { resolveCourseTemplateContent } from '@/content/course-templates/provider';
import { getCategoryListMock } from '@/legacy/adapters/category-list/mock';
import { getCourseDetailMock } from '@/legacy/adapters/course-detail/mock';
import { resolveCourseTemplate } from '@/features/course-detail/templates/resolveCourseTemplate';

const pages = [
  ['1010', 1], ['1010', 2], ['3020', 1], ['4010', 1],
] as const;

describe('all accessible local course fixtures', () => {
  it('classifies, loads detail data, and resolves valid universal content for every visible card', () => {
    const seen = new Set<string>();
    for (const [categoryId, page] of pages) {
      for (const card of getCategoryListMock(categoryId, page).items) {
        expect(seen.has(card.id), `duplicate card ${card.id}`).toBe(false);
        seen.add(card.id);
        const detail = getCourseDetailMock(card.id);
        expect(detail, `missing detail ${card.id}`).not.toBeNull();
        const type = resolveCourseTemplate(detail!.item.category.id);
        expect(type).not.toBe('legacy');
        expect(resolveCourseTemplateContent(detail!.item.id, type as 'humanities' | 'math' | 'short-answer')).toMatchObject({
          courseId: detail!.item.id, templateType: type,
        });
      }
    }
    expect([...seen]).toEqual(['1001', '1002', 'mock-math-001', 'mock-short-001']);
  });

  it('has no phantom later pages and preserves legacy fallback for unsupported categories', () => {
    expect(getCategoryListMock('1010', 3).items).toEqual([]);
    expect(resolveCourseTemplate('2010')).toBe('legacy');
  });
});
