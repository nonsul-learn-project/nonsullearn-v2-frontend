import 'server-only';

import { courseRevalidateSeconds } from '@/env.server';

import { bridgeServerFetch } from '../../client/bridge-server';
import { isBridgeError } from '../../client/bridge-error';
import {
  courseItemResponseSchema,
  courseListResponseSchema,
  type Course,
} from '../../contracts/course';

/**
 * 실제 강좌 조회. **Vercel 서버에서** ISR 로 호출한다 (AGENTS.md §2 표).
 *
 * 반환 규약 (Gate 3 Contract v1):
 *   - 없는 강좌(404) → `null`
 *   - 그 밖의 실패(네트워크, timeout, 3xx, HTML, 5xx, Contract 위반) → `BridgeError` throw
 *
 * **실패를 throw 하는 것이 의도다.** ISR 재생성 중에 throw 하면 Next 는 마지막으로 성공한
 * HTML 을 계속 내보낸다. 여기서 `unavailable` 을 돌려주면 Bridge 가 잠깐 흔들릴 때마다
 * 캐시된 좋은 페이지가 빈 화면으로 덮인다. UI 상태가 필요한 호출자는
 * `getCourseState`/`getCoursesState` 를 쓴다 (ADR 0007).
 *
 * 쿠키는 보내지 않는다. 공개 데이터만 가져온다 (AGENTS.md §2 절대 원칙 2).
 */

export const COURSE_BRIDGE_PATH = '/courses.php';

/** Bridge 가 없는 강좌에 쓰는 상태코드. 이것만 `null` 이고 나머지는 전부 실패다. */
const NOT_FOUND = 404;

function isNotFound(error: unknown): boolean {
  return isBridgeError(error) && error.kind === 'http' && error.status === NOT_FOUND;
}

/** 없는 강좌는 `null`. 그 밖의 실패는 `BridgeError` 를 던진다. */
export async function getCourseHttp(id: string): Promise<Course | null> {
  try {
    const response = await bridgeServerFetch({
      path: `${COURSE_BRIDGE_PATH}?id=${encodeURIComponent(id)}`,
      schema: courseItemResponseSchema,
      revalidate: courseRevalidateSeconds,
    });
    return response.item;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

/** 강좌가 없으면 빈 배열. 실패는 `BridgeError` 를 던진다. */
export async function getCoursesHttp(): Promise<Course[]> {
  const response = await bridgeServerFetch({
    path: COURSE_BRIDGE_PATH,
    schema: courseListResponseSchema,
    revalidate: courseRevalidateSeconds,
  });
  return response.items;
}
