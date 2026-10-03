# ADR 0008 — Contract 단일 원본을 `contracts/bridge/` 로 옮긴다

상태: ACCEPTED
작성일: 2026-10-02
관련 Gate: Gate 3

## 맥락

Gate 1 에서는 Contract 의 원본이 zod(`src/legacy/contracts/*.ts`)였고 fixture 가
`src/legacy/contracts/fixtures/` 에 있었다. `AGENTS.md` §4 와 `GATES.md` Gate 3 항목도 그 위치를 적고 있다.

Gate 3 에서 Legacy 쪽 `html2/v2-api/` 가 **다른 레포**에 구현된다. 그러면 약속의 양쪽 당사자가
서로 다른 레포에 있고, 한쪽(V2)의 TypeScript 파일이 원본 노릇을 할 수 없다.

- PHP 는 zod 를 읽을 수 없다. 사람이 손으로 옮겨야 하고, 그 과정에서 조용히 갈라진다.
- 운영 Bridge 가 Contract 를 지키는지 확인하려면 **런타임과 무관한** 기계가 읽을 수 있는 정의가 필요하다.
- fixture 가 `src/` 안에 있으면 "V2 의 테스트 데이터"로 보인다. 실제로는 양쪽이 합의한 예시 응답이다.

## 결정

단일 원본을 `contracts/bridge/` 로 옮긴다.

```text
contracts/bridge/
├── *.v1.schema.json     ← 단일 원본 (JSON Schema, 언어 중립)
├── fixtures/            ← 예시 응답. mock adapter 와 하네스가 공유
└── README.md            ← 버전 규칙, 금지 필드
```

`src/legacy/contracts/*.ts` 의 zod 는 **사본**이 된다. 둘이 갈라지지 않게:

1. `tests/contract/bridge-fixtures.test.ts` 가 모든 fixture 에 대해 zod 판정과 JSON Schema 판정이
   **같은지** 확인한다 (`scripts/bridge-check.mjs --fixtures --json` 출력과 대조).
2. mock adapter 는 데이터를 직접 갖지 않고 `contracts/bridge/fixtures/` 를 읽어 zod 로 parse 한다.
3. `pnpm contract:fixtures` 가 `pnpm check` 에 포함되어 매 커밋 돈다.

`src/legacy/contracts/fixtures/` 는 삭제했다. 원본이 두 곳에 있으면 반드시 갈라진다.

## 이유

- **언어 중립이어야 양쪽이 쓴다.** PHP 쪽도 같은 JSON Schema 로 자기 응답을 검사할 수 있다.
- **런타임 밖이어야 운영을 검사할 수 있다.** `pnpm bridge:check` 는 Next 를 띄우지 않고
  스키마만 읽어 운영 응답을 검증한다.
- **repo 루트에 있어야 "공유 계약"으로 읽힌다.** `src/` 안에 있으면 V2 의 내부 구현처럼 보인다.

## 대안

- **zod 를 원본으로 두고 JSON Schema 를 생성:** 기각. 생성물을 커밋해야 하고, PHP 쪽이
  생성 파이프라인에 의존하게 된다. 또 `zod-to-json-schema` 같은 의존성이 필요하다
  (`AGENTS.md` §9 의존성 추가 최소화).
- **Bridge 레포(`nonsul-learn-html1`)에 원본을 둔다:** 기각. V2 의 `pnpm check` 가 다른 레포를
  읽어야 하고, 두 레포의 버전이 어긋나면 CI 가 무엇을 기준으로 삼을지 모른다.
- **양쪽에 각각 둔다:** 기각. 그게 지금 막으려는 상황이다.

## 결과

- 장점: 약속이 한 곳에 있고, 양쪽이 같은 파일로 검사받는다. 운영 응답 검증이 가능해졌다.
- 비용: `src/` 밖의 JSON 을 import 하므로 mock 의 import 경로가 `../../../../contracts/...` 로 길다.
  path alias 를 추가하면 짧아지지만 `tsconfig.json` 변경이 필요해 Gate 3 범위에서 제외했다.
- `AGENTS.md` §4 구조도와 `GATES.md` Gate 3 항목("fixture는 `src/legacy/contracts/fixtures/`")이
  구현과 어긋난 상태로 남는다. 이 문서들은 사람이 통제하므로 수정하지 않았다.
  **사람이 처리할 잔여 항목이다** (ADR 0004 와 같은 처리).

## 재검토

Gate 8 에서 Contract 가 3개 이상으로 늘면 `course` 정의 중복(`courses-list` / `course-detail`)이
부담이 되는지 본다. 그때 검사기에 파일 간 `$ref` 지원을 추가할지 결정한다.
