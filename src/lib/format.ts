/**
 * 날짜·금액 포맷 단일 출처 (AGENTS.md §6.1). 원화, `Asia/Seoul`.
 *
 * Legacy 와 **같은 결과**를 내야 한다. 화면에 보이는 숫자가 다르면 parity 가 깨진다.
 */

/**
 * PHP `number_format($value, 0)` 과 같다. 천 단위 쉼표, 소수점 없음.
 *
 * `Intl.NumberFormat('ko-KR')` 을 쓰지 않는 이유: 로케일 데이터에 따라 `10,000` 대신
 * 다른 자리수 묶음이 나올 수 있고, PHP 는 항상 3자리 묶음이다. 결과를 고정한다.
 */
export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const negative = rounded < 0;
  const digits = Math.abs(rounded).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return negative ? `-${grouped}` : grouped;
}

/**
 * Legacy `display_price($price)` 과 같다 — `number_format($price, 0).'원'`
 * (`html2/lib/shop.lib.php:604`).
 *
 * 전화문의 분기는 여기서 처리하지 않는다. Legacy 스킨도 `it_tel_inq` 일 때는
 * `display_price()` 를 부르지 않고 "전화문의" 문자열을 직접 쓴다.
 */
export function formatPrice(value: number): string {
  return `${formatNumber(value)}원`;
}

/**
 * Legacy 옵션 추가금 표기. `shop.override.js:65-69`:
 *
 * ```js
 * if(parseInt(price) >= 0) opt_prc = "+"+number_format(String(price))+"원";
 * else                     opt_prc = number_format(String(price))+"원";
 * ```
 *
 * 음수면 `number_format` 이 이미 `-` 를 붙이므로 부호를 또 붙이지 않는다.
 */
export function formatOptionPrice(value: number): string {
  return value >= 0 ? `+${formatPrice(value)}` : formatPrice(value);
}

/**
 * Legacy 목록의 날짜 표기. `substr($is_time, 2, 8)` 과 같다
 * (`itemuse.skin.php:44`, `itemqa.skin.php:41`).
 *
 * `2026-09-30 11:21:00` → `26-09-30`. Legacy 가 timezone 변환을 하지 않고 문자열을
 * 그대로 자르므로 여기서도 자른다. `Date` 로 파싱하면 UTC 해석이 끼어들어 날짜가 밀린다.
 */
export function formatLegacyListDate(value: string): string {
  return value.slice(2, 10);
}
