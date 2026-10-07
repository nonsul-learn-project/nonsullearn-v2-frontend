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
  /**
   * Vercel 이 자동 주입한다. `assertHostedBridgeConfigured()` 가 이 값으로
   * "mock fallback 을 허용해도 되는 환경인가"를 판단한다.
   * 빈 문자열은 미설정과 같게 본다 (Vercel 이 비어 있는 값을 주입할 수 있다).
   */
  VERCEL_ENV: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.enum(['development', 'preview', 'production']).default('development'),
  ),
  COURSE_SOURCE: z.enum(['mock', 'http']).default('mock'),
  LEGACY_BRIDGE_BASE: z.preprocess(
    // 빈 문자열은 미설정과 같게 본다. Vercel 에 빈 값이 등록돼 있으면 전체 env 검증이
    // 터져서 앱이 안 뜨는데, 그건 "등록 안 함"과 구분할 이유가 없다.
    (value) => (value === '' ? undefined : value),
    z
      .url()
      .refine((url) => !url.endsWith('/'), { message: '끝에 / 를 붙이지 않는다' })
      .optional(),
  ),
  LEGACY_BRIDGE_TIMEOUT_MS: z.coerce.number().int().min(500).max(10_000).default(3_000),
  COURSE_REVALIDATE_SECONDS: z.coerce.number().int().min(30).default(300),
  /** Gate 4 방법 C에서 `/_next/static/*`을 Vercel origin으로 보내는 절대 URL. */
  V2_ASSET_PREFIX: z
    .url()
    .refine((value) => !value.endsWith('/'), { message: '끝에 / 를 붙이지 않는다' })
    .optional(),
  V2_PROXY_SECRET: z.string().optional(),
  /**
   * Gate 6 컷오버 스위치. `'true'` 일 때만 proxy secret 검사와 홈 index 를 켠다.
   * `V2_PROXY_SECRET` 이 없으면 검사할 기준이 없으므로 이 값이 `'true'` 라도 전부 통과한다
   * (ADR 0009). secret 은 Vercel 에만 등록하고 로컬에는 두지 않기 때문이다.
   */
  V2_ENFORCE_PROXY: z.enum(['true', 'false']).default('false'),
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
  VERCEL_ENV: process.env.VERCEL_ENV,
  COURSE_SOURCE: process.env.COURSE_SOURCE,
  LEGACY_BRIDGE_BASE: process.env.LEGACY_BRIDGE_BASE,
  LEGACY_BRIDGE_TIMEOUT_MS: process.env.LEGACY_BRIDGE_TIMEOUT_MS,
  COURSE_REVALIDATE_SECONDS: process.env.COURSE_REVALIDATE_SECONDS,
  V2_ASSET_PREFIX: process.env.V2_ASSET_PREFIX,
  V2_PROXY_SECRET: process.env.V2_PROXY_SECRET,
  V2_ENFORCE_PROXY: process.env.V2_ENFORCE_PROXY,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
});

/**
 * Gate 6 컷오버가 켜졌는가. proxy secret 검사(`src/proxy.ts`)와 홈 index/canonical
 * (`src/app/page.tsx`)이 이 값 하나로 같이 움직인다.
 */
export const enforceProxy: boolean = serverEnv.V2_ENFORCE_PROXY === 'true';

/** AGENTS.md §6.3: 강좌 페이지 ISR 주기. */
export const courseRevalidateSeconds: number = serverEnv.COURSE_REVALIDATE_SECONDS;

/**
 * 공개 데이터 adapter 가 mock 구현을 고르기 **전에** 부른다.
 *
 * Vercel Preview/Production 에서 `LEGACY_BRIDGE_BASE` 를 등록하지 않으면
 * adapter 가 조용히 fixture 를 돌려주고, 하네스용 예시 강좌가 운영 화면에 그대로 뜬다.
 * 그 사고는 조용히 지나가는 것보다 빌드/요청이 터지는 쪽이 낫다.
 *
 * 로컬과 CI(`VERCEL_ENV` 미설정 → `development`)에서는 mock fallback 이 정상 동작이다.
 */
export function assertHostedBridgeConfigured(): void {
  if (!isHostedEnv()) return;
  if (serverEnv.LEGACY_BRIDGE_BASE === undefined) {
    throw new Error(
      'Vercel Preview/Production 에는 LEGACY_BRIDGE_BASE 가 필수다. ' +
        'mock fallback 은 로컬·CI 에서만 허용된다.',
    );
  }
}

/** Vercel 에 올라간 배포인가. 여기서는 mock 이 허용되지 않는다. */
function isHostedEnv(): boolean {
  return serverEnv.VERCEL_ENV === 'preview' || serverEnv.VERCEL_ENV === 'production';
}

/**
 * 공개 데이터 adapter 가 mock/http 구현을 고를 때 **이 함수만** 쓴다.
 *
 * `COURSE_SOURCE` 의 기본값이 `mock` 이라서, Vercel 에 `LEGACY_BRIDGE_BASE` 만 등록하고
 * `COURSE_SOURCE` 를 빠뜨리면 Preview 가 조용히 fixture 를 돌려줬다. 그러면 실제 강좌 id 가
 * mock 에 없으니 `null` → `notFound()` → **없는 강좌도 아닌데 404** 가 된다.
 *
 * 그래서 hosted(Preview/Production)에서는 `COURSE_SOURCE` 값을 보지 않고 항상 `http` 다.
 * mock 은 로컬·CI 전용이라는 규칙(`assertHostedBridgeConfigured`)을 소스 선택까지 확장한 것이다.
 */
export function shouldUseMockBridge(): boolean {
  assertHostedBridgeConfigured();
  if (isHostedEnv()) return false;
  return serverEnv.COURSE_SOURCE === 'mock';
}
