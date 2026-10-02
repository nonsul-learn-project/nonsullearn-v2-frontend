import anonymousFixture from '../../../../contracts/bridge/fixtures/viewer.anonymous.json';
import correctorFixture from '../../../../contracts/bridge/fixtures/viewer.corrector.json';
import memberFixture from '../../../../contracts/bridge/fixtures/viewer.member.json';
import { toViewerState, viewerResponseSchema, type ViewerState } from '../../contracts/viewer';

/**
 * mock viewer. 로컬과 Preview 에서 쓴다.
 *
 * fixture 를 그냥 반환하지 않고 **schema 로 한 번 parse 한다.** mock 이 Contract 를 벗어나면
 * 거기서 바로 실패해야 한다. 그래야 mock 과 http 가 같은 약속 위에 있다
 * (contracts/bridge/README.md "단일 원본 규칙" 3).
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

/**
 * Contract 에는 관리자 전용 fixture 를 두지 않는다. `admin` 은 capabilities 조합일 뿐이고,
 * fixture 를 늘리면 Contract 원본에 UI 시나리오가 섞인다. corrector fixture 에서 파생한다.
 */
const correctorResponse = viewerResponseSchema.parse(correctorFixture);
const adminResponse = viewerResponseSchema.parse({
  ...correctorResponse,
  capabilities: { correction: true, admin: true },
});

const responses: Record<'anonymous' | 'member' | 'corrector' | 'admin', unknown> = {
  anonymous: anonymousFixture,
  member: memberFixture,
  corrector: correctorFixture,
  admin: adminResponse,
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
    return toViewerState(viewerResponseSchema.parse(responses.member));
  }

  return toViewerState(viewerResponseSchema.parse(responses[scenario]));
}
