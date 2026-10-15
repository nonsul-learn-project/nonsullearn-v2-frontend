import humanities from './defaults/humanities.json';
import math from './defaults/math.json';
import shortAnswer from './defaults/short-answer.json';
import { validateCourseTemplate, type CourseTemplateContent, type CourseTemplateOverride, type TemplateType } from './types';

const defaults: Record<TemplateType, unknown> = { humanities, math, 'short-answer': shortAnswer };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Objects merge recursively; arrays replace, except sections merge by stable section id. Null is invalid. */
export function mergeCourseTemplate(defaultContent: CourseTemplateContent, override: CourseTemplateOverride): CourseTemplateContent {
  if (override.courseId === '__default__' || override.templateType !== defaultContent.templateType) throw new Error('Course template type mismatch');
  const merge = (base: unknown, patch: unknown): unknown => {
    if (patch === undefined) return base;
    if (patch === null) throw new Error('Explicit null is not supported in course content');
    if (Array.isArray(base) && Array.isArray(patch)) {
      if (base.every((entry) => isRecord(entry) && typeof entry.id === 'string') && patch.every((entry) => isRecord(entry) && typeof entry.id === 'string')) {
        const replacement = new Map(patch.map((entry) => [entry.id as string, entry]));
        return base.map((entry) => merge(entry, replacement.get(entry.id as string))).concat(patch.filter((entry) => !base.some((baseEntry) => isRecord(baseEntry) && baseEntry.id === entry.id)));
      }
      return patch;
    }
    if (isRecord(base) && isRecord(patch)) {
      return Object.fromEntries(new Set([...Object.keys(base), ...Object.keys(patch)]).values().map((key) => [key, merge(base[key], patch[key])]));
    }
    return patch;
  };
  return validateCourseTemplate(merge(defaultContent, override));
}

export function getTemplateDefault(templateType: TemplateType): CourseTemplateContent {
  return validateCourseTemplate(defaults[templateType]);
}

/** Gate 4 entrypoint: absent content deliberately returns null so the current page stays in use. */
export function loadCourseTemplate(courseId: string, templateType: TemplateType, override?: CourseTemplateOverride): CourseTemplateContent | null {
  if (!override) return null;
  if (override.courseId !== courseId) throw new Error('Course ID mismatch');
  return mergeCourseTemplate(getTemplateDefault(templateType), override);
}
