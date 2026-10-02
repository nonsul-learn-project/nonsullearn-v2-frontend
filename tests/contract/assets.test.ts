import { describe, expect, it } from 'vitest';

import { COURSE_IMAGE_PLACEHOLDER, legacyAssetUrl } from '@/legacy';

/**
 * L1 — Legacy 자산 URL 결합.
 *
 * Contract 는 `image` 를 상대 경로로만 허용한다. 호스트 결합은 adapter 가 아니라
 * 렌더 시점(`legacyAssetUrl`)에서 한다 — adapter 가 결합해 ISR 로 캐시하면
 * asset host 를 바꿀 때 캐시가 전부 낡은 값이 된다.
 *
 * 테스트 env 의 asset host 는 `nonsul-learn.com` 이다 (vitest.config.ts).
 */

const HOST = 'nonsul-learn.com';

describe('상대 경로에 호스트를 붙인다', () => {
  it('Legacy 썸네일 경로', () => {
    expect(legacyAssetUrl('/data/item/1001/thumb.jpg')).toBe(
      `https://${HOST}/data/item/1001/thumb.jpg`,
    );
  });

  it('선행 슬래시가 없어도 붙인다', () => {
    expect(legacyAssetUrl('data/item/x.jpg')).toBe(`https://${HOST}/data/item/x.jpg`);
  });

  it('쿼리와 한글 파일명을 그대로 보존한다', () => {
    expect(legacyAssetUrl('/data/item/강좌.jpg?v=2')).toBe(
      `https://${HOST}/data/item/강좌.jpg?v=2`,
    );
  });
});

describe('이미 절대 URL 이면 손대지 않는다', () => {
  it.each([
    'https://cdn.example.test/a.jpg',
    'http://cdn.example.test/a.jpg',
    'HTTPS://CDN.EXAMPLE.TEST/a.jpg',
  ])('%s', (url) => {
    expect(legacyAssetUrl(url)).toBe(url);
  });

  it('protocol-relative 는 https 를 붙이고 호스트를 덧대지 않는다', () => {
    expect(legacyAssetUrl('//cdn.example.test/a.jpg')).toBe('https://cdn.example.test/a.jpg');
  });
});

describe('이미지가 없으면 자리표시자다', () => {
  it('null → placeholder', () => {
    expect(legacyAssetUrl(null)).toBe(COURSE_IMAGE_PLACEHOLDER);
  });

  it('빈 문자열 → placeholder', () => {
    expect(legacyAssetUrl('')).toBe(COURSE_IMAGE_PLACEHOLDER);
  });

  it('placeholder 는 로컬 자산이다 (Legacy 호스트를 타지 않는다)', () => {
    expect(COURSE_IMAGE_PLACEHOLDER.startsWith('/')).toBe(true);
    expect(COURSE_IMAGE_PLACEHOLDER).not.toContain(HOST);
  });
});

describe('결과는 항상 렌더 가능한 값이다', () => {
  it('어떤 입력에도 빈 문자열을 돌려주지 않는다', () => {
    for (const input of [null, '', '/a.jpg', 'a.jpg', '//h/a.jpg', 'https://h/a.jpg']) {
      expect(legacyAssetUrl(input).length).toBeGreaterThan(0);
    }
  });
});
