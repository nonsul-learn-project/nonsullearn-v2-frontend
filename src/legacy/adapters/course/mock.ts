import basicDetailFixture from '../../../../contracts/bridge/fixtures/course-detail.basic.json';
import basicListFixture from '../../../../contracts/bridge/fixtures/courses-list.basic.json';
import emptyListFixture from '../../../../contracts/bridge/fixtures/courses-list.empty.json';
import {
  courseItemResponseSchema,
  courseListResponseSchema,
  type Course,
} from '../../contracts/course';
import { BridgeError } from '../../client/bridge-error';

/**
 * mock course. **데이터를 여기 쓰지 않는다.** `contracts/bridge/fixtures/` 를 읽어
 * zod 로 parse 해서 돌려준다. 그래서 mock 이 Contract 를 벗어날 수 없다
 * (contracts/bridge/README.md "단일 원본 규칙" 3).
 *
 * 반환 모양은 http adapter 와 **같다**: 없는 강좌는 `null`, 실패는 `BridgeError` throw.
 * 4가지 UI 상태로 바꾸는 일은 `index.ts` 의 `getCourseState`/`getCoursesState` 가 한다.
 */

export const COURSE_MOCK_SCENARIOS = ['on-sale', 'sold-out', 'missing', 'error'] as const;

export type CourseMockScenario = (typeof COURSE_MOCK_SCENARIOS)[number];

export function parseCourseScenario(value: string | null | undefined): CourseMockScenario {
  const found = COURSE_MOCK_SCENARIOS.find((scenario) => scenario === value);
  return found ?? 'on-sale';
}

/** fixture 를 한 번만 parse 한다. Contract 를 벗어난 fixture 는 여기서 바로 터진다. */
const basicList = courseListResponseSchema.parse(basicListFixture);
const emptyList = courseListResponseSchema.parse(emptyListFixture);
const basicDetail = courseItemResponseSchema.parse(basicDetailFixture);

/**
 * 품절 단건은 목록 fixture 의 품절 항목을 그대로 쓴다.
 * 같은 강좌를 두 fixture 에 중복해 두면 갈라지기 때문이다.
 */
function soldOutCourse(): Course {
  const found = basicList.items.find((course) => course.soldOut);
  if (found === undefined) {
    throw new Error(
      'courses-list.basic.json 에 soldOut 항목이 없다. sold-out 시나리오가 성립하지 않는다.',
    );
  }
  return found;
}

/** mock 실패 시나리오. http adapter 의 `bridge_unavailable` 과 같은 모양으로 던진다. */
function mockUnavailable(): never {
  throw new BridgeError('http', '/courses.php', 'mock error 시나리오 (?course=error)', {
    status: 503,
  });
}

/** 없는 강좌는 `null` 이다 (Bridge 는 404 + `not_found` 로 답한다). */
export function getCourseMock(scenario: CourseMockScenario): Course | null {
  switch (scenario) {
    case 'error':
      return mockUnavailable();
    case 'missing':
      return null;
    case 'sold-out':
      return soldOutCourse();
    case 'on-sale':
      return basicDetail.item;
  }
}

export function getCoursesMock(scenario: CourseMockScenario): Course[] {
  switch (scenario) {
    case 'error':
      return mockUnavailable();
    // 빈 목록도 처리해야 하는 상태다 (AGENTS.md §6.4 "빈 값/없음").
    case 'missing':
      return emptyList.items;
    case 'sold-out':
    case 'on-sale':
      return basicList.items;
  }
}
