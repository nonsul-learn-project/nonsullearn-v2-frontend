import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const url = process.argv[2];
if (!url) throw new Error('Usage: node scripts/capture-legacy-baseline.mjs <legacy-url>');
const viewports = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
const directory = new URL('../tests/visual/baseline/legacy/', import.meta.url);
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document
      .querySelectorAll('.carousel')
      .forEach((element) => element.setAttribute('data-bs-interval', 'false'));
  });
  await page
    .locator('nav')
    .screenshot({ path: new URL(`header-${viewport.name}.png`, directory).pathname });
  await page
    .locator('footer')
    .screenshot({ path: new URL(`footer-${viewport.name}.png`, directory).pathname });
  if (viewport.width < 1024) {
    await page.getByRole('button', { name: '메뉴 열기' }).click();
    await page
      .locator('#offcanvasNavbar')
      .screenshot({ path: new URL(`mobile-nav-${viewport.name}.png`, directory).pathname });
  }
  await page.close();
}
await browser.close();
const sha = createHash('sha256')
  .update(await readFile(new URL('../src/design-system/legacy/main.css', import.meta.url)))
  .digest('hex');
await writeFile(
  new URL('meta.json', directory),
  JSON.stringify({ capturedAt: new Date().toISOString(), url, mainCssSha256: sha }, null, 2),
);
