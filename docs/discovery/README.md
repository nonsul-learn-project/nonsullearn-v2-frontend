# Discovery 문서 인덱스

작성일: 2026-10-02  
근거 파일: 이 폴더의 수집 원본과 산출물  
상태: ACTIVE

| 경로 | 설명 |
|---|---|
| `local-audit-*.txt` | 로컬 baseline A1~A11 원본 |
| `v2-discovery-*.txt` | 운영 runtime B1~B12 원본 |
| `http-*.txt` / `home-assets.from-html.txt` | HTTP/TLS/asset 원본 |
| `manual-checks-20261002.md` | 사람이 제공한 수동 증거 원문 |
| `SUMMARY.md` | 첫 읽기용 요약 |
| `gates/` | Gate 0.5/0.9 판정 |
| 나머지 `.md` | contract, bridge, URL, route, tracking, Apache, 결정 문서 |

의존 관계: 원본 evidence → `manual-checks` 포함 → Gate 문서/주제 문서 → `SUMMARY.md`. 기존 분석과 겹치는 사실은 `docs/production-discovery/` 및 `docs/frontend-migration-audit/` 링크를 참조한다.

재수집은 `scripts/discovery/run-all.sh`를 사용한다. 새 파일 날짜가 다르면 이 폴더에서 최신 `local-audit-*`, `v2-discovery-*`, `http-*`를 선택하고, 수동 검증은 별도 원문 파일로 보존한다.
