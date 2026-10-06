import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { clientEnv } from '@/env.client';
import { serverEnv } from '@/env.server';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/design-system/legacy/main.css';
import '@/design-system/tokens.css';
import './globals.css';

/**
 * 명시적인 site URL이 없으면 Vercel 배포 URL을 쓴다. 둘 다 없으면 absolute URL을
 * 만들지 않도록 metadataBase를 생략한다.
 */
const metadataBase =
  clientEnv.NEXT_PUBLIC_SITE_URL ??
  (serverEnv.VERCEL_URL === undefined ? undefined : new URL(`https://${serverEnv.VERCEL_URL}`));

export const metadata: Metadata = {
  ...(metadataBase === undefined ? {} : { metadataBase }),
  robots: { index: false, follow: false },
  title: {
    default: '논술런',
    template: '%s | 논술런',
  },
  description: '논술런 온라인 논술 인강',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
