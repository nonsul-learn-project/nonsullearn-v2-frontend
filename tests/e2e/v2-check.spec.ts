import { expect, test, type ConsoleMessage } from '@playwright/test';

/**
 * L3 — `/_v2/check` (HARNESS.md §5 렌더·SEO 행).
 *
 * 이 경로가 실제로 라우팅되는지 확인하는 것이 핵심이다. Next.js 에서 `_` 로 시작하는 폴더는
 * private folder 라 라우팅되지 않으므로 `src/app/%5Fv2/check/` 로 만들었다.
 * 그 트릭이 동작하는지는 빌드된 결과물로만 확인할 수 있다.
 */

/** 페이지가 뱉은 console error 를 모은다. */
function collectConsoleErrors(messages: string[]) {
  return (message: ConsoleMessage) => {
    if (message.type() === 'error') messages.push(message.text());
  };
}

test('/_v2/check 가 200 이고 콘솔 error 가 없다', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', collectConsoleErrors(errors));
  page.on('pageerror', (error) => errors.push(error.message));

  const response = await page.goto('/_v2/check');
  expect(response?.status()).toBe(200);

  await expect(page.getByRole('heading', { level: 1, name: 'V2 Check' })).toBeVisible();
  // viewer 조회가 끝날 때까지 기다린다 (서버 HTML 은 항상 loading 이다).
  await expect(page.getByTestId('auth-area')).not.toHaveAttribute('data-status', 'loading');

  expect(errors).toEqual([]);
});

test('noindex 메타가 있다', async ({ page }) => {
  await page.goto('/_v2/check');
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute('content', /noindex/);
});

test('프록시를 거치지 않은 응답에는 X-Robots-Tag: noindex 가 붙는다', async ({ page }) => {
  const response = await page.goto('/_v2/check');
  expect(response?.headers()['x-robots-tag']).toBe('noindex');
});

test('서버 HTML 에 로그인 상태가 들어가지 않는다 (캐시 오염 방지)', async ({ request }) => {
  // JS 없이 받은 HTML 은 항상 loading 이어야 한다 (AGENTS.md §6.3).
  const response = await request.get('/_v2/check?viewer=member');
  const html = await response.text();
  expect(html).toContain('data-status="loading"');
  expect(html).not.toContain('로그아웃');
});

test.describe('viewer mock 시나리오', () => {
  test('?viewer=corrector 에서 첨삭 링크가 노출된다', async ({ page }) => {
    await page.goto('/_v2/check?viewer=corrector');
    await expect(page.getByRole('link', { name: '첨삭제출현황' })).toBeVisible();
    await expect(page.getByRole('link', { name: '관리자' })).toHaveCount(0);
  });

  test('?viewer=member 에서는 첨삭 링크가 없다', async ({ page }) => {
    await page.goto('/_v2/check?viewer=member');
    await expect(page.getByRole('link', { name: '로그아웃' })).toBeVisible();
    await expect(page.getByRole('link', { name: '첨삭제출현황' })).toHaveCount(0);
  });

  test('?viewer=anonymous 에서 로그인 링크가 현재 경로를 복귀값으로 가진다', async ({ page }) => {
    await page.goto('/_v2/check?viewer=anonymous');
    const login = page.getByRole('link', { name: '로그인' });
    await expect(login).toBeVisible();
    await expect(login).toHaveAttribute('href', '/bbs/login.php?url=%2F_v2%2Fcheck');
  });

  test('?viewer=unavailable 에서 에러 화면 대신 로그인 버튼이 나온다', async ({ page }) => {
    await page.goto('/_v2/check?viewer=unavailable');
    await expect(page.getByTestId('auth-area')).toHaveAttribute('data-status', 'unavailable');
    await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '문제가 발생했습니다' })).toHaveCount(0);
  });

  test('?viewer=admin 에서 관리자 링크가 노출된다', async ({ page }) => {
    await page.goto('/_v2/check?viewer=admin');
    await expect(page.getByRole('link', { name: '관리자' })).toBeVisible();
  });
});
