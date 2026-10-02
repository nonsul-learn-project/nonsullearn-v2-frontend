import type { MetadataRoute } from 'next';

import { clientEnv } from '@/env.client';
import { serverEnv } from '@/env.server';

/**
 * production 만 색인을 허용한다 (HARNESS.md §5 robots 행).
 *
 * Preview 와 로컬이 색인되면 운영 페이지와 중복 콘텐츠가 되고, Gate 6 컷오버 전에
 * 미완성 화면이 검색에 노출된다. 그래서 non-production 은 전부 disallow 다.
 */
export default function robots(): MetadataRoute.Robots {
  if (serverEnv.VERCEL_ENV !== 'production') {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 내부 확인용 페이지와 진단 endpoint 는 운영에서도 색인하지 않는다.
        disallow: ['/_v2/', '/api/'],
      },
    ],
    sitemap: `${clientEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
