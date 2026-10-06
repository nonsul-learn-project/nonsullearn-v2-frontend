/**
 * Hero parity 측정 도구 (사람이 실행한다).
 *
 * Legacy 홈과 V2 홈을 같은 뷰포트에서 띄워 Hero 슬라이드 요소의 getBoundingClientRect와
 * getComputedStyle을 나란히 비교한다. 눈대중 조정 대신 숫자로 parity를 확인하기 위한 것이며,
 * `pnpm check` 하네스에는 포함하지 않는다 (운영 도메인을 조회하므로).
 *
 *   node scripts/parity-hero.mjs                      # V2 = http://localhost:3000
 *   V2_URL=http://localhost:3100/ node scripts/parity-hero.mjs
 *   LEGACY_URL=... node scripts/parity-hero.mjs
 *
 * 쿠키 없이 새 browser context로 열기 때문에 Legacy는 항상 비로그인 화면이다.
 * 자동 슬라이드 전환(Bootstrap Carousel / V2 setInterval)은 `window.setInterval`을 무력화해
 * 멈춘 뒤, `.active` 클래스를 직접 옮겨 슬라이드 3장을 모두 측정한다.
 */
import { chromium } from '@playwright/test';

const LEGACY_URL = process.env.LEGACY_URL ?? 'https://nonsul-learn.com/';
const V2_URL = process.env.V2_URL ?? 'http://localhost:3000/';
const WIDTHS = [1440, 768, 375];

/** 측정 대상. 모두 `.carousel-item.active` 기준이다. */
const TARGETS = [
  ['slide', '슬라이드', '.carousel-item.active'],
  ['container', '.container', '.carousel-item.active .container'],
  ['row', '.row', '.carousel-item.active .row'],
  ['L.col', '좌측 컨테이너', '.carousel-item.active .hero-text-align'],
  ['L.badge', '좌측 배지', '.carousel-item.active .hero-badge'],
  ['L.title', '좌측 제목', '.carousel-item.active .hero-title'],
  ['L.desc', '좌측 설명', '.carousel-item.active .hero-desc'],
  ['L.btn', '좌측 버튼', '.carousel-item.active .hero-btn-wrapper > a'],
  ['R.card', '카드', '.carousel-item.active .instructor-single-box'],
  ['R.icon', '아이콘 원', '.carousel-item.active .instructor-avatar-icon'],
  ['R.info', '카드 내부 컨테이너', '.carousel-item.active .instructor-info'],
  ['R.h4', '카드 제목', '.carousel-item.active .instructor-info h4'],
  ['R.p', '카드 부제', '.carousel-item.active .instructor-info p'],
  ['R.badge', '카드 배지', '.carousel-item.active .instructor-info .badge'],
];

const PROPS = [
  'display',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'gap',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'width',
  'height',
  'minHeight',
  'maxWidth',
  'aspectRatio',
  'position',
  'top',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'wordBreak',
];

async function openPage(context, url) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.setInterval = () => 0;
  });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  return page;
}

async function activate(page, index) {
  await page.evaluate((target) => {
    document
      .querySelectorAll('#heroCarousel .carousel-item')
      .forEach((item, order) => item.classList.toggle('active', order === target));
  }, index);
  await page.waitForTimeout(250);
}

/** 슬라이드 상단 기준 상대 y로 재는 이유: Header 높이 차이(별도 섹션)를 빼고 Hero만 보려고. */
async function probe(page) {
  return page.evaluate(
    ([targets, props]) => {
      const slide = document.querySelector('.carousel-item.active');
      const slideTop = slide === null ? 0 : slide.getBoundingClientRect().y;
      const round = (value) => Math.round(value * 100) / 100;
      return Object.fromEntries(
        targets.map(([key, , selector]) => {
          const element = document.querySelector(selector);
          if (element === null) return [key, null];
          const rect = element.getBoundingClientRect();
          const computed = getComputedStyle(element);
          return [
            key,
            {
              rect: {
                x: round(rect.x),
                y: round(rect.y - slideTop),
                w: round(rect.width),
                h: round(rect.height),
              },
              style: Object.fromEntries(props.map((prop) => [prop, computed[prop]])),
            },
          ];
        }),
      );
    },
    [TARGETS, PROPS],
  );
}

const browser = await chromium.launch();
const measured = {};
for (const width of WIDTHS) {
  for (const [name, url] of [
    ['legacy', LEGACY_URL],
    ['v2', V2_URL],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await openPage(context, url);
    for (let slide = 0; slide < 3; slide += 1) {
      await activate(page, slide);
      measured[`${width}|${slide + 1}|${name}`] = await probe(page);
    }
    await context.close();
  }
}
await browser.close();

let worst = 0;
for (const width of WIDTHS) {
  console.log(`\n#### ${width}px — Δ(V2 − Legacy) \`x / y / w / h\`\n`);
  console.log('| 요소 | 슬라이드 1 | 슬라이드 2 | 슬라이드 3 |');
  console.log('|---|---|---|---|');
  for (const [key, label] of TARGETS) {
    const cells = [1, 2, 3].map((slide) => {
      const legacy = measured[`${width}|${slide}|legacy`][key];
      const v2 = measured[`${width}|${slide}|v2`][key];
      if (legacy === null || v2 === null) return legacy === v2 ? '–' : '**한쪽만 존재**';
      const delta = ['x', 'y', 'w', 'h'].map(
        (prop) => Math.round((v2.rect[prop] - legacy.rect[prop]) * 10) / 10,
      );
      worst = Math.max(worst, ...delta.map(Math.abs));
      return delta.every((value) => value === 0) ? '0' : delta.join(' / ');
    });
    console.log(`| ${label} \`${key}\` | ${cells.join(' | ')} |`);
  }
}

console.log('\n#### computed style 차이\n');
let styleDiffs = 0;
for (const width of WIDTHS) {
  for (let slide = 1; slide <= 3; slide += 1) {
    for (const [key, label] of TARGETS) {
      const legacy = measured[`${width}|${slide}|legacy`][key];
      const v2 = measured[`${width}|${slide}|v2`][key];
      if (legacy === null || v2 === null) continue;
      const diffs = PROPS.filter((prop) => legacy.style[prop] !== v2.style[prop]);
      if (diffs.length === 0) continue;
      styleDiffs += 1;
      const detail = diffs.map((prop) => `${prop}: ${legacy.style[prop]} → ${v2.style[prop]}`);
      console.log(`- ${width}px 슬라이드 ${slide} ${label}: ${detail.join('; ')}`);
    }
  }
}
if (styleDiffs === 0) console.log('- 없음');

console.log(`\n최대 위치/크기 차이: ${worst}px`);
process.exitCode = worst > 2 ? 1 : 0;
