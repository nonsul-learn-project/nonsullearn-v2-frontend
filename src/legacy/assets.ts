import { clientEnv } from '@/env.client';

/**
 * Legacy 자산(강좌 썸네일 등) URL 결합.
 *
 * Bridge 는 `image` 를 **Legacy DB 기준 상대 경로**(`/data/item/...`)로 준다. 호스트를 붙이는 일은
 * adapter 가 아니라 **렌더 시점**에 여기서 한다. 이유:
 *
 *   - adapter 가 호스트를 붙여 캐시하면, asset host 를 바꿀 때 ISR 캐시가 전부 낡은 값이 된다.
 *   - Contract(`contracts/bridge/`)가 상대 경로만 허용한다. adapter 가 변환하면 Contract 와
 *     adapter 출력이 달라져 fixture 로 검증할 수 없게 된다.
 *
 * 이 모듈은 클라이언트에서도 안전하다 (`NEXT_PUBLIC_LEGACY_ASSET_HOST` 만 읽는다).
 *
 * AGENTS.md §6.3: 이 호스트는 `next.config` 의 `remotePatterns` 에 등록돼 있어야
 * Gate 4 방법 C의 Hero 등은 `next/image unoptimized`로 이 원본 URL을 직접 쓴다.
 */

/**
 * 이미지가 없는 강좌용 자리표시자. 로컬 `public/` 자산이므로 Legacy 호스트를 타지 않는다.
 *
 * SVG 라서 `next/image` 로 쓰려면 `unoptimized` 가 필요하다 (`dangerouslyAllowSVG` 를 켜는 대신).
 * 실제 사용은 Gate 8 강좌 UI 에서 결정한다.
 */
export const COURSE_IMAGE_PLACEHOLDER = '/images/course-placeholder.svg';

/**
 * `image` 값을 렌더 가능한 URL 로 바꾼다.
 *
 *   `/data/item/1001/thumb.jpg` → `https://<asset host>/data/item/1001/thumb.jpg`
 *   `https://...`               → 그대로 (이미 절대 URL)
 *   `null`                      → `COURSE_IMAGE_PLACEHOLDER`
 */
export function legacyAssetUrl(image: string | null): string {
  if (image === null || image === '') return COURSE_IMAGE_PLACEHOLDER;

  // 이미 절대 URL 이면 손대지 않는다. Contract 는 상대 경로만 허용하지만,
  // 다른 출처(예: `src/content/`)의 값이 이 함수를 지나갈 수 있다.
  if (/^https?:\/\//i.test(image)) return image;

  // protocol-relative(`//host/path`)도 절대 URL 로 취급한다. 호스트를 덧붙이면 깨진다.
  if (image.startsWith('//')) return `https:${image}`;

  const path = image.startsWith('/') ? image : `/${image}`;
  return `https://${clientEnv.NEXT_PUBLIC_LEGACY_ASSET_HOST}${path}`;
}

/**
 * Legacy 가 상품 이미지에 쓰는 **썸네일** URL. Legacy `<img src>` 와 바이트 단위로 같다.
 *
 * `shop/item.php` 는 원본을 그대로 쓰지 않는다. `get_it_thumbnail()` 이
 * `thumbnail.lib.php` 로 `thumb-{확장자 뗀 이름}_{너비}x{높이}.{확장자}` 를 만들어 쓴다
 * (`html2/lib/thumbnail.lib.php:277`). 원본은 3MB 대인데 썸네일은 300KB 대라
 * 원본을 쓰면 Legacy 보다 10배 무거운 화면이 된다.
 *
 * 이름 규칙이 Legacy 구현 세부사항이라 `src/legacy/` 안에 둔다 (AGENTS.md §2 절대 원칙 5).
 *
 * Legacy 는 파일을 요청 시점에 생성하므로, 아직 생성되지 않은 썸네일은 404 다.
 * 그 경우를 위해 호출하는 쪽이 `onError` 로 원본(`legacyAssetUrl`)으로 되돌릴 수 있게
 * 원본 URL 도 같이 돌려준다.
 */
export interface LegacyThumbnail {
  /** `thumb-..._860x485.png` 절대 URL. */
  url: string;
  /** 썸네일이 없을 때 쓸 원본 절대 URL. */
  originalUrl: string;
  width: number;
  height: number;
}

/**
 * `shop/item.php` 의 큰 이미지 크기. Legacy `de_mimg_width`/`de_mimg_height` 값이며
 * 운영 응답의 `<img width="860" height="485">` 로 확인했다.
 */
export const COURSE_IMAGE_WIDTH = 860;
export const COURSE_IMAGE_HEIGHT = 485;

export function legacyItemThumbnail(
  image: string,
  width: number = COURSE_IMAGE_WIDTH,
  height: number = COURSE_IMAGE_HEIGHT,
): LegacyThumbnail {
  const originalUrl = legacyAssetUrl(image);
  const slash = image.lastIndexOf('/');
  const dir = slash === -1 ? '' : image.slice(0, slash + 1);
  const filename = image.slice(slash + 1);
  const dot = filename.lastIndexOf('.');
  // 확장자가 없으면 썸네일 이름을 만들 수 없다. 원본을 쓴다.
  if (dot <= 0) return { url: originalUrl, originalUrl, width, height };

  const base = filename.slice(0, dot);
  const extension = filename.slice(dot);
  return {
    url: legacyAssetUrl(`${dir}thumb-${base}_${width}x${height}${extension}`),
    originalUrl,
    width,
    height,
  };
}
