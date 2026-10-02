import { z } from 'zod';

/**
 * 브라우저 번들에 들어가는 환경변수 계약.
 *
 * AGENTS.md §6.2: `process.env` 직접 접근은 이 파일과 `env.server.ts`에서만 허용한다.
 * `NEXT_PUBLIC_*`는 번들러가 빌드 시점에 치환하므로 **키를 하나씩 명시적으로** 읽어야 한다.
 * (`process.env[name]` 같은 동적 접근은 치환되지 않아 런타임에 undefined가 된다.)
 *
 * AGENTS.md §9: 여기에 비밀값을 넣지 않는다. 전부 브라우저에 노출되는 값이다.
 */

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),

  /** 빈 문자열이면 상대경로를 쓴다는 뜻이다 (운영에서 Legacy가 같은 도메인에 있을 때). */
  NEXT_PUBLIC_LEGACY_BASE_URL: z.union([z.literal(''), z.url()]),

  NEXT_PUBLIC_LEGACY_ASSET_HOST: z
    .string()
    .min(1)
    .refine((value) => !value.includes('/') && !value.includes(':'), {
      message: 'hostname만 넣는다 (scheme, 경로, 포트 없이)',
    }),

  NEXT_PUBLIC_VIEWER_SOURCE: z.enum(['mock', 'http']),

  NEXT_PUBLIC_ANALYTICS_ENABLED: z.enum(['true', 'false']).default('false'),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
}

export function parseClientEnv(source: Record<string, string | undefined>): ClientEnv {
  const result = clientEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`client env 검증 실패:\n${formatIssues(result.error)}`);
  }
  return result.data;
}

/** 번들러 치환을 위해 키를 하나씩 명시적으로 읽는다. 이 모양을 유지할 것. */
export const clientEnv: ClientEnv = parseClientEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_LEGACY_BASE_URL: process.env.NEXT_PUBLIC_LEGACY_BASE_URL,
  NEXT_PUBLIC_LEGACY_ASSET_HOST: process.env.NEXT_PUBLIC_LEGACY_ASSET_HOST,
  NEXT_PUBLIC_VIEWER_SOURCE: process.env.NEXT_PUBLIC_VIEWER_SOURCE,
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
});

/** AGENTS.md §8: 기본은 false이며 false면 console 출력만 한다. */
export const analyticsEnabled: boolean = clientEnv.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
