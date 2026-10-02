# Gate 3 — Legacy Integration Foundation (V2 측)

작성일: 2026-10-02
상태: **V2 측 DONE — 운영 Bridge 실응답 검증 대기 (사람)**
브랜치: `feat/gate-3-bridge-contract-v1`

이 기록은 **이 레포(V2)** 작업만 담는다. Legacy `html2/v2-api/viewer.php`, `courses.php` 는
`nonsul-learn-html1` 레포와 서버 설치 스크립트 소관이다.

---

## 1. 항목별 결과

| Gate 3 항목 | 결과 | 증거 |
|---|---|---|
| Contract / fixture | DONE | `contracts/bridge/` — JSON Schema 4개, fixture 정상 7 / 거부 3 |
| `ViewerAdapter` | DONE (점검) | `src/legacy/adapters/viewer/` — 상대경로 + `same-origin` 유지 확인 |
| `CourseAdapter` | DONE | `src/legacy/adapters/course/http.ts` — 404→null, 그 외 throw |
| `bridge-fetch.ts` / `bridge-server.ts` | DONE | `redirect: 'manual'` 추가, 쿠키 미전달 유지 |
| mock 위치 | DONE | `src/legacy/adapters/<contract>/mock.ts` (fixture 는 `contracts/bridge/fixtures/`, ADR 0008) |
| 응답 key 와 fixture key 정합 | DONE | `tests/contract/bridge-fixtures.test.ts` — zod 판정 ⇄ JSON Schema 판정 대조 |
| secret / PII / transaction 변경 없음 | DONE | viewer Contract 에 `mb_id`·이름·level 없음 (ADR 0003), 거부 fixture 2개로 고정 |
| Bridge GET-only | DONE (V2 측) | `pnpm bridge:check` B6 가 POST 405 를 검사 (운영 실행은 사람) |
| L4 S1~S4 | **대기** | 운영 Bridge 배포 후 사람이 실행 |

## 2. 검증 출력

```
$ pnpm contract:fixtures
정상 fixture 7개, 거부 fixture 3개
fixtures: 10 passed, 0 failed

$ pnpm test
Test Files  18 passed (18)
     Tests  341 passed (341)          ← 작업 전 268 / 16 파일

$ env -i PATH="$PATH" HOME="$HOME" pnpm build
BUILD EXIT=0                           ← env 없이 빌드 통과 (ADR 0006)

$ grep -rn "localhost" src/ --include=*.ts --include=*.tsx
localhost 건수: 0
```

`pnpm check` = `check:legacy-css && contract:fixtures && lint && typecheck && test && build` 전부 PASS.
lint 경고 4건은 Gate 2 이전부터 있던 것(`no-img-element` 3, `no-page-custom-font` 1)이며 에러는 0건이다.

## 3. Contract v1 과 기존 zod 의 차이 (처리 결과)

viewer 는 대조 결과 **이미 Contract 와 같아** 바꾼 것이 없다 (ADR 0003 의 displayName 제외가 그대로 맞았다).

course 는 Gate 1 draft 였으므로 Contract 에 맞춰 고쳤다.

| 기존 zod (Gate 1 draft) | Contract v1 | 처리 |
|---|---|---|
| `teacherName: string` | 없음 | **삭제** |
| `imageUrl: string \| null` | `image` (상대 경로 `^/(?!/)`) | 이름 변경 + 절대 URL 거부 |
| `salePrice: int` | `price: int` | 이름 변경 |
| `saleStatus: enum(on_sale/sold_out/inquiry/unavailable)` | `soldOut: bool` + `priceOnInquiry: bool` | enum 삭제, boolean 2개로 교체 |
| `id: string.min(1)` | `^[A-Za-z0-9_-]{1,20}$` | pattern 추가 |
| 단건 `item: Course \| null` | `item: Course` (없으면 404) | nullable 제거 |
| (없음) | `{ v, error }` envelope | `bridgeErrorResponseSchema` 추가 |

**UI 가 Contract 에 없는 필드를 쓰는 경우는 없었다.** `Course` 를 읽는 컴포넌트가 아직 없다
(강좌 UI 는 Gate 8). 그래서 Contract 를 늘리지 않고 그대로 좁혔다.

## 4. 이번 Gate 에서 내린 결정

| ADR | 내용 |
|---|---|
| 0007 | course adapter 의 실패 표면을 둘로 (`getCourse` throw / `getCourseState` unavailable). ISR 이 마지막 성공본을 유지하게 하려면 throw 가 필요하다 |
| 0008 | Contract 단일 원본을 `contracts/bridge/` 로 이동. PHP 가 읽을 수 있는 언어 중립 정의가 필요하다 |

Contract 를 좁히는 과정에서 **`image` pattern 을 `^/` → `^/(?!/)` 로 강화했다.**
`//host/path` 는 선행 슬래시가 있어도 protocol-relative 절대 URL 이라서, 통과시키면
Bridge 가 준 값이 강좌 이미지를 다른 호스트로 돌릴 수 있었다.

`tests/lint/boundary.test.ts` 의 ESLint 준비 비용을 `beforeAll` 로 옮겼다. 첫 `lintText()` 가
~3초라서 테스트 파일이 늘어나자 기본 5초 timeout 을 간헐적으로 넘겼다. 검사 기준은 그대로다.

---

## 5. 사람이 할 일

### 5.1 운영 Bridge 검증 (필수, Gate 3 PASS 조건)

Legacy 서버에 `html2/v2-api/` 설치가 끝난 뒤:

```bash
BASE=https://nonsul-learn.com pnpm bridge:check
# 로그인 viewer 까지 보려면
SMOKE_PHPSESSID=<세션값> BASE=https://nonsul-learn.com pnpm bridge:check
```

검사 항목은 `docs/harness/HARNESS.md` §5.1 B1~B7.
**이 검사가 통과하기 전에 `COURSE_SOURCE=http` 로 바꾸지 않는다.**

### 5.2 통과 후 Vercel env 등록

```
COURSE_SOURCE=http
LEGACY_BRIDGE_BASE=https://nonsul-learn.com/v2-api
```

등록 후 재배포. `NEXT_PUBLIC_VIEWER_SOURCE` 는 **`mock` 으로 둔다** —
Vercel 도메인에서는 PHP 세션 쿠키가 전달되지 않아 `http` 로 바꾸면 로그인 사용자도
비로그인으로 보인다. Gate 4 에서 Apache 프록시가 메인 도메인으로 요청을 받은 뒤 전환한다
(`src/env.client.ts` 주석).

### 5.3 문서 잔여 항목 (사람 통제 문서, 에이전트가 수정하지 않았다)

| 문서 | 어긋난 내용 | 실제 구현 |
|---|---|---|
| `AGENTS.md` §4 | fixture 가 `src/legacy/contracts/fixtures/` | `contracts/bridge/fixtures/` (ADR 0008) |
| `GATES.md` Gate 3 3번째 ● | 같음 | 같음 |
| `GATES.md` Gate 3 예시 JSON | `"member": { "displayName": ..., "level": 2 }` 포함 | **Contract 는 이 필드를 금지한다.** `viewer.raw-level.invalid.json` 이 거부를 고정 (ADR 0003) |
| `HARNESS.md` §4 L2 `member` 행 | 같음 | 같음 (ADR 0003 이 이미 기록) |

### 5.4 Gate 8 로 넘기는 항목

- `next.config.ts` 에 `images.remotePatterns` 로 `NEXT_PUBLIC_LEGACY_ASSET_HOST` 등록
  (AGENTS.md §6.3). 강좌 이미지를 실제로 렌더할 때 필요하다. 지금은 렌더하는 화면이 없어
  `next.config` 를 건드리지 않았다.
- `public/images/course-placeholder.svg` 는 SVG 라서 `next/image` 로 쓰려면 `unoptimized` 가
  필요하다. 또는 PNG 로 교체한다.
- `src/analytics/events.ts` 의 `begin_checkout.salePrice` prop 이름이 Contract 의 `price` 와
  어긋난다. analytics 이벤트 스키마는 Gate 7 소관이라 건드리지 않았다.
