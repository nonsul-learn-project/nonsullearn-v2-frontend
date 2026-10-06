import { afterEach, describe, expect, it, vi } from 'vitest';

const originalAssetPrefix = process.env.V2_ASSET_PREFIX;

afterEach(() => {
  if (originalAssetPrefix === undefined) {
    delete process.env.V2_ASSET_PREFIX;
  } else {
    process.env.V2_ASSET_PREFIX = originalAssetPrefix;
  }
  vi.resetModules();
});

describe('Gate 4 방법 C assetPrefix', () => {
  it('env가 없으면 assetPrefix를 설정하지 않는다', async () => {
    delete process.env.V2_ASSET_PREFIX;
    vi.resetModules();

    const { default: config } = await import('../../next.config');

    expect(config.assetPrefix).toBeUndefined();
  });

  it('V2_ASSET_PREFIX가 있으면 절대 Vercel origin을 static asset prefix로 쓴다', async () => {
    process.env.V2_ASSET_PREFIX = 'https://nonsullearn-v2-frontend.vercel.app';
    vi.resetModules();

    const { default: config } = await import('../../next.config');

    expect(config.assetPrefix).toBe('https://nonsullearn-v2-frontend.vercel.app');
  });
});
