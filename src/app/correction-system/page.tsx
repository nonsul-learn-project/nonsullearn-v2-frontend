import type { Metadata } from 'next';
import { staticPagesContent } from '@/content/static-pages';
import { enforceProxy } from '@/env.server';
import { CorrectionPageContent } from '@/features/static-pages/StaticPages';
import { SiteShell } from '@/features/site-shell/SiteShell';

const { seo } = staticPagesContent.correction;
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: `https://nonsul-learn.com${seo.canonicalPath}` },
  robots: { index: enforceProxy, follow: enforceProxy },
};
export default function CorrectionSystemPage() {
  return (
    <SiteShell>
      <CorrectionPageContent />
    </SiteShell>
  );
}
