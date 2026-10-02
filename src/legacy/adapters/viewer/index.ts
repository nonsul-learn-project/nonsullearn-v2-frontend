import { clientEnv } from '@/env.client';

import type { ViewerState } from '../../contracts/viewer';

import { getViewerHttp } from './http';
import {
  getViewerMock,
  parseViewerScenario,
  VIEWER_MOCK_SCENARIOS,
  type ViewerMockScenario,
} from './mock';

/**
 * viewer 소스 선택. **env로만** 고른다 (AGENTS.md §7: 소스 선택은 env로만).
 *
 * `LEGACY_BRIDGE_TIMEOUT_MS`는 서버 전용 변수라 브라우저에서 읽을 수 없다.
 * viewer는 브라우저가 호출하므로 여기서는 별도의 클라이언트 타임아웃을 쓴다.
 */
export const VIEWER_CLIENT_TIMEOUT_MS = 3_000;

export interface GetViewerOptions {
  /** mock일 때만 쓰인다. 보통 `?viewer=` 쿼리값. */
  scenario?: string | null;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
}

export async function getViewer(options: GetViewerOptions = {}): Promise<ViewerState> {
  if (clientEnv.NEXT_PUBLIC_VIEWER_SOURCE === 'mock') {
    return getViewerMock(parseViewerScenario(options.scenario));
  }
  return getViewerHttp({
    timeoutMs: VIEWER_CLIENT_TIMEOUT_MS,
    signal: options.signal,
    onError: options.onError,
  });
}

export { VIEWER_MOCK_SCENARIOS, type ViewerMockScenario };
