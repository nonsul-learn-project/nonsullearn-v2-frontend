# 강좌 상세페이지 3종 템플릿 통합 — 작업 기록

작성일: 2026-10-15
범위: 이번 실행은 **Gate 0 ~ Gate 2** (조사·설계)만 수행했다. UI 코드 변경·배포는 없다.

## Gate 번호 주의

이 워크스트림의 `Gate 0~7`은 **요청서가 정의한 자체 번호**이며,
`docs/harness/GATES.md`의 프로젝트 하네스 Gate(0~10)와 **다른 체계**다.

| | 번호 체계 | 이 작업의 위치 |
|---|---|---|
| 프로젝트 하네스 | `docs/harness/GATES.md` Gate 0~10 | **Gate 8 — Public Frontend Migration (강좌 상세)**, 현재 `NOT STARTED` |
| 이 워크스트림 | 이 폴더의 Gate 0~7 | Gate 8을 쪼갠 내부 단계 |

혼동을 막기 위해 이 폴더의 문서는 항상 `템플릿 Gate n`으로, 하네스 쪽은 `하네스 Gate n`으로 적는다.

## 통합 보고서 (권장 시작점)

- **[GATE-1-2-통합보고서.md](GATE-1-2-통합보고서.md)** — Gate 1~2 전체를 하나로 정리한 문서 (1,358행).
  제1부 Gate 1 / 제2부 Gate 2 / 제3부 결정 사항·Gate 3 진입. 아래 개별 산출물의 내용을 모두 담고 있다.

## 산출물 (개별)

| Gate | 문서 | 판정 |
|---|---|---|
| 0 | [source-inventory.md](source-inventory.md) · [current-page-audit.md](current-page-audit.md) · [html-reference-map.md](html-reference-map.md) | [gate-0-verdict.md](gate-0-verdict.md) — **PASS** |
| 1 | [content-parity-matrix.md](content-parity-matrix.md) · [functional-parity.md](functional-parity.md) · [gap-analysis.md](gap-analysis.md) | [gate-1-verdict.md](gate-1-verdict.md) — **PASS** |
| 2 | [integration-architecture.md](integration-architecture.md) · [component-reuse-plan.md](component-reuse-plan.md) · [data-mapping.md](data-mapping.md) · [rollout-and-rollback-plan.md](rollout-and-rollback-plan.md) | [gate-2-verdict.md](gate-2-verdict.md) — **PASS (조건부)** |

## 사람이 결정해야 하는 것 (템플릿 Gate 3 진입 전)

전부 [gate-2-verdict.md](gate-2-verdict.md) §2에 모아 두었다. 요약:

- **D1** 템플릿 카피 ~25개 필드의 저장 위치 (V2 콘텐츠 파일 / Bridge 확장 / 혼합)
- **D2** 히어로 `<h1>`을 강좌명으로 둘지 마케팅 헤드라인으로 둘지 (SEO)
- **D3** `it_explan`/`it_head_html`/`it_tail_html` 기존 Legacy HTML의 처리
- **D4** 하네스 Gate 6(홈 컷오버) 이전에 이 작업을 진행할지 (AGENTS.md §9 "Gate 6 이전 리디자인 금지"와의 순서 충돌)
