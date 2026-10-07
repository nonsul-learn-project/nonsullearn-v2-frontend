import emptyFixture from '../../../../contracts/bridge/fixtures/course-community.empty.json';
import questionsFixture from '../../../../contracts/bridge/fixtures/course-community.questions.json';
import reviewsFixture from '../../../../contracts/bridge/fixtures/course-community.reviews.json';
import { BridgeError } from '../../client/bridge-error';
import {
  courseCommunityResponseSchema,
  type CourseCommunityResponse,
  type CourseCommunityType,
} from '../../contracts/course-community';
import { COURSE_DETAIL_MOCK_ERROR_ID } from '../course-detail/mock';

import { COURSE_COMMUNITY_BRIDGE_PATH } from './http';

/**
 * mock 후기/문의. fixture 를 읽어 zod 로 parse 한다
 * (contracts/bridge/README.md "단일 원본 규칙" 3).
 *
 * 상세 mock 과 **같은 id 주소 체계**를 쓴다 (`adapters/course-detail/mock.ts` 주석 참고).
 * `1001` 만 후기·문의가 있고 나머지는 비어 있다 — fixture 의 `reviewSummary.count` 와 맞춘다.
 * 안 맞으면 요약은 "3건"인데 목록은 비는 화면이 나와서 parity 확인이 어려워진다.
 */

const reviews = courseCommunityResponseSchema.parse(reviewsFixture);
const questions = courseCommunityResponseSchema.parse(questionsFixture);
const empty = courseCommunityResponseSchema.parse(emptyFixture);

/** 후기·문의가 있는 유일한 mock 강좌. `course-full.basic.json` 의 id 다. */
const WITH_CONTENT_ID = '1001';

function emptyFor(type: CourseCommunityType): CourseCommunityResponse {
  return type === 'reviews' ? empty : { ...empty, type: 'questions', items: [] };
}

export function getCourseCommunityMock(
  id: string,
  type: CourseCommunityType,
): CourseCommunityResponse {
  if (id === COURSE_DETAIL_MOCK_ERROR_ID) {
    throw new BridgeError(
      'http',
      COURSE_COMMUNITY_BRIDGE_PATH,
      `mock 장애 시나리오 (id=${COURSE_DETAIL_MOCK_ERROR_ID})`,
      { status: 503 },
    );
  }

  if (id !== WITH_CONTENT_ID) return emptyFor(type);
  return type === 'reviews' ? reviews : questions;
}
