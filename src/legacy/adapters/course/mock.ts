import emptyListFixture from '../../contracts/fixtures/course.empty-list.json';
import listFixture from '../../contracts/fixtures/course.list.json';
import missingFixture from '../../contracts/fixtures/course.missing.json';
import onSaleFixture from '../../contracts/fixtures/course.on-sale.json';
import soldOutFixture from '../../contracts/fixtures/course.sold-out.json';
import {
  courseItemResponseSchema,
  courseListResponseSchema,
  type CourseListState,
  type CourseState,
} from '../../contracts/course';

/**
 * mock course. fixture를 schema로 parse해서 돌려준다 (HARNESS.md §2 — 같은 fixture를 공유한다).
 */

export const COURSE_MOCK_SCENARIOS = ['on-sale', 'sold-out', 'missing', 'error'] as const;

export type CourseMockScenario = (typeof COURSE_MOCK_SCENARIOS)[number];

export function parseCourseScenario(value: string | null | undefined): CourseMockScenario {
  const found = COURSE_MOCK_SCENARIOS.find((scenario) => scenario === value);
  return found ?? 'on-sale';
}

const itemFixtures: Record<'on-sale' | 'sold-out' | 'missing', unknown> = {
  'on-sale': onSaleFixture,
  'sold-out': soldOutFixture,
  missing: missingFixture,
};

export function getCourseMock(scenario: CourseMockScenario): CourseState {
  if (scenario === 'error') return { status: 'unavailable' };

  const parsed = courseItemResponseSchema.parse(itemFixtures[scenario]);
  if (parsed.item === null) return { status: 'missing' };
  return { status: 'ready', course: parsed.item };
}

export function getCoursesMock(scenario: CourseMockScenario): CourseListState {
  if (scenario === 'error') return { status: 'unavailable' };

  const source = scenario === 'missing' ? emptyListFixture : listFixture;
  const parsed = courseListResponseSchema.parse(source);
  return { status: 'ready', courses: parsed.items };
}
