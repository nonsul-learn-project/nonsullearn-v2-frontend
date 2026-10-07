'use client';

import { Fragment } from 'react';

import type { CourseOptionItem } from '@/legacy';
import { formatNumber } from '@/lib/format';

/**
 * Legacy `get_item_options()` / `get_item_supply()` / `itemoption.php` 가 만드는
 * select 묶음을 그대로 재현한다 (`html2/lib/shop.lib.php:955-1144`,
 * `html2/shop/itemoption.php`).
 *
 * `item.php` 는 둘 다 `'div'` 모드로 부르고 `$is_first_option_title = 1` 을 넘긴다:
 *
 *     get_item_options($it_id, $it_option_subject, 'div', 1)
 *     get_item_supply ($it_id, $it_supply_subject, 'div', 1)
 *
 * 그래서 DOM 이 주제 수에 따라 갈린다. 아래 주석의 줄 번호가 근거다.
 */

/** PHP `chr(30)`. Bridge 의 `parts` 는 io_id 를 이것으로 쪼갠 결과다. */
export const RS = String.fromCharCode(30);

/**
 * Legacy option 텍스트의 가격 꼬리표. `shop.lib.php:1042-1045` 와 `itemoption.php:66-69`.
 *
 * ```php
 * if($row['io_price'] >= 0) $price = '&nbsp;&nbsp;+ '.number_format($row['io_price']).'원';
 * else                      $price = '&nbsp;&nbsp; '.number_format($row['io_price']).'원';
 * ```
 *
 * `&nbsp;` 는 U+00A0 다. 일반 공백으로 바꾸면 Legacy 와 폭이 달라진다.
 */
function priceSuffix(price: number): string {
  const sign = price >= 0 ? '+ ' : ' ';
  return `  ${sign}${formatNumber(price)}원`;
}

/** `io_stock_qty < 1` 이면 `&nbsp;&nbsp;[품절]`. */
function soldOutSuffix(available: boolean): string {
  return available ? '' : '  [품절]';
}

/**
 * Legacy `<option value>`. 잎 노드만 `{값},{가격},{재고}` 꼴이고 중간 단계는 값만이다
 * (`itemoption.php:63-78`).
 *
 * Bridge 는 재고 **수량**을 주지 않는다 (`available` boolean 만). Legacy JS 가
 * `parseInt(info[2]) < 1` 로만 쓰므로 1/0 으로 넣어도 판정이 같다.
 * // TBD(legacy): 수량을 화면에 보여줘야 하면 Bridge 에 io_stock_qty 를 추가한다.
 */
export function leafOptionValue(part: string, price: number, available: boolean): string {
  return `${part},${price},${available ? 1 : 0}`;
}

/** Legacy `value.split(",")[0]` — 선택값에서 옵션 부분만 뽑는다 (`shop.js:303`). */
export function optionPart(raw: string): string {
  return raw.split(',')[0] ?? '';
}

export interface CourseOptionPickerProps {
  subjects: string[];
  /** `options.items` 중 `type === 0` 인 것들. */
  items: CourseOptionItem[];
  /** select 들의 현재 raw 값. index = subjects 의 index. */
  picked: string[];
  onPick: (depth: number, raw: string) => void;
}

/**
 * 선택옵션. 주제가 1개면 `<div class="get_item_options">` 하나, 2개 이상이면 주제마다
 * 하나씩 만든다. 이게 Legacy 의 두 분기(`$subj_count > 1` / else)다.
 */
export function CourseOptionPicker({
  subjects,
  items,
  picked,
  onPick,
}: CourseOptionPickerProps) {
  const multi = subjects.length > 1;

  /**
   * `depth` 단계의 후보. Legacy 는 중간 단계는 `get_item_options` 가 전체 io_id 를 쪼개
   * 중복 제거하고, 마지막 단계는 `itemoption.php` 가 `io_id like '{상위}chr(30)%'` 로 받아 온다.
   * Bridge 가 잎 노드를 전부 주므로 같은 목록을 여기서 만든다.
   */
  function choicesAt(depth: number): CourseOptionItem[] {
    const prefix = picked.slice(0, depth).map(optionPart);
    const seen = new Set<string>();
    const result: CourseOptionItem[] = [];
    for (const option of items) {
      if (!prefix.every((value, index) => option.parts[index] === value)) continue;
      const part = option.parts[depth];
      if (part === undefined || part === '' || seen.has(part)) continue;
      seen.add(part);
      result.push(option);
    }
    return result;
  }

  function renderSelect(subject: string, depth: number) {
    const seq = depth + 1;
    const isLeaf = depth === subjects.length - 1;
    const choices = choicesAt(depth);
    // Legacy: 다중 주제에서 `$i > 0` 인 select 는 disabled 로 시작하고, 상위를 고르면 풀린다.
    const disabled = multi && depth > 0 && optionPart(picked[depth - 1] ?? '') === '';
    // Legacy: 주제가 1개면 '선택', 여러 개면 주제 이름이 placeholder 다
    // (`$is_first_option_title = 1` → `shop.lib.php:1007`, `itemoption.php:34-39`).
    const placeholder = multi ? subject : '선택';

    return (
      <select
        id={`it_option_${seq}`}
        className="it_option"
        disabled={disabled}
        value={picked[depth] ?? ''}
        onChange={(event) => onPick(depth, event.target.value)}
      >
        <option value="">{placeholder}</option>
        {choices.map((choice) => {
          const part = choice.parts[depth] ?? '';
          return isLeaf ? (
            <option key={part} value={leafOptionValue(part, choice.price, choice.available)}>
              {`${part}${priceSuffix(choice.price)}${soldOutSuffix(choice.available)}`}
            </option>
          ) : (
            <option key={part} value={part}>
              {part}
            </option>
          );
        })}
      </select>
    );
  }

  if (!multi) {
    const subject = subjects[0] ?? '';
    return (
      <div className="get_item_options">
        <label htmlFor="it_option_1">{subject}</label>
        <span>{renderSelect(subject, 0)}</span>
      </div>
    );
  }

  return (
    <>
      {subjects.map((subject, depth) => (
        <div className="get_item_options" key={subject}>
          <label htmlFor={`it_option_${depth + 1}`} className="label-title">
            {subject}
          </label>
          <span>{renderSelect(subject, depth)}</span>
        </div>
      ))}
    </>
  );
}

export interface CourseSupplyPickerProps {
  subjects: string[];
  /** `options.items` 중 `type === 1` 인 것들. `parts[0]` 이 주제다. */
  items: CourseOptionItem[];
  picked: string[];
  onPick: (depth: number, raw: string) => void;
}

/**
 * 추가옵션. Legacy `get_item_supply()` 는 io_id 를 `{주제}chr(30){값}` 으로 저장하고
 * `parts[0]` 으로 주제별 묶음을 만든다. 선택옵션과 달리 단계가 없다 — 주제마다 독립 select 다.
 *
 * `<div class="get_item_supply">` 와 `<span class="td_sit_sel">` 은 선택옵션과 class 가 다르다
 * (`shop.lib.php:1114-1136`).
 *
 * 운영 카탈로그 39개 강좌 전부 `supplySubjects` 가 비어 있어 실물 화면으로는 확인하지 못했다.
 * // TBD(legacy): 추가옵션이 있는 강좌가 생기면 DOM 과 전송값을 실물로 확인한다.
 */
export function CourseSupplyPicker({
  subjects,
  items,
  picked,
  onPick,
}: CourseSupplyPickerProps) {
  return (
    <>
      {subjects.map((subject, depth) => {
        const choices = items.filter((option) => option.parts[0] === subject);
        // Legacy: 해당 주제에 옵션이 없으면 `if($opt_count)` 가 false 라 select 자체를 안 그린다.
        if (choices.length === 0) return <Fragment key={subject} />;

        const seq = depth + 1;
        return (
          <div className="get_item_supply" key={subject}>
            <label htmlFor={`it_supply_${seq}`} className="label-title">
              {subject}
            </label>
            <span className="td_sit_sel">
              <select
                id={`it_supply_${seq}`}
                className="it_supply"
                value={picked[depth] ?? ''}
                onChange={(event) => onPick(depth, event.target.value)}
              >
                {/* `$is_first_option_title = 1` 이므로 placeholder 가 주제 이름이다. */}
                <option value="">{subject}</option>
                {choices.map((choice) => {
                  const part = choice.parts[1] ?? '';
                  return (
                    <option
                      key={choice.id}
                      value={leafOptionValue(part, choice.price, choice.available)}
                    >
                      {`${part}${priceSuffix(choice.price)}${soldOutSuffix(choice.available)}`}
                    </option>
                  );
                })}
              </select>
            </span>
          </div>
        );
      })}
    </>
  );
}
