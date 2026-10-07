import type { Metadata } from 'next';
import { staticPagesContent } from '@/content/static-pages';
import { enforceProxy } from '@/env.server';
import { AboutPageContent } from '@/features/static-pages/StaticPages';
import { SiteShell } from '@/features/site-shell/SiteShell';
import '@/features/static-pages/legacy-static-pages.css';

const { seo } = staticPagesContent.about;
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: `https://nonsul-learn.com${seo.canonicalPath}` },
  robots: { index: enforceProxy, follow: enforceProxy },
};
export default function AboutPage() {
  return (
    <SiteShell>
      <AboutPageContent />
    </SiteShell>
  );
}
