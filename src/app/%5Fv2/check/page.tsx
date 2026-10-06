import type { Metadata } from 'next';

import { clientEnv } from '@/env.client';
import { ViewerProvider } from '@/legacy';
import { AuthArea } from '@/features/header/AuthArea';

/**
 * 내부 확인용 페이지. 외부에 노출하지 않는다 (EXECUTION-PLAN.md 합류 지점 Gate 4).
 *
 * 폴더 이름이 `%5Fv2` 인 이유: Next.js 에서 `_` 로 시작하는 폴더는 private folder 라
 * 라우팅되지 않는다. `%5F`(URL 인코딩된 `_`)로 쓰면 실제 URL 이 `/_v2/check` 가 된다.
 *
 * Gate 4 에서 Apache 프록시를 이 경로로 먼저 검증한다. 사용자가 보는 페이지보다 먼저
 * 가장 위험한 인프라 변경을 확인하기 위한 것이다.
 */
export const metadata: Metadata = {
  title: 'V2 Check',
  // 운영 robots.ts 도 /_v2/ 를 막지만, 페이지 자체에도 noindex 를 둔다.
  robots: { index: false, follow: false },
};

/** 표시해도 되는 것은 **env 이름과 모드**다. 값(특히 secret)은 표시하지 않는다. */
const visibleEnv = [
  ['NEXT_PUBLIC_SITE_URL', clientEnv.NEXT_PUBLIC_SITE_URL],
  ['NEXT_PUBLIC_LEGACY_BASE_URL', clientEnv.NEXT_PUBLIC_LEGACY_BASE_URL],
  ['NEXT_PUBLIC_LEGACY_ASSET_HOST', clientEnv.NEXT_PUBLIC_LEGACY_ASSET_HOST],
  ['NEXT_PUBLIC_VIEWER_SOURCE', clientEnv.NEXT_PUBLIC_VIEWER_SOURCE],
  ['NEXT_PUBLIC_ANALYTICS_ENABLED', clientEnv.NEXT_PUBLIC_ANALYTICS_ENABLED],
] as const;

export default async function V2CheckPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const viewerParam = params.viewer;
  const scenario = Array.isArray(viewerParam) ? viewerParam[0] : viewerParam;

  return (
    <main>
      <h1>V2 Check</h1>
      <p>내부 확인용 페이지입니다. 운영 화면이 아닙니다.</p>

      <h2>Auth Area</h2>
      {/*
        viewer 는 클라이언트에서만 조회한다 (AGENTS.md §6.3).
        서버 HTML 에는 항상 loading 이 들어가므로 이 페이지는 캐시해도 안전하다.
      */}
      <ViewerProvider scenario={scenario ?? null}>
        <AuthArea />
      </ViewerProvider>

      <h2>Environment</h2>
      <dl>
        {visibleEnv.map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd data-env={name}>{value}</dd>
          </div>
        ))}
      </dl>

      <h2>mock 시나리오</h2>
      <p>
        <code>?viewer=anonymous|member|corrector|admin|unavailable|slow</code>
      </p>
    </main>
  );
}
