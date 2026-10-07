import type { Metadata } from 'next'; import { notFound } from 'next/navigation';
import { SiteShell } from '@/features/site-shell/SiteShell'; import { HtmlContent } from '@/features/public-pages/PublicPages'; import { enforceProxy } from '@/env.server'; import { getContent } from '@/legacy/server'; import { sanitizeLegacyHtml } from '@/lib/sanitize-legacy-html';
import '@/features/public-pages/legacy-public-pages.css';
export const revalidate = 300; export const metadata: Metadata = { title: '서비스 이용약관', description: '논술런 서비스 이용약관', alternates: { canonical: 'https://nonsul-learn.com/terms' }, robots: { index: enforceProxy, follow: enforceProxy } };
export default async function TermsPage() { const content = await getContent('provision'); if (!content) notFound(); return <SiteShell><HtmlContent id={content.id} title={content.title} html={sanitizeLegacyHtml(content.contentHtml)} /></SiteShell>; }
