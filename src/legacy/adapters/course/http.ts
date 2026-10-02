import 'server-only';

import { courseRevalidateSeconds } from '@/env.server';

import { bridgeServerFetch } from '../../client/bridge-server';
import {
  courseItemResponseSchema,
  courseListResponseSchema,
  type CourseListState,
  type CourseState,
} from '../../contracts/course';

/**
 * 실제 강좌 조회. **Vercel 서버에서** ISR로 호출한다 (AGENTS.md §2 표).
 *
 * 경로와 파라미터 이름은 **placeholder다.** Gate 3에서 `courses.php`를 실제로 배포하고 확정한다
 * (docs/harness/EXECUTION-PLAN.md Step 2-B). 지금은 Contract와 호출 모양만 세운다.
 *
 * AGENTS.md §6.4: 실패는 `unavailable` 상태로 돌려준다. 페이지를 throw로 깨뜨리지 않는다.
 */

// TBD(legacy): Gate 3에서 courses.php 확정 시 경로와 쿼리 이름을 검증한다.
export const COURSE_BRIDGE_PATH = '/courses.php';

export async function getCourseHttp(
  id: string,
  options: { onError?: (error: unknown) => void } = {},
): Promise<CourseState> {
  try {
    const response = await bridgeServerFetch({
      path: `${COURSE_BRIDGE_PATH}?id=${encodeURIComponent(id)}`,
      schema: courseItemResponseSchema,
      revalidate: courseRevalidateSeconds,
    });
    if (response.item === null) return { status: 'missing' };
    return { status: 'ready', course: response.item };
  } catch (error) {
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}

export async function getCoursesHttp(
  options: { categoryId?: string; onError?: (error: unknown) => void } = {},
): Promise<CourseListState> {
  const query =
    options.categoryId === undefined ? '' : `?categoryId=${encodeURIComponent(options.categoryId)}`;
  try {
    const response = await bridgeServerFetch({
      path: `${COURSE_BRIDGE_PATH}${query}`,
      schema: courseListResponseSchema,
      revalidate: courseRevalidateSeconds,
    });
    return { status: 'ready', courses: response.items };
  } catch (error) {
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}
