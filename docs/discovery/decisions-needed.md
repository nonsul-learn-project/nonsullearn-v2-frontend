# Decisions Needed

작성일: 2026-10-02  
근거 파일: discovery evidence 전체 및 `GATES.md`  
상태: DECISION-NEEDED

| # | 질문 | 선택지 | 권장안과 이유 | 블로킹 Gate | 결정 시 기록 위치 |
|---:|---|---|---|---|---|
| 1 | 서버 용량 조치 | swap / worker 하향 / instance upgrade / 조합 | 측정 후 worker·timeout 조정 또는 upgrade; 911MB·swap 0 위험 | Gate 4 | `apache-readiness.md` |
| 2 | sudo 확보 | 비밀번호 확인 / 권한 부여 / 다른 계정 | 최소 권한 운영 계정 | Gate 4 | `apache-readiness.md` |
| 3 | SSH 키 전환 시점 | 즉시 / Gate 4 후 | 검증 가능한 키 전환 후 password auth 비활성화 | Gate 4 전 운영 안정성 | `SUMMARY.md` |
| 4 | kernel 재부팅 | 점검창 / 연기 | 7 사이트 영향 공지 후 점검창 | Gate 4 전 권장 | `SUMMARY.md` |
| 5 | Vercel plan | commercial plan 선택 | 상업적 사용 적합 플랜 확정 | Gate 1/4 | `gate-0.9.md` |
| 6 | origin domain | Vercel 기본 / 전용 origin | 운영 route와 secret 정책에 맞는 전용 origin | Gate 4 | `gate-0.9.md` |
| 7 | kill switch 경로 | 기존 제안 / 별도 경로 | 운영자·rollback 문서와 함께 확정 | Gate 4 | `gate-0.9.md` |
| 8 | 테스트 계정 2개 | 일반 / level 8 이상 | 최소 권한 검증 가능 계정 | Gate 3~5 | `gate-0.9.md` |
| 9 | visit 우회 | bridge 표식 / 최소 bootstrap | bridge 표식으로 visit/optimize 우회 | Gate 3 | `bridge-risks.md` |
| 10 | `displayName` 제외 | 제외 / 포함 | 제외; Header 비사용·PII 최소화 | Gate 3 | `viewer-contract-v1.md` |
| 11 | Gate 5 재정의 | parity 유지 / 신규 측정 도입 | 신규 도입으로 정의 수정; 현재 tracking 0건 | Gate 5 | `tracking-inventory.md` |
| 12 | 실제 session 만료/P5 | 40분 무동작 테스트 후 기준 수정 | 로그인 후 40분 무동작 새로고침으로 검증 | Gate 3/5 | `gate-0.9.md` |
| 13 | 전역 CORS `*` | 유지 / 축소 | V2와 분리해 보안 검토 후 축소 여부 결정 | Gate 4 전 권장 | `bridge-risks.md` |

F7 [추론]: 앱은 `gc_maxlifetime=10800`이나 `phpsessionclean`은 php.ini의 1440초 기준일 수 있어 실제 유휴 만료가 약 24분일 수 있다. 검증: 로그인 후 40분 무동작 뒤 새로고침. 근거: v2-discovery:B5,B12, local-audit:A4.
