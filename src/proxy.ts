/**
 * Origin 보호 (AGENTS.md §4 `proxy.ts`, ADR 0006 재도입 목록 / ADR 0009).
 *
 * Apache 정문이 Vercel 로 프록시할 때 `X-V2-Proxy-Secret` 을 붙인다. 그 헤더가 맞지 않으면
 * Vercel 배포 URL 로 직접 들어온 요청이므로 403 으로 막는다.
 *
 * `V2_ENFORCE_PROXY=true` 이고 `V2_PROXY_SECRET` 이 있을 때만 검사한다. 둘 중 하나라도 없으면
 * Gate 4 전과 똑같이 전부 통과시킨다 — secret 은 Vercel 에만 등록하므로 로컬과 CI 는
 * 검사 없이 돌아야 한다.
 */
import { NextResponse, type NextRequest } from 'next/server';

import { serverEnv } from '@/env.server';

/** Apache 가 붙이는 공유 비밀 헤더. 이름과 값 모두 로그에 남기지 않는다. */
const SECRET_HEADER = 'x-v2-proxy-secret';

/**
 * 프록시를 거치지 않아도 되는 경로.
 *
 * `/_next/static/*` 과 `robots.txt` 는 아래 `config.matcher` 에서 이미 제외돼 여기까지 오지
 * 않지만, matcher 가 바뀌어도 정적 자산과 진단 endpoint 가 막히지 않도록 함수 안에서도 센다.
 * `/api/v2-health` 는 Apache 설정을 고치는 사람이 프록시 동작을 확인하는 통로라 반드시 열어 둔다
 * (HARNESS.md §6 스모크 S5/S6).
 */
function isExempt(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname === '/robots.txt' ||
    pathname === '/api/v2-health'
  );
}

/**
 * 길이와 내용을 모두 상수시간으로 비교한다.
 *
 * Edge 런타임에는 `node:crypto` 의 `timingSafeEqual` 이 없으므로 직접 구현한다. 길이가 달라도
 * 바로 끝내지 않고 둘 중 긴 쪽까지 전부 훑어서, 처음 몇 글자가 맞았는지가 응답 시간으로
 * 새지 않게 한다.
 */
function timingSafeEqual(actual: string, expected: string): boolean {
  const encoder = new TextEncoder();
  const a = encoder.encode(actual);
  const b = encoder.encode(expected);
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    diff |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return diff === 0;
}

/** 헤더 값이나 실패 이유를 본문에 담지 않는다. 캐시에도 남기지 않는다. */
function forbidden(): NextResponse {
  return new NextResponse(null, {
    status: 403,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex',
    },
  });
}

export function proxy(request: NextRequest): NextResponse {
  const secret = serverEnv.V2_PROXY_SECRET;
  if (serverEnv.V2_ENFORCE_PROXY !== 'true' || secret === undefined || secret === '') {
    return NextResponse.next();
  }
  if (isExempt(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const provided = request.headers.get(SECRET_HEADER);
  if (provided === null || !timingSafeEqual(provided, secret)) {
    return forbidden();
  }
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
