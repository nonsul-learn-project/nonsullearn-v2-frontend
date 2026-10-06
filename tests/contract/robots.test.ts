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

async function loadHome(env: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return (await import('@/app/page')).metadata;
}

describe('robots', () => {
  it.each(['', 'preview', 'production'])('%s 환경에서도 전체 disallow다', async (vercelEnv) => {
    const { robots } = await load(vercelEnv);
    const rules = robots().rules;
    expect(Array.isArray(rules) ? rules[0]?.disallow : rules.disallow).toBe('/');
  });

  it.each(['true', 'false'])(
    'V2_ENFORCE_PROXY=%s 여도 robots.txt 는 전체 disallow 를 유지한다',
    async (enforce) => {
      vi.resetModules();
      vi.stubEnv('V2_ENFORCE_PROXY', enforce);
      const robots = (await import('@/app/robots')).default;
      const rules = robots().rules;
      expect(Array.isArray(rules) ? rules[0]?.disallow : rules.disallow).toBe('/');
    },
  );
});

describe('홈 index / canonical', () => {
  it('V2_ENFORCE_PROXY 가 없으면 layout 의 noindex 를 그대로 상속한다', async () => {
    const home = await loadHome({});

    expect(home.robots).toBeUndefined();
    expect(home.alternates?.canonical).toBeUndefined();
  });

  it('V2_ENFORCE_PROXY=false 면 index 를 열지 않는다', async () => {
    const home = await loadHome({ V2_ENFORCE_PROXY: 'false' });

    expect(home.robots).toBeUndefined();
  });

  it('V2_ENFORCE_PROXY=true 면 index 를 열고 메인 도메인을 canonical 로 찍는다', async () => {
    const home = await loadHome({ V2_ENFORCE_PROXY: 'true' });

    expect(home.robots).toEqual({ index: true, follow: true });
    expect(home.alternates?.canonical).toBe('https://nonsul-learn.com/');
  });

  it('NEXT_PUBLIC_SITE_URL 이 있으면 canonical 기준이 그쪽이다 (AGENTS.md §6.3)', async () => {
    const home = await loadHome({
      V2_ENFORCE_PROXY: 'true',
      NEXT_PUBLIC_SITE_URL: 'https://www.nonsul-learn.com',
    });

    expect(home.alternates?.canonical).toBe('https://www.nonsul-learn.com/');
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
