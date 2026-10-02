import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('proxy', () => {
  it.each(['', 'preview', 'production'])('%s 환경에서도 요청을 그대로 통과시킨다', async (vercelEnv) => {
    vi.stubEnv('VERCEL_ENV', vercelEnv);
    const { proxy } = await import('@/proxy');
    const response = proxy(new NextRequest('https://v2-origin.example.test/courses/1'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('Gate 4 재도입을 위한 matcher 경계를 유지한다', async () => {
    const { config } = await import('@/proxy');
    const pattern = new RegExp(`^${config.matcher[0]}$`);

    expect(pattern.test('/_next/static/chunk.js')).toBe(false);
    expect(pattern.test('/courses/1')).toBe(true);
  });
});
