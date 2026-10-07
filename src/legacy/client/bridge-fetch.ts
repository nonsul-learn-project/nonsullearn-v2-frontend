import type { z } from 'zod';

import { BridgeError, isJsonContentType } from './bridge-error';

/**
 * 브라우저에서 Thin PHP Bridge를 호출한다.
 *
 * AGENTS.md §2: viewer 같은 로그인 상태는 **브라우저**가 same-origin으로 호출한다.
 * PHP 세션 쿠키는 브라우저가 자동으로 붙이며, 이 레포의 서버 코드는 쿠키를 보지도, 전달하지도 않는다.
 *
 * 그래서 경로는 반드시 same-origin 상대경로다. 절대 URL을 받지 않는다.
 */

export interface BridgeFetchOptions {
  /** `/v2-api/viewer.php` 처럼 `/`로 시작하는 same-origin 경로. */
  path: string;
  schema: z.ZodType<unknown>;
  timeoutMs: number;
  signal?: AbortSignal;
}

export async function bridgeFetch<T>(options: {
  path: string;
  schema: z.ZodType<T>;
  timeoutMs: number;
  signal?: AbortSignal;
}): Promise<T> {
  const { path, schema, timeoutMs, signal } = options;

  if (!path.startsWith('/')) {
    throw new BridgeError('network', path, 'same-origin 상대경로만 허용한다 (절대 URL 금지)');
  }

  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs);
  const abortSignal =
    signal === undefined
      ? timeoutController.signal
      : AbortSignal.any([signal, timeoutController.signal]);

  let response: Response;
  try {
    response = await fetch(path, {
      method: 'GET',
      // PHP 세션 쿠키는 브라우저가 same-origin 요청에 자동으로 붙인다.
      credentials: 'same-origin',
      // 로그인 상태는 캐시하지 않는다.
      cache: 'no-store',
      headers: { Accept: 'application/json' },
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

/**
 * 응답을 Contract로 좁힌다. 브라우저와 서버 클라이언트가 같은 검사를 쓴다.
 *
 * 순서가 중요하다: status → content-type → JSON → schema.
 * content-type 검사를 건너뛰면 Legacy의 `ErrorDocument 404 /index.php` 홈 HTML을
 * 파싱하려다 엉뚱한 에러가 난다 (docs/discovery/bridge-risks.md).
 */
export async function parseBridgeResponse<T>(options: {
  path: string;
  schema: z.ZodType<T>;
  response: Response;
}): Promise<T> {
  const { path, schema, response } = options;

  if (!response.ok) {
    throw new BridgeError('http', path, `status ${response.status}`, { status: response.status });
  }

  const contentType = response.headers.get('content-type');
  if (!isJsonContentType(contentType)) {
    throw new BridgeError(
      'not-json',
      path,
      `content-type이 JSON이 아니다: ${contentType ?? '(없음)'}`,
      {
        status: response.status,
      },
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new BridgeError('malformed-json', path, 'JSON 파싱에 실패했다', {
      status: response.status,
      cause,
    });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    // 에러 메시지에 응답 본문을 넣지 않는다. Contract 위반 응답에 개인정보가 섞여 있을 수 있다.
    throw new BridgeError(
      'contract',
      path,
      `Contract와 맞지 않다: ${parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join(', ')}`,
      { status: response.status },
    );
  }

  return parsed.data;
}
