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

test.describe('Gate 8 정적 이관 페이지', () => {
  const pages = [
    ['/correction-system', '첨삭 시스템 소개', '합격을 완성하는', false],
    ['/about', '논술런 소개', '논술, 이제', false],
    ['/company', '회사 안내', '김윤환입시연구소 사업자 정보', true],
  ] as const;

  for (const [path, title, visibleText, isImageOnly] of pages) {
    test(`${path}는 noindex metadata와 Legacy 구조 콘텐츠를 제공한다`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(`${title} | 논술런`);
      await expect(page.locator('meta[name="description"]')).not.toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      const content = isImageOnly
        ? page.getByRole('img', { name: visibleText })
        : page.getByText(visibleText, { exact: false }).first();
      await expect(content).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://nonsul-learn.com${path}`,
      );
    });
  }
});
