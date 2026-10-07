import type { Metadata } from 'next';
import { SiteShell } from '@/features/site-shell/SiteShell';
import { TeachersContent } from '@/features/public-pages/PublicPages';
import { enforceProxy } from '@/env.server';
import { getTeachers } from '@/legacy/server';
export const revalidate = 300;
export const metadata: Metadata = { title: '논술런 강사진', description: '논술런 강사진 소개', alternates: { canonical: 'https://nonsul-learn.com/teachers' }, robots: { index: enforceProxy, follow: enforceProxy } };
export default async function TeachersPage() { return <SiteShell><TeachersContent teachers={await getTeachers()} /></SiteShell>; }
