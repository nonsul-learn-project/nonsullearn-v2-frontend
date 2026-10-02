import 'server-only';

import type { z } from 'zod';

import { serverEnv } from '@/env.server';

import { BridgeError } from './bridge-error';
import { parseBridgeResponse } from './bridge-fetch';

/**
 * Vercel 서버에서 Thin PHP Bridge를 호출한다. 강좌 공개 정보처럼 **쿠키가 필요 없는** 데이터만.
 *
 * AGENTS.md §2 절대 원칙: 이 경로에 PHP 세션 쿠키를 붙이지 않는다.
 * `credentials`를 설정하지 않고 `Cookie` 헤더도 만들지 않는다. 그래야 응답을 ISR로 캐시할 수 있다.
 */

export interface BridgeServerOptions<T> {
  /** `/courses.php` 처럼 `/`로 시작하는 Bridge 경로. `LEGACY_BRIDGE_BASE` 뒤에 붙는다. */
  path: string;
  schema: z.ZodType<T>;
  /** Next.js ISR 주기(초). 생략하면 캐시하지 않는다. */
  revalidate?: number | false;
  signal?: AbortSignal;
}

export async function bridgeServerFetch<T>(options: BridgeServerOptions<T>): Promise<T> {
  const { path, schema, revalidate, signal } = options;

  if (!path.startsWith('/')) {
    throw new BridgeError('network', path, "경로는 '/'로 시작해야 한다");
  }

  // 단일 환경 원칙(ADR 0006): 빌드를 막지 않는다. `COURSE_SOURCE=http` 로 바꿔 놓고
  // base 를 등록하지 않았을 때 **adapter 를 호출하는 순간** 분명하게 실패한다.
  if (serverEnv.LEGACY_BRIDGE_BASE === undefined) {
    throw new BridgeError(
      'network',
      path,
      'COURSE_SOURCE=http 인데 LEGACY_BRIDGE_BASE 가 없다. Vercel env 에 ' +
        'LEGACY_BRIDGE_BASE=https://<도메인>/v2-api 를 등록하라',
    );
  }

  const url = `${serverEnv.LEGACY_BRIDGE_BASE}${path}`;
  const timeoutMs = serverEnv.LEGACY_BRIDGE_TIMEOUT_MS;

  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs);
  const abortSignal =
    signal === undefined
      ? timeoutController.signal
      : AbortSignal.any([signal, timeoutController.signal]);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      // 쿠키를 보내지 않는다. 공개 데이터만 가져온다.
      //
      // 리디렉션을 따라가지 않는다. Legacy 는 없는/보호된 경로를 로그인 페이지나 홈으로 302 시키는데,
      // 따라가면 200 HTML 이 되어 "Bridge 가 죽었다"가 "이상한 JSON 파싱 실패"로 둔갑한다.
      // `redirect: 'manual'` 이면 3xx 가 그대로 남아 아래 status 검사에서 실패한다.
      redirect: 'manual',
      next: revalidate === undefined ? undefined : { revalidate },
      signal: abortSignal,
    });
  } catch (cause) {
    clearTimeout(timer);
    if (timeoutController.signal.aborted) {
      throw new BridgeError('timeout', path, `${timeoutMs}ms 안에 응답이 없었다`, { cause });
    }
    throw new BridgeError('network', path, '요청이 실패했다', { cause });
  }
  clearTimeout(timer);

  return parseBridgeResponse({ path, schema, response });
}
