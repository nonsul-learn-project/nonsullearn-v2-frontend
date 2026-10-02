import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * robots / sitemap / metadata (HARNESS.md §5 robots·SEO 행).
 * Preview 가 색인되면 운영과 중복 콘텐츠가 되고 미완성 화면이 검색에 노출된다.
 */

const env = {
  NEXT_PUBLIC_SITE_URL: 'https://nonsul.example.test',
  NEXT_PUBLIC_LEGACY_BASE_URL: '',
  NEXT_PUBLIC_LEGACY_ASSET_HOST: 'assets.example.test',
  NEXT_PUBLIC_ANALYTICS_ENABLED: 'false',
  NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
  COURSE_SOURCE: 'mock',
  LEGACY_BRIDGE_BASE: 'https://nonsul.example.test/v2-api',
  V2_PROXY_SECRET: 'a'.repeat(40),
};

async function load(overrides: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries({ ...env, ...overrides })) {
    vi.stubEnv(key, value);
  }
  return {
    robots: (await import('@/app/robots')).default,
    sitemap: (await import('@/app/sitemap')).default,
    layout: await import('@/app/layout'),
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('robots', () => {
  it.each(['development', 'preview'])('%s 는 전부 disallow 다', async (vercelEnv) => {
    const { robots } = await load({ VERCEL_ENV: vercelEnv });
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules[0]?.disallow).toBe('/');
    expect(rules[0]?.allow).toBeUndefined();
    expect(result.sitemap).toBeUndefined();
  });

  it('production 은 allow 하되 내부 경로는 막는다', async () => {
    const { robots } = await load({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_VIEWER_SOURCE: 'http',
      COURSE_SOURCE: 'http',
    });
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules[0]?.allow).toBe('/');
    expect(rules[0]?.disallow).toEqual(['/_v2/', '/api/']);
  });

  it('production sitemap 은 NEXT_PUBLIC_SITE_URL 기준이다', async () => {
    const { robots } = await load({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_VIEWER_SOURCE: 'http',
      COURSE_SOURCE: 'http',
    });
    expect(robots().sitemap).toBe('https://nonsul.example.test/sitemap.xml');
  });
});

describe('sitemap', () => {
  it('지금은 비어 있다 (V2 가 운영하는 공개 페이지가 없다)', async () => {
    const { sitemap } = await load({ VERCEL_ENV: 'preview' });
    expect(sitemap()).toEqual([]);
  });
});

describe('metadata', () => {
  it('metadataBase 가 NEXT_PUBLIC_SITE_URL 이다 (canonical 기준)', async () => {
    const { layout } = await load({ VERCEL_ENV: 'preview' });
    expect(layout.metadata.metadataBase?.toString()).toBe('https://nonsul.example.test/');
  });

  it('origin 도메인이 아니라 메인 도메인을 쓴다', async () => {
    const { layout } = await load({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_VIEWER_SOURCE: 'http',
      COURSE_SOURCE: 'http',
      NEXT_PUBLIC_SITE_URL: 'https://nonsul.example.test',
    });
    // metadataBase 의 타입은 `string | URL` 이므로 URL 로 좁혀서 host 를 본다.
    const host = new URL(String(layout.metadata.metadataBase)).host;
    expect(host).not.toContain('v2-origin');
    expect(host).toBe('nonsul.example.test');
  });

  it('title template 과 description 이 있다', async () => {
    const { layout } = await load({ VERCEL_ENV: 'preview' });
    expect(layout.metadata.title).toMatchObject({ template: '%s | 논술런' });
    expect(layout.metadata.description).toBeTruthy();
  });
});
