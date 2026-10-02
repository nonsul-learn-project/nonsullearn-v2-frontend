import { NextResponse, type NextRequest } from 'next/server';

import { clientEnv } from '@/env.client';
import { serverEnv } from '@/env.server';

/**
 * Origin 보호.
 *
 * 파일 이름이 `proxy.ts` 인 이유: Next.js 16 부터 `middleware` 규약이 deprecated 이고
 * `proxy` 가 그 자리를 잇는다. 둘이 같이 있으면 빌드가 실패한다.
 * 문서(AGENTS/GATES/HARNESS)에는 `middleware.ts` 로 적혀 있다 — 같은 파일을 가리킨다.
 *
 * 무엇을 막는가: Vercel origin(`v2-origin.<도메인>`)에 직접 들어온 요청.
 * 운영에서 사용자는 항상 Apache 정문을 지나며, Apache 가 `X-V2-Proxy-Secret` 을 붙인다.
 * 그 헤더가 없거나 다르면 메인 도메인으로 308 로 보낸다. origin 이 검색에 노출되거나
 * Legacy 를 우회해 접근되는 것을 막는 것이 목적이다 (GATES.md Gate 4, HARNESS.md L4 S9).
 */

const PROXY_SECRET_HEADER = 'x-v2-proxy-secret';

/**
 * 비밀값 비교. 길이 차이와 조기 반환으로 정보가 새지 않게 모든 바이트를 본다.
 *
 * 길이가 다르면 바로 false 를 돌려주는 대신, 길이 비교 결과를 누적값에 섞어
 * 비교 자체는 항상 같은 횟수만큼 돌게 한다.
 */
function secretsMatch(provided: string | null, expected: string): boolean {
  if (provided === null) return false;

  const providedBytes = new TextEncoder().encode(provided);
  const expectedBytes = new TextEncoder().encode(expected);

  let diff = providedBytes.length ^ expectedBytes.length;
  for (let i = 0; i < expectedBytes.length; i += 1) {
    // 길이가 짧으면 0 과 비교한다. 비교 횟수는 expected 길이에 고정된다.
    diff |= (providedBytes[i] ?? 0) ^ (expectedBytes[i] ?? 0);
  }
  return diff === 0;
}

/** production 이거나 `V2_ENFORCE_PROXY=true` 면 강제한다. */
export function shouldEnforceProxy(env: { VERCEL_ENV: string; V2_ENFORCE_PROXY: string }): boolean {
  return env.VERCEL_ENV === 'production' || env.V2_ENFORCE_PROXY === 'true';
}

export function proxy(request: NextRequest): NextResponse {
  const proxied = secretsMatch(request.headers.get(PROXY_SECRET_HEADER), serverEnv.V2_PROXY_SECRET);

  if (!proxied && shouldEnforceProxy(serverEnv)) {
    // 같은 path/query 를 유지한 채 메인 도메인으로 보낸다.
    // 308 이라 method 와 body 가 보존되고 영구 리디렉트로 캐시된다.
    const target = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      clientEnv.NEXT_PUBLIC_SITE_URL,
    );
    return NextResponse.redirect(target, 308);
  }

  const response = NextResponse.next();

  if (!proxied) {
    // 프록시를 거치지 않은 응답(preview, 로컬, origin 직접 접근)은 색인되지 않게 한다.
    response.headers.set('X-Robots-Tag', 'noindex');
  }

  return response;
}

export default proxy;

export const config = {
  /**
   * 정적 경로는 제외한다. `_next/static` 과 `_next/image` 는 빌드 산출물이고,
   * favicon/robots/sitemap 은 크롤러가 프록시 없이 받아도 되는 것들이다.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
