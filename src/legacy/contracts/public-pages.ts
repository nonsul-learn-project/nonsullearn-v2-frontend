import { z } from 'zod';

export const teacherSchema = z.object({
  id: z.string().min(1), name: z.string().min(1), categoryId: z.string().min(1), categoryName: z.string(),
  ability: z.string(), career: z.string(), image: z.string().regex(/^\/(?!\/)/).nullable(), updatedAt: z.string(),
}).strict();
export const teachersResponseSchema = z.object({ v: z.literal(1), items: z.array(teacherSchema) }).strict();

export const contentIdSchema = z.enum(['provision', 'privacy']);
export const contentResponseSchema = z.object({ v: z.literal(1), id: contentIdSchema, title: z.string().min(1), contentHtml: z.string() }).strict();

export const faqIdSchema = z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive());
export const faqResponseSchema = z.object({
  v: z.literal(1), id: z.number().int().positive(), title: z.string().min(1),
  masters: z.array(z.object({ id: z.number().int().positive(), title: z.string().min(1) }).strict()),
  headerImage: z.string().regex(/^\/(?!\/)/).nullable(), footerImage: z.string().regex(/^\/(?!\/)/).nullable(),
  items: z.array(z.object({ id: z.number().int().positive(), questionHtml: z.string(), answerHtml: z.string() }).strict()),
}).strict();

export type Teacher = z.infer<typeof teacherSchema>;
export type Content = z.infer<typeof contentResponseSchema>;
export type Faq = z.infer<typeof faqResponseSchema>;
