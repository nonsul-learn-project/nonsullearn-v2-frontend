import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { clientEnv } from '@/env.client';

import './globals.css';

/**
 * canonical 의 기준은 항상 `NEXT_PUBLIC_SITE_URL` 이다 (AGENTS.md §6.3).
 * origin 도메인이 아니라 사용자가 보는 메인 도메인이어야 한다. 그래야 Vercel origin 이
 * 검색에 중복으로 잡히지 않는다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: '논술런',
    template: '%s | 논술런',
  },
  description: '논술런 온라인 논술 인강',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
