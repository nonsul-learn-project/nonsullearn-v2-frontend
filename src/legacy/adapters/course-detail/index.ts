import { assertHostedBridgeConfigured, serverEnv } from '@/env.server';

import { isBridgeError } from '../../client/bridge-error';
import type { CourseFull, CourseFullState } from '../../contracts/course-full';

import { getCourseDetailHttp } from './http';
import { getCourseDetailMock, parseCourseDetailScenario } from './mock';

/**
 * 강좌 상세 조회. 소스 선택은 env(`COURSE_SOURCE`)로만 한다.
 *
 * 표면이 두 벌인 이유는 `adapters/course/index.ts` 와 같다 (ADR 0007):
 *
 *   `getCourseDetail`      — Contract 그대로. 없으면 `null`, 실패는 `BridgeError` throw.
 *   `getCourseDetailState` — 실패를 `unavailable` 로 바꾼다 (AGENTS.md §6.4).
 *
 * 강좌 상세 페이지는 `getCourseDetail` 을 쓴다. ISR 재생성 중 throw 하면 Next 가 마지막
 * 성공본을 계속 내보내므로, Bridge 가 잠깐 흔들릴 때 좋은 HTML 이 빈 화면으로 덮이지 않는다.
 */
export interface GetCourseDetailOptions {
  /** mock 일 때만 쓰인다. 보통 `?course=` 쿼리값. */
  scenario?: string | null;
  onError?: (error: unknown) => void;
}

/**
 * `assertHostedBridgeConfigured()` 를 mock 분기 **앞에서** 부른다.
 * Vercel Preview/Production 에서 `LEGACY_BRIDGE_BASE` 를 빠뜨리면 하네스용 예시 강좌가
 * 운영 화면에 뜨는데, 그건 조용히 지나가는 것보다 터지는 쪽이 낫다.
 */
const usingMock = (): boolean => {
  assertHostedBridgeConfigured();
  return serverEnv.COURSE_SOURCE === 'mock';
};

/** 없는 강좌는 `null`. 그 밖의 실패는 `BridgeError` 를 던진다. */
export async function getCourseDetail(
  id: string,
  options: GetCourseDetailOptions = {},
): Promise<CourseFull | null> {
  if (usingMock()) return getCourseDetailMock(parseCourseDetailScenario(options.scenario));
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
    const course = await getCourseDetail(id, options);
    return course === null ? { status: 'missing' } : { status: 'ready', course };
  } catch (error) {
    if (!isBridgeError(error)) throw error;
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}
