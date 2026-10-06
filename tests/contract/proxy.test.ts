import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const SECRET = 'gate6-shared-secret-not-production';
const ORIGIN = 'https://nonsullearn-v2-frontend.vercel.app';

/** `serverEnv` 는 모듈 로드 시점에 한 번 파싱되므로 env 를 바꾸면 모듈을 다시 읽어야 한다. */
async function loadProxy(env: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return (await import('@/proxy')).proxy;
}

function request(pathname: string, secret?: string): NextRequest {
  return new NextRequest(`${ORIGIN}${pathname}`, {
    headers: secret === undefined ? undefined : { 'X-V2-Proxy-Secret': secret },
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('proxy — 검사가 꺼진 동안', () => {
  it.each(['', 'preview', 'production'])(
    'V2_ENFORCE_PROXY 가 없으면 %s 환경에서도 헤더 없이 통과한다',
    async (vercelEnv) => {
      const proxy = await loadProxy({ VERCEL_ENV: vercelEnv });
      const response = proxy(request('/courses/1'));

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    },
  );

  it('V2_ENFORCE_PROXY=false 면 헤더가 틀려도 통과한다', async () => {
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'false', V2_PROXY_SECRET: SECRET });

    expect(proxy(request('/', 'wrong')).status).toBe(200);
  });

  it('V2_ENFORCE_PROXY=true 라도 secret 이 없으면 통과한다 (ADR 0009)', async () => {
    // secret 은 Vercel 에만 등록한다. 로컬·CI 빌드가 403 으로 막히면 안 된다.
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true' });

    expect(proxy(request('/')).status).toBe(200);
  });
});

describe('proxy — 검사가 켜졌을 때', () => {
  it('secret 이 일치하면 통과한다', async () => {
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true', V2_PROXY_SECRET: SECRET });
    const response = proxy(request('/courses/1', SECRET));

    expect(response.status).toBe(200);
  });

  it.each([
    ['값이 다르면', `${SECRET}-nope`],
    ['길이가 짧으면', SECRET.slice(0, -1)],
    ['빈 문자열이면', ''],
  ])('secret 이 %s 403 이다', async (_label, provided) => {
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true', V2_PROXY_SECRET: SECRET });

    expect(proxy(request('/courses/1', provided)).status).toBe(403);
  });

  it('헤더가 아예 없으면 403 이다', async () => {
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true', V2_PROXY_SECRET: SECRET });

    expect(proxy(request('/courses/1')).status).toBe(403);
  });

  it('403 응답은 본문도 캐시도 남기지 않는다', async () => {
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true', V2_PROXY_SECRET: SECRET });
    const response = proxy(request('/', 'wrong'));

    await expect(response.text()).resolves.toBe('');
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
    expect(response.headers.get('x-robots-tag')).toBe('noindex');
    // 받은 값이나 기대값이 어떤 헤더로도 새지 않아야 한다.
    expect(JSON.stringify([...response.headers])).not.toContain(SECRET);
  });

  it.each(['/_next/static/chunks/main.js', '/robots.txt', '/api/v2-health'])(
    '%s 는 헤더 없이도 통과한다',
    async (pathname) => {
      const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true', V2_PROXY_SECRET: SECRET });

      expect(proxy(request(pathname)).status).toBe(200);
    },
  );

  it('예외 경로가 아닌 API 는 그대로 막는다', async () => {
    const proxy = await loadProxy({ V2_ENFORCE_PROXY: 'true', V2_PROXY_SECRET: SECRET });

    expect(proxy(request('/api/v2-health/other')).status).toBe(403);
  });
});

describe('proxy — matcher', () => {
  it('정적 자산과 robots/sitemap 은 matcher 단계에서 제외된다', async () => {
    const { config } = await import('@/proxy');
    const pattern = new RegExp(`^${config.matcher[0]}$`);

    expect(pattern.test('/_next/static/chunk.js')).toBe(false);
    expect(pattern.test('/robots.txt')).toBe(false);
    expect(pattern.test('/sitemap.xml')).toBe(false);
    expect(pattern.test('/courses/1')).toBe(true);
    expect(pattern.test('/api/v2-health')).toBe(true);
  });
});
