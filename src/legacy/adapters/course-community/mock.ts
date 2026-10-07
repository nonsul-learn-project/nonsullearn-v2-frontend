import emptyFixture from '../../../../contracts/bridge/fixtures/course-community.empty.json';
import questionsFixture from '../../../../contracts/bridge/fixtures/course-community.questions.json';
import reviewsFixture from '../../../../contracts/bridge/fixtures/course-community.reviews.json';
import { BridgeError } from '../../client/bridge-error';
import {
  courseCommunityResponseSchema,
  type CourseCommunityResponse,
  type CourseCommunityType,
} from '../../contracts/course-community';

import { COURSE_COMMUNITY_BRIDGE_PATH } from './http';

/**
 * mock 후기/문의. fixture 를 읽어 zod 로 parse 한다
 * (contracts/bridge/README.md "단일 원본 규칙" 3).
 *
 * 시나리오는 상세 페이지와 같은 `?course=` 값을 쓴다. 강좌가 `no-options`/`sold-out` 처럼
 * 후기가 없는 상태면 빈 목록을 돌려줘야 Legacy 의 "등록된 강의후기가 없습니다." 를 볼 수 있다.
 */

const reviews = courseCommunityResponseSchema.parse(reviewsFixture);
const questions = courseCommunityResponseSchema.parse(questionsFixture);
const empty = courseCommunityResponseSchema.parse(emptyFixture);

function emptyFor(type: CourseCommunityType): CourseCommunityResponse {
  return type === 'reviews' ? empty : { ...empty, type: 'questions', items: [] };
}

/** 후기가 없는 강좌 fixture 와 짝을 맞춰야 하는 시나리오들. */
const EMPTY_SCENARIOS = new Set(['no-options', 'sold-out', 'price-on-inquiry']);

export function getCourseCommunityMock(
  type: CourseCommunityType,
  scenario: string | null | undefined,
): CourseCommunityResponse {
  if (scenario === 'error') {
    throw new BridgeError(
      'http',
      COURSE_COMMUNITY_BRIDGE_PATH,
      'mock error 시나리오 (?course=error)',
      { status: 503 },
    );
  }

  // 후기가 0건인 강좌 fixture 와 짝을 맞춘다.
  if (scenario !== null && scenario !== undefined && EMPTY_SCENARIOS.has(scenario)) {
    return emptyFor(type);
  }

  return type === 'reviews' ? reviews : questions;
}
