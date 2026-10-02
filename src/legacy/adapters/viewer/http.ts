import { bridgeFetch } from '../../client/bridge-fetch';
import { toViewerState, viewerResponseSchema, type ViewerState } from '../../contracts/viewer';

/**
 * 실제 viewer 조회. **브라우저에서만** 호출한다.
 *
 * AGENTS.md §6.3: 서버 렌더링 결과에 로그인 상태가 섞이면 ISR 캐시가 오염된다.
 * 그래서 same-origin 상대경로를 쓰고, PHP 세션 쿠키는 브라우저가 알아서 붙인다.
 *
 * AGENTS.md §6.4: **모든 실패는 `unavailable`이다.** throw하지 않는다.
 * 호출자가 `onError`로 실패 사유를 받아 `bridge_error`를 보낸다.
 */

export const VIEWER_BRIDGE_PATH = '/v2-api/viewer.php';

export async function getViewerHttp(options: {
  timeoutMs: number;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
}): Promise<ViewerState> {
  try {
    const response = await bridgeFetch({
      path: VIEWER_BRIDGE_PATH,
      schema: viewerResponseSchema,
      timeoutMs: options.timeoutMs,
      signal: options.signal,
    });
    return toViewerState(response);
  } catch (error) {
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}
