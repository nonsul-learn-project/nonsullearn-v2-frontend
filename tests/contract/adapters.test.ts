import { describe, expect, it, vi } from 'vitest';

import { getViewerHttp, VIEWER_BRIDGE_PATH } from '@/legacy/adapters/viewer/http';
import {
  getViewerMock,
  parseViewerScenario,
  VIEWER_MOCK_SCENARIOS,
} from '@/legacy/adapters/viewer/mock';
import {
  COURSE_MOCK_SCENARIOS,
  getCourseMock,
  getCoursesMock,
  parseCourseScenario,
} from '@/legacy/adapters/course/mock';

/**
 * L1 — Adapter. mock 은 fixture 를 schema 로 parse해서 돌려주고,
 * http 는 **모든 실패를 `unavailable` 로** 바꿔야 한다 (AGENTS.md §6.4).
 */

describe('viewer mock', () => {
  it.each([
    ['anonymous', { status: 'anonymous' }],
    ['member', { status: 'member', can: { correction: false, admin: false } }],
    ['corrector', { status: 'member', can: { correction: true, admin: false } }],
    ['admin', { status: 'member', can: { correction: true, admin: true } }],
    ['unavailable', { status: 'unavailable' }],
  ] as const)('%s 시나리오', async (scenario, expected) => {
    await expect(getViewerMock(scenario)).resolves.toEqual(expected);
  });

  it('slow 는 member 를 돌려준다 (loading 상태를 눈으로 보기 위한 지연)', async () => {
    vi.useFakeTimers();
    const promise = getViewerMock('slow');
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toEqual({
      status: 'member',
      can: { correction: false, admin: false },
    });
    vi.useRealTimers();
  });

  it('모르는 ?viewer= 값은 anonymous 로 떨어진다', () => {
    for (const value of ['nope', '', null, undefined, 'MEMBER']) {
      expect(parseViewerScenario(value)).toBe('anonymous');
    }
  });

  it('알려진 시나리오는 그대로 통과한다', () => {
    for (const scenario of VIEWER_MOCK_SCENARIOS) {
      expect(parseViewerScenario(scenario)).toBe(scenario);
    }
  });
});

describe('viewer http — 모든 실패는 unavailable', () => {
  const stubFetch = (impl: () => Promise<Response>) => vi.stubGlobal('fetch', vi.fn(impl));

  it('정상 응답을 상태로 옮긴다', async () => {
    stubFetch(
      async () =>
        new Response(
          JSON.stringify({
            v: 1,
            authenticated: true,
            capabilities: { correction: true, admin: false },
          }),
          {
            headers: { 'content-type': 'application/json' },
          },
        ),
    );
    await expect(getViewerHttp({ timeoutMs: 100 })).resolves.toEqual({
      status: 'member',
      can: { correction: true, admin: false },
    });
    vi.unstubAllGlobals();
  });

  it.each([
    [
      'HTML 응답',
      async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } }),
    ],
    [
      '500',
      async () =>
        new Response('{}', { status: 500, headers: { 'content-type': 'application/json' } }),
    ],
    [
      '깨진 JSON',
      async () => new Response('{', { headers: { 'content-type': 'application/json' } }),
    ],
    [
      'Contract 위반',
      async () =>
        new Response(JSON.stringify({ v: 1, authenticated: true, mb_id: 'x' }), {
          headers: { 'content-type': 'application/json' },
        }),
    ],
  ])('%s → unavailable 이고 throw 하지 않는다', async (_label, impl) => {
    stubFetch(impl as () => Promise<Response>);
    const onError = vi.fn();
    await expect(getViewerHttp({ timeoutMs: 100, onError })).resolves.toEqual({
      status: 'unavailable',
    });
    expect(onError).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('네트워크 실패도 unavailable 이다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );
    await expect(getViewerHttp({ timeoutMs: 100 })).resolves.toEqual({ status: 'unavailable' });
    vi.unstubAllGlobals();
  });

  it('same-origin 상대경로를 호출한다', async () => {
    const requested: unknown[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((input: unknown) => {
        requested.push(input);
        return Promise.resolve(
          new Response(JSON.stringify({ v: 1, authenticated: false }), {
            headers: { 'content-type': 'application/json' },
          }),
        );
      }),
    );
    await getViewerHttp({ timeoutMs: 100 });
    expect(requested).toEqual([VIEWER_BRIDGE_PATH]);
    expect(VIEWER_BRIDGE_PATH.startsWith('/')).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe('course mock', () => {
  it('on-sale 은 판매중 강좌를 돌려준다', () => {
    const state = getCourseMock('on-sale');
    expect(state.status).toBe('ready');
    if (state.status !== 'ready') throw new Error('unreachable');
    expect(state.course.saleStatus).toBe('on_sale');
    expect(state.course.salePrice).toBeGreaterThan(0);
  });

  it('sold-out 은 마감 강좌를 돌려준다', () => {
    const state = getCourseMock('sold-out');
    expect(state.status).toBe('ready');
    if (state.status !== 'ready') throw new Error('unreachable');
    expect(state.course.saleStatus).toBe('sold_out');
  });

  it('missing 은 missing 상태다', () => {
    expect(getCourseMock('missing')).toEqual({ status: 'missing' });
  });

  it('error 는 unavailable 상태다', () => {
    expect(getCourseMock('error')).toEqual({ status: 'unavailable' });
    expect(getCoursesMock('error')).toEqual({ status: 'unavailable' });
  });

  it('목록은 fixture 의 강좌를 돌려준다', () => {
    const state = getCoursesMock('on-sale');
    expect(state.status).toBe('ready');
    if (state.status !== 'ready') throw new Error('unreachable');
    expect(state.courses.length).toBeGreaterThan(0);
  });

  it('빈 목록 상태를 표현할 수 있다 (AGENTS.md §6.4 빈 값)', () => {
    const state = getCoursesMock('missing');
    expect(state.status).toBe('ready');
    if (state.status !== 'ready') throw new Error('unreachable');
    expect(state.courses).toEqual([]);
  });

  it('모르는 ?course= 값은 on-sale 로 떨어진다', () => {
    for (const value of ['nope', '', null, undefined]) {
      expect(parseCourseScenario(value)).toBe('on-sale');
    }
    for (const scenario of COURSE_MOCK_SCENARIOS) {
      expect(parseCourseScenario(scenario)).toBe(scenario);
    }
  });
});
