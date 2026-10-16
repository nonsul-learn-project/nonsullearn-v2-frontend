import type { TemplateType } from '@/content/course-templates';

export type CourseTemplateKey = TemplateType | 'legacy';

const prefixes: Record<string, TemplateType> = { '10': 'humanities', '30': 'math', '40': 'short-answer' };

/** Verified Gate 2 category-prefix mapping. Unknown categories deliberately remain legacy. */
export function resolveCourseTemplate(categoryId: string): CourseTemplateKey {
  return prefixes[categoryId.slice(0, 2)] ?? 'legacy';
}
