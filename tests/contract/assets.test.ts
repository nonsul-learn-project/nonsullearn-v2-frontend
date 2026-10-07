import { describe, expect, it } from 'vitest';

import {
  COURSE_IMAGE_HEIGHT,
  COURSE_IMAGE_PLACEHOLDER,
  COURSE_IMAGE_WIDTH,
  legacyAssetUrl,
  legacyItemThumbnail,
} from '@/legacy';

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

describe('legacyItemThumbnail — Legacy get_it_thumbnail()', () => {
  it('thumb-{이름}_{너비}x{높이}{확장자} 를 만든다', () => {
    // html2/lib/thumbnail.lib.php:277 의 이름 규칙.
    // 운영 응답 확인: /data/item/1791259062/thumb-7J2466y464W87Iig_149_860x485.png
    expect(legacyItemThumbnail('/data/item/1791259062/7J2466y464W87Iig_149.png').url).toBe(
      'https://nonsul-learn.com/data/item/1791259062/thumb-7J2466y464W87Iig_149_860x485.png',
    );
  });

  it('기본 크기는 shop/item.php 의 860x485 다', () => {
    const thumbnail = legacyItemThumbnail('/data/item/1/a.jpg');
    expect(thumbnail.width).toBe(COURSE_IMAGE_WIDTH);
    expect(thumbnail.height).toBe(COURSE_IMAGE_HEIGHT);
    expect(COURSE_IMAGE_WIDTH).toBe(860);
    expect(COURSE_IMAGE_HEIGHT).toBe(485);
  });

  it('원본 URL 도 같이 준다 (썸네일이 아직 생성되지 않았을 때의 대안)', () => {
    expect(legacyItemThumbnail('/data/item/1/a.jpg').originalUrl).toBe(
      'https://nonsul-learn.com/data/item/1/a.jpg',
    );
  });

  it('확장자가 없으면 썸네일 이름을 만들 수 없으므로 원본을 쓴다', () => {
    const thumbnail = legacyItemThumbnail('/data/item/1/noext');
    expect(thumbnail.url).toBe(thumbnail.originalUrl);
  });

  it('점으로 시작하는 파일명(숨김 파일)도 원본으로 떨어진다', () => {
    const thumbnail = legacyItemThumbnail('/data/item/1/.hidden');
    expect(thumbnail.url).toBe(thumbnail.originalUrl);
  });

  it('크기를 바꾸면 파일명도 같이 바뀐다', () => {
    expect(legacyItemThumbnail('/data/item/1/a.png', 70, 70).url).toBe(
      'https://nonsul-learn.com/data/item/1/thumb-a_70x70.png',
    );
  });
});
