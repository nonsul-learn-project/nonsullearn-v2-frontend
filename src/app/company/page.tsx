import type { Metadata } from 'next';
import { staticPagesContent } from '@/content/static-pages';
import { enforceProxy } from '@/env.server';
import { CompanyPageContent } from '@/features/static-pages/StaticPages';

const { seo } = staticPagesContent.company;
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: `https://nonsul-learn.com${seo.canonicalPath}` },
  robots: { index: enforceProxy, follow: enforceProxy },
};
export default function CompanyPage() {
  return <CompanyPageContent />;
}
