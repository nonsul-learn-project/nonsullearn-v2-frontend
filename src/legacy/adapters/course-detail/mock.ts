import basicFixture from '../../../../contracts/bridge/fixtures/course-full.basic.json';
import noOptionsFixture from '../../../../contracts/bridge/fixtures/course-full.no-options.json';
import priceOnInquiryFixture from '../../../../contracts/bridge/fixtures/course-full.price-on-inquiry.json';
import soldOutFixture from '../../../../contracts/bridge/fixtures/course-full.sold-out.json';
import { BridgeError } from '../../client/bridge-error';
import { courseFullResponseSchema, type CourseFull } from '../../contracts/course-full';

import { COURSE_DETAIL_BRIDGE_PATH } from './http';

/**
 * mock 강좌 상세. **데이터를 여기 쓰지 않는다.** `contracts/bridge/fixtures/` 를 읽어
 * zod 로 parse 해서 돌려준다 (contracts/bridge/README.md "단일 원본 규칙" 3).
 *
 * 반환 모양은 http adapter 와 **같다**: 없는 강좌는 `null`, 실패는 `BridgeError` throw.
 *
 * 시나리오는 `AGENTS.md §5` 의 `?course=` 네 가지에 두 개를 더한다. 선택옵션 유무와
 * 전화문의는 Legacy 스킨이 **DOM 자체를 다르게** 그리는 분기라서, 로컬에서 눈으로 확인할
 * 방법이 없으면 parity 를 검증할 수 없다.
 */

export const COURSE_DETAIL_MOCK_SCENARIOS = [
  'on-sale',
  'no-options',
  'sold-out',
  'price-on-inquiry',
  'missing',
  'error',
] as const;

export type CourseDetailMockScenario = (typeof COURSE_DETAIL_MOCK_SCENARIOS)[number];

export function parseCourseDetailScenario(
  value: string | null | undefined,
): CourseDetailMockScenario {
  const found = COURSE_DETAIL_MOCK_SCENARIOS.find((scenario) => scenario === value);
  return found ?? 'on-sale';
}

/** fixture 를 한 번만 parse 한다. Contract 를 벗어난 fixture 는 여기서 바로 터진다. */
function load(fixture: unknown): CourseFull {
  const { v: _version, ...course } = courseFullResponseSchema.parse(fixture);
  return course;
}

const basic = load(basicFixture);
const noOptions = load(noOptionsFixture);
const soldOut = load(soldOutFixture);
const priceOnInquiry = load(priceOnInquiryFixture);

/** mock 실패 시나리오. http adapter 의 `bridge_unavailable` 과 같은 모양으로 던진다. */
function mockUnavailable(): never {
  throw new BridgeError(
    'http',
    COURSE_DETAIL_BRIDGE_PATH,
    'mock error 시나리오 (?course=error)',
    { status: 503 },
  );
}

/** 없는 강좌는 `null` 이다 (Bridge 는 404 로 답한다). */
export function getCourseDetailMock(scenario: CourseDetailMockScenario): CourseFull | null {
  switch (scenario) {
    case 'error':
      return mockUnavailable();
    case 'missing':
      return null;
    case 'sold-out':
      return soldOut;
    case 'price-on-inquiry':
      return priceOnInquiry;
    case 'no-options':
      return noOptions;
    case 'on-sale':
      return basic;
  }
}
