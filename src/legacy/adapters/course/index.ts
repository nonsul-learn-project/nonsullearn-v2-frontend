import { shouldUseMockBridge } from '@/env.server';

import { isBridgeError } from '../../client/bridge-error';
import type { Course, CourseListState, CourseState } from '../../contracts/course';

import { getCourseHttp, getCoursesHttp } from './http';
import { getCourseMock, getCoursesMock, parseCourseScenario } from './mock';

/**
 * 강좌 조회. 소스 선택은 env(`COURSE_SOURCE`)로만 한다.
 *
 * 표면이 두 벌이다. 이유는 ISR 과 AGENTS.md §6.4 가 서로 다른 것을 원하기 때문이다.
 *
 *   `getCourse` / `getCourses`      — Contract 그대로. 없으면 `null`/빈 배열, 실패는 `BridgeError` throw.
 *                                     **ISR 재생성 중 throw 하면 Next 가 마지막 성공본을 계속 내보낸다.**
 *                                     강좌 페이지처럼 캐시된 좋은 HTML 이 있는 경우 이게 맞다.
 *   `getCourseState` / `getCoursesState` — 실패를 `unavailable` 상태로 바꾼다 (AGENTS.md §6.4).
 *                                     캐시본이 없거나(첫 빌드), 페이지 일부만 강좌에 의존할 때 쓴다.
 *
 * 어느 쪽을 쓸지는 호출하는 페이지가 고른다. 자세한 근거는
 * docs/decisions/0007-course-adapter-failure-surface.md.
 */
export interface GetCourseOptions {
  /** mock 일 때만 쓰인다. 보통 `?course=` 쿼리값. */
  scenario?: string | null;
  // 카테고리 필터는 Contract v1 에 없다. 목록을 받아 `categoryId` 로 걸러 쓴다.
  onError?: (error: unknown) => void;
}

/** 없는 강좌는 `null`. 그 밖의 실패는 `BridgeError` 를 던진다. */
export async function getCourse(
  id: string,
  options: GetCourseOptions = {},
): Promise<Course | null> {
  if (shouldUseMockBridge()) return getCourseMock(parseCourseScenario(options.scenario));
  return getCourseHttp(id);
}

/** 강좌가 없으면 빈 배열. 실패는 `BridgeError` 를 던진다. */
export async function getCourses(options: GetCourseOptions = {}): Promise<Course[]> {
  if (shouldUseMockBridge()) return getCoursesMock(parseCourseScenario(options.scenario));
  return getCoursesHttp();
}

/**
 * `BridgeError` 만 `unavailable` 로 삼킨다.
 *
 * 그 밖의 예외(예: Contract 를 벗어난 fixture 때문에 zod 가 던진 것)는 다시 던진다.
 * Bridge 장애와 우리 쪽 버그를 같은 화면으로 덮으면 버그가 조용히 배포된다.
 */
function reportBridgeFailure(error: unknown, onError?: (error: unknown) => void): void {
  if (!isBridgeError(error)) throw error;
  onError?.(error);
}

export async function getCourseState(
  id: string,
  options: GetCourseOptions = {},
): Promise<CourseState> {
  try {
    const course = await getCourse(id, options);
    return course === null ? { status: 'missing' } : { status: 'ready', course };
  } catch (error) {
    reportBridgeFailure(error, options.onError);
    return { status: 'unavailable' };
  }
}

export async function getCoursesState(options: GetCourseOptions = {}): Promise<CourseListState> {
  try {
    return { status: 'ready', courses: await getCourses(options) };
  } catch (error) {
    reportBridgeFailure(error, options.onError);
    return { status: 'unavailable' };
  }
}
