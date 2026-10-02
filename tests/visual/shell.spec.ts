import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';

const baseline = 'tests/visual/baseline/legacy/header-375.png';
test('shell visual parity has a captured legacy baseline', async ({ page }) => {
  test.skip(
    !existsSync(baseline),
    'Legacy baseline missing: run node scripts/capture-legacy-baseline.mjs <legacy-url>',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/_v2/shell?viewer=anonymous');
  await expect(page.locator('nav')).toHaveScreenshot('header-375.png', { maxDiffPixelRatio: 0.02 });
});
