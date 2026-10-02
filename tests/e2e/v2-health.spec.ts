import { expect, test } from '@playwright/test';

/**
 * L3 — `/api/v2-health` (HARNESS.md §6 스모크 S5/S6 가 운영에서 쓸 endpoint).
 * 여기서는 응답 모양과 **쿠키 미노출**만 확인한다. 실제 프록시 판정은 Gate 4 에서 한다.
 */

test('응답 모양이 계약대로다', async ({ request }) => {
  const response = await request.get('/api/v2-health');
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('no-store');

  const body = await response.json();
  expect(Object.keys(body).sort()).toEqual(['cookieForwarded', 'env', 'proxied', 'sha']);
  expect(typeof body.proxied).toBe('boolean');
  expect(typeof body.cookieForwarded).toBe('boolean');
});

test('쿠키를 보내도 값이 응답에 담기지 않는다', async ({ request }) => {
  const response = await request.get('/api/v2-health', {
    headers: { cookie: 'PHPSESSID=supersecretsession' },
  });
  const text = await response.text();

  // 쿠키가 왔다는 사실은 알려주되,
  expect(JSON.parse(text).cookieForwarded).toBe(true);
  // 값은 절대 담지 않는다.
  expect(text).not.toContain('supersecretsession');
  expect(text).not.toContain('PHPSESSID');
});

test('secret 없이 호출하면 proxied 가 false 다', async ({ request }) => {
  const body = await (await request.get('/api/v2-health')).json();
  expect(body.proxied).toBe(false);
});
