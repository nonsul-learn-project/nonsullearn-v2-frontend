import { NextResponse, type NextRequest } from 'next/server';

import { serverEnv } from '@/env.server';

/**
 * 프록시 진단 endpoint. Gate 4 스모크 S5/S6 가 이걸로 판정한다 (HARNESS.md §6).
 *
 * 가장 중요한 것은 `cookieForwarded` 다. Apache 가 프록시할 때 Cookie 헤더를 제거하는지
 * 이 값으로 확인한다. V2 는 PHP 세션 쿠키를 받아서는 안 된다 (AGENTS.md §2 절대 원칙 2).
 *
 * **쿠키 값이나 헤더 원문을 응답에 담지 않는다.** 존재 여부만 boolean 으로 돌려준다.
 * 이 응답이 로그나 스크린샷에 남아도 세션이 새지 않아야 한다.
 */

// 매 요청 실제 헤더를 봐야 하므로 캐시하지 않는다. AGENTS.md §6.3 이 허용한 유일한 예외다.
export const dynamic = 'force-dynamic';

export function GET(request: NextRequest): NextResponse {
  const body = {
    /** Gate 4 전에는 proxy 검증을 하지 않는다. */
    proxied: false,
    /** 쿠키가 V2 까지 전달됐는가. **false 여야 정상이다.** */
    cookieForwarded: request.headers.get('cookie') !== null,
    /** 어느 배포인지. Vercel 이 주입한다. */
    sha: serverEnv.VERCEL_GIT_COMMIT_SHA,
  };

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      // 진단 endpoint 가 검색에 잡히지 않게 한다.
      'X-Robots-Tag': 'noindex',
    },
  });
}
