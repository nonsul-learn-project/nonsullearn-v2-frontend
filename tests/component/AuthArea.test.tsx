// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthArea } from '@/features/header/AuthArea';
import { ViewerProvider } from '@/legacy';
import { legacyRoutes } from '@/legacy';

/**
 * L2 — viewer (HARNESS.md §4 viewer 표 6개 시나리오).
 *
 * `member` 행의 Pass 조건은 "표시 이름" 대신 "로그아웃/정보수정 링크" 로 본다.
 * Viewer Contract v1 에 `displayName` 이 없기 때문이다 (ADR 0003).
 */

const PATHNAME = '/courses/1001';

vi.mock('next/navigation', () => ({
  usePathname: () => PATHNAME,
}));

const trackMock = vi.hoisted(() => vi.fn());
vi.mock('@/analytics', () => ({ track: trackMock }));

beforeEach(() => {
  trackMock.mockClear();
});

const renderWithViewer = (scenario: string) =>
  render(
    <ViewerProvider scenario={scenario}>
      <AuthArea />
    </ViewerProvider>,
  );

const area = () => screen.getByTestId('auth-area');

const waitForStatus = async (status: string) => {
  await waitFor(() => expect(area()).toHaveAttribute('data-status', status));
};

describe('loading', () => {
  it('조회가 끝나기 전에는 loading 이다', () => {
    render(
      <ViewerProvider initialState={{ status: 'loading' }}>
        <AuthArea />
      </ViewerProvider>,
    );
    expect(area()).toHaveAttribute('data-status', 'loading');
  });

  it('고정 폭 placeholder 라 레이아웃이 밀리지 않는다', () => {
    render(
      <ViewerProvider initialState={{ status: 'loading' }}>
        <AuthArea />
      </ViewerProvider>,
    );
    const placeholder = area().querySelector('[aria-hidden="true"]');
    expect(placeholder).not.toBeNull();
    expect((placeholder as HTMLElement).style.width).toBe('12rem');
  });

  it('loading 중에는 로그인/로그아웃 링크가 없다', () => {
    render(
      <ViewerProvider initialState={{ status: 'loading' }}>
        <AuthArea />
      </ViewerProvider>,
    );
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('slow 시나리오는 loading 으로 시작한다', () => {
    renderWithViewer('slow');
    expect(area()).toHaveAttribute('data-status', 'loading');
  });
});

describe('anonymous', () => {
  it('회원가입과 로그인 링크를 보여준다', async () => {
    renderWithViewer('anonymous');
    await waitForStatus('anonymous');
    expect(screen.getByRole('link', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('로그인 링크가 legacyRoutes.login(현재경로) 다', async () => {
    renderWithViewer('anonymous');
    await waitForStatus('anonymous');
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute(
      'href',
      legacyRoutes.login(PATHNAME),
    );
  });

  it('회원가입 링크가 legacyRoutes.register() 다', async () => {
    renderWithViewer('anonymous');
    await waitForStatus('anonymous');
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute(
      'href',
      legacyRoutes.register(),
    );
  });

  it('로그아웃 링크는 없다', async () => {
    renderWithViewer('anonymous');
    await waitForStatus('anonymous');
    expect(screen.queryByRole('link', { name: '로그아웃' })).toBeNull();
  });
});

describe('member', () => {
  it('정보수정과 로그아웃 링크를 보여준다', async () => {
    renderWithViewer('member');
    await waitForStatus('member');
    expect(screen.getByRole('link', { name: '정보수정' })).toHaveAttribute(
      'href',
      legacyRoutes.memberEdit(),
    );
    expect(screen.getByRole('link', { name: '로그아웃' })).toHaveAttribute(
      'href',
      legacyRoutes.logout(),
    );
  });

  it('로그인/회원가입 링크는 없다', async () => {
    renderWithViewer('member');
    await waitForStatus('member');
    expect(screen.queryByRole('link', { name: '로그인' })).toBeNull();
    expect(screen.queryByRole('link', { name: '회원가입' })).toBeNull();
  });

  it('회원 이름을 렌더하지 않는다 (Contract v1 에 displayName 이 없다 — ADR 0003)', async () => {
    renderWithViewer('member');
    await waitForStatus('member');
    expect(area().textContent).toBe('정보수정로그아웃');
  });
});

describe('member (비첨삭) — 첨삭 메뉴 미노출', () => {
  it('can.correction 이 false 면 첨삭제출현황이 없다', async () => {
    renderWithViewer('member');
    await waitForStatus('member');
    expect(screen.queryByRole('link', { name: '첨삭제출현황' })).toBeNull();
  });

  it('can.admin 이 false 면 관리자 링크가 없다', async () => {
    renderWithViewer('member');
    await waitForStatus('member');
    expect(screen.queryByRole('link', { name: '관리자' })).toBeNull();
  });
});

describe('corrector', () => {
  it('첨삭제출현황 링크를 보여준다', async () => {
    renderWithViewer('corrector');
    await waitForStatus('member');
    expect(screen.getByRole('link', { name: '첨삭제출현황' })).toHaveAttribute(
      'href',
      legacyRoutes.correctionStatus(),
    );
  });

  it('첨삭 권한만 있으면 관리자 링크는 없다', async () => {
    renderWithViewer('corrector');
    await waitForStatus('member');
    expect(screen.queryByRole('link', { name: '관리자' })).toBeNull();
  });
});

describe('admin', () => {
  it('관리자 링크를 보여준다', async () => {
    renderWithViewer('admin');
    await waitForStatus('member');
    expect(screen.getByRole('link', { name: '관리자' })).toHaveAttribute(
      'href',
      legacyRoutes.admin(),
    );
  });
});

describe('unavailable', () => {
  it('로그인 버튼을 보여준다', async () => {
    renderWithViewer('unavailable');
    await waitForStatus('unavailable');
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute(
      'href',
      legacyRoutes.login(PATHNAME),
    );
  });

  it('에러 UI 를 띄우지 않는다', async () => {
    renderWithViewer('unavailable');
    await waitForStatus('unavailable');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(area().textContent).not.toMatch(/오류|실패|에러|문제가 발생/);
  });

  it('bridge_error 를 정확히 1회 보낸다', async () => {
    renderWithViewer('unavailable');
    await waitForStatus('unavailable');
    await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));
    expect(trackMock).toHaveBeenCalledWith('bridge_error', {
      contract: 'viewer',
      kind: 'unavailable',
    });
  });

  it('리렌더해도 bridge_error 가 늘지 않는다', async () => {
    const { rerender } = render(
      <ViewerProvider scenario="unavailable">
        <AuthArea />
      </ViewerProvider>,
    );
    await waitForStatus('unavailable');
    await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));

    rerender(
      <ViewerProvider scenario="unavailable">
        <AuthArea />
      </ViewerProvider>,
    );
    await waitFor(() => expect(area()).toHaveAttribute('data-status', 'unavailable'));
    expect(trackMock).toHaveBeenCalledTimes(1);
  });
});

describe('정상 상태에서는 bridge_error 를 보내지 않는다', () => {
  it.each(['anonymous', 'member', 'corrector', 'admin'])('%s', async (scenario) => {
    renderWithViewer(scenario);
    await waitFor(() => expect(area().getAttribute('data-status')).not.toBe('loading'));
    expect(trackMock).not.toHaveBeenCalled();
  });
});
