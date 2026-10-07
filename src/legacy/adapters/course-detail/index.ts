import { shouldUseMockBridge } from '@/env.server';

import { isBridgeError } from '../../client/bridge-error';
import type { CourseFull, CourseFullState } from '../../contracts/course-full';

import { getCourseDetailHttp } from './http';
import { getCourseDetailMock } from './mock';

/**
 * 강좌 상세 조회. 소스 선택은 env(`COURSE_SOURCE`)로만 한다.
 *
 * 표면이 두 벌인 이유는 `adapters/course/index.ts` 와 같다 (ADR 0007):
 *
 *   `getCourseDetail`      — Contract 그대로. 없으면 `null`, 실패는 `BridgeError` throw.
 *   `getCourseDetailState` — 실패를 `unavailable` 로 바꾼다 (AGENTS.md §6.4).
 *
 * mock 시나리오는 `?course=` 쿼리가 아니라 **id** 로 고른다. 페이지가 `searchParams` 를 읽으면
 * ISR 이 깨지기 때문이다 (`./mock.ts` 주석, AGENTS.md §6.3).
 *
 * 강좌 상세 페이지는 `getCourseDetail` 을 쓴다. ISR 재생성 중 throw 하면 Next 가 마지막
 * 성공본을 계속 내보내므로, Bridge 가 잠깐 흔들릴 때 좋은 HTML 이 빈 화면으로 덮이지 않는다.
 */
export interface GetCourseDetailOptions {
  onError?: (error: unknown) => void;
}



/** 없는 강좌는 `null`. 그 밖의 실패는 `BridgeError` 를 던진다. */
export async function getCourseDetail(id: string): Promise<CourseFull | null> {
  if (shouldUseMockBridge()) return getCourseDetailMock(id);
  return getCourseDetailHttp(id);
}

/**
 * `BridgeError` 만 `unavailable` 로 삼킨다. 그 밖의 예외는 다시 던진다 —
 * Bridge 장애와 우리 쪽 버그를 같은 화면으로 덮으면 버그가 조용히 배포된다.
 */
export async function getCourseDetailState(
  id: string,
  options: GetCourseDetailOptions = {},
): Promise<CourseFullState> {
  try {
    const course = await getCourseDetail(id);
    return course === null ? { status: 'missing' } : { status: 'ready', course };
  } catch (error) {
    if (!isBridgeError(error)) throw error;
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}
