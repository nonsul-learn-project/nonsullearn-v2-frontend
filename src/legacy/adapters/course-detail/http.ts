import 'server-only';

import { courseRevalidateSeconds } from '@/env.server';

import { isBridgeError } from '../../client/bridge-error';
import { bridgeServerFetch } from '../../client/bridge-server';
import { courseFullResponseSchema, type CourseFull } from '../../contracts/course-full';

/**
 * 강좌 상세 조회. **Vercel 서버에서** ISR 로 호출한다 (AGENTS.md §2 표).
 *
 * `courses.php` 와 반환 규약이 같다:
 *   - 없는 강좌(404) → `null`
 *   - 그 밖의 실패 → `BridgeError` throw (ISR 이 마지막 성공본을 계속 내보낸다, ADR 0007)
 *
 * 쿠키는 보내지 않는다. 공개 데이터만 가져온다 (AGENTS.md §2 절대 원칙 2).
 */

export const COURSE_DETAIL_BRIDGE_PATH = '/course-detail.php';

/**
 * Bridge 가 없는 강좌에 쓰는 상태코드.
 *
 * `course-detail.php` 는 잘못된 id 에 400 을 준다. 400 도 `null` 로 삼키지 않고 throw 한다 —
 * 400 은 "없는 강좌"가 아니라 "우리가 Bridge 가 받지 않는 id 를 보냈다"는 **우리 쪽 버그**다.
 * 그걸 404 처럼 조용히 넘기면 라우트 파라미터 검증이 빠진 걸 모르고 지나간다.
 */
const NOT_FOUND = 404;

function isNotFound(error: unknown): boolean {
  return isBridgeError(error) && error.kind === 'http' && error.status === NOT_FOUND;
}

/** 없는 강좌는 `null`. 그 밖의 실패는 `BridgeError` 를 던진다. */
export async function getCourseDetailHttp(id: string): Promise<CourseFull | null> {
  try {
    const response = await bridgeServerFetch({
      path: `${COURSE_DETAIL_BRIDGE_PATH}?id=${encodeURIComponent(id)}`,
      schema: courseFullResponseSchema,
      revalidate: courseRevalidateSeconds,
    });
    const { v: _version, ...course } = response;
    return course;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}
