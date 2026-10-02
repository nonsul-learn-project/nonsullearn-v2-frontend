import type { ReactNode } from 'react';
import { ViewerProvider } from '@/legacy';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ViewerProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
    </ViewerProvider>
  );
}
