import { expect, test } from '@playwright/test';

/**
 * L3 — `/courses/[id]` 강좌 상세 (HARNESS.md §5).
 *
 * mock env 로 빌드한 결과물을 본다 (`playwright.config.ts`: `COURSE_SOURCE=mock`).
 * `NEXT_PUBLIC_LEGACY_BASE_URL=''` 은 `env.client.ts` 가 기본값으로 바꾸므로 Legacy 링크는
 * `https://nonsul-learn.com/...` 절대 URL 이다.
 *
 * mock 시나리오는 **id 로 주소화**돼 있다 (`src/legacy/adapters/course-detail/mock.ts`).
 * 페이지가 `searchParams` 를 읽으면 ISR 이 깨지기 때문에 `?course=` 를 쓰지 않는다.
 *
 * 여기서 보는 것은 "빌드된 HTML 이 Legacy 구조를 갖고, 탭·옵션·폼이 동작하는가"다.
 * 필드 값 대조는 L2(`tests/component/course-detail.test.tsx`)가 더 촘촘하게 한다.
 */

/** 선택옵션 3개 + 후기 3건. */
const COURSE = '/courses/1001';
/** 선택옵션 없음. */
const NO_OPTIONS = '/courses/1002';
/** 품절. */
const SOLD_OUT = '/courses/1003';
/** 전화문의. */
const ON_INQUIRY = '/courses/1004';
/** Bridge 장애. */
const BRIDGE_DOWN = '/courses/9999';

test('Legacy shop/item.php 의 주요 DOM 구조가 그대로 있다', async ({ page }) => {
  await page.goto(COURSE);

  // item.php 가 `#sit` 안에 폼과 탭을 넣는다.
  await expect(page.locator('#sit')).toBeVisible();
  await expect(page.locator('#sit_hhtml')).toBeAttached();
  await expect(page.locator('#sit_ov_from form[name="fitem"]')).toBeAttached();
  await expect(page.locator('#sit_ov_wrap #sit_pvi #sit_pvi_big')).toBeVisible();
  await expect(page.locator('#sit_ov.renewal_itemform')).toBeVisible();
  await expect(page.locator('#sit_info #sit_tab ul.tab_tit')).toBeVisible();

  // 히어로는 상품명과 요약을 h1/p 로 쓴다.
  await expect(page.locator('.shop_hero_section h1.hero_title')).toHaveText(
    '인문논술 기본완성 (예시)',
  );
  await expect(page.locator('.shop_hero_section .hero_sub_title')).toHaveText('논술런');
});

test('수강료 표가 Legacy 문구와 순서를 따른다', async ({ page }) => {
  await page.goto(COURSE);

  // `.sit_ov_tbl` 은 `#sit_inf_open`(강의 정보 고시)에도 붙는다 — Legacy 가 같은 class 를 쓴다.
  await expect(page.locator('.sit_info .sit_ov_tbl th')).toHaveText([
    '수강료',
    '신청기간',
    '수강기간',
    '모집인원',
    '강의수',
  ]);
  await expect(page.locator('tr.tr_price strong')).toHaveText(['330,000원', '264,000원']);
});

test('탭이 Legacy 처럼 하나만 열리고 공지사항은 Legacy 게시판으로 간다', async ({ page }) => {
  await page.goto(COURSE);

  // 첫 탭이 기본으로 열려 있다 (`$(".tab_con > li:first").show()`).
  await expect(page.locator('#sit_inf')).toBeVisible();
  await expect(page.locator('#sit_use')).toBeHidden();
  await expect(page.locator('#btn_sit_inf')).toHaveClass(/selected/);

  await page.locator('#btn_sit_use').click();
  await expect(page.locator('#sit_use')).toBeVisible();
  await expect(page.locator('#sit_inf')).toBeHidden();
  await expect(page.locator('#btn_sit_use')).toHaveClass(/selected/);

  await page.locator('#btn_sit_qa').click();
  await expect(page.locator('#sit_qa')).toBeVisible();
  await expect(page.locator('#sit_use')).toBeHidden();
});

test('해시로 들어오면 해당 탭이 열린다 (item.info.skin.php:226)', async ({ page }) => {
  await page.goto(`${COURSE}#sit_qa`);
  await expect(page.locator('#sit_qa')).toBeVisible();
  await expect(page.locator('#sit_inf')).toBeHidden();
});

test('선택옵션을 고르면 전송용 hidden 필드가 Legacy 이름으로 생긴다', async ({ page }) => {
  await page.goto(COURSE);

  await expect(page.locator('#sit_opt_added')).toHaveCount(0);
  await page.locator('select#it_option_1.it_option').selectOption('교재 포함,30000,1');

  await expect(page.locator('ul#sit_opt_added > li.sit_opt_list')).toHaveCount(1);
  await expect(page.locator('input[name="io_type[1001][]"]')).toHaveValue('0');
  await expect(page.locator('input[name="io_id[1001][]"]')).toHaveValue('교재 포함');
  await expect(page.locator('input[name="io_value[1001][]"]')).toHaveValue('교재비:교재 포함');
  await expect(page.locator('input[name="ct_qty[1001][]"]')).toHaveValue('1');
});

test('옵션 없이 제출하면 Legacy 와 같은 문구로 막고 이동하지 않는다', async ({ page }) => {
  await page.goto(COURSE);

  const messages: string[] = [];
  page.on('dialog', (dialog) => {
    messages.push(dialog.message());
    void dialog.dismiss();
  });

  await page.locator('button.sit_btn_buy').click();
  expect(messages).toEqual(['상품의 선택옵션을 선택해 주십시오.']);
  // 폼이 제출되지 않았으므로 여전히 같은 경로다.
  expect(new URL(page.url()).pathname).toBe(COURSE);
});

test('선택옵션이 없는 강좌는 옵션 줄을 미리 갖고 있다', async ({ page }) => {
  await page.goto(NO_OPTIONS);

  await expect(page.locator('select.it_option')).toHaveCount(0);
  await expect(page.locator('div#sit_opt_added.sit_opt_list')).toBeAttached();
  await expect(page.locator('input[name="io_id[1002][]"]')).toHaveValue('');
  await expect(page.locator('input[name="io_value[1002][]"]')).toHaveValue(
    '선택옵션 없는 예시 강좌',
  );
});

test('품절 강좌는 안내만 보이고 주문 버튼이 없다', async ({ page }) => {
  await page.goto(SOLD_OUT);

  await expect(page.locator('#sit_ov_soldout')).toHaveText(
    '상품의 재고가 부족하여 수강신청할 수 없습니다.',
  );
  await expect(page.locator('button.sit_btn_buy')).toHaveCount(0);
  await expect(page.locator('#sit_sel_option')).toHaveCount(0);
});

test('전화문의 강좌는 판매가격 자리에 전화문의를 쓴다', async ({ page }) => {
  await page.goto(ON_INQUIRY);

  await expect(page.locator('.sit_ov_tbl th').first()).toHaveText('판매가격');
  await expect(page.locator('.sit_ov_tbl td').first()).toHaveText('전화문의');
  await expect(page.locator('button.sit_btn_buy')).toHaveCount(0);
});

test('후기·문의가 비어 있으면 Legacy 문구를 쓴다', async ({ page }) => {
  await page.goto(NO_OPTIONS);

  await page.locator('#btn_sit_use').click();
  await expect(page.locator('#sit_use .sit_empty')).toHaveText('등록된 강의후기가 없습니다.');

  await page.locator('#btn_sit_qa').click();
  await expect(page.locator('#sit_qa .sit_empty')).toHaveText('등록된 강의문의가 없습니다.');
});

test('후기 아코디언과 더 보기 링크가 동작한다', async ({ page }) => {
  await page.goto(COURSE);
  await page.locator('#btn_sit_use').click();

  await expect(page.locator('#sit_use_ol > li.sit_use_li')).toHaveCount(3);
  await expect(page.locator('#sit_use_con_0')).toBeHidden();
  await page.locator('.sit_use_li_title').first().click();
  await expect(page.locator('#sit_use_con_0')).toBeVisible();

  /*
   * Legacy 쓰기 폼으로 가는 링크. playwright 는 `NEXT_PUBLIC_LEGACY_BASE_URL=''` 을 주지만
   * `env.client.ts` 가 빈 문자열을 기본값(`https://nonsul-learn.com`)으로 바꾸므로 절대 URL 이다.
   */
  await expect(page.locator('#sit_use_wbtn a')).toHaveAttribute(
    'href',
    'https://nonsul-learn.com/shop/itemuseform.php?it_id=1001',
  );
});

test('Bridge 가 죽으면 페이지가 깨지지 않는다', async ({ page }) => {
  // 강좌 본문 자체를 못 받으면 ISR 캐시가 없는 첫 요청은 에러 경계로 떨어진다.
  // 그 화면이 Next 기본 500 이 아니라 우리 error.tsx 여야 한다.
  const response = await page.goto(BRIDGE_DOWN);
  expect(response).not.toBeNull();
  await expect(page.locator('body')).not.toBeEmpty();
});

test('등록되지 않은 강좌는 404 다', async ({ page }) => {
  // mock 에 없는 id → Bridge 의 404 와 같은 자리다.
  const response = await page.goto('/courses/8888');
  expect(response?.status()).toBe(404);
});

test('Contract 를 벗어난 id 는 Bridge 를 때리지 않고 404 다', async ({ page }) => {
  // `courseIdSchema` = `^[A-Za-z0-9_-]{1,20}$`. Bridge 는 이런 id 에 400 을 준다.
  const response = await page.goto('/courses/this-id-is-far-too-long-to-be-valid');
  expect(response?.status()).toBe(404);
});

test('메타데이터와 canonical 이 Legacy 제목 조합을 따른다', async ({ page }) => {
  await page.goto(COURSE);

  // Legacy: `$g5['title'] = $it['it_name'].' &gt; '.$it['ca_name']`
  await expect(page).toHaveTitle('인문논술 기본완성 (예시) > 수능전 파이널 | 논술런');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://localhost:3100/courses/1001',
  );
});

test('모바일 375px 에서 가로 스크롤이 없다', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(COURSE);

  // AGENTS.md §6.5 — 모바일 우선, 가로 스크롤 금지.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('1440px 에서 좌우 2단 레이아웃이다 (Legacy #sit_ov_wrap flex)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(COURSE);

  const image = await page.locator('#sit_pvi').boundingBox();
  const summary = await page.locator('#sit_ov').boundingBox();
  expect(image).not.toBeNull();
  expect(summary).not.toBeNull();
  // 같은 줄에 나란히 있어야 한다 (992px 아래에서만 column 으로 바뀐다).
  expect(summary!.x).toBeGreaterThan(image!.x + image!.width - 1);
});
