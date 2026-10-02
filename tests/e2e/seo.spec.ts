import { expect, test } from '@playwright/test';

/**
 * L3 — robots / 404 / metadata (HARNESS.md §5 robots·404 행).
 */

test('non-production 에서 /robots.txt 가 전부 disallow 다', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain('User-Agent: *');
  expect(body).toContain('Disallow: /');
  // Preview 가 색인되면 운영과 중복 콘텐츠가 된다.
  expect(body).not.toContain('Allow: /');
  expect(body).not.toContain('Sitemap:');
});

test('/sitemap.xml 이 200 이고 비어 있다', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  // V2 가 운영하는 공개 페이지가 아직 없다 (홈 Gate 5, 강좌 Gate 8).
  expect(await response.text()).not.toContain('<url>');
});

test('/does-not-exist 가 404 페이지다', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: '페이지를 찾을 수 없습니다' }),
  ).toBeVisible();
});

test('404 페이지의 로그인 링크가 legacyRoutes 로 만들어진다', async ({ page }) => {
  await page.goto('/does-not-exist');
  await expect(page.getByRole('link', { name: '로그인' })).toHaveAttribute(
    'href',
    '/bbs/login.php?url=%2F',
  );
});

test('홈 placeholder 에 title 과 description 이 있다', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('논술런');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /논술런/);
  await expect(page.getByRole('heading', { level: 1, name: 'V2 Foundation' })).toBeVisible();
});
