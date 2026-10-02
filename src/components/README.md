# components

여러 feature가 공유하는 **조합** 컴포넌트만 둔다. primitive는 `@/design-system/primitives`다.

순수 UI 영역이므로 `@/legacy`와 `@/analytics`를 import하지 않는다 (AGENTS.md §6.2, ESLint가 막는다).
데이터는 prop으로 받는다.
