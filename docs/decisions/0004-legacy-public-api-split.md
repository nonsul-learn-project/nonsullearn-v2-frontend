# ADR 0004 — Legacy 공개 API 를 `@/legacy` 와 `@/legacy/server` 로 분리

상태: ACCEPTED
작성일: 2026-10-02
관련 Gate: Gate 1

## 맥락

`AGENTS.md` §4 는 `src/legacy/index.ts` 를 "외부 공개 API (여기 export된 것만 사용 가능)"로,
§6.2 는 `app/`, `features/`, `components/` 가 "`@/legacy` (index)만 import" 하도록 정한다.
동시에 Gate 1 프롬프트는 `bridge-server.ts` 를 `server-only` 로 두고,
그 index 하나에 `useViewer`(클라이언트 전용)와 `getCourse`/`getCourses`(서버 전용)를 **같이** export 하라고 한다.

이 둘은 양립하지 않는다. Next 16.3.7 로 직접 확인했다.

`features/header/AuthArea.tsx` 는 `'use client'` 이고 `useViewer()` 가 필요하다.
그 컴포넌트가 `@/legacy` 를 import 하면 barrel 이 `course/http.ts → bridge-server.ts → server-only` 를
전이적으로 끌어온다. `server-only` 는 react-server 조건이 아닌 번들에서 모듈 스코프에서 throw 하므로 빌드가 깨진다.

```text
Import traces:
  Client Component Browser:
    ./src/legacy/client/bridge-server.ts   ← import 'server-only'
    ./src/legacy/adapters/course/http.ts
    ./src/legacy/adapters/course/index.ts
    ./src/legacy/index.ts
    ./src/features/_probe/Probe.tsx        ← 'use client'
    ./src/app/probe-page/page.tsx
```

`@/env.server` 의 `server-only` 도 같은 경로로 걸린다. 즉 Phase 2 산출물까지 함께 영향을 받는다.

## 결정

공개 API 표면을 **둘로** 나눈다. 내부 경로 직접 import 금지는 그대로 유지한다.

| 모듈 | 성격 | export |
|---|---|---|
| `@/legacy` | 클라이언트에서도 안전 | `ViewerProvider`, `useViewer`, `useViewerCapabilities`, `legacyRoutes`, `safeReturnTo`, `BridgeError`, `isBridgeError`, 그리고 `ViewerState` / `Course` 등 타입 |
| `@/legacy/server` | `import 'server-only'` | `getCourse`, `getCourses` |

ESLint 는 `app/`, `features/` 에서 이 두 개만 허용한다.
`group: ['@/legacy/*', '@/legacy/*/**', '!@/legacy/server']` 로 `@/legacy/server` 만 예외를 둔다.
`@/legacy/client/*`, `@/legacy/adapters/*`, `@/legacy/contracts/*`, `@/legacy/server/internal` 같은 경로는 계속 막힌다.
순수 UI 영역(`design-system/`, `components/`)은 **둘 다** 금지다.

`tests/lint/boundary.test.ts` 가 이 동작을 ESLint API 로 직접 검증한다 (허용 1건, 차단 3건).

## 이유

1. **`server-only` 가 경계를 빌드 시점에 강제한다.** 규칙을 어기면 lint 를 통과했더라도 배포 전에 빌드가 멈춘다.
   이것이 리뷰나 관례보다 강하다.
2. **`AGENTS.md` §2 절대 원칙 2 를 지킨다.** 서버 전용 env(`LEGACY_BRIDGE_BASE`, `V2_PROXY_SECRET`)가
   클라이언트 번들로 새는 경로가 구조적으로 막힌다.
3. **경계의 개수는 늘지 않는다.** 밖에서 보면 여전히 "Legacy 는 `legacy/` 를 통해서만" 이고,
   달라지는 것은 그 입구가 서버용/클라이언트용으로 표시된다는 점뿐이다.

## 대안

- **`server-only` 마커 제거 (단일 barrel 유지):** 기각. `AGENTS.md` 문구는 지켜지지만
  지키려던 **실질**(서버 전용 코드와 env 가 브라우저로 가지 않는다)을 잃는다.
  Gate 1 프롬프트 Phase 2/4 가 명시한 `server-only` 요구도 어긋난다.
- **`getCourse`/`getCourses` 가 env 를 인자로 받기:** 기각. barrel 하나를 지킬 수 있지만
  "소스 선택은 env 로만" 이 깨지고 모든 호출지에 env 배선이 반복된다.
- **`'use server'` Server Action:** 기각. Server Action 은 POST 기반이라
  `AGENTS.md` §6.3 이 요구하는 강좌 페이지 ISR 과 맞지 않는다.

## 결과

- 장점: 경계가 타입·번들러 양쪽에서 강제된다. 위반이 배포 전에 드러난다.
- 비용: `AGENTS.md` §4 구조도와 §6.2 밑줄("`@/legacy` (index)만")이 구현과 글자 단위로 어긋난 상태로 남는다.
  문서 본문은 수정하지 않았다 — `AGENTS.md` 는 모든 에이전트의 계약서이므로 사람이 통제한다.
  **사람이 처리할 잔여 항목이다.**

## 재검토

Gate 8 에서 강좌 상세 페이지가 실제로 `@/legacy/server` 를 쓰기 시작할 때 표면이 적절한지 다시 본다.
`getCourse` 외의 서버 전용 읽기가 늘어나면 그때도 입구는 `@/legacy/server` 하나로 유지한다.
