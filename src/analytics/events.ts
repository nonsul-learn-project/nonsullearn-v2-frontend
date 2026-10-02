/**
 * Canonical event 목록 (AGENTS.md §8).
 *
 * 이 목록에 없는 이름으로 `track()` 을 부르면 **타입 에러**다. 새 이벤트는 여기에 먼저 추가한다.
 * 그래야 provider 별 매핑(Gate 7)이 추측 없이 가능하다.
 *
 * `purchase` 는 **일부러 없다.** Legacy 결제 완료 페이지가 소유한다 (AGENTS.md §8).
 * V2 에서 발생시키면 전환이 중복 집계된다.
 */
export const CANONICAL_EVENTS = [
  'page_view',
  'cta_click',
  'course_view',
  'begin_checkout',
  'bridge_error',
] as const;

export type CanonicalEvent = (typeof CANONICAL_EVENTS)[number];

/** 이벤트별 속성. 값은 JSON 으로 직렬화 가능한 것만. 개인정보는 넣지 않는다 (AGENTS.md §8). */
export interface EventProps {
  page_view: { path: string };
  cta_click: { label: string; destination: string };
  course_view: { courseId: string };
  begin_checkout: { courseId: string; salePrice: number };
  /** `kind` 는 `BridgeError.kind` 다. 응답 본문이나 쿠키를 넣지 않는다. */
  bridge_error: { contract: string; kind: string };
}

export function isCanonicalEvent(value: string): value is CanonicalEvent {
  return (CANONICAL_EVENTS as readonly string[]).includes(value);
}
