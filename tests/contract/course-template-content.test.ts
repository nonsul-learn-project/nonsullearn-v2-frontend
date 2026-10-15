import { describe, expect, it } from 'vitest';

import {
  getTemplateDefault,
  loadCourseTemplate,
  mergeCourseTemplate,
  validateCourseTemplate,
  type CourseTemplateOverride,
} from '@/content/course-templates';

const courseId = 'fixture-course-1';
const override: CourseTemplateOverride = {
  courseId,
  templateType: 'humanities',
  hero: { marketingHeadline: '검증용 헤드라인', highlight: '검증용' },
};

describe('course template content contract', () => {
  it.each(['humanities', 'math', 'short-answer'] as const)('validates the %s default JSON', (type) => {
    expect(getTemplateDefault(type).templateType).toBe(type);
  });

  it('rejects a missing required hero field', () => {
    const content = structuredClone(getTemplateDefault('humanities')) as Record<string, unknown>;
    delete (content.hero as Record<string, unknown>).marketingHeadline;
    expect(() => validateCourseTemplate(content)).toThrow();
  });

  it('rejects a wrong template type and unknown fields', () => {
    expect(() => validateCourseTemplate({ ...getTemplateDefault('math'), templateType: 'physics' })).toThrow();
    expect(() => validateCourseTemplate({ ...getTemplateDefault('math'), eyebrow: 'forbidden' })).toThrow();
  });

  it('detects course ID and template type mismatches', () => {
    expect(() => loadCourseTemplate('another-id', 'humanities', override)).toThrow('Course ID mismatch');
    expect(() => mergeCourseTemplate(getTemplateDefault('math'), override)).toThrow('type mismatch');
  });

  it('allows a selected section to be hidden while retaining the section order', () => {
    const result = mergeCourseTemplate(getTemplateDefault('humanities'), { ...override, sections: [{ id: 'curriculum', visible: false }] });
    expect(result.sections.find((section) => section.id === 'curriculum')).toEqual({ id: 'curriculum', visible: false });
    expect(result.sections).toHaveLength(12);
  });

  it('merges section arrays by id and replaces ordinary arrays', () => {
    const result = mergeCourseTemplate(getTemplateDefault('humanities'), {
      ...override,
      faq: [{ question: '질문', answer: '답변' }],
      sections: [{ id: 'proof', visible: true }],
    });
    expect(result.faq).toHaveLength(1);
    expect(result.sections.find((section) => section.id === 'proof')?.visible).toBe(true);
  });

  it('does not permit operational price fields or eyebrow fields', () => {
    expect(() => validateCourseTemplate({ ...getTemplateDefault('humanities'), price: 1000 })).toThrow();
    expect(() => validateCourseTemplate({ ...getTemplateDefault('humanities'), hero: { ...getTemplateDefault('humanities').hero, eyebrow: '금지' } })).toThrow();
  });

  it('requires an explicit Legacy HTML preservation policy', () => {
    const content = structuredClone(getTemplateDefault('humanities')) as Record<string, unknown>;
    delete (content.contentMetadata as Record<string, unknown>).legacyHtml;
    expect(() => validateCourseTemplate(content)).toThrow();
  });

  it('falls back to the existing page when no course JSON exists', () => {
    expect(loadCourseTemplate(courseId, 'humanities')).toBeNull();
  });
});
