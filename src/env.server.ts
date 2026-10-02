import 'server-only';

import { z } from 'zod';

import { formatIssues } from '@/env.client';

/**
 * 서버 전용 환경변수 계약.
 *
 * Gate 4 전에는 local/Preview/Production을 구분하지 않는다. 모든 값은 선택 사항이며,
 * source가 mock일 때 Bridge 값과 proxy secret은 읽지 않는다.
 */
export const serverEnvSchema = z.object({
  COURSE_SOURCE: z.enum(['mock', 'http']).default('mock'),
  LEGACY_BRIDGE_BASE: z
    .url()
    .refine((value) => !value.endsWith('/'), { message: '끝에 / 를 붙이지 않는다' })
    .optional(),
  LEGACY_BRIDGE_TIMEOUT_MS: z.coerce.number().int().min(500).max(10_000).default(3_000),
  COURSE_REVALIDATE_SECONDS: z.coerce.number().int().min(30).default(300),
  V2_PROXY_SECRET: z.string().optional(),
  /** Vercel이 자동 주입하는 배포 URL host. 없으면 metadataBase를 생략한다. */
  VERCEL_URL: z.string().min(1).optional(),
  /** Vercel이 자동 주입하는 배포 식별자. */
  VERCEL_GIT_COMMIT_SHA: z
    .string()
    .optional()
    .transform((value) => (value === undefined || value === '' ? null : value)),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`server env 검증 실패:\n${formatIssues(result.error)}`);
  }
  return result.data;
}

export const serverEnv: ServerEnv = parseServerEnv({
  COURSE_SOURCE: process.env.COURSE_SOURCE,
  LEGACY_BRIDGE_BASE: process.env.LEGACY_BRIDGE_BASE,
  LEGACY_BRIDGE_TIMEOUT_MS: process.env.LEGACY_BRIDGE_TIMEOUT_MS,
  COURSE_REVALIDATE_SECONDS: process.env.COURSE_REVALIDATE_SECONDS,
  V2_PROXY_SECRET: process.env.V2_PROXY_SECRET,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
});

/** AGENTS.md §6.3: 강좌 페이지 ISR 주기. */
export const courseRevalidateSeconds: number = serverEnv.COURSE_REVALIDATE_SECONDS;
