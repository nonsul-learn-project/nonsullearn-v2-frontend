import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * L1 — 소스 선택과 404 매핑.
 *
 * Preview 에서 `/courses/<실제 id>` 가 404 였던 회귀를 고정한다. 원인은
 * `COURSE_SOURCE` 기본값이 `mock` 이라서 Preview 가 fixture 를 돌려주고, 실제 id 가
 * mock 에 없으니 `null` → `notFound()` 로 간 것이었다.
 */

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadUseMockBridge() {
  vi.resetModules();
  const { shouldUseMockBridge } = await import('@/env.server');
  return shouldUseMockBridge;
}

describe('shouldUseMockBridge — hosted 에서는 mock 을 쓰지 않는다', () => {
  it('local(development)에서는 COURSE_SOURCE 기본값대로 mock 이다', async () => {
    vi.stubEnv('VERCEL_ENV', undefined);
    vi.stubEnv('COURSE_SOURCE', undefined);
    expect((await loadUseMockBridge())()).toBe(true);
  });

  it('local 에서 COURSE_SOURCE=http 면 http 다', async () => {
    vi.stubEnv('VERCEL_ENV', undefined);
    vi.stubEnv('COURSE_SOURCE', 'http');
    expect((await loadUseMockBridge())()).toBe(false);
  });

  it.each(['preview', 'production'])(
    '%s 에서는 COURSE_SOURCE 를 보지 않고 항상 http 다',
    async (env) => {
      // 이게 404 회귀의 핵심이다. COURSE_SOURCE 가 mock 이어도 실제 Bridge 를 불러야 한다.
      vi.stubEnv('VERCEL_ENV', env);
      vi.stubEnv('COURSE_SOURCE', 'mock');
      vi.stubEnv('LEGACY_BRIDGE_BASE', 'https://nonsul-learn.com/v2-api');
      expect((await loadUseMockBridge())()).toBe(false);
    },
  );

  it.each(['preview', 'production'])(
    '%s 에서 LEGACY_BRIDGE_BASE 가 없으면 mock 으로 떨어지지 않고 터진다',
    async (env) => {
      vi.stubEnv('VERCEL_ENV', env);
      vi.stubEnv('COURSE_SOURCE', 'mock');
      vi.stubEnv('LEGACY_BRIDGE_BASE', undefined);
      const shouldUseMockBridge = await loadUseMockBridge();
      expect(() => shouldUseMockBridge()).toThrow(/LEGACY_BRIDGE_BASE/);
    },
  );
});

describe('Bridge 실패는 404 가 아니다', () => {
  /** 404 만 `null`(없는 강좌)이고 나머지는 전부 throw 여야 한다. */
  async function callWith(response: Response) {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('COURSE_SOURCE', 'http');
    vi.stubEnv('LEGACY_BRIDGE_BASE', 'https://nonsul-learn.com/v2-api');
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    const { getCourseDetailHttp } = await import('@/legacy/adapters/course-detail/http');
    return getCourseDetailHttp('1791259062');
  }

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });

  it('404 는 없는 강좌이므로 null 이다', async () => {
    await expect(callWith(json({ error: 'not_found' }, 404))).resolves.toBeNull();
  });

  it('503 은 throw 한다 (notFound 로 바뀌면 안 된다)', async () => {
    await expect(callWith(json({ error: 'bridge_unavailable' }, 503))).rejects.toThrow();
  });

  it('400 은 throw 한다', async () => {
    await expect(callWith(json({ error: 'invalid_parameter' }, 400))).rejects.toThrow();
  });

  it('Contract 불일치는 throw 한다', async () => {
    await expect(callWith(json({ v: 1, item: { id: '1' } }, 200))).rejects.toThrow();
  });

  it('JSON 이 아닌 응답(Legacy HTML)은 throw 한다', async () => {
    await expect(
      callWith(new Response('<html></html>', { status: 200, headers: { 'content-type': 'text/html' } })),
    ).rejects.toThrow();
  });
});
