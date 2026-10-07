import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { clientEnv } from '@/env.client';
import { enforceProxy } from '@/env.server';
import { CourseCategoryList } from '@/features/course-category/CourseCategoryList';
import { SiteShell } from '@/features/site-shell/SiteShell';
import { categoryIdSchema, getCategoryList } from '@/legacy/server';

// 이 라우트에서만 쓰는 Legacy 스킨 CSS (= skin/shop/basic/style.css 미러).
import '@/features/course-category/legacy-category-list.css';

/**
 * `/courses/category/[id]` — Legacy `shop/list.php?ca_id=<id>` 와 같은 화면.
 *
 * ISR 이다. `searchParams` 를 읽지 않으므로 요청마다 SSR 이 되지 않는다 (AGENTS.md §6.3).
 * V2 는 항상 1페이지만 렌더하고 2페이지 이후는 Legacy 주소로 넘긴다.
 */

export const revalidate = 300;

/**
 * 빈 배열이지만 함수는 있어야 ISR 이 켜진다 (`prerender-manifest` 의 `dynamicRoutes`).
 * 빌드 때 Bridge 를 부르지 않는 것이 목적이다 — 분류를 전부 prerender 하면
 * `LEGACY_BRIDGE_TIMEOUT_MS` 를 넘기는 순간 배포 전체가 실패한다.
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [];
}

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

/** Bridge 가 받지 않는 id 는 Bridge 를 때리지 않고 404 로 낸다. */
async function resolveId(params: CategoryPageProps['params']): Promise<string> {
  const parsed = categoryIdSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  return parsed.data;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const id = await resolveId(params);
  const data = await getCategoryList(id);
  if (data === null) return { title: '분류를 찾을 수 없습니다' };

  // Legacy `$g5['title'] = $ca['ca_name'].' 상품리스트'`
  const title = `${data.category.name} 상품리스트`;
  const canonical = new URL(
    `/courses/category/${data.category.id}`,
    clientEnv.NEXT_PUBLIC_SITE_URL ?? clientEnv.NEXT_PUBLIC_LEGACY_BASE_URL,
  ).toString();

  return {
    title,
    description: `${data.category.name} 강좌 목록`,
    alternates: { canonical },
    robots: enforceProxy ? { index: true, follow: true } : undefined,
  };
}

export default async function CourseCategoryPage({ params }: CategoryPageProps) {
  const id = await resolveId(params);

  /**
   * 없는 분류만 `null` → 404 다. 접근 제한(403), Bridge 장애(503), 네트워크·Contract 오류는
   * adapter 가 throw 하고, ISR 은 마지막 성공본을 계속 내보낸다 (ADR 0007).
   */
  const data = await getCategoryList(id);
  if (data === null) notFound();

  return (
    <SiteShell>
      <CourseCategoryList data={data} />
    </SiteShell>
  );
}
