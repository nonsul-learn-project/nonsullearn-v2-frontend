import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * L1 — Course http adapter (Gate 3).
 *
 * 반환 규약을 고정한다: **404 만 `null`**, 그 밖의 실패는 전부 `BridgeError` throw.
 * throw 하는 이유는 ISR 이 마지막 성공본을 계속 내보내게 하기 위해서다 (ADR 0007).
 *
 * `@/env.server` 는 모듈 로드 시점에 process.env 를 parse 하므로 통째로 mock 한다.
 * 그래야 `COURSE_SOURCE=http` + Bridge base 조합을 테스트에서 만들 수 있다.
 */

const BRIDGE_BASE = 'https://bridge.test/v2-api';
const TIMEOUT_MS = 50;

vi.mock('@/env.server', () => ({
  serverEnv: {
    COURSE_SOURCE: 'http',
    LEGACY_BRIDGE_BASE: BRIDGE_BASE,
    LEGACY_BRIDGE_TIMEOUT_MS: TIMEOUT_MS,
    COURSE_REVALIDATE_SECONDS: 300,
  },
  courseRevalidateSeconds: 300,
}));

const { serverEnv } = await import('@/env.server');
const { getCourseHttp, getCoursesHttp, COURSE_BRIDGE_PATH } =
  await import('@/legacy/adapters/course/http');
const { BridgeError, isBridgeError } = await import('@/legacy/client/bridge-error');

const course = {
  id: '1001',
  title: '예시 강좌',
  summary: '설명',
  price: 264000,
  listPrice: 330000,
  priceOnInquiry: false,
  soldOut: false,
  image: '/data/item/1001/thumb.jpg',
  categoryId: '1010',
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

/** fetch 호출 인자를 기록하면서 주어진 응답을 돌려준다. */
interface FetchCall {
  url: string;
  init: RequestInit & { next?: { revalidate?: number | false } };
}

let calls: FetchCall[] = [];

function stubFetch(impl: (call: FetchCall) => Promise<Response>): void {
  calls = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, init: FetchCall['init']) => {
      const call = { url, init };
      calls.push(call);
      return impl(call);
    }),
  );
}

beforeEach(() => {
  serverEnv.LEGACY_BRIDGE_BASE = BRIDGE_BASE;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('성공', () => {
  it('200 목록 → Course[]', async () => {
    stubFetch(async () => json({ v: 1, items: [course] }));

    await expect(getCoursesHttp()).resolves.toEqual([course]);
    expect(calls[0]!.url).toBe(`${BRIDGE_BASE}${COURSE_BRIDGE_PATH}`);
  });

  it('200 빈 목록 → []', async () => {
    stubFetch(async () => json({ v: 1, items: [] }));
    await expect(getCoursesHttp()).resolves.toEqual([]);
  });

  it('200 단건 → Course', async () => {
    stubFetch(async () => json({ v: 1, item: course }));

    await expect(getCourseHttp('1001')).resolves.toEqual(course);
    expect(calls[0]!.url).toBe(`${BRIDGE_BASE}${COURSE_BRIDGE_PATH}?id=1001`);
  });

  it('id 를 URL 인코딩한다 (경로 탈출을 그대로 붙이지 않는다)', async () => {
    stubFetch(async () => json({ v: 1, item: course }));

    await getCourseHttp('../etc/passwd').catch(() => undefined);
    expect(calls[0]!.url).toBe(`${BRIDGE_BASE}${COURSE_BRIDGE_PATH}?id=..%2Fetc%2Fpasswd`);
  });

  it('쿠키를 보내지 않고 ISR revalidate 를 건다 (AGENTS.md §2, §6.3)', async () => {
    stubFetch(async () => json({ v: 1, items: [course] }));
    await getCoursesHttp();

    const { init } = calls[0]!;
    expect(init.next).toEqual({ revalidate: 300 });
    expect(init.credentials).toBeUndefined();
    expect(JSON.stringify(init.headers ?? {})).not.toMatch(/cookie/i);
    // 리디렉션을 따라가면 Legacy 로그인 HTML 을 JSON 으로 착각한다.
    expect(init.redirect).toBe('manual');
  });
});

describe('없는 강좌만 null 이다', () => {
  it('404 → null', async () => {
    stubFetch(async () => json({ v: 1, error: 'not_found' }, 404));
    await expect(getCourseHttp('nope')).resolves.toBeNull();
  });

  it('404 가 HTML 이어도 null 이다 (Legacy ErrorDocument fallback)', async () => {
    stubFetch(
      async () =>
        new Response('<html>home</html>', {
          status: 404,
          headers: { 'content-type': 'text/html' },
        }),
    );
    await expect(getCourseHttp('nope')).resolves.toBeNull();
  });

  it('목록은 404 를 null 로 바꾸지 않는다 (목록이 없다는 건 장애다)', async () => {
    stubFetch(async () => json({ v: 1, error: 'not_found' }, 404));
    await expect(getCoursesHttp()).rejects.toThrow(BridgeError);
  });
});

describe('그 밖의 실패는 전부 throw 한다 (ISR 이 마지막 성공본을 유지한다)', () => {
  const expectBridgeError = async (promise: Promise<unknown>, kind: string): Promise<void> => {
    const error = await promise.then(
      (value) => {
        throw new Error(`throw 하지 않고 ${JSON.stringify(value)} 를 돌려줬다`);
      },
      (caught: unknown) => caught,
    );
    expect(isBridgeError(error)).toBe(true);
    expect((error as InstanceType<typeof BridgeError>).kind).toBe(kind);
  };

  it('503 → http', async () => {
    stubFetch(async () => json({ v: 1, error: 'bridge_unavailable' }, 503));
    await expectBridgeError(getCourseHttp('1001'), 'http');
    await expectBridgeError(getCoursesHttp(), 'http');
  });

  it('timeout → timeout', async () => {
    stubFetch(
      ({ init }) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        }),
    );
    await expectBridgeError(getCoursesHttp(), 'timeout');
  });

  it('200 인데 HTML → not-json', async () => {
    stubFetch(
      async () =>
        new Response('<html><body>로그인</body></html>', {
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        }),
    );
    await expectBridgeError(getCoursesHttp(), 'not-json');
    await expectBridgeError(getCourseHttp('1001'), 'not-json');
  });

  it('302 → http (따라가지 않는다)', async () => {
    stubFetch(
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: 'https://nonsul-learn.com/bbs/login.php' },
        }),
    );
    await expectBridgeError(getCoursesHttp(), 'http');
    await expectBridgeError(getCourseHttp('1001'), 'http');
  });

  it('Contract 위반 (추가 필드) → contract', async () => {
    stubFetch(async () => json({ v: 1, items: [{ ...course, it_price: 1 }] }));
    await expectBridgeError(getCoursesHttp(), 'contract');
  });

  it('Contract 위반 (단건 item: null) → contract', async () => {
    // 없는 강좌는 404 여야 한다. 200 + item:null 은 Contract 위반이다.
    stubFetch(async () => json({ v: 1, item: null }));
    await expectBridgeError(getCourseHttp('1001'), 'contract');
  });

  it('네트워크 실패 → network', async () => {
    stubFetch(() => Promise.reject(new TypeError('fetch failed')));
    await expectBridgeError(getCoursesHttp(), 'network');
  });

  it('Contract 위반 메시지에 응답 본문을 담지 않는다', async () => {
    stubFetch(async () => json({ v: 1, items: [{ ...course, mb_id: 'secret-user' }] }));
    const error = await getCoursesHttp().catch((caught: unknown) => caught);
    expect(String(error)).not.toContain('secret-user');
  });
});

describe('단일 환경 원칙 (ADR 0006)', () => {
  it('COURSE_SOURCE=http 인데 base 가 없으면 빌드가 아니라 호출 시 실패한다', async () => {
    serverEnv.LEGACY_BRIDGE_BASE = undefined;
    stubFetch(async () => json({ v: 1, items: [] }));

    const error = await getCoursesHttp().catch((caught: unknown) => caught);
    expect(isBridgeError(error)).toBe(true);
    expect(String(error)).toContain('LEGACY_BRIDGE_BASE');
    // fetch 를 시도조차 하지 않는다.
    expect(calls).toHaveLength(0);
  });
});
