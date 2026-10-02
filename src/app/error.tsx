'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { legacyRoutes } from '@/legacy';

/**
 * Gate 1 최소 마크업. 스타일과 legacy 클래스는 Gate 2 범위다.
 *
 * AGENTS.md §6.4: Bridge 실패는 여기까지 오지 않는다 — adapter 가 `unavailable` 상태로 바꾼다.
 * 이 화면은 그 밖의 예상 못한 오류를 위한 마지막 그물이다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 운영에서는 Vercel 로그로 간다. 사용자에게는 digest 외의 내부 정보를 보이지 않는다.
    console.error('[v2] unhandled error', error.digest ?? error.message);
  }, [error]);

  return (
    <main>
      <h1>문제가 발생했습니다</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
      <button type="button" onClick={reset}>
        다시 시도
      </button>
      <nav>
        <ul>
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>
            <a href={legacyRoutes.login('/')}>로그인</a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
