/**
 * Course Community Contract v1 — 공개 강의후기와 강의문의.
 *
 * **단일 원본은 `contracts/bridge/course-community.v1.schema.json` 이다.**
 *
 * `GET /v2-api/course-community.php?id=<it_id>&type=reviews|questions`
 *
 * Bridge 가 공개하는 범위는 Legacy 목록보다 좁다. 이건 의도된 것이다:
 *
 *   후기 — `is_confirm = 1` (관리자가 확인한 것) 만. Legacy `itemuse.php` 와 같다.
 *   문의 — `iq_secret = 0` (비밀글 아닌 것) 만. **Legacy 는 비밀글도 제목을 보여주고**
 *          본문만 "비밀글로 보호된 문의입니다." 로 가린다. V2 는 비밀글을 아예 받지 않으므로
 *          목록 길이와 `total` 이 Legacy 보다 작다 (docs/decisions/bridge-course-community.md).
 *
 * AGENTS.md §7.2: 개인 식별 정보 금지. `authorName` 은 Legacy 가 `get_text()` 로 내보내는
 * 표시용 이름이며 `mb_id` 가 아니다.
 */

import { z } from 'zod';

import { courseIdSchema } from './course';

export const COURSE_COMMUNITY_CONTRACT_VERSION = 1;

export const COURSE_COMMUNITY_TYPES = ['reviews', 'questions'] as const;

export type CourseCommunityType = (typeof COURSE_COMMUNITY_TYPES)[number];

export const courseCommunityTypeSchema = z.enum(COURSE_COMMUNITY_TYPES);

/** 관리자 답변. Legacy `itemuse.skin.php` 는 `is_reply_subject` 가 있을 때만 블록을 그린다. */
export const courseReviewReplySchema = z
  .object({
    authorName: z.string(),
    subject: z.string(),
    contentHtml: z.string(),
  })
  .strict();

export const courseReviewSchema = z
  .object({
    id: z.number().int().min(1),
    /** 0~5. Legacy 는 이 값으로 `s_star{score}.png` 를 고른다. */
    score: z.number().int().nonnegative(),
    authorName: z.string(),
    subject: z.string(),
    contentHtml: z.string(),
    /** Legacy `is_time`. 스킨은 `substr($is_time, 2, 8)` 로 `YY.MM.DD` 만 보여준다. */
    createdAt: z.string(),
    reply: courseReviewReplySchema.nullable(),
  })
  .strict();

export const courseQuestionSchema = z
  .object({
    id: z.number().int().min(1),
    authorName: z.string(),
    subject: z.string(),
    questionHtml: z.string(),
    /** 답변이 없으면 빈 문자열. Legacy 는 "답변이 등록되지 않았습니다." 로 대체한다. */
    answerHtml: z.string(),
    createdAt: z.string(),
    answered: z.boolean(),
  })
  .strict();

const pageEnvelope = {
  v: z.literal(COURSE_COMMUNITY_CONTRACT_VERSION),
  courseId: courseIdSchema,
  page: z.number().int().min(1),
  /** Bridge 가 고정한 페이지 크기. Legacy `itemuse.php`/`itemqa.php` 는 5 를 쓴다. */
  limit: z.number().int().min(1),
  total: z.number().int().nonnegative(),
};

export const courseReviewsResponseSchema = z
  .object({
    ...pageEnvelope,
    type: z.literal('reviews'),
    items: z.array(courseReviewSchema),
  })
  .strict();

export const courseQuestionsResponseSchema = z
  .object({
    ...pageEnvelope,
    type: z.literal('questions'),
    items: z.array(courseQuestionSchema),
  })
  .strict();

/** `type` 으로 갈라지는 discriminated union. */
export const courseCommunityResponseSchema = z.discriminatedUnion('type', [
  courseReviewsResponseSchema,
  courseQuestionsResponseSchema,
]);

export type CourseReviewReply = z.infer<typeof courseReviewReplySchema>;
export type CourseReview = z.infer<typeof courseReviewSchema>;
export type CourseQuestion = z.infer<typeof courseQuestionSchema>;
export type CourseReviewsResponse = z.infer<typeof courseReviewsResponseSchema>;
export type CourseQuestionsResponse = z.infer<typeof courseQuestionsResponseSchema>;
export type CourseCommunityResponse = z.infer<typeof courseCommunityResponseSchema>;

/**
 * Legacy 가 한 페이지에 보여주는 줄 수.
 *
 * `html2/shop/itemuse.php:69` 와 `html2/shop/itemqa.php:69` 모두 `$rows = 5` 다.
 * Bridge 는 `limit` 을 20 으로 고정해서 주므로, 화면에서는 이 값으로 잘라 Legacy 와 맞춘다.
 * 나머지는 "더 보기"가 Legacy 목록으로 넘긴다 (docs/decisions/bridge-course-community.md).
 */
export const LEGACY_COMMUNITY_ROWS = 5;

/** AGENTS.md §6.4: 후기/문의 탭도 4가지 상태를 모두 처리한다. */
export type CourseCommunityState<T> =
  | { status: 'loading' }
  | { status: 'ready'; items: T[]; total: number; hasMore: boolean }
  | { status: 'unavailable' };

export type CourseReviewsState = CourseCommunityState<CourseReview>;
export type CourseQuestionsState = CourseCommunityState<CourseQuestion>;
