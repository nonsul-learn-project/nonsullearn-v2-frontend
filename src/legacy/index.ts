/**
 * Legacy Integration Boundary 의 **클라이언트에서도 안전한** 공개 API.
 *
 * `app/`, `features/` 는 이 모듈과 `@/legacy/server` 두 개만 import 한다.
 * 내부 경로(`@/legacy/client/*`, `@/legacy/adapters/*`, `@/legacy/contracts/*`)는 ESLint 가 막는다.
 *
 * 여기에 `server-only` 에 의존하는 것을 넣지 않는다. 넣으면 `'use client'` 컴포넌트가
 * 이 모듈을 import 하는 순간 빌드가 실패한다. 서버 전용 데이터 접근은 `./server.ts` 가 소유한다
 * (docs/decisions/0004-legacy-public-api-split.md).
 */

export {
  ViewerProvider,
  useViewer,
  useViewerCapabilities,
  type ViewerProviderProps,
} from './adapters/viewer/ViewerProvider';

export { legacyRoutes, safeReturnTo, type LegacyRoutes } from './handoff/routes';

export { BridgeError, isBridgeError, type BridgeErrorKind } from './client/bridge-error';

export { legacyAssetUrl, COURSE_IMAGE_PLACEHOLDER } from './assets';

export {
  legacyItemThumbnail,
  COURSE_IMAGE_WIDTH,
  COURSE_IMAGE_HEIGHT,
  type LegacyThumbnail,
} from './assets';

export type { ViewerState, ViewerCapabilities } from './contracts/viewer';

export type { Course, CourseState, CourseListState, BridgeErrorCode } from './contracts/course';

export {
  courseIdSchema,
} from './contracts/course';

/**
 * 강좌 상세는 Contract 타입과 **Legacy 스킨의 판단**을 같이 내보낸다.
 * `isCourseOrderable` 같은 것은 순수 함수이며, 폼을 그리는 Client Component 가 써야 한다.
 */
export {
  isCourseSoldOut,
  isCourseOrderable,
  requiresLegacyCertification,
  courseStarScore,
  COURSE_INFORMATION_TITLES,
} from './contracts/course-full';

export type {
  CourseFull,
  CourseFullItem,
  CourseFullState,
  CourseCategory,
  CourseExtra,
  CourseInformation,
  CourseOptions,
  CourseOptionItem,
  CourseReviewSummary,
  CourseForm,
} from './contracts/course-full';

export type {
  CategoryListResponse,
  CategoryListItem,
  CategoryListCategory,
  CategoryListPagination,
  CategoryListBadges,
} from './contracts/category-list';

export { LEGACY_COMMUNITY_ROWS } from './contracts/course-community';

export type {
  CourseReview,
  CourseReviewReply,
  CourseQuestion,
  CourseReviewsState,
  CourseQuestionsState,
  CourseCommunityType,
} from './contracts/course-community';
