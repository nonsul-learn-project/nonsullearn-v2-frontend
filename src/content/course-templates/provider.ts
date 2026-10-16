import { getTemplateDefault, mergeCourseTemplate } from './loader';
import type { CourseTemplateContent, CourseTemplateOverride, TemplateType } from './types';

/** Gate 5 owns adding verified, real course-ID entries. Gate 4 intentionally ships none. */
const courseOverrides: Record<string, CourseTemplateOverride | undefined> = {};

/**
 * Gate 5-B resolution: a supported course does not require a per-course file.
 * Defaults supply template-owned copy; an override only supplies verified deltas.
 * Invalid file data must not break the course route, so it resolves to legacy fallback.
 */
export function resolveCourseTemplateContent(
  courseId: string,
  templateType: TemplateType,
  override: CourseTemplateOverride | undefined = courseOverrides[courseId],
): CourseTemplateContent | null {
  try {
    return mergeCourseTemplate(getTemplateDefault(templateType), {
      courseId,
      templateType,
      ...override,
    });
  } catch {
    return null;
  }
}

export function getCourseTemplateContent(courseId: string, templateType: TemplateType): CourseTemplateContent | null {
  return resolveCourseTemplateContent(courseId, templateType);
}
