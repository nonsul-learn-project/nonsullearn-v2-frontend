import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { BridgeError, isJsonContentType } from '@/legacy/client/bridge-error';
import { bridgeFetch } from '@/legacy/client/bridge-fetch';

/**
 * L1 — bridge-fetch (HARNESS.md §3: HTML 응답 → 실패, 잘못된 JSON → 실패, timeout → 실패).
 *
 * Legacy Apache 는 없는 경로에 `ErrorDocument 404 /index.php` 로 **홈 HTML** 을 돌려준다
 * (docs/discovery/bridge-risks.md "404 fallback", manual:M3). 그래서 content-type 검사가 필수다.
 */

const schema = z.object({ v: z.literal(1), ok: z.boolean() }).strict();

const jsonResponse = (body: unknown, init?: { status?: number; contentType?: string }) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'content-type': init?.contentType ?? 'application/json' },
  });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const call = () => bridgeFetch({ path: '/v2-api/viewer.php', schema, timeoutMs: 1_000 });

const expectKind = async (kind: string): Promise<BridgeError> => {
  const error = await call().catch((caught: unknown) => caught);
  expect(error).toBeInstanceOf(BridgeError);
  expect((error as BridgeError).kind).toBe(kind);
  return error as BridgeError;
};

describe('정상', () => {
  it('Contract 에 맞는 JSON 을 파싱해 돌려준다', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 1, ok: true }));
    await expect(call()).resolves.toEqual({ v: 1, ok: true });
  });

  it('application/json; charset=utf-8 도 받는다', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ v: 1, ok: true }, { contentType: 'application/json; charset=utf-8' }),
    );
    await expect(call()).resolves.toEqual({ v: 1, ok: true });
  });
});

describe('요청 모양', () => {
  it('same-origin 쿠키를 붙이고 캐시하지 않는다', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 1, ok: true }));
    await call();
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.credentials).toBe('same-origin');
    expect(init.cache).toBe('no-store');
    expect(init.method).toBe('GET');
  });

  it('Cookie 헤더를 직접 만들지 않는다 (AGENTS.md §2)', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 1, ok: true }));
    await call();
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headerKeys = Object.keys((init.headers ?? {}) as Record<string, string>).map((key) =>
      key.toLowerCase(),
    );
    expect(headerKeys).not.toContain('cookie');
  });

  it('절대 URL 은 거부한다', async () => {
    await expect(
      bridgeFetch({ path: 'https://evil.test/viewer.php', schema, timeoutMs: 1_000 }),
    ).rejects.toBeInstanceOf(BridgeError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('HTML 응답 → 실패', () => {
  it('Legacy 의 ErrorDocument 홈 HTML 은 not-json 이다', async () => {
    fetchMock.mockResolvedValue(
      new Response('<!DOCTYPE html><html><body>논술런</body></html>', {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      }),
    );
    await expectKind('not-json');
  });

  it('content-type 이 없으면 not-json 이다', async () => {
    fetchMock.mockResolvedValue(new Response('{"v":1,"ok":true}', { status: 200 }));
    await expectKind('not-json');
  });

  it.each(['text/plain', 'text/html', 'application/xml'])(
    '%s 는 not-json 이다',
    async (contentType) => {
      fetchMock.mockResolvedValue(
        new Response('{"v":1,"ok":true}', {
          status: 200,
          headers: { 'content-type': contentType },
        }),
      );
      await expectKind('not-json');
    },
  );
});

describe('잘못된 JSON → 실패', () => {
  it('JSON 파싱이 깨지면 malformed-json 이다', async () => {
    fetchMock.mockResolvedValue(
      new Response('{"v":1,', { status: 200, headers: { 'content-type': 'application/json' } }),
    );
    await expectKind('malformed-json');
  });

  it('Contract 와 맞지 않으면 contract 다', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 2, ok: true }));
    await expectKind('contract');
  });

  it('알 수 없는 필드가 있으면 contract 다 (.strict())', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 1, ok: true, mb_id: 'x' }));
    await expectKind('contract');
  });

  it('Contract 위반 에러 메시지에 응답 본문을 담지 않는다', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 1, ok: true, mb_email: 'a@b.test' }));
    const error = await expectKind('contract');
    expect(error.message).not.toContain('a@b.test');
  });
});

describe('HTTP 상태', () => {
  it.each([401, 403, 404, 500, 502, 504])('status %i 는 http 다', async (status) => {
    fetchMock.mockResolvedValue(jsonResponse({ v: 1, ok: true }, { status }));
    const error = await expectKind('http');
    expect(error.status).toBe(status);
  });
});

describe('timeout → 실패', () => {
  it('timeoutMs 를 넘기면 timeout 이다', async () => {
    // fetch 가 abort signal 을 보고 거부하도록 흉내낸다 (실제 fetch 와 같은 동작).
    fetchMock.mockImplementation(
      (_input: unknown, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            reject(new DOMException('aborted', 'AbortError'));
          });
        }),
    );
    await expect(
      bridgeFetch({ path: '/v2-api/viewer.php', schema, timeoutMs: 10 }),
    ).rejects.toMatchObject({ kind: 'timeout' });
  });

  it('네트워크 자체가 실패하면 network 다', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expectKind('network');
  });
});

describe('isJsonContentType', () => {
  it.each([
    ['application/json', true],
    ['application/json; charset=utf-8', true],
    ['APPLICATION/JSON', true],
    ['application/problem+json', true],
    ['text/html', false],
    ['text/json', false],
    [null, false],
  ] as const)('%s → %s', (contentType, expected) => {
    expect(isJsonContentType(contentType)).toBe(expected);
  });
});
