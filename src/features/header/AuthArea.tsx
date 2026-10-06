'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { track } from '@/analytics';
import { siteContent } from '@/content/site';
import { legacyRoutes, useViewer } from '@/legacy';

/**
 * Header 의 인증 영역. viewer 상태별로 Legacy 로 가는 링크만 바꾼다.
 *
 * **스타일이 없다.** Gate 2 에서 legacy `head.php:17-124` 의 마크업 구조와 클래스명으로 교체한다
 * (docs/design/component-map.md: `head.php` → `SiteHeader`/`DesktopNav`/`AuthArea`).
 * 지금은 상태 전이와 링크 목적지가 맞는지만 확인한다.
 *
 * AGENTS.md §6.4 4가지 상태를 모두 처리한다:
 *   loading      고정 폭 placeholder (레이아웃 이동 없음)
 *   anonymous    회원가입, 로그인
 *   member       정보수정, 로그아웃 (+ can.correction, can.admin)
 *   unavailable  비로그인처럼 보이게 로그인 버튼 + bridge_error 1회
 *
 * `displayName` 은 쓰지 않는다 — Contract v1 에 없다 (ADR 0003).
 *
 * 아이콘은 Legacy head.php 와 같은 Font Awesome class 를 `src/content/site.ts` 에서 가져온다
 * (`fa-user-plus` 회원가입, `fa-right-to-bracket` 로그인). member 분기(정보수정/로그아웃/관리자/
 * 첨삭제출현황)는 Legacy 가 세션이 있어야 렌더하는 영역이라 아이콘 유무를 확인하지 못했다.
 * // TBD(legacy): head.php 의 로그인 상태 블록 확인 후 적용.
 */
export function AuthArea({ mobile = false }: { mobile?: boolean }) {
  const viewer = useViewer();
  const pathname = usePathname();
  const returnTo = pathname ?? '/';

  // `unavailable` 상태당 bridge_error 를 정확히 1회만 보낸다.
  const reportedRef = useRef(false);
  useEffect(() => {
    if (viewer.status === 'unavailable') {
      if (!reportedRef.current) {
        reportedRef.current = true;
        track('bridge_error', { contract: 'viewer', kind: 'unavailable' });
      }
      return;
    }
    reportedRef.current = false;
  }, [viewer.status]);

  if (viewer.status === 'loading') {
    // 고정 폭이라 로그인 상태가 들어와도 주변 요소가 밀리지 않는다 (HARNESS.md §4 loading 행).
    return (
      <div data-testid="auth-area" data-status="loading">
        <span aria-hidden="true" style={{ display: 'inline-block', width: '12rem' }} />
        <span className="visually-hidden">로그인 상태 확인 중</span>
      </div>
    );
  }

  // Bridge 가 죽어도 에러 화면을 띄우지 않는다. 비로그인처럼 보이게 한다 (AGENTS.md §6.4).
  if (viewer.status === 'unavailable') {
    return (
      <div
        data-testid="auth-area"
        data-status="unavailable"
        className={mobile ? 'd-flex align-items-center gap-3' : undefined}
      >
        <a href={legacyRoutes.login(returnTo)} className={`nav-auth-link${mobile ? ' fs-6' : ''}`}>
          <i className={siteContent.authIcons.login} aria-hidden="true" /> 로그인
        </a>
      </div>
    );
  }

  if (viewer.status === 'anonymous') {
    return (
      <div
        data-testid="auth-area"
        data-status="anonymous"
        className={mobile ? 'd-flex align-items-center gap-3' : undefined}
      >
        <a href={legacyRoutes.register()} className={`nav-auth-link${mobile ? ' fs-6' : ''}`}>
          <i className={siteContent.authIcons.register} aria-hidden="true" /> 회원가입
        </a>
        <span className="text-black-50 fs-7">|</span>
        <a href={legacyRoutes.login(returnTo)} className={`nav-auth-link${mobile ? ' fs-6' : ''}`}>
          <i className={siteContent.authIcons.login} aria-hidden="true" /> 로그인
        </a>
      </div>
    );
  }

  return (
    <div
      data-testid="auth-area"
      data-status="member"
      className={mobile ? 'd-flex align-items-center gap-3' : undefined}
    >
      {viewer.can.admin ? (
        <>
          <a
            href={legacyRoutes.admin()}
            className={`nav-auth-link text-danger fw-bold${mobile ? ' fs-6' : ' me-1'}`}
          >
            관리자
          </a>
          <span className="text-black-50 fs-7">|</span>
        </>
      ) : null}
      <a href={legacyRoutes.memberEdit()} className={`nav-auth-link${mobile ? ' fs-6' : ''}`}>
        정보수정
      </a>
      <span className="text-black-50 fs-7">|</span>
      <a href={legacyRoutes.logout()} className={`nav-auth-link${mobile ? ' fs-6' : ''}`}>
        로그아웃
      </a>
      {/* 권한 판단은 can.* 만 쓴다. level 숫자를 UI 에서 비교하지 않는다 (AGENTS.md §6.4). */}
      {viewer.can.correction ? <a href={legacyRoutes.correctionStatus()}>첨삭제출현황</a> : null}
    </div>
  );
}
