# Gate 0.9 — Prerequisites

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `v2-discovery-20261002-1033.txt`, `http-20261002-1033.txt`, `manual-checks-20261002.md`, `../nonsullearn-v2-frontend/docs/harness/GATES.md`  
상태: IN PROGRESS (증거 수집 완료, 결정 대기)

| # | 필수 항목 | 결과 | 판정 | 근거 |
|---:|---|---|---|---|
| 1 | Header `$member`, `common.php` 부수효과 | 로그인 판별 `mb_id`, correction은 `mb_level > 7`, admin은 `$is_admin`; side effect 기록 완료 | DONE | local-audit:A1,A2,A3, manual:M1 |
| 2 | Apache/MPM/모듈/vhost/TLS/sudo | Apache·vhost·TLS 확인; proxy/proxy_http 미로드, sudo는 비밀번호 필요 | PARTIAL | v2-discovery:B2,B3,B10, http:H3; [결정](../decisions-needed.md#2-sudo-권한-확보-방법) |
| 3 | session cookie 이름·도메인 | `PHPSESSID`, host-only, `/`, Secure/HttpOnly; 일부 경로 SameSite=None | DONE | http:H1, v2-discovery:B9, local-audit:A4, manual:M1 |
| 4 | tracking 목록 | GA/GTM/Meta/Naver/Kakao 및 UTM 처리 0건 | DONE | local-audit:A8,A9, http:H6 |
| 5 | Legacy URL 지도 | `legacy-url-map.md`에 기록 | DONE | local-audit:A5, manual:M1, [지도](../legacy-url-map.md) |
| 6 | 메모리/CPU credit 기준선 및 CloudWatch alarm | 메모리/CPU 기준선 수집; CPU credit/CloudWatch alarm 미확인 | DECISION-NEEDED | v2-discovery:B1; [결정](../decisions-needed.md#1-서버-용량-조치) |
| 7 | Vercel plan, origin, kill switch | 모두 미결정 | DECISION-NEEDED | [결정](../decisions-needed.md#5-vercel-플랜) |
| 8 | 일반/첨삭 테스트 계정 | 미제공 | DECISION-NEEDED | [결정](../decisions-needed.md#8-테스트-계정-2개) |
| 9 | UTM/attribution 충돌 | Legacy UTM 처리 0건, 기존 쿠키 후보 기록; V2 이름/정책 미결정 | DECISION-NEEDED | local-audit:A9, [인벤토리](../tracking-inventory.md) |
| 10 | `shop/ajax.list.php` 재사용 | 인증 없이 HTML 출력; canonical API 부적합 | DONE | local-audit:A7, manual:M1 |

## PASS 조건 체크리스트

- [ ] CloudWatch CPU credit/메모리 alarm 기준과 서버 용량 조치를 결정한다.
- [ ] sudo 확보 방식, Vercel commercial plan, origin, kill switch를 결정한다.
- [ ] 일반/level 8 이상 테스트 계정을 제공한다.
- [ ] V2 attribution 쿠키 이름 및 Legacy와의 충돌 회피를 결정한다.

필수 사실의 증거는 확보됐지만 위 결정 없이는 Gate 1~6 runtime 검증을 추측 없이 수행할 수 없으므로 PASS가 아니다. 근거: `GATES.md` Gate 0.9 DoD/PASS CONDITION.
