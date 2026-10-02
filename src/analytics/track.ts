import { analyticsEnabled } from '@/env.client';

import type { CanonicalEvent, EventProps } from './events';

/**
 * 모든 이벤트의 유일한 출구 (AGENTS.md §8).
 *
 * 컴포넌트에서 `gtag`, `fbq`, `wcs` 를 직접 부르지 않는다. provider 연결은 Gate 5/7 범위이며,
 * 지금은 `NEXT_PUBLIC_ANALYTICS_ENABLED=false` 일 때의 동작(console 출력만)만 확정한다.
 */
export function track<E extends CanonicalEvent>(event: E, props: EventProps[E]): void {
  if (!analyticsEnabled) {
    // provider 를 부르지 않는다. 로컬과 Preview 에서 무엇이 나갈지 눈으로 확인하는 용도다.
    console.info('[analytics:disabled]', event, props);
    return;
  }

  // TODO(Gate 5): provider adapter 연결 (GTM/GA4/Meta/Naver/Kakao).
  // docs/discovery/tracking-inventory.md — 현재 Legacy 에 추적 태그가 0건이므로
  // Gate 5 는 "parity 유지"가 아니라 "측정 신규 도입"이다.
  console.info('[analytics]', event, props);
}
