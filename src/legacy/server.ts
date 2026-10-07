import 'server-only';

/**
 * Legacy Integration Boundary 의 **서버 전용** 공개 API.
 *
 * 쿠키 없이 가져오는 공개 데이터만 여기 있다. 강좌 정보는 Vercel 서버가 ISR 로 읽는다
 * (AGENTS.md §2 표). viewer 는 브라우저가 호출하므로 `@/legacy` 쪽이다.
 *
 * `server-only` 때문에 `'use client'` 컴포넌트가 이 모듈을 import 하면 빌드가 실패한다.
 * 그게 목적이다 (docs/decisions/0004-legacy-public-api-split.md).
 */

export {
  getCourse,
  getCourses,
  getCourseState,
  getCoursesState,
  type GetCourseOptions,
} from './adapters/course';

export {
  getCourseDetail,
  getCourseDetailState,
  type GetCourseDetailOptions,
} from './adapters/course-detail';

export {
  getCourseReviewsState,
  getCourseQuestionsState,
  type GetCourseCommunityOptions,
} from './adapters/course-community';
