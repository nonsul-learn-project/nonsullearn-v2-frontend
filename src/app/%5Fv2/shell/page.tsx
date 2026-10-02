import type { Metadata } from 'next';
import { SiteShell } from '@/features/site-shell/SiteShell';

export const metadata: Metadata = {
  title: 'Shell preview',
  robots: { index: false, follow: false },
};
export default function ShellPage() {
  return (
    <SiteShell>
      <main aria-label="Shell preview" />
    </SiteShell>
  );
}
