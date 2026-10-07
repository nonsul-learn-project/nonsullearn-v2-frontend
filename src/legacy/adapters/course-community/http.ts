import 'server-only';

import { courseRevalidateSeconds } from '@/env.server';

import { bridgeServerFetch } from '../../client/bridge-server';
import {
  courseCommunityResponseSchema,
  type CourseCommunityResponse,
  type CourseCommunityType,
} from '../../contracts/course-community';

/**
 * 후기/문의 1페이지 조회. **Vercel 서버에서** ISR 로 호출한다.
 *
 * 쿠키를 보내지 않으므로 받는 것은 공개분뿐이다 — 확인된 후기와 비밀글이 아닌 문의.
 * 비밀글 문의를 보려면 Legacy 로 가야 하고, 그 판단은 Legacy 세션이 한다.
 *
 * 실패는 전부 `BridgeError` throw 다. 404(없는 강좌)도 여기서는 삼키지 않는다 —
 * 호출하는 쪽은 이미 `getCourseDetail` 로 강좌가 있다는 걸 확인한 뒤이므로,
 * 여기서의 404 는 Bridge 두 endpoint 의 가시성 기준이 어긋난 **이상 상황**이다.
 */

export const COURSE_COMMUNITY_BRIDGE_PATH = '/course-community.php';

export async function getCourseCommunityHttp(
  id: string,
  type: CourseCommunityType,
  page = 1,
): Promise<CourseCommunityResponse> {
  const query = new URLSearchParams({ id, type, page: String(page) });
  return bridgeServerFetch({
    path: `${COURSE_COMMUNITY_BRIDGE_PATH}?${query.toString()}`,
    schema: courseCommunityResponseSchema,
    revalidate: courseRevalidateSeconds,
  });
}
