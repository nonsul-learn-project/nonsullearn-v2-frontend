import { describe, expect, it } from 'vitest';

import { getCourseTemplateContent } from '@/content/course-templates/provider';
import { resolveCourseTemplate } from '@/features/course-detail/templates/resolveCourseTemplate';

describe('course template resolver and Gate 5-safe provider', () => {
  it.each([
    ['101060', 'humanities'],
    ['302010', 'math'],
    ['401010', 'short-answer'],
    ['201010', 'legacy'],
    ['x', 'legacy'],
  ] as const)('resolves %s as %s', (categoryId, expected) => {
    expect(resolveCourseTemplate(categoryId)).toBe(expected);
  });

  it('returns null until Gate 5 adds a verified course override', () => {
    expect(getCourseTemplateContent('fixture-course-1', 'humanities')).toBeNull();
  });
});
