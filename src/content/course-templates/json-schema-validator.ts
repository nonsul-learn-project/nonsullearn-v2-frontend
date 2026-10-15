import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020';

import baseSchema from './schemas/course-content.schema.json';
import humanitiesSchema from './schemas/humanities.schema.json';
import mathSchema from './schemas/math.schema.json';
import shortAnswerSchema from './schemas/short-answer.schema.json';
import type { TemplateType } from './types';

const ajv = new Ajv2020({ allErrors: true, strict: false });
ajv.addFormat('uri', /^https:\/\/\S+$/);
ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
ajv.addSchema(baseSchema);

const validators: Record<TemplateType, ValidateFunction> = {
  humanities: ajv.compile(humanitiesSchema),
  math: ajv.compile(mathSchema),
  'short-answer': ajv.compile(shortAnswerSchema),
};

function isTemplateType(value: unknown): value is TemplateType {
  return value === 'humanities' || value === 'math' || value === 'short-answer';
}

/** Validates the checked-in Draft 2020-12 files before the Zod type boundary. */
export function assertJsonSchemaCourseTemplate(input: unknown): void {
  const type = typeof input === 'object' && input !== null ? (input as Record<string, unknown>).templateType : undefined;
  if (!isTemplateType(type)) throw new Error('JSON Schema: templateType must be humanities, math, or short-answer');
  const validator = validators[type];
  if (!validator(input)) {
    const errors = (validator.errors ?? []).map((error: ErrorObject) => `${error.instancePath || '/'} ${error.message ?? 'invalid'}`).join('; ');
    throw new Error(`JSON Schema validation failed: ${errors}`);
  }
}
