# ADR 0003 — Viewer Contract v1 에서 `displayName` 제외

상태: ACCEPTED
작성일: 2026-10-02
관련 Gate: Gate 1 (Contract 수립), Gate 3 (Bridge 확정)

## 맥락

Viewer Contract v1 에 회원 표시 이름을 넣을지 결정해야 했다. 세 문서가 서로 다른 것을 말한다.

| 문서 | 내용 |
|---|---|
| `docs/discovery/viewer-contract-v1.md` (DONE) | `displayName` **제외 권고**. Legacy Header 가 이름을 쓰지 않는다 (근거: `html2/head.php:88`, local-audit:A1,A2,A5, manual:M1) |
| `docs/discovery/decisions-needed.md` #10 | 권장안 = 제외. "Header 비사용·PII 최소화" |
| `docs/harness/HARNESS.md` §4 L2 viewer `member` 행 | Pass 조건에 "**표시 이름**, 로그아웃 링크" |

`HARNESS.md` 의 해당 칸은 Discovery 이전 기준이며, Discovery 가 Legacy Header 를 실제로 확인한 결과와 어긋난다.

## 결정

**`displayName` 을 넣지 않는다.** Viewer Contract v1 은 로그인 여부와 권한만 전달한다.

```json
{ "v": 1, "authenticated": false }
{ "v": 1, "authenticated": true, "capabilities": { "correction": false, "admin": false } }
```

- `src/legacy/contracts/viewer.ts` 의 두 object 는 `.strict()` 이므로 `displayName` 이 들어오면 parse 가 실패한다.
- 그 동작을 `src/legacy/contracts/fixtures/viewer.invalid.has-displayName.json` 과
  `tests/contract/viewer.test.ts` 가 고정한다.
- L2 `member` 시나리오의 Pass 조건은 "**로그아웃 링크와 정보수정 링크 노출**"로 본다. 표시 이름은 검증하지 않는다.

## 이유

1. **Legacy Header 가 이름을 쓰지 않는다.** parity 기준이 되는 화면에 없는 데이터를 Contract 에 넣을 이유가 없다.
2. **viewer 응답은 캐시 불가 경로다.** 로그인 상태는 `Cache-Control: no-store` 로 매번 나간다.
   거기에 이름을 실으면 모든 페이지 로드마다 개인정보가 네트워크를 지난다.
3. **AGENTS.md §7.2** 는 개인 식별 정보 필드를 Contract 에 두는 것을 금지한다. 이름은 그 범주다.
4. **Contract drift 를 줄인다.** 나중에 이름이 필요해지면 `v` 를 유지한 채 필드를 추가할 수 있다(§7.2:
   필드 추가 = 버전 유지). 반대로 넣었다가 빼는 것은 버전 증가가 필요하다. 넣지 않는 쪽이 되돌리기 쉽다.

## 대안

- **`displayName` 포함 (`HARNESS.md` 문구 따르기):** 기각. Discovery 결정 #10 과 AGENTS.md §7.2 를 거스르고,
  얻는 것은 Legacy 에 없는 UI 요소다.
- **`HARNESS.md` §4 를 같이 수정:** 하지 않았다. `HARNESS.md` §10 은 하네스 기준 변경을 에이전트 단독으로
  하지 못하게 하고, `AGENTS.md` §9 도 사람 승인 없는 기준 완화를 금지한다. 이 ADR 로 어긋남을 기록하고
  문서 수정은 사람 판단에 맡긴다.

## 결과

- 장점: viewer 응답에 개인정보가 없다. Bridge PHP 가 `$member` 에서 읽을 필드가 줄어 부수효과 위험도 줄어든다.
- 비용: `HARNESS.md` §4 L2 `member` 행이 구현과 어긋난 상태로 남는다. **사람이 처리할 잔여 항목이다.**

## 재검토

Gate 3 에서 `viewer.php` 를 실제로 배포할 때 `$is_admin` 이 `super`/`group` 같은 문자열일 때의
capability 의미를 확정한다 (`docs/discovery/viewer-contract-v1.md` "열린 질문"). 그 결정은 이 ADR 을 바꾸지 않는다.
