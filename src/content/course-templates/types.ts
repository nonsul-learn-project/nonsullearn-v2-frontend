import { z } from 'zod';
import { assertJsonSchemaCourseTemplate } from './json-schema-validator';

export const TEMPLATE_TYPES = ['humanities', 'math', 'short-answer'] as const;
export type TemplateType = (typeof TEMPLATE_TYPES)[number];

const assetSchema = z.object({ src: z.string().regex(/^(\/|https:\/\/)/), alt: z.string().min(1) }).strict();
const sectionSchema = z.object({ id: z.enum(['problem', 'outcomes', 'proof', 'method', 'curriculum', 'learning-system', 'recommend', 'course-info', 'community', 'enroll', 'faq', 'legacy-content']), visible: z.boolean() }).strict();
const lessonSchema = z.object({ title: z.string().min(1), description: z.string().min(1), output: z.string().optional(), check: z.string().optional(), duration: z.string().optional() }).strict();
const faqSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) }).strict();

export const courseTemplateSchema = z.object({
  schemaVersion: z.literal(1),
  courseId: z.string().regex(/^(?:__default__|[A-Za-z0-9_-]{1,20})$/),
  templateType: z.enum(TEMPLATE_TYPES),
  hero: z.object({ marketingHeadline: z.string().min(1), highlight: z.string().min(1), keywords: z.string().optional(), summary: z.string().optional(), target: z.string().optional(), ctaLabel: z.string().min(1).default('수강 신청하기') }).strict(),
  sections: z.array(sectionSchema).min(1),
  assets: z.object({ instructorPhoto: assetSchema.optional(), previewVideoUrl: z.string().url().optional(), certificates: z.array(assetSchema).optional(), productImagePolicy: z.literal('legacy-gallery') }).strict(),
  instructor: z.object({ name: z.string().min(1), introduction: z.string().min(1).optional(), careers: z.array(z.string().min(1)).max(3).optional() }).strict().optional(),
  curriculum: z.object({ introduction: z.string().min(1).optional(), lessons: z.array(lessonSchema).min(1).optional() }).strict().optional(),
  proof: z.object({ brandStats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1), basis: z.string().min(1) }).strict()).length(3).optional(), preservationScope: z.literal('brand-wide').optional() }).strict().optional(),
  learningSystem: z.object({ methodLine: z.string().min(1).optional(), promise: z.string().min(1).optional(), steps: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) }).strict()).length(3).optional(), session: z.array(z.object({ label: z.string().min(1), description: z.string().min(1) }).strict()).min(1).optional(), feedback: z.object({ count: z.number().int().positive(), uploadGuide: z.string().min(1), returnGuide: z.string().min(1) }).strict().optional() }).strict().optional(),
  faq: z.array(faqSchema).min(1).optional(),
  contentMetadata: z.object({ sourceDocuments: z.array(z.string().min(1)).min(1), legacyHtml: z.enum(['visible', 'hidden']), reviewedAt: z.string().date().optional() }).strict(),
}).strict();

export type CourseTemplateContent = z.infer<typeof courseTemplateSchema>;
type DeepPartial<T> = T extends Array<infer Item>
  ? Array<DeepPartial<Item>>
  : T extends object
    ? { [Key in keyof T]?: DeepPartial<T[Key]> }
    : T;

/** A course file only states values that differ from its type default. */
export type CourseTemplateOverride = DeepPartial<Omit<CourseTemplateContent, 'courseId' | 'templateType'>> & {
  courseId: string;
  templateType: TemplateType;
};

export function validateCourseTemplate(input: unknown): CourseTemplateContent {
  assertJsonSchemaCourseTemplate(input);
  return courseTemplateSchema.parse(input);
}
