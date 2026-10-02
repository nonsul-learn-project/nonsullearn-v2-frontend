import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { clientEnv } from '@/env.client';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/design-system/legacy/main.css';
import '@/design-system/tokens.css';
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
