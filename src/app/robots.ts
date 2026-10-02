import type { MetadataRoute } from 'next';

/** Gate 4 전에는 어느 배포도 검색에 노출하지 않는다. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
