import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Origin 보호 (GATES.md Gate 1 "middleware origin 보호", Gate 4 스모크 S9).
 *
 * 실제 파일은 `src/proxy.ts` 다 — Next.js 16 이 `middleware` 규약을 대체했다.
 * env 조합마다 모듈을 다시 읽어야 하므로 `vi.resetModules()` + 동적 import 를 쓴다.
 */

const SECRET = 'a'.repeat(40);

const baseEnv = {
  NEXT_PUBLIC_SITE_URL: 'https://nonsul.example.test',
  NEXT_PUBLIC_LEGACY_BASE_URL: '',
  NEXT_PUBLIC_LEGACY_ASSET_HOST: 'assets.example.test',
  NEXT_PUBLIC_ANALYTICS_ENABLED: 'false',
  LEGACY_BRIDGE_BASE: 'https://nonsul.example.test/v2-api',
  V2_PROXY_SECRET: SECRET,
};

/** env 를 바꿔 끼우고 proxy 모듈을 새로 불러온다. */
async function loadProxy(overrides: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries({ ...baseEnv, ...overrides })) {
    vi.stubEnv(key, value);
  }
  return import('@/proxy');
}

const request = (url: string, headers: Record<string, string> = {}) =>
  new NextRequest(new URL(url), { headers: new Headers(headers) });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('production 에서 secret 이 맞지 않으면 308', () => {
  const productionEnv = {
    VERCEL_ENV: 'production',
    NEXT_PUBLIC_VIEWER_SOURCE: 'http',
    COURSE_SOURCE: 'http',
  };

  it('헤더가 없으면 메인 도메인으로 308 이다', async () => {
    const { proxy } = await loadProxy(productionEnv);
    const response = proxy(request('https://v2-origin.example.test/courses/1'));
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://nonsul.example.test/courses/1');
  });

  it('path 와 query 를 그대로 유지한다', async () => {
    const { proxy } = await loadProxy(productionEnv);
    const response = proxy(request('https://v2-origin.example.test/courses/1?utm_source=x&a=b'));
    expect(response.headers.get('location')).toBe(
      'https://nonsul.example.test/courses/1?utm_source=x&a=b',
    );
  });

  it('secret 이 틀리면 308 이다', async () => {
    const { proxy } = await loadProxy(productionEnv);
    const response = proxy(
      request('https://v2-origin.example.test/', { 'x-v2-proxy-secret': 'b'.repeat(40) }),
    );
    expect(response.status).toBe(308);
  });

  it('secret 이 짧게 잘렸어도 통과하지 않는다 (길이 비교 누락 방지)', async () => {
    const { proxy } = await loadProxy(productionEnv);
    for (const wrong of [SECRET.slice(0, 39), SECRET.slice(0, 1), '', `${SECRET}x`]) {
      const response = proxy(
        request('https://v2-origin.example.test/', { 'x-v2-proxy-secret': wrong }),
      );
      expect(response.status, `secret "${wrong.slice(0, 5)}..." 가 통과했다`).toBe(308);
    }
  });

  it('secret 이 맞으면 통과하고 noindex 를 붙이지 않는다', async () => {
    const { proxy } = await loadProxy(productionEnv);
    const response = proxy(
      request('https://v2-origin.example.test/', { 'x-v2-proxy-secret': SECRET }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Robots-Tag')).toBeNull();
  });
});

describe('V2_ENFORCE_PROXY', () => {
  it('true 면 preview 에서도 강제한다', async () => {
    const { proxy } = await loadProxy({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      COURSE_SOURCE: 'mock',
      V2_ENFORCE_PROXY: 'true',
    });
    expect(proxy(request('https://v2-origin.example.test/')).status).toBe(308);
  });

  it('false 면 preview 는 통과하되 noindex 가 붙는다', async () => {
    const { proxy } = await loadProxy({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      COURSE_SOURCE: 'mock',
      V2_ENFORCE_PROXY: 'false',
    });
    const response = proxy(request('https://v2-origin.example.test/'));
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
  });

  it('로컬(development)도 통과하되 noindex 가 붙는다', async () => {
    const { proxy } = await loadProxy({
      VERCEL_ENV: 'development',
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      COURSE_SOURCE: 'mock',
    });
    const response = proxy(request('http://localhost:3000/'));
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
  });
});

describe('shouldEnforceProxy', () => {
  it('production 이거나 V2_ENFORCE_PROXY=true 일 때만 강제한다', async () => {
    const { shouldEnforceProxy } = await loadProxy({
      VERCEL_ENV: 'development',
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      COURSE_SOURCE: 'mock',
    });
    expect(shouldEnforceProxy({ VERCEL_ENV: 'production', V2_ENFORCE_PROXY: 'false' })).toBe(true);
    expect(shouldEnforceProxy({ VERCEL_ENV: 'preview', V2_ENFORCE_PROXY: 'true' })).toBe(true);
    expect(shouldEnforceProxy({ VERCEL_ENV: 'preview', V2_ENFORCE_PROXY: 'false' })).toBe(false);
    expect(shouldEnforceProxy({ VERCEL_ENV: 'development', V2_ENFORCE_PROXY: 'false' })).toBe(
      false,
    );
  });
});

describe('matcher', () => {
  it('정적 경로를 제외한다', async () => {
    const { config } = await loadProxy({
      VERCEL_ENV: 'development',
      NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
      COURSE_SOURCE: 'mock',
    });
    const pattern = new RegExp(`^${config.matcher[0]}$`);

    for (const excluded of [
      '/_next/static/chunk.js',
      '/_next/image',
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
    ]) {
      expect(pattern.test(excluded), `${excluded} 는 제외돼야 한다`).toBe(false);
    }

    for (const included of ['/', '/courses/1', '/_v2/check', '/api/v2-health']) {
      expect(pattern.test(included), `${included} 는 포함돼야 한다`).toBe(true);
    }
  });
});
