import type { MetadataRoute } from 'next';

/**
 * 현재 V2 가 운영하는 공개 페이지가 없다. 홈은 Gate 5/6 에서 이전하고,
 * 강좌 상세는 Gate 8 이다. 그때까지 sitemap 은 비어 있는 것이 맞다 —
 * 아직 Legacy 가 소유한 URL 을 V2 sitemap 에 넣으면 잘못된 신호를 준다.
 *
 * Gate 5 에서 홈을, Gate 8 에서 강좌 상세를 여기에 추가한다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
