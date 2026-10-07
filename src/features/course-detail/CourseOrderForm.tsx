'use client';

import Image from 'next/image';
import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';

import { track } from '@/analytics';
import {
  courseStarScore,
  isCourseOrderable,
  isCourseSoldOut,
  legacyAssetUrl,
  legacyItemThumbnail,
  legacyRoutes,
  type CourseFull,
} from '@/legacy';
import { formatOptionPrice, formatPrice } from '@/lib/format';

import {
  CourseOptionPicker,
  CourseSupplyPicker,
  optionPart,
  RS,
} from './CourseOptionPicker';

/**
 * Legacy `skin/shop/basic/item.form.skin.php` 를 그대로 옮긴 것.
 *
 * DOM·class·id 를 Legacy 와 같게 유지한다 (AGENTS.md §9 "Gate 6 이전 리디자인 금지").
 * 스타일은 `legacy-course-detail.css`(= `style_2.css` 미러)가 그 선택자로 붙는다.
 * 스킨이 inline `style` 로 넣는 값은 inline 으로 둔다 — 클래스로 옮기면 우선순위가 달라진다.
 *
 * 동작은 jQuery(`js/shop.js`, `js/shop.override.js`) 대신 React state 로 재현한다
 * (AGENTS.md §6.5). **전송되는 필드 이름·값은 Legacy 와 완전히 같아야 한다** —
 * 받는 쪽이 Legacy `cartupdate.php` 다.
 */

/** `#sit_sel_option` 에 추가된 한 줄. Legacy `add_sel_option()` 의 인자와 1:1 이다. */
interface SelectedOption {
  /** `io_type` — 0 선택옵션, 1 추가옵션. */
  type: 0 | 1;
  /** `io_id` — Bridge 가 준 io_id 를 그대로 쓴다. */
  id: string;
  /** `io_value` — `주제:값`, 여러 주제면 ` / ` 로 이었다. 중복 검사 기준이기도 하다. */
  value: string;
  price: number;
  /** Legacy 는 io_stock_qty 를 넣는다. Bridge 가 수량을 주지 않아 available 만 반영한다. */
  stock: number;
  qty: number;
}

export interface CourseOrderFormProps {
  course: CourseFull;
  /**
   * Legacy `shop/item.php:140-163` 이 `it_id` 순서로 찾는 형제 강좌.
   * Bridge 가 주지 않아 강좌 목록에서 같은 규칙으로 계산해 넘긴다.
   */
  siblings: { previous: string | null; next: string | null };
}

export function CourseOrderForm({ course, siblings }: CourseOrderFormProps) {
  const { item, options, reviewSummary, form } = course;

  const orderable = isCourseOrderable(item);
  const soldOut = isCourseSoldOut(item);
  const starScore = courseStarScore(reviewSummary);
  /** Legacy `if(!$option_item)` 과 같은 분기. 선택옵션 주제가 있는가. */
  const hasSelectableOptions = options.subjects.length > 0;

  const [shareOpen, setShareOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>(() => options.subjects.map(() => ''));
  const [supplyPicked, setSupplyPicked] = useState<string[]>(() =>
    options.supplySubjects.map(() => ''),
  );
  const [selected, setSelected] = useState<SelectedOption[]>([]);

  const selectionItems = useMemo(
    () => options.items.filter((option) => option.type === 0),
    [options.items],
  );
  const supplyItems = useMemo(
    () => options.items.filter((option) => option.type === 1),
    [options.items],
  );
  const thumbnails = useMemo(
    () =>
      item.images.map((image, index) => ({
        image,
        no: index + 1,
        ...legacyItemThumbnail(image),
      })),
    [item.images],
  );

  /** Legacy `same_option_check()` (`shop.js:441-456`) — io_value 가 같으면 거부한다. */
  function alreadyAdded(value: string): boolean {
    if (selected.some((option) => option.value === value)) {
      window.alert(`${value} 은(는) 이미 추가하신 옵션상품입니다.`);
      return true;
    }
    return false;
  }

  /**
   * Legacy `sel_option_process()` (`shop.js:280-330`).
   *
   *   io_id    = parts.join(chr(30))            ← Bridge 의 `item.id` 가 이미 그 값이다
   *   io_value = `주제:값` 들을 ` / ` 로 이은 것
   *   price    = 마지막 select 값의 가격
   */
  function commitSelection(raw: string[]): void {
    const parts = raw.map(optionPart);
    const leaf = selectionItems.find(
      (option) =>
        option.parts.length === parts.length &&
        option.parts.every((part, index) => part === parts[index]),
    );
    if (leaf === undefined) return;

    // Legacy `shop.js:308-312`: 마지막 select 의 재고가 1 미만이면 거부한다.
    if (!leaf.available) {
      window.alert('선택하신 선택옵션상품은 재고가 부족하여 구매할 수 없습니다.');
      return;
    }

    // Legacy `shop.js:319-324`: `it_price + io_price < 0` 이면 거부한다.
    if (item.price + leaf.price < 0) {
      window.alert('구매금액이 음수인 상품은 구매할 수 없습니다.');
      return;
    }

    const value = options.subjects
      .map((subject, index) => `${subject}:${parts[index] ?? ''}`)
      .join(' / ');
    if (alreadyAdded(value)) return;

    setSelected((current) => [
      ...current,
      { type: 0, id: leaf.id, value, price: leaf.price, stock: 1, qty: 1 },
    ]);
  }

  function onPickSelection(depth: number, raw: string): void {
    const next = picked.map((value, index) => {
      if (index === depth) return raw;
      // Legacy 는 하위 select 를 `disabled` 로 묶고 값을 비운다.
      return index > depth ? '' : value;
    });
    setPicked(next);

    // 마지막 단계가 채워졌을 때만 `#sit_sel_option` 에 추가한다 (`shop.js:105-116`).
    if (raw !== '' && depth === options.subjects.length - 1) commitSelection(next);
  }

  /**
   * Legacy 추가옵션 (`shop.override.js:3-44`).
   *
   *   io_id    = `주제 + chr(30) + 값`  ← Bridge 의 `item.id` 가 이미 그 값이다
   *   io_value = `주제:값`
   *
   * 운영 카탈로그 39개 강좌 전부 `supplySubjects` 가 비어 있어 실물로 확인하지 못했다.
   * // TBD(legacy): 추가옵션이 있는 강좌가 생기면 전송값을 실물로 확인한다.
   */
  function onPickSupply(depth: number, raw: string): void {
    setSupplyPicked((current) => current.map((value, index) => (index === depth ? raw : value)));
    if (raw === '') return;

    const subject = options.supplySubjects[depth] ?? '';
    const part = optionPart(raw);
    const option = supplyItems.find(
      (candidate) => candidate.parts[0] === subject && candidate.parts[1] === part,
    );
    if (option === undefined) return;

    if (!option.available) {
      window.alert(`${part}은(는) 재고가 부족하여 구매할 수 없습니다.`);
      return;
    }
    if (option.price < 0) {
      window.alert('구매금액이 음수인 상품은 구매할 수 없습니다.');
      return;
    }

    const value = `${subject}:${part}`;
    if (alreadyAdded(value)) return;

    // Legacy 가 만드는 io_id 와 Bridge 의 io_id 는 같아야 한다. 다르면 Bridge 값을 믿는다.
    const id = option.id === `${subject}${RS}${part}` ? option.id : `${subject}${RS}${part}`;

    setSelected((current) => [
      ...current,
      { type: 1, id, value, price: option.price, stock: 1, qty: 1 },
    ]);
  }

  function changeQty(index: number, delta: number): void {
    setSelected((current) =>
      current.map((option, position) =>
        position === index ? { ...option, qty: Math.max(1, option.qty + delta) } : option,
      ),
    );
  }

  function setQty(index: number, raw: string): void {
    const parsed = Number.parseInt(raw, 10);
    setSelected((current) =>
      current.map((option, position) =>
        position === index
          ? { ...option, qty: Number.isNaN(parsed) || parsed < 1 ? 1 : parsed }
          : option,
      ),
    );
  }

  function removeOption(index: number): void {
    setSelected((current) => current.filter((_option, position) => position !== index));
  }

  /**
   * Legacy `fitem_submit()` (`item.form.skin.php:280-301`). 검사 순서까지 같다.
   *
   *   1. `sw_direct` = 1 (이 스킨에는 장바구니 버튼이 없고 바로구매뿐이다)
   *   2. `#it_price` 가 음수면 "전화로 문의해 주시면 감사하겠습니다."
   *   3. `.sit_opt_list` 가 하나도 없으면 "상품의 선택옵션을 선택해 주십시오."
   */
  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    // Legacy 의 `it_price < 0` 에 해당한다. 전화문의 상품은 `it_price` 가 음수로 저장된다.
    if (item.priceOnInquiry) {
      event.preventDefault();
      window.alert('전화로 문의해 주시면 감사하겠습니다.');
      return;
    }

    // `.sit_opt_list` 개수. 선택옵션이 없는 강좌는 스킨이 1개를 미리 넣어 둔다.
    const optionRows = hasSelectableOptions
      ? selected.filter((option) => option.type === 0).length
      : 1;
    if (optionRows < 1) {
      event.preventDefault();
      window.alert('상품의 선택옵션을 선택해 주십시오.');
      return;
    }

    // AGENTS.md §7.3: Handoff 클릭은 track 후 이동한다.
    track('begin_checkout', { courseId: item.id, salePrice: item.price });
  }

  const shareUrl = legacyRoutes.courseDetail(item.id);
  const shareTitle = `${item.name} | 논술런`;

  return (
    <div id="sit_ov_from" className="shop_list_container">
      <form
        name="fitem"
        method={form.method}
        action={resolveAction(form.action)}
        onSubmit={onSubmit}
      >
        <input type="hidden" name="it_id[]" value={item.id} />
        {/* Legacy 는 빈 값으로 두고 submit 시 채운다. 이 스킨은 바로구매 버튼 하나라 값이 1 로 고정이다. */}
        <input type="hidden" name="sw_direct" value="1" />
        <input type="hidden" name="url" value="" />

        <div id="sit_ov_wrap">
          {/* 상품이미지 미리보기 시작 */}
          <div id="sit_pvi">
            <div id="sit_pvi_big">
              {thumbnails.length === 0 ? (
                // Legacy `item.form.skin.php:46-48`: 이미지가 없으면 no_image.gif 를 그린다.
                <Image
                  src={legacyAssetUrl('/shop/img/no_image.gif')}
                  alt=""
                  width={860}
                  height={485}
                  unoptimized
                />
              ) : (
                thumbnails.map((thumbnail, index) => (
                  <a
                    key={thumbnail.image}
                    href={legacyRoutes.courseLargeImage(item.id, thumbnail.no)}
                    target="_blank"
                    rel="noreferrer"
                    // jQuery 가 `$("#sit_pvi_big a:first").addClass("visible")` 로 넣는 class.
                    className={index === 0 ? 'popup_item_image visible' : 'popup_item_image'}
                  >
                    <Image
                      src={thumbnail.url}
                      alt=""
                      width={thumbnail.width}
                      height={thumbnail.height}
                      priority={index === 0}
                      unoptimized
                    />
                  </a>
                ))
              )}
            </div>
          </div>
          {/* 상품이미지 미리보기 끝 */}

          {/* 상품 요약정보 및 구매 시작 */}
          <section id="sit_ov" className="renewal_itemform">
            <h2 id="sit_title" className="sound_only">
              {item.name} 요약정보 및 구매
            </h2>

            <div id="sit_star_sns" style={starSnsStyle}>
              <div>
                {/* Legacy `if ($star_score)` — 후기가 없으면 별을 아예 그리지 않는다. */}
                {starScore > 0 && (
                  <>
                    <span className="sound_only">고객평점</span>
                    <Image
                      src={legacyAssetUrl(`/shop/img/s_star${starScore}.png`)}
                      alt=""
                      className="sit_star"
                      width={90}
                      height={18}
                      unoptimized
                    />
                    <span className="sound_only">별{starScore}개</span>
                  </>
                )}
                <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '8px' }}>
                  강의후기 ({reviewSummary.count}건)
                </span>
              </div>

              <div id="sit_btn_opt" style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  type="button"
                  className="btn_sns_share"
                  onClick={() => setShareOpen((open) => !open)}
                  aria-expanded={shareOpen}
                  style={shareButtonStyle}
                  title="SNS 공유하기"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span className="sound_only">sns 공유</span>
                </button>

                <div className="sns_area" style={{ ...snsAreaStyle, display: shareOpen ? 'flex' : 'none' }}>
                  {/* Legacy `get_sns_share_link()` 가 만드는 두 링크. */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&p=${encodeURIComponent(shareTitle)}`}
                    className="share-facebook"
                    target="_blank"
                    rel="noreferrer"
                    style={snsIconStyle}
                  >
                    <Image
                      src={legacyAssetUrl('/skin/shop/basic/img/sns_fb_s.png')}
                      alt="페이스북에 공유"
                      width={16}
                      height={16}
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </a>{' '}
                  <a
                    href={`https://twitter.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    className="share-twitter"
                    target="_blank"
                    rel="noreferrer"
                    style={snsIconStyle}
                  >
                    <Image
                      src={legacyAssetUrl('/skin/shop/basic/img/sns_twt_s.png')}
                      alt="트위터에 공유"
                      width={16}
                      height={16}
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </a>
                  {/*
                   * Legacy 는 여기에 `#sit_btn_rec`(지인에게 추천하기)를 둔다. 회원 전용이고
                   * `itemrecommend.php` 를 팝업으로 띄운다. V2 는 회원 전용 쓰기 기능을
                   * 구현하지 않는다 (AGENTS.md §2 절대 원칙 3) — 링크만 거는 것도 비회원에게는
                   * Legacy 가 confirm 후 로그인으로 보내는 흐름이라 화면이 갈린다.
                   * // TBD(legacy): 추천 기능을 노출할지 제품 결정이 필요하다.
                   */}
                </div>
              </div>
            </div>

            <div className="sit_info">
              <table className="sit_ov_tbl">
                <colgroup>
                  <col className="grid_3" />
                  <col />
                </colgroup>
                <tbody>
                  {/*
                   * Legacy 의 `!it_use` → "판매중지" 분기는 V2 에 도달하지 않는다.
                   * Bridge 쿼리가 `it_use='1' AND ca_use='1'` 로 이미 걸러 404 를 준다.
                   */}
                  {item.priceOnInquiry ? (
                    <tr>
                      <th scope="row">판매가격</th>
                      <td>전화문의</td>
                    </tr>
                  ) : (
                    <tr className="tr_price">
                      <th scope="row">수강료</th>
                      <td>
                        <strong style={listPriceStyle}>{formatPrice(item.listPrice)}</strong>
                        <strong style={salePriceStyle}>{formatPrice(item.price)}</strong>
                        <input type="hidden" id="it_price" value={item.price} readOnly />
                      </td>
                    </tr>
                  )}

                  {/* Legacy it_3 / it_2 / it_4 / it_5. 빈 값이면 행 자체를 그리지 않는다. */}
                  {hasText(item.extra[3]) && (
                    <tr>
                      <th scope="row">신청기간</th>
                      <td>{item.extra[3]}</td>
                    </tr>
                  )}
                  {hasText(item.extra[2]) && (
                    <tr>
                      <th scope="row">수강기간</th>
                      <td>수강 시작 후 {item.extra[2]}일</td>
                    </tr>
                  )}
                  {hasText(item.extra[4]) && (
                    <tr>
                      <th scope="row">모집인원</th>
                      <td>{item.extra[4]}명</td>
                    </tr>
                  )}
                  {hasText(item.extra[5]) && (
                    <tr>
                      <th scope="row">강의수</th>
                      <td>{item.extra[5]}강</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/*
             * Legacy `item.php:203` — `$option_item`/`$supply_item` 은 `$is_orderable` 일 때만
             * 채워진다. 전화문의·품절 강좌에는 select 가 아예 없다.
             */}
            {orderable && hasSelectableOptions && (
              <section className="sit_option" style={{ marginTop: '20px' }}>
                <h3>선택옵션</h3>
                <CourseOptionPicker
                  subjects={options.subjects}
                  items={selectionItems}
                  picked={picked}
                  onPick={onPickSelection}
                />
              </section>
            )}

            {orderable && options.supplySubjects.length > 0 && (
              <section className="sit_option" style={{ marginTop: '20px' }}>
                <h3>추가옵션</h3>
                <CourseSupplyPicker
                  subjects={options.supplySubjects}
                  items={supplyItems}
                  picked={supplyPicked}
                  onPick={onPickSupply}
                />
              </section>
            )}

            {/* Legacy `item.form.skin.php:174` — `if ($is_orderable)` */}
            {orderable && (
              <section id="sit_sel_option">
                <h3 className="sound_only">선택된 옵션</h3>

                {hasSelectableOptions
                  ? selected.length > 0 && (
                      // shop.override.js `add_sel_option()` 이 만드는 `<ul id="sit_opt_added">`.
                      <ul id="sit_opt_added">
                        {selected.map((option, index) => (
                          <li
                            key={`${option.type}-${option.id}`}
                            className={option.type === 1 ? 'sit_spl_list' : 'sit_opt_list'}
                          >
                            <input type="hidden" name={`io_type[${item.id}][]`} value={option.type} />
                            <input type="hidden" name={`io_id[${item.id}][]`} value={option.id} />
                            <input type="hidden" name={`io_value[${item.id}][]`} value={option.value} />
                            <input type="hidden" className="io_price" value={option.price} readOnly />
                            <input type="hidden" className="io_stock" value={option.stock} readOnly />
                            <div className="opt_name">
                              <span className="sit_opt_subj">{option.value}</span>
                            </div>
                            <div className="opt_count">
                              <button
                                type="button"
                                className="sit_qty_minus"
                                onClick={() => changeQty(index, -1)}
                              >
                                <i className="fa fa-minus" aria-hidden="true" />
                                <span className="sound_only">감소</span>
                              </button>
                              <input
                                type="text"
                                name={`ct_qty[${item.id}][]`}
                                value={option.qty}
                                className="num_input"
                                size={5}
                                aria-label={`${option.value} 수량`}
                                onChange={(event) => setQty(index, event.target.value)}
                              />
                              <button
                                type="button"
                                className="sit_qty_plus"
                                onClick={() => changeQty(index, 1)}
                              >
                                <i className="fa fa-plus" aria-hidden="true" />
                                <span className="sound_only">증가</span>
                              </button>
                              <span className="sit_opt_prc">{formatOptionPrice(option.price)}</span>
                              <button
                                type="button"
                                className="sit_opt_del"
                                onClick={() => removeOption(index)}
                              >
                                <i className="fa fa-times" aria-hidden="true" />
                                <span className="sound_only">삭제</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )
                  : /*
                     * Legacy `item.form.skin.php:178-194` — 선택옵션이 없는 강좌는 스킨이 이 줄을
                     * 미리 넣는다. io_id 는 **빈 문자열**이고 io_value 는 상품명이다.
                     */
                    <div id="sit_opt_added" className="sit_opt_list">
                      <input type="hidden" name={`io_type[${item.id}][]`} value="0" />
                      <input type="hidden" name={`io_id[${item.id}][]`} value="" />
                      <input type="hidden" name={`io_value[${item.id}][]`} value={item.name} />
                      <input type="hidden" className="io_price" value="0" readOnly />
                      <input type="hidden" className="io_stock" value="1" readOnly />
                      <input
                        type="hidden"
                        name={`ct_qty[${item.id}][]`}
                        value={item.buyMinQty}
                        className="num_input"
                        size={5}
                        readOnly
                      />
                    </div>}
              </section>
            )}

            {/* Legacy `item.form.skin.php:199-201` */}
            {soldOut && (
              <p id="sit_ov_soldout" style={{ color: '#ef4444', fontWeight: 600, marginTop: '15px' }}>
                상품의 재고가 부족하여 수강신청할 수 없습니다.
              </p>
            )}

            <div id="sit_ov_btn" style={{ marginTop: '30px' }}>
              {orderable && (
                <button
                  type="submit"
                  value="바로구매"
                  className="sit_btn_buy"
                  style={{ width: '100%' }}
                >
                  수강 신청하기
                </button>
              )}
              {/*
               * Legacy `item.form.skin.php:208-210`:
               *   `if(!$is_orderable && $it['it_soldout'] && $it['it_stock_sms'])` 면
               *   `재입고알림`(`#sit_btn_alm`) 링크를 그린다.
               * Bridge 가 `it_stock_sms` 를 주지 않아 조건을 완성할 수 없다. 조건의 일부만 보고
               * 그리면 SMS 알림이 꺼진 강좌에도 버튼이 뜬다 — 그래서 아예 그리지 않는다.
               * // TBD(legacy): Bridge 에 stockSmsEnabled 를 추가한 뒤 이 분기를 켠다.
               */}
            </div>
          </section>
          {/* 상품 요약정보 및 구매 끝 */}
        </div>

        {/* 다른 상품 보기 시작 */}
        <div className="sit_siblings" style={siblingsStyle}>
          <div className="div_prev">
            {siblings.previous === null ? (
              <span style={disabledSiblingStyle}>
                <i className="fa fa-angle-left" aria-hidden="true" style={{ marginRight: '6px' }} />{' '}
                이전 강의 없음
              </span>
            ) : (
              <a
                href={legacyRoutes.courseDetail(siblings.previous)}
                id="siblings_prev"
                style={siblingStyle}
              >
                <i className="fa fa-angle-left" aria-hidden="true" /> 이전 강의
              </a>
            )}
          </div>

          <div className="div_list">
            <a href={legacyRoutes.courseList(item.category.id)} style={listButtonStyle}>
              <i className="fa fa-bars" aria-hidden="true" style={{ marginRight: '4px' }} /> 목록보기
            </a>
          </div>

          <div className="div_next">
            {siblings.next === null ? (
              <span style={disabledSiblingStyle}>
                다음 강의 없음{' '}
                <i className="fa fa-angle-right" aria-hidden="true" style={{ marginLeft: '6px' }} />
              </span>
            ) : (
              <a
                href={legacyRoutes.courseDetail(siblings.next)}
                id="siblings_next"
                style={siblingStyle}
              >
                다음 강의 <i className="fa fa-angle-right" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        {/* 다른 상품 보기 끝 */}
      </form>
    </div>
  );
}

/** Legacy 는 빈 문자열 `it_*` 값을 falsy 로 보고 행을 그리지 않는다. */
function hasText(value: string | undefined): value is string {
  return value !== undefined && value !== '';
}

/**
 * Bridge 가 주는 `form.action` 은 `/shop/cartupdate.php` 상대경로다. Legacy base 를 붙인다 —
 * Gate 6 컷오버 전에는 V2 가 Vercel 도메인에 있을 수 있어 상대경로가 V2 로 간다.
 * `NEXT_PUBLIC_LEGACY_BASE_URL` 이 빈 문자열이면 결과도 상대경로이고, 그게 컷오버 후 정답이다.
 */
function resolveAction(action: string): string {
  // `legacyRoutes.cartUpdate()` 와 같은 값이다. Bridge 가 다른 경로를 주면 그쪽을 따른다.
  return action === '/shop/cartupdate.php' ? legacyRoutes.cartUpdate() : action;
}

const starSnsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
};

const shareButtonStyle: CSSProperties = {
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#475569',
  transition: 'all 0.2s',
};

const snsAreaStyle: CSSProperties = {
  position: 'absolute',
  right: 0,
  top: '48px',
  background: '#fff',
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  zIndex: 100,
  whiteSpace: 'nowrap',
  alignItems: 'center',
  gap: '8px',
};

const snsIconStyle: CSSProperties = {
  display: 'inline-flex',
  width: '36px',
  height: '36px',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '50%',
  transition: 'all 0.2s',
};

const listPriceStyle: CSSProperties = {
  fontSize: '1.1rem',
  textDecoration: 'line-through',
  color: '#94a3b8',
  marginRight: '10px',
};

const salePriceStyle: CSSProperties = {
  fontSize: '1.5rem',
  color: '#2563eb',
  fontWeight: 700,
};

const siblingsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '30px 0',
  paddingTop: '20px',
  borderTop: '1px solid #e2e8f0',
};

const siblingStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  color: '#334155',
  fontSize: '0.9rem',
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'all 0.2s',
};

const disabledSiblingStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 16px',
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  color: '#94a3b8',
  fontSize: '0.9rem',
  cursor: 'not-allowed',
};

const listButtonStyle: CSSProperties = {
  padding: '8px 16px',
  background: '#fff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  color: '#475569',
  fontSize: '0.9rem',
  fontWeight: 600,
  textDecoration: 'none',
};
