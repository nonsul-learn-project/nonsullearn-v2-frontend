import { afterEach, describe, expect, it, vi } from 'vitest';

async function load(vercelEnv: string) {
  vi.resetModules();
  vi.stubEnv('VERCEL_ENV', vercelEnv);
  return {
    robots: (await import('@/app/robots')).default,
    layout: await import('@/app/layout'),
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('robots', () => {
  it.each(['', 'preview', 'production'])('%s 환경에서도 전체 disallow다', async (vercelEnv) => {
    const { robots } = await load(vercelEnv);
    const rules = robots().rules;
    expect(Array.isArray(rules) ? rules[0]?.disallow : rules.disallow).toBe('/');
  });
});

describe('metadata', () => {
  it('site URL과 Vercel URL이 없으면 metadataBase를 생략한다', async () => {
    const { layout } = await load('production');
    expect(layout.metadata.metadataBase).toBeUndefined();
  });

  it('Vercel URL이 있을 때만 metadataBase를 만든다', async () => {
    vi.resetModules();
    vi.stubEnv('VERCEL_URL', 'nonsul.example.test');
    const layout = await import('@/app/layout');
    expect(layout.metadata.metadataBase?.toString()).toBe('https://nonsul.example.test/');
  });
});
