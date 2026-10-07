import { shouldUseMockBridge } from '@/env.server';

import { isBridgeError } from '../../client/bridge-error';
import {
  LEGACY_COMMUNITY_ROWS,
  type CourseQuestionsState,
  type CourseReviewsState,
} from '../../contracts/course-community';

import { getCourseCommunityHttp } from './http';
import { getCourseCommunityMock } from './mock';

/**
 * 후기/문의 탭의 1페이지. 실패는 `unavailable` 상태로 바꾼다 (AGENTS.md §6.4).
 *
 * 강좌 본문과 달리 여기는 **throw 하지 않는다.** 후기 하나 못 받았다고 강좌 페이지 전체가
 * 마지막 성공본으로 돌아가거나 빈 화면이 되면 안 된다. 탭만 "불러올 수 없습니다"가 된다.
 *
 * Legacy 와 줄 수를 맞추기 위해 `LEGACY_COMMUNITY_ROWS`(5)로 자른다. Bridge 는 `limit` 을
 * 20 으로 고정해서 주므로 15줄을 버린다 — Bridge 가 `limit` 파라미터를 받으면 지울 코드다
 * (docs/decisions/bridge-course-community.md).
 */
export interface GetCourseCommunityOptions {
  onError?: (error: unknown) => void;
}



export async function getCourseReviewsState(
  id: string,
  options: GetCourseCommunityOptions = {},
): Promise<CourseReviewsState> {
  try {
    const response = shouldUseMockBridge()
      ? getCourseCommunityMock(id, 'reviews')
      : await getCourseCommunityHttp(id, 'reviews');
    // discriminated union 을 좁힌다. Bridge 가 다른 type 을 주면 그건 Contract 위반이다.
    if (response.type !== 'reviews') {
      throw new Error(`reviews 를 요청했는데 type=${response.type} 이 왔다`);
    }
    return {
      status: 'ready',
      items: response.items.slice(0, LEGACY_COMMUNITY_ROWS),
      total: response.total,
      hasMore: response.total > LEGACY_COMMUNITY_ROWS,
    };
  } catch (error) {
    if (!isBridgeError(error)) throw error;
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}

export async function getCourseQuestionsState(
  id: string,
  options: GetCourseCommunityOptions = {},
): Promise<CourseQuestionsState> {
  try {
    const response = shouldUseMockBridge()
      ? getCourseCommunityMock(id, 'questions')
      : await getCourseCommunityHttp(id, 'questions');
    if (response.type !== 'questions') {
      throw new Error(`questions 를 요청했는데 type=${response.type} 이 왔다`);
    }
    return {
      status: 'ready',
      items: response.items.slice(0, LEGACY_COMMUNITY_ROWS),
      total: response.total,
      hasMore: response.total > LEGACY_COMMUNITY_ROWS,
    };
  } catch (error) {
    if (!isBridgeError(error)) throw error;
    options.onError?.(error);
    return { status: 'unavailable' };
  }
}
