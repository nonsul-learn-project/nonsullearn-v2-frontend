import { describe, expect, it } from 'vitest';

import { resolveCourseTemplateContent } from '@/content/course-templates/provider';
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

  it.each(['humanities', 'math', 'short-answer'] as const)('resolves %s defaults without an override', (type) => {
    const content = resolveCourseTemplateContent('fixture-course-1', type);
    expect(content).toMatchObject({ courseId: 'fixture-course-1', templateType: type });
    expect(content?.hero.marketingHeadline).not.toBe('');
  });

  it('merges a verified override over defaults', () => {
    const content = resolveCourseTemplateContent('fixture-course-1', 'humanities', {
      courseId: 'fixture-course-1',
      templateType: 'humanities',
      hero: { marketingHeadline: '강좌 전용 문구' },
    });
    expect(content?.hero.marketingHeadline).toBe('강좌 전용 문구');
    expect(content?.hero.highlight).not.toBe('');
  });

  it('uses legacy fallback for malformed IDs or incompatible overrides', () => {
    expect(resolveCourseTemplateContent('../bad', 'humanities')).toBeNull();
    expect(resolveCourseTemplateContent('fixture-course-1', 'math', {
      courseId: 'fixture-course-1', templateType: 'humanities',
    })).toBeNull();
  });
});
