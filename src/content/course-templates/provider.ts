import { loadCourseTemplate } from './loader';
import type { CourseTemplateContent, CourseTemplateOverride, TemplateType } from './types';

/** Gate 5 owns adding verified, real course-ID entries. Gate 4 intentionally ships none. */
const courseOverrides: Record<string, CourseTemplateOverride | undefined> = {};

export function getCourseTemplateContent(courseId: string, templateType: TemplateType): CourseTemplateContent | null {
  return loadCourseTemplate(courseId, templateType, courseOverrides[courseId]);
}
