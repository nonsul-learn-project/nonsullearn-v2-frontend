import anonymousFixture from '../../contracts/fixtures/viewer.anonymous.json';
import adminFixture from '../../contracts/fixtures/viewer.admin.json';
import correctorFixture from '../../contracts/fixtures/viewer.corrector.json';
import memberFixture from '../../contracts/fixtures/viewer.member.json';
import { toViewerState, viewerResponseSchema, type ViewerState } from '../../contracts/viewer';

/**
 * mock viewer. 로컬과 Preview에서 쓴다.
 *
 * fixture를 그냥 반환하지 않고 **schema로 한 번 parse한다.** mock이 Contract를 벗어나면
 * 거기서 바로 실패해야 한다. 그래야 mock과 http가 같은 약속 위에 있다 (HARNESS.md §2).
 */

export const VIEWER_MOCK_SCENARIOS = [
  'anonymous',
  'member',
  'corrector',
  'admin',
  'unavailable',
  'slow',
] as const;

export type ViewerMockScenario = (typeof VIEWER_MOCK_SCENARIOS)[number];

const fixtures: Record<'anonymous' | 'member' | 'corrector' | 'admin', unknown> = {
  anonymous: anonymousFixture,
  member: memberFixture,
  corrector: correctorFixture,
  admin: adminFixture,
};

/** `?viewer=` 값을 알려진 시나리오로 좁힌다. 모르는 값은 기본(anonymous)이다. */
export function parseViewerScenario(value: string | null | undefined): ViewerMockScenario {
  const found = VIEWER_MOCK_SCENARIOS.find((scenario) => scenario === value);
  return found ?? 'anonymous';
}

/** `slow` 시나리오가 loading 상태를 눈으로 확인할 수 있게 만드는 지연. */
export const VIEWER_MOCK_SLOW_DELAY_MS = 1_500;

export async function getViewerMock(scenario: ViewerMockScenario): Promise<ViewerState> {
  if (scenario === 'unavailable') {
    return { status: 'unavailable' };
  }

  if (scenario === 'slow') {
    await new Promise((resolve) => setTimeout(resolve, VIEWER_MOCK_SLOW_DELAY_MS));
    return toViewerState(viewerResponseSchema.parse(fixtures.member));
  }

  return toViewerState(viewerResponseSchema.parse(fixtures[scenario]));
}
