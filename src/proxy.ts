/**
 * Gate 4 전에는 모든 요청을 그대로 통과시킨다.
 *
 * Gate 4 routing 검증 시 Apache proxy secret 검사와 origin redirect를 여기에서
 * 다시 도입한다. 상세 재도입 목록은 ADR 0006을 따른다.
 */
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
  void request;
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
