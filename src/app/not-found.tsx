import type { Metadata } from 'next';
import Link from 'next/link';

import { legacyRoutes } from '@/legacy';

// Gate 1 최소 마크업. 스타일과 legacy 클래스는 Gate 2 범위다.
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>요청하신 주소를 다시 확인해 주세요.</p>
      <nav>
        <ul>
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>
            {/* Legacy URL 하드코딩 금지. legacyRoutes 로만 만든다 (AGENTS.md §7.3). */}
            <a href={legacyRoutes.login('/')}>로그인</a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
