'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { ViewerState } from '../../contracts/viewer';

import { getViewer } from './index';

/**
 * viewer를 **클라이언트에서만** 조회한다.
 *
 * AGENTS.md §6.3: 서버 렌더링 결과에 로그인 상태가 섞이면 ISR/CDN 캐시가 오염된다.
 * 그래서 서버 HTML은 항상 `loading`이고, 마운트 후에 한 번 조회한다.
 *
 * 결과 캐시는 메모리만이다. 로그인 상태를 localStorage나 쿠키에 복제하지 않는다.
 */

const ViewerContext = createContext<ViewerState>({ status: 'loading' });

export interface ViewerProviderProps {
  children: ReactNode;
  /** mock일 때만 쓰인다. 보통 `?viewer=` 쿼리값. */
  scenario?: string | null;
  /** Bridge 실패를 알린다. 호출자가 `track('bridge_error')`를 보낸다. 상태당 1회만 호출된다. */
  onBridgeError?: (error: unknown) => void;
  /** 테스트에서 조회를 건너뛰고 상태를 고정하기 위한 것. 운영 코드에서는 쓰지 않는다. */
  initialState?: ViewerState;
}

export function ViewerProvider({
  children,
  scenario,
  onBridgeError,
  initialState,
}: ViewerProviderProps) {
  const [state, setState] = useState<ViewerState>(initialState ?? { status: 'loading' });

  // 콜백이 리렌더마다 새로 들어와도 조회 effect를 다시 돌리지 않는다. 조회는 마운트 후 1회다.
  // ref 쓰기는 render 중이 아니라 effect에서 한다. 아래 조회 effect보다 먼저 선언해야
  // (effect는 선언 순서대로 실행된다) 조회가 끝날 때 최신 콜백이 들어 있다.
  const onBridgeErrorRef = useRef(onBridgeError);
  useEffect(() => {
    onBridgeErrorRef.current = onBridgeError;
  }, [onBridgeError]);

  useEffect(() => {
    // initialState가 주어졌으면 그 상태를 그대로 쓴다 (테스트/스토리 용도).
    if (initialState !== undefined) return;

    const controller = new AbortController();
    let active = true;

    void getViewer({
      scenario,
      signal: controller.signal,
      onError: (error) => onBridgeErrorRef.current?.(error),
    }).then((next) => {
      if (active) setState(next);
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [scenario, initialState]);

  return <ViewerContext.Provider value={state}>{children}</ViewerContext.Provider>;
}

export function useViewer(): ViewerState {
  return useContext(ViewerContext);
}

/**
 * 권한 판단은 `can.*`만 쓴다 (AGENTS.md §6.4). level 숫자를 UI에서 비교하지 않는다.
 * `loading`과 `unavailable`에서는 권한이 없는 것으로 본다.
 */
export function useViewerCapabilities(): { correction: boolean; admin: boolean } {
  const viewer = useViewer();
  return useMemo(
    () => (viewer.status === 'member' ? viewer.can : { correction: false, admin: false }),
    [viewer],
  );
}
