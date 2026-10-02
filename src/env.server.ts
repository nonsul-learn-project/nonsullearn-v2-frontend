import 'server-only';

import { z } from 'zod';

import { clientEnvSchema, formatIssues } from '@/env.client';

/**
 * 서버에서만 읽는 환경변수 계약.
 *
 * `server-only`가 클라이언트 번들로의 import를 빌드 시점에 막는다 (AGENTS.md §6.2).
 * AGENTS.md §2/§9: DB 접속 정보, PHP session secret, PG/SMTP/SMS credential은
 * 여기에도 들어오지 않는다. V2 runtime은 그것들을 알 필요가 없다.
 */

export const serverEnvSchema = z.object({
  COURSE_SOURCE: z.enum(['mock', 'http']).default('mock'),

  /** Thin PHP Bridge(`/v2-api`)의 base. 경로를 붙일 때 중복 `/`가 생기지 않게 끝 `/`를 금지한다. */
  LEGACY_BRIDGE_BASE: z
    .url()
    .refine((value) => !value.endsWith('/'), {
      message: '끝에 / 를 붙이지 않는다',
    })
    .optional(),

  LEGACY_BRIDGE_TIMEOUT_MS: z.coerce.number().int().min(500).max(10_000).default(3_000),

  COURSE_REVALIDATE_SECONDS: z.coerce.number().int().min(30).default(300),

  /** Apache 프록시가 붙이는 `X-V2-Proxy-Secret` 값. release guard가 on인 production에서는 32자 이상이다. */
  // mock build에는 proxy가 아직 연결되지 않으므로 빈 기본값을 쓴다.
  V2_PROXY_SECRET: z.string().default(''),

  V2_ENFORCE_PROXY: z.enum(['true', 'false']).default('false'),

  VERCEL_ENV: z.enum(['development', 'preview', 'production']).default('development'),

  /** Gate 4 routing 검증 전에는 Vercel Production mock build만 허용한다. */
  V2_RELEASE_GUARD: z.enum(['on', 'off']).default('off'),

  /**
   * Vercel 이 자동 주입하는 배포 커밋. `/api/v2-health` 가 "어느 배포를 보고 있는지" 알려줄 때만 쓴다.
   * 사람이 등록하는 값이 아니므로 비어 있어도 된다. 빈 문자열은 null 로 본다.
   */
  VERCEL_GIT_COMMIT_SHA: z
    .string()
    .optional()
    .transform((value) => (value === undefined || value === '' ? null : value)),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * production 전용 금지 조합. 빌드/부팅을 실패시킨다.
 *
 * 왜 빌드를 깨뜨리는가: mock 데이터가 운영에 올라가는 것과, 추측 가능한 proxy secret으로
 * origin이 공개되는 것은 배포 후에 발견하면 이미 사용자에게 노출된 상태다.
 */
export function assertProductionGuards(env: ServerEnv, viewerSource: 'mock' | 'http'): void {
  const violations: string[] = [];

  if (env.COURSE_SOURCE === 'http' && env.LEGACY_BRIDGE_BASE === undefined) {
    violations.push('LEGACY_BRIDGE_BASE — COURSE_SOURCE=http 일 때 필수다');
  }

  const usesHttpSource = viewerSource === 'http' || env.COURSE_SOURCE === 'http';
  if (usesHttpSource && env.V2_PROXY_SECRET.length < 16) {
    violations.push('V2_PROXY_SECRET — http source일 때 16자 이상이어야 한다');
  }

  if (env.VERCEL_ENV !== 'production' || env.V2_RELEASE_GUARD !== 'on') {
    if (violations.length > 0) {
      throw new Error(
        `server env 금지 조합:\n${violations.map((line) => `  - ${line}`).join('\n')}`,
      );
    }
    return;
  }

  if (viewerSource !== 'http') {
    violations.push(
      `NEXT_PUBLIC_VIEWER_SOURCE=${viewerSource} — production에서는 http 여야 한다 (mock 금지)`,
    );
  }
  if (env.COURSE_SOURCE !== 'http') {
    violations.push(
      `COURSE_SOURCE=${env.COURSE_SOURCE} — production에서는 http 여야 한다 (mock 금지)`,
    );
  }
  if (env.V2_PROXY_SECRET.length < 32) {
    violations.push(
      `V2_PROXY_SECRET 길이 ${env.V2_PROXY_SECRET.length} — production에서는 32자 이상이어야 한다`,
    );
  }

  if (violations.length > 0) {
    throw new Error(
      `production env 금지 조합:\n${violations.map((line) => `  - ${line}`).join('\n')}`,
    );
  }
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`server env 검증 실패:\n${formatIssues(result.error)}`);
  }

  // production guard는 client 쪽 viewer source까지 같이 봐야 판단할 수 있다.
  const viewer = clientEnvSchema.shape.NEXT_PUBLIC_VIEWER_SOURCE.safeParse(
    source.NEXT_PUBLIC_VIEWER_SOURCE,
  );
  assertProductionGuards(result.data, viewer.success ? viewer.data : 'mock');

  if (result.data.VERCEL_ENV === 'production' && result.data.V2_RELEASE_GUARD === 'off') {
    console.warn('[env] release guard OFF — Gate 4 전까지만 허용');
  }

  return result.data;
}

/** 번들러 치환 대상은 아니지만 client 쪽과 같은 모양을 유지한다. */
export const serverEnv: ServerEnv = parseServerEnv({
  COURSE_SOURCE: process.env.COURSE_SOURCE,
  LEGACY_BRIDGE_BASE: process.env.LEGACY_BRIDGE_BASE,
  LEGACY_BRIDGE_TIMEOUT_MS: process.env.LEGACY_BRIDGE_TIMEOUT_MS,
  COURSE_REVALIDATE_SECONDS: process.env.COURSE_REVALIDATE_SECONDS,
  V2_PROXY_SECRET: process.env.V2_PROXY_SECRET,
  V2_ENFORCE_PROXY: process.env.V2_ENFORCE_PROXY,
  VERCEL_ENV: process.env.VERCEL_ENV,
  V2_RELEASE_GUARD: process.env.V2_RELEASE_GUARD,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  NEXT_PUBLIC_VIEWER_SOURCE: process.env.NEXT_PUBLIC_VIEWER_SOURCE,
});

export const isProduction: boolean = serverEnv.VERCEL_ENV === 'production';

/** AGENTS.md §6.3: 강좌 페이지 ISR 주기. */
export const courseRevalidateSeconds: number = serverEnv.COURSE_REVALIDATE_SECONDS;
