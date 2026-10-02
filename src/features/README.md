# features

사용자 기능 단위. 한 폴더 = 한 기능 (`header`, `home`, `course-detail` ...).

`@/legacy`(index)와 `@/analytics`만 import한다. `@/legacy/client/*`나 `@/legacy/adapters/*` 직접 import는 ESLint가 막는다.
Legacy 의존 UI는 `loading` / 정상 / 빈 값 / `unavailable` 4가지 상태를 모두 처리한다 (AGENTS.md §6.4).
