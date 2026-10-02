import { afterEach, describe, expect, it, vi } from 'vitest';

import { CANONICAL_EVENTS, isCanonicalEvent } from '@/analytics';

/**
 * L2 — analytics (HARNESS.md §4 analytics 표).
 *
 * canonical 이름 검사는 **타입**으로 한다. `tests/component/analytics.types.test-d.ts` 가 아니라
 * 여기서는 런타임 동작(disabled 시 provider 0회)과 목록 자체를 검증한다.
 * UTM/attribution 은 Gate 5/7 범위다.
 */

const env = {
  NEXT_PUBLIC_SITE_URL: 'https://nonsul.example.test',
  NEXT_PUBLIC_LEGACY_BASE_URL: '',
  NEXT_PUBLIC_LEGACY_ASSET_HOST: 'assets.example.test',
  NEXT_PUBLIC_VIEWER_SOURCE: 'mock',
};

async function loadTrack(analyticsEnabled: 'true' | 'false') {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', analyticsEnabled);
  return (await import('@/analytics')).track;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('canonical 목록', () => {
  it('AGENTS.md §8 이 정한 5개다', () => {
    expect([...CANONICAL_EVENTS]).toEqual([
      'page_view',
      'cta_click',
      'course_view',
      'begin_checkout',
      'bridge_error',
    ]);
  });

  it('purchase 는 목록에 없다 (Legacy 결제 완료 페이지가 소유한다)', () => {
    expect(isCanonicalEvent('purchase')).toBe(false);
  });

  it('목록에 없는 이름은 거부한다', () => {
    for (const name of ['purchase', 'add_to_cart', 'login', 'sign_up', '']) {
      expect(isCanonicalEvent(name)).toBe(false);
    }
  });
});

describe('ANALYTICS_ENABLED=false', () => {
  it('provider 를 호출하지 않는다', async () => {
    const track = await loadTrack('false');
    const gtag = vi.fn();
    const fbq = vi.fn();
    const wcs = vi.fn();
    vi.stubGlobal('gtag', gtag);
    vi.stubGlobal('fbq', fbq);
    vi.stubGlobal('wcs', wcs);
    vi.spyOn(console, 'info').mockImplementation(() => {});

    track('page_view', { path: '/' });
    track('cta_click', { label: '수강신청', destination: '/shop/item.php?it_id=1' });

    expect(gtag).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
    expect(wcs).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('console 출력만 한다', async () => {
    const track = await loadTrack('false');
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    track('bridge_error', { contract: 'viewer', kind: 'timeout' });
    expect(info).toHaveBeenCalledWith('[analytics:disabled]', 'bridge_error', {
      contract: 'viewer',
      kind: 'timeout',
    });
  });
});

describe('ANALYTICS_ENABLED=true', () => {
  it('아직 provider 가 연결되지 않았다 (Gate 5)', async () => {
    const track = await loadTrack('true');
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    track('course_view', { courseId: '1001' });
    expect(info).toHaveBeenCalledWith('[analytics]', 'course_view', { courseId: '1001' });
  });
});
