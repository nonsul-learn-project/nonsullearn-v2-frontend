import { serverEnv } from '@/env.server';

import type { CourseListState, CourseState } from '../../contracts/course';

import { getCourseHttp, getCoursesHttp } from './http';
import { getCourseMock, getCoursesMock, parseCourseScenario } from './mock';

/** 소스 선택은 env(`COURSE_SOURCE`)로만 한다. */
export interface GetCourseOptions {
  scenario?: string | null;
  onError?: (error: unknown) => void;
}

export async function getCourse(id: string, options: GetCourseOptions = {}): Promise<CourseState> {
  if (serverEnv.COURSE_SOURCE === 'mock') {
    return getCourseMock(parseCourseScenario(options.scenario));
  }
  return getCourseHttp(id, options);
}

export async function getCourses(
  options: GetCourseOptions & { categoryId?: string } = {},
): Promise<CourseListState> {
  if (serverEnv.COURSE_SOURCE === 'mock') {
    return getCoursesMock(parseCourseScenario(options.scenario));
  }
  return getCoursesHttp(options);
}
