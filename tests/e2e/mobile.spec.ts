import { expect, test } from '@playwright/test';

/**
 * L3 — 모바일 레이아웃 (HARNESS.md §5 모바일 행, AGENTS.md §6.5 "모바일(375px) 우선, 가로 스크롤 금지").
 */

test.use({ viewport: { width: 375, height: 812 } });

for (const path of ['/', '/_v2/check', '/_v2/check?viewer=corrector']) {
  test(`375×812 에서 ${path} 에 가로 스크롤이 없다`, async ({ page }) => {
    await page.goto(path);
    // 뷰포트보다 넓은 콘텐츠가 있으면 scrollWidth 가 375 를 넘는다.
    const scrollWidth = await page.evaluate(() => document.scrollingElement?.scrollWidth ?? 0);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });
}
