import type { Metadata } from 'next';

import { clientEnv } from '@/env.client';
import { enforceProxy } from '@/env.server';
import { SiteShell } from '@/features/site-shell/SiteShell';
import { HomeSections } from '@/features/home/HomeSections';

/**
 * Gate 6 컷오버 전까지 홈은 layout 의 noindex 를 그대로 상속한다.
 *
 * `V2_ENFORCE_PROXY=true` 는 "메인 도메인 트래픽이 이 배포로 들어온다"는 뜻이므로, 그때만
 * 홈을 index 허용으로 바꾸고 canonical 을 메인 도메인 기준으로 찍는다. 그 전에 index 를 열면
 * Vercel 배포 URL 이 색인돼 Legacy 홈과 중복된다.
 *
 * canonical 기준은 AGENTS.md §6.3 대로 `NEXT_PUBLIC_SITE_URL` 이며, 없으면 Legacy base
 * (기본값 `https://nonsul-learn.com`)로 떨어진다.
 *
 * `robots.txt` 는 여전히 전체 `Disallow: /` 다 (`src/app/robots.ts`). 실제 색인이 시작되려면
 * 컷오버 시점에 robots.txt 도 같이 열어야 한다.
 */
const canonical = new URL(
  '/',
  clientEnv.NEXT_PUBLIC_SITE_URL ?? clientEnv.NEXT_PUBLIC_LEGACY_BASE_URL,
).toString();

export const metadata: Metadata = enforceProxy
  ? {
      robots: { index: true, follow: true },
      alternates: { canonical },
    }
  : {};

export default function HomePage() {
  return (
    <SiteShell>
      <HomeSections />
    </SiteShell>
  );
}
