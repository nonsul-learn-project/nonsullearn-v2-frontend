import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * `/api/v2-health` (GATES.md Gate 1, HARNESS.md §6 스모크 S5/S6).
 *
 * 핵심은 **쿠키 값이나 헤더 원문이 응답에 절대 들어가지 않는 것**이다.
 * Gate 4 에서 S6 가 `cookieForwarded == false` 를 확인해 Apache 가 Cookie 를 제거했는지 판정한다.
 */

const env = {
  VERCEL_GIT_COMMIT_SHA: '',
};

async function loadRoute(overrides: Record<string, string> = {}) {
  vi.resetModules();
  for (const [key, value] of Object.entries({ ...env, ...overrides })) {
    vi.stubEnv(key, value);
  }
  return import('@/app/api/v2-health/route');
}

const request = (headers: Record<string, string> = {}) =>
  new NextRequest(new URL('https://v2-origin.example.test/api/v2-health'), {
    headers: new Headers(headers),
  });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('proxied', () => {
  it('Gate 4 전에는 요청 헤더와 무관하게 false 다', async () => {
    const { GET } = await loadRoute();
    expect((await GET(request()).json()).proxied).toBe(false);
    expect((await GET(request({ 'x-v2-proxy-secret': 'arbitrary' })).json()).proxied).toBe(false);
  });
});

describe('cookieForwarded — 쿠키 존재 여부만 boolean 으로', () => {
  it('쿠키가 없으면 false 다 (정상)', async () => {
    const { GET } = await loadRoute();
    const body = await GET(request()).json();
    expect(body.cookieForwarded).toBe(false);
  });

  it('쿠키가 오면 true 다 (Apache 설정 문제 신호)', async () => {
    const { GET } = await loadRoute();
    const body = await GET(request({ cookie: 'PHPSESSID=abc123' })).json();
    expect(body.cookieForwarded).toBe(true);
  });

  it('쿠키 값을 응답에 담지 않는다', async () => {
    const { GET } = await loadRoute();
    const response = GET(request({ cookie: 'PHPSESSID=supersecretsession; ck_mb_id=testuser' }));
    const text = await response.text();
    expect(text).not.toContain('supersecretsession');
    expect(text).not.toContain('PHPSESSID');
    expect(text).not.toContain('testuser');
    expect(text).not.toContain('ck_mb_id');
  });

  it('proxy 관련 요청 헤더 값을 응답에 담지 않는다', async () => {
    const { GET } = await loadRoute();
    const text = await GET(request({ 'x-v2-proxy-secret': 'arbitrary' })).text();
    expect(text).not.toContain('arbitrary');
  });

  it('헤더 원문을 담지 않는다', async () => {
    const { GET } = await loadRoute();
    const text = await GET(
      request({ cookie: 'a=b', 'user-agent': 'probe/1.0', 'x-forwarded-for': '203.0.113.9' }),
    ).text();
    expect(text).not.toContain('probe/1.0');
    expect(text).not.toContain('203.0.113.9');
  });
});

describe('응답 모양', () => {
  it('키는 proxied, cookieForwarded, sha 뿐이다', async () => {
    const { GET } = await loadRoute();
    const body = await GET(request()).json();
    expect(Object.keys(body).sort()).toEqual(['cookieForwarded', 'proxied', 'sha']);
  });

  it('VERCEL_GIT_COMMIT_SHA 가 없으면 sha 는 null 이다', async () => {
    const { GET } = await loadRoute();
    expect((await GET(request()).json()).sha).toBeNull();
  });

  it('VERCEL_GIT_COMMIT_SHA 가 있으면 그 값이다', async () => {
    const { GET } = await loadRoute({ VERCEL_GIT_COMMIT_SHA: 'abc1234' });
    expect((await GET(request()).json()).sha).toBe('abc1234');
  });
});

describe('캐시 / 색인', () => {
  it('Cache-Control 이 no-store 다', async () => {
    const { GET } = await loadRoute();
    expect(GET(request()).headers.get('Cache-Control')).toContain('no-store');
  });

  it('noindex 를 붙인다', async () => {
    const { GET } = await loadRoute();
    expect(GET(request()).headers.get('X-Robots-Tag')).toBe('noindex');
  });

  it('force-dynamic 이다 (매 요청 실제 헤더를 봐야 한다)', async () => {
    const route = await loadRoute();
    expect(route.dynamic).toBe('force-dynamic');
  });
});
