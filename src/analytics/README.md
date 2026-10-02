# analytics

모든 이벤트는 `track(event, props)`를 거친다. 컴포넌트에서 `gtag`/`fbq`/`wcs` 직접 호출 금지 (AGENTS.md §8).

이벤트 이름은 `events.ts`의 canonical 목록만 쓴다. `NEXT_PUBLIC_ANALYTICS_ENABLED=false`면 console 출력만 한다.
provider 연결과 attribution은 Gate 5/7 범위다. `purchase`는 Legacy 결제 완료 페이지가 소유한다.
