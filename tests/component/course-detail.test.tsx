// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CourseOrderForm } from '@/features/course-detail/CourseOrderForm';
import { CourseQuestionList } from '@/features/course-detail/CourseQuestionList';
import { CourseReviewList } from '@/features/course-detail/CourseReviewList';
import { courseFullResponseSchema, type CourseFull } from '@/legacy/contracts/course-full';
import {
  courseCommunityResponseSchema,
  type CourseQuestion,
  type CourseReview,
} from '@/legacy/contracts/course-community';

/**
 * L2 — 강좌 상세 (HARNESS.md §4).
 *
 * 핵심은 **Legacy `cartupdate.php` 로 가는 필드 이름·값이 Legacy 스킨과 같은가**다.
 * 이름 하나가 틀려도 수강신청이 조용히 깨지므로, 폼 직렬화 결과를 그대로 고정한다.
 */

const FIXTURE_DIR = 'contracts/bridge/fixtures';

function courseFixture(name: string): CourseFull {
  const parsed = courseFullResponseSchema.parse(
    JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), 'utf8')),
  );
  return {
    item: parsed.item,
    options: parsed.options,
    reviewSummary: parsed.reviewSummary,
    form: parsed.form,
  };
}

const noSiblings = { previous: null, next: null };

/** `<form>` 을 Legacy 가 보내는 것과 같은 key/value 쌍으로 직렬화한다. */
function serializeForm(): [string, string][] {
  const form = document.querySelector('form[name="fitem"]');
  if (form === null) throw new Error('form[name=fitem] 이 없다');
  return [...new FormData(form as HTMLFormElement).entries()].map(([key, value]) => [
    key,
    String(value),
  ]);
}

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => undefined);
});

describe('선택옵션이 없는 강좌 — Legacy item.form.skin.php:178-194', () => {
  beforeEach(() => {
    render(<CourseOrderForm course={courseFixture('course-full.no-options.json')} siblings={noSiblings} />);
  });

  it('스킨이 미리 넣는 옵션 줄 하나를 그린다', () => {
    const added = document.querySelector('#sit_opt_added');
    expect(added).not.toBeNull();
    expect(added).toHaveClass('sit_opt_list');
    // 선택옵션이 없으면 `<ul>` 이 아니라 `<div>` 다.
    expect(added?.tagName).toBe('DIV');
  });

  it('Legacy 와 같은 필드 이름·값을 보낸다', () => {
    // io_id 는 **빈 문자열**이고 io_value 는 상품명이다. ct_qty 는 buyMinQty.
    expect(serializeForm()).toEqual([
      ['it_id[]', '1002'],
      ['sw_direct', '1'],
      ['url', ''],
      ['io_type[1002][]', '0'],
      ['io_id[1002][]', ''],
      ['io_value[1002][]', '선택옵션 없는 예시 강좌'],
      ['ct_qty[1002][]', '1'],
    ]);
  });

  it('선택옵션 select 를 그리지 않는다', () => {
    expect(document.querySelector('select.it_option')).toBeNull();
  });

  it('수강 신청하기 버튼이 있다', () => {
    expect(screen.getByRole('button', { name: '수강 신청하기' })).toBeInTheDocument();
  });
});

describe('선택옵션이 있는 강좌 — Legacy get_item_options() div 모드', () => {
  beforeEach(() => {
    render(<CourseOrderForm course={courseFixture('course-full.basic.json')} siblings={noSiblings} />);
  });

  it('주제가 1개면 label 에 label-title class 가 없고 placeholder 가 "선택" 이다', () => {
    const select = document.querySelector('select#it_option_1.it_option');
    expect(select).not.toBeNull();
    expect(document.querySelector('.get_item_options > label[for="it_option_1"]')).not.toHaveClass(
      'label-title',
    );
    expect(select?.querySelector('option')?.textContent).toBe('선택');
  });

  it('option value 는 `{값},{가격},{재고}` 다 (itemoption.php:78)', () => {
    const values = [...document.querySelectorAll('select.it_option option')].map(
      (option) => (option as HTMLOptionElement).value,
    );
    expect(values).toEqual(['', '교재 포함,30000,1', '교재 미포함,0,1', '품절 옵션,0,0']);
  });

  it('option 텍스트에 &nbsp;&nbsp;+ 가격원 과 [품절] 을 붙인다', () => {
    const texts = [...document.querySelectorAll('select.it_option option')].map(
      (option) => option.textContent,
    );
    // ` ` 두 개 — Legacy 의 `&nbsp;&nbsp;` 다.
    expect(texts[1]).toBe('교재 포함  + 30,000원');
    expect(texts[2]).toBe('교재 미포함  + 0원');
    expect(texts[3]).toBe('품절 옵션  + 0원  [품절]');
  });

  it('옵션을 고르기 전에는 전송할 옵션 줄이 없다', () => {
    expect(document.querySelector('#sit_opt_added')).toBeNull();
    expect(serializeForm()).toEqual([
      ['it_id[]', '1001'],
      ['sw_direct', '1'],
      ['url', ''],
    ]);
  });

  it('옵션을 고르면 Legacy 와 같은 io_id / io_value 를 보낸다', async () => {
    const user = userEvent.setup();
    await user.selectOptions(
      document.querySelector('select.it_option') as HTMLSelectElement,
      '교재 포함,30000,1',
    );

    // io_id  = parts.join(chr(30))  → 주제 1개라 값 그대로
    // io_value = `주제:값`            → shop.js:310
    expect(serializeForm()).toEqual([
      ['it_id[]', '1001'],
      ['sw_direct', '1'],
      ['url', ''],
      ['io_type[1001][]', '0'],
      ['io_id[1001][]', '교재 포함'],
      ['io_value[1001][]', '교재비:교재 포함'],
      ['ct_qty[1001][]', '1'],
    ]);
  });

  it('추가된 줄은 ul#sit_opt_added > li.sit_opt_list 다', async () => {
    const user = userEvent.setup();
    await user.selectOptions(
      document.querySelector('select.it_option') as HTMLSelectElement,
      '교재 미포함,0,1',
    );
    const added = document.querySelector('#sit_opt_added');
    expect(added?.tagName).toBe('UL');
    expect(added?.querySelectorAll('li.sit_opt_list')).toHaveLength(1);
    expect(document.querySelector('.sit_opt_subj')?.textContent).toBe('교재비:교재 미포함');
  });

  it('재고가 없는 옵션은 거부하고 추가하지 않는다', async () => {
    const user = userEvent.setup();
    await user.selectOptions(
      document.querySelector('select.it_option') as HTMLSelectElement,
      '품절 옵션,0,0',
    );
    expect(window.alert).toHaveBeenCalledWith(
      '선택하신 선택옵션상품은 재고가 부족하여 구매할 수 없습니다.',
    );
    expect(document.querySelector('#sit_opt_added')).toBeNull();
  });

  it('같은 옵션을 또 고르면 Legacy same_option_check() 처럼 거부한다', async () => {
    const user = userEvent.setup();
    const select = document.querySelector('select.it_option') as HTMLSelectElement;
    await user.selectOptions(select, '교재 포함,30000,1');
    await user.selectOptions(select, '교재 미포함,0,1');
    await user.selectOptions(select, '교재 포함,30000,1');
    expect(window.alert).toHaveBeenCalledWith(
      '교재비:교재 포함 은(는) 이미 추가하신 옵션상품입니다.',
    );
    expect(document.querySelectorAll('#sit_opt_added > li')).toHaveLength(2);
  });

  it('수량 +/- 가 ct_qty 를 바꾸고 1 아래로 내려가지 않는다', async () => {
    const user = userEvent.setup();
    await user.selectOptions(
      document.querySelector('select.it_option') as HTMLSelectElement,
      '교재 포함,30000,1',
    );
    await user.click(document.querySelector('.sit_qty_plus') as HTMLElement);
    expect(serializeForm()).toContainEqual(['ct_qty[1001][]', '2']);

    await user.click(document.querySelector('.sit_qty_minus') as HTMLElement);
    await user.click(document.querySelector('.sit_qty_minus') as HTMLElement);
    expect(serializeForm()).toContainEqual(['ct_qty[1001][]', '1']);
  });

  it('삭제 버튼이 줄을 없앤다', async () => {
    const user = userEvent.setup();
    await user.selectOptions(
      document.querySelector('select.it_option') as HTMLSelectElement,
      '교재 포함,30000,1',
    );
    await user.click(document.querySelector('.sit_opt_del') as HTMLElement);
    expect(document.querySelector('#sit_opt_added')).toBeNull();
  });

  it('옵션을 고르지 않고 제출하면 Legacy 와 같은 문구로 막는다', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: '수강 신청하기' }));
    expect(window.alert).toHaveBeenCalledWith('상품의 선택옵션을 선택해 주십시오.');
  });

  it('수강료는 정가(취소선)와 판매가를 함께 보여준다', () => {
    const row = document.querySelector('tr.tr_price');
    expect(row?.querySelector('th')?.textContent).toBe('수강료');
    const prices = [...(row?.querySelectorAll('strong') ?? [])].map((el) => el.textContent);
    expect(prices).toEqual(['330,000원', '264,000원']);
    expect(document.querySelector('input#it_price')).toHaveValue('264000');
  });

  it('it_1 은 표에 넣지 않는다 (Legacy 스킨이 쓰지 않는다)', () => {
    // fixture 의 extra["1"] 은 "80" 이다. 어느 행에도 나오면 안 된다.
    const headers = [...document.querySelectorAll('.sit_ov_tbl th')].map((el) => el.textContent);
    expect(headers).toEqual(['수강료', '신청기간', '수강기간', '모집인원', '강의수']);
    expect(document.querySelector('.sit_info')?.textContent).not.toContain('80');
  });

  it('extra 를 Legacy 문구 그대로 조립한다', () => {
    const cells = [...document.querySelectorAll('.sit_ov_tbl tbody tr')].map(
      (row) => row.querySelector('td')?.textContent,
    );
    expect(cells.slice(1)).toEqual(['26.10.06 ~', '수강 시작 후 30일', '60명', '4강']);
  });

  it('후기 건수를 요약에 보여준다', () => {
    expect(document.querySelector('#sit_star_sns')?.textContent).toContain('강의후기 (3건)');
  });
});

describe('품절 강좌 — Legacy is_soldout() / $is_orderable', () => {
  beforeEach(() => {
    render(<CourseOrderForm course={courseFixture('course-full.sold-out.json')} siblings={noSiblings} />);
  });

  it('품절 안내를 보여준다', () => {
    expect(document.querySelector('#sit_ov_soldout')?.textContent).toBe(
      '상품의 재고가 부족하여 수강신청할 수 없습니다.',
    );
  });

  it('수강 신청하기 버튼과 선택된 옵션 영역이 아예 없다', () => {
    expect(screen.queryByRole('button', { name: '수강 신청하기' })).not.toBeInTheDocument();
    expect(document.querySelector('#sit_sel_option')).toBeNull();
    expect(document.querySelector('#sit_opt_added')).toBeNull();
  });
});

describe('전화문의 강좌 — Legacy it_tel_inq', () => {
  beforeEach(() => {
    render(
      <CourseOrderForm
        course={courseFixture('course-full.price-on-inquiry.json')}
        siblings={noSiblings}
      />,
    );
  });

  it('수강료 대신 판매가격 / 전화문의 를 보여준다', () => {
    const row = document.querySelector('.sit_ov_tbl tbody tr');
    expect(row?.querySelector('th')?.textContent).toBe('판매가격');
    expect(row?.querySelector('td')?.textContent).toBe('전화문의');
    // 전화문의 분기에는 `#it_price` 가 없다.
    expect(document.querySelector('input#it_price')).toBeNull();
    expect(document.querySelector('tr.tr_price')).toBeNull();
  });

  it('주문 버튼이 없다', () => {
    expect(screen.queryByRole('button', { name: '수강 신청하기' })).not.toBeInTheDocument();
  });

  it('이미지가 없으면 no_image.gif 를 쓴다', () => {
    const img = document.querySelector('#sit_pvi_big img');
    expect(img?.getAttribute('src')).toContain('/shop/img/no_image.gif');
  });

  it('값이 빈 extra 는 행을 그리지 않는다', () => {
    const headers = [...document.querySelectorAll('.sit_ov_tbl th')].map((el) => el.textContent);
    expect(headers).toEqual(['판매가격']);
  });
});

describe('이미지 — Legacy get_it_thumbnail()', () => {
  it('썸네일 URL 과 largeimage 팝업 링크를 쓴다', () => {
    render(<CourseOrderForm course={courseFixture('course-full.basic.json')} siblings={noSiblings} />);
    const links = [...document.querySelectorAll('#sit_pvi_big a.popup_item_image')];
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/largeimage.php?it_id=1001&no=1',
    );
    expect(links[1]?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/largeimage.php?it_id=1001&no=2',
    );
    // jQuery 가 첫 링크에 넣는 class.
    expect(links[0]).toHaveClass('visible');
    expect(links[1]).not.toHaveClass('visible');
    expect(document.querySelector('#sit_pvi_big img')?.getAttribute('src')).toContain(
      'thumb-thumb_860x485.jpg',
    );
  });
});

describe('형제 강좌 — Legacy sit_siblings', () => {
  it('없으면 "없음" 문구를, 있으면 Legacy 상세 링크를 그린다', () => {
    const { unmount } = render(
      <CourseOrderForm course={courseFixture('course-full.basic.json')} siblings={noSiblings} />,
    );
    expect(document.querySelector('.div_prev')?.textContent).toContain('이전 강의 없음');
    expect(document.querySelector('.div_next')?.textContent).toContain('다음 강의 없음');
    expect(document.querySelector('.div_list a')?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/list.php?ca_id=101060',
    );
    unmount();

    render(
      <CourseOrderForm
        course={courseFixture('course-full.basic.json')}
        siblings={{ previous: '2002', next: '1000' }}
      />,
    );
    expect(document.querySelector('#siblings_prev')?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/item.php?it_id=2002',
    );
    expect(document.querySelector('#siblings_next')?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/item.php?it_id=1000',
    );
  });
});

describe('폼 action — Bridge 가 소유한다', () => {
  it('Legacy cartupdate.php 로 POST 한다', () => {
    render(<CourseOrderForm course={courseFixture('course-full.basic.json')} siblings={noSiblings} />);
    const form = document.querySelector('form[name="fitem"]');
    expect(form?.getAttribute('action')).toBe('https://nonsul-learn.com/shop/cartupdate.php');
    expect(form?.getAttribute('method')).toBe('POST');
  });
});

// ---------------------------------------------------------------------------
// 후기 / 문의 — AGENTS.md §6.4 4가지 상태
// ---------------------------------------------------------------------------

function reviewItems(): CourseReview[] {
  const parsed = courseCommunityResponseSchema.parse(
    JSON.parse(readFileSync(path.join(FIXTURE_DIR, 'course-community.reviews.json'), 'utf8')),
  );
  if (parsed.type !== 'reviews') throw new Error('unreachable');
  return parsed.items;
}

function questionItems(): CourseQuestion[] {
  const parsed = courseCommunityResponseSchema.parse(
    JSON.parse(readFileSync(path.join(FIXTURE_DIR, 'course-community.questions.json'), 'utf8')),
  );
  if (parsed.type !== 'questions') throw new Error('unreachable');
  return parsed.items;
}

describe('강의후기 목록 — Legacy itemuse.skin.php', () => {
  it('loading 상태를 처리한다', () => {
    render(<CourseReviewList courseId="1001" state={{ status: 'loading' }} />);
    expect(document.querySelector('.sit_empty')?.textContent).toBe(
      '강의후기를 불러오는 중입니다.',
    );
  });

  it('빈 목록은 Legacy 문구를 그대로 쓴다', () => {
    render(
      <CourseReviewList
        courseId="1001"
        state={{ status: 'ready', items: [], total: 0, hasMore: false }}
      />,
    );
    expect(document.querySelector('.sit_empty')?.textContent).toBe('등록된 강의후기가 없습니다.');
  });

  it('unavailable 이면 페이지를 깨지 않고 안내만 바꾼다', () => {
    render(<CourseReviewList courseId="1001" state={{ status: 'unavailable' }} />);
    expect(document.querySelector('.sit_empty')?.textContent).toContain('불러올 수 없습니다');
    // 쓰기 버튼은 Legacy 로 가는 링크라 Bridge 실패와 무관하게 남아 있어야 한다.
    expect(document.querySelector('#sit_use_wbtn a')).not.toBeNull();
  });

  it('목록을 ol#sit_use_ol > li.sit_use_li 로 그린다', () => {
    render(
      <CourseReviewList
        courseId="1001"
        state={{ status: 'ready', items: reviewItems(), total: 3, hasMore: false }}
      />,
    );
    expect(document.querySelectorAll('#sit_use_ol > li.sit_use_li')).toHaveLength(3);
    expect(document.querySelector('.sit_use_tit')?.textContent).toBe('예시 후기 제목입니다');
    // 날짜는 YY-MM-DD 로 자른다.
    expect(document.querySelector('#sit_use_ol li')?.textContent).toContain('26-09-30');
  });

  it('내용보기가 아코디언을 열고 다른 줄은 닫는다', async () => {
    const user = userEvent.setup();
    render(
      <CourseReviewList
        courseId="1001"
        state={{ status: 'ready', items: reviewItems(), total: 3, hasMore: false }}
      />,
    );
    const toggles = [...document.querySelectorAll('.sit_use_li_title')];
    expect(document.querySelector('#sit_use_con_0')).not.toHaveClass('is_open');

    await user.click(toggles[0] as HTMLElement);
    expect(document.querySelector('#sit_use_con_0')).toHaveClass('is_open');

    await user.click(toggles[1] as HTMLElement);
    expect(document.querySelector('#sit_use_con_0')).not.toHaveClass('is_open');
    expect(document.querySelector('#sit_use_con_1')).toHaveClass('is_open');
  });

  it('관리자 답변이 있으면 답변 블록을, 없으면 그리지 않는다', () => {
    render(
      <CourseReviewList
        courseId="1001"
        state={{ status: 'ready', items: reviewItems(), total: 3, hasMore: false }}
      />,
    );
    const replies = document.querySelectorAll('.sit_use_reply');
    expect(replies).toHaveLength(1);
    expect(replies[0]?.textContent).toContain('답변 드립니다');
  });

  it('total 이 Legacy 페이지 크기를 넘으면 Legacy 목록으로 더 보기를 건다', () => {
    render(
      <CourseReviewList
        courseId="1001"
        state={{ status: 'ready', items: reviewItems(), total: 12, hasMore: true }}
      />,
    );
    const more = document.querySelector('.sit_use_more a');
    expect(more?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/itemuse.php?it_id=1001',
    );
    expect(more?.textContent).toContain('12건');
  });

  it('쓰기 버튼은 Legacy itemuseform.php 로 새 창으로 간다', () => {
    render(
      <CourseReviewList
        courseId="1001"
        state={{ status: 'ready', items: [], total: 0, hasMore: false }}
      />,
    );
    const write = document.querySelector('#sit_use_wbtn a');
    expect(write?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/itemuseform.php?it_id=1001',
    );
    expect(write?.getAttribute('target')).toBe('_blank');
  });
});

describe('강의문의 목록 — Legacy itemqa.skin.php', () => {
  it('답변완료 / 답변대기 배지를 Legacy 문구로 쓴다', () => {
    render(
      <CourseQuestionList
        courseId="1001"
        state={{ status: 'ready', items: questionItems(), total: 2, hasMore: false }}
      />,
    );
    const badges = [...document.querySelectorAll('#sit_qa_ol > li span')]
      .map((el) => el.textContent)
      .filter((text) => text === '답변완료' || text === '답변대기');
    expect(badges).toEqual(['답변완료', '답변대기']);
  });

  it('답변이 없으면 Legacy 대체 문구를 쓴다', async () => {
    const user = userEvent.setup();
    render(
      <CourseQuestionList
        courseId="1001"
        state={{ status: 'ready', items: questionItems(), total: 2, hasMore: false }}
      />,
    );
    await user.click(document.querySelectorAll('.sit_qa_li_title')[2] as HTMLElement);
    expect(document.querySelector('#sit_qa_con_1')?.textContent).toContain(
      '답변이 등록되지 않았습니다.',
    );
  });

  it('빈 목록 / unavailable 을 처리한다', () => {
    const { unmount } = render(
      <CourseQuestionList
        courseId="1001"
        state={{ status: 'ready', items: [], total: 0, hasMore: false }}
      />,
    );
    expect(document.querySelector('.sit_empty')?.textContent).toBe('등록된 강의문의가 없습니다.');
    unmount();

    render(<CourseQuestionList courseId="1001" state={{ status: 'unavailable' }} />);
    expect(document.querySelector('.sit_empty')?.textContent).toContain('불러올 수 없습니다');
  });

  it('더 보기는 Legacy itemqa.php 로 간다', () => {
    render(
      <CourseQuestionList
        courseId="1001"
        state={{ status: 'ready', items: questionItems(), total: 30, hasMore: true }}
      />,
    );
    expect(document.querySelector('.sit_qa_more a')?.getAttribute('href')).toBe(
      'https://nonsul-learn.com/shop/itemqa.php?it_id=1001',
    );
  });
});
