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
import { BridgeError } from '@/legacy/client/bridge-error';
import { courseSchema } from '@/legacy/contracts/course';

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

describe('viewer http — same-origin 규약 (Gate 3 점검)', () => {
  it('상대 경로를 쓰고 쿠키를 브라우저에 맡긴다 (절대 URL/cors 로 바꾸지 않는다)', async () => {
    const seen: { url: unknown; init: RequestInit | undefined }[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((url: unknown, init: RequestInit | undefined) => {
        seen.push({ url, init });
        return Promise.resolve(
          new Response(JSON.stringify({ v: 1, authenticated: false }), {
            headers: { 'content-type': 'application/json' },
          }),
        );
      }),
    );

    await getViewerHttp({ timeoutMs: 100 });

    expect(seen).toHaveLength(1);
    expect(seen[0]!.url).toBe('/v2-api/viewer.php');
    // 세션 쿠키는 브라우저가 same-origin 요청에 자동으로 붙인다. 서버 코드가 쿠키를 만들지 않는다.
    expect(seen[0]!.init?.credentials).toBe('same-origin');
    // 로그인 상태는 캐시하지 않는다.
    expect(seen[0]!.init?.cache).toBe('no-store');
    // CORS 요청으로 바꾸면 쿠키 규칙이 달라진다.
    expect(seen[0]!.init?.mode).toBeUndefined();
    vi.unstubAllGlobals();
  });

  it('302 는 unavailable 이다 (로그인 페이지로 튄 응답을 로그인으로 착각하지 않는다)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(null, {
            status: 302,
            headers: { location: '/bbs/login.php' },
          }),
        ),
      ),
    );
    const onError = vi.fn();
    await expect(getViewerHttp({ timeoutMs: 100, onError })).resolves.toEqual({
      status: 'unavailable',
    });
    expect(onError).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('viewer 경로는 same-origin 상대경로다 (절대 URL 은 bridge-fetch 가 막는다)', () => {
    expect(VIEWER_BRIDGE_PATH).toBe('/v2-api/viewer.php');
    expect(VIEWER_BRIDGE_PATH).not.toMatch(/^https?:/);
  });

  it('Contract 를 벗어난 응답은 unavailable 이고 예외를 전파하지 않는다', async () => {
    // level 숫자가 섞여 들어온 경우 (ADR 0003, AGENTS.md §6.4)
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              v: 1,
              authenticated: true,
              capabilities: { correction: true, admin: false },
              member: { level: 8 },
            }),
            { headers: { 'content-type': 'application/json' } },
          ),
        ),
      ),
    );
    await expect(getViewerHttp({ timeoutMs: 100 })).resolves.toEqual({ status: 'unavailable' });
    vi.unstubAllGlobals();
  });
});

describe('course mock — http adapter 와 같은 모양으로 답한다', () => {
  it('on-sale 은 판매중 강좌를 돌려준다', () => {
    const course = getCourseMock('on-sale');
    expect(course).not.toBeNull();
    expect(course!.soldOut).toBe(false);
    expect(course!.priceOnInquiry).toBe(false);
    expect(course!.price).toBeGreaterThan(0);
  });

  it('sold-out 은 품절 강좌를 돌려준다', () => {
    const course = getCourseMock('sold-out');
    expect(course).not.toBeNull();
    expect(course!.soldOut).toBe(true);
  });

  it('missing 은 null 이다 (Bridge 는 404 + not_found)', () => {
    expect(getCourseMock('missing')).toBeNull();
  });

  it('error 는 BridgeError 를 던진다 (http adapter 와 동일)', () => {
    expect(() => getCourseMock('error')).toThrow(BridgeError);
    expect(() => getCoursesMock('error')).toThrow(BridgeError);
  });

  it('목록은 fixture 의 강좌를 돌려준다', () => {
    expect(getCoursesMock('on-sale').length).toBeGreaterThan(0);
  });

  it('목록에 전화문의와 품절 강좌가 모두 있다 (UI 4가지 상태 재현용)', () => {
    const courses = getCoursesMock('on-sale');
    expect(courses.some((course) => course.priceOnInquiry)).toBe(true);
    expect(courses.some((course) => course.soldOut)).toBe(true);
    expect(courses.some((course) => course.image === null)).toBe(true);
  });

  it('missing 은 빈 목록이다 (AGENTS.md §6.4 빈 값)', () => {
    expect(getCoursesMock('missing')).toEqual([]);
  });

  it('mock 이 돌려준 강좌는 Contract 를 만족한다', () => {
    for (const course of getCoursesMock('on-sale')) {
      expect(courseSchema.safeParse(course).success).toBe(true);
    }
    expect(courseSchema.safeParse(getCourseMock('on-sale')).success).toBe(true);
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
