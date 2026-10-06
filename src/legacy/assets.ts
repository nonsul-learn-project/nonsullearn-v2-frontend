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
