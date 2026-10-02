import { describe, expect, it } from 'vitest';

import { track } from '@/analytics';

/**
 * L2 — analytics canonical 이름을 **타입**으로 강제한다 (HARNESS.md §4 analytics 표 1행).
 *
 * `@ts-expect-error` 를 쓰는 이유: 타입 에러가 **나야 정상**이다. 만약 track() 이 느슨해져
 * 아래 호출이 통과하게 되면 `@ts-expect-error` 자체가 "쓸모없는 지시자" 오류가 되어
 * `pnpm typecheck` 가 깨진다. 즉 이 블록이 규칙의 감시자다 (AGENTS.md §6.1 허용 범위).
 */
describe('track 의 타입 경계', () => {
  it('canonical 이름과 맞는 props 는 통과한다', () => {
    expect(() => {
      track('page_view', { path: '/' });
      track('cta_click', { label: '수강신청', destination: '/shop/item.php?it_id=1' });
      track('course_view', { courseId: '1001' });
      track('begin_checkout', { courseId: '1001', salePrice: 264000 });
      track('bridge_error', { contract: 'viewer', kind: 'timeout' });
    }).not.toThrow();
  });

  it('목록에 없는 이벤트명은 타입 에러다', () => {
    const forbidden = () => {
      // purchase 는 Legacy 결제 완료 페이지가 소유한다 (AGENTS.md §8).
      // @ts-expect-error 목록에 없는 이벤트명이므로 타입 에러여야 한다
      track('purchase', { courseId: '1001' });
      // @ts-expect-error 목록에 없는 이벤트명이므로 타입 에러여야 한다
      track('add_to_cart', { courseId: '1001' });
      // @ts-expect-error 목록에 없는 이벤트명이므로 타입 에러여야 한다
      track('login', {});
    };
    expect(typeof forbidden).toBe('function');
  });

  it('props 모양이 다르면 타입 에러다', () => {
    const wrongProps = () => {
      // @ts-expect-error path 가 필요한데 없다
      track('page_view', {});
      // @ts-expect-error salePrice 는 number 여야 한다
      track('begin_checkout', { courseId: '1001', salePrice: '264000' });
      // @ts-expect-error courseId 가 아니라 id 를 넘겼다
      track('course_view', { id: '1001' });
    };
    expect(typeof wrongProps).toBe('function');
  });
});
