# Bridge Bootstrap 위험

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `v2-discovery-20261002-1033.txt`, `manual-checks-20261002.md`  
상태: PARTIAL

| 위험 | 왜 문제인가 | `_bootstrap.php` 대응 선택지 | 남은 결정 | 근거 |
|---|---|---|---|---|
| 방문자 통계 | 매 viewer 호출이 `visit_insert.inc.php`를 실행해 방문자 수를 부풀릴 수 있음 | **권장:** bridge 요청 표식으로 insert 우회; 대안: 별도 최소 bootstrap | 우회 방식 승인 | html2/common.php:792, local-audit:A3, manual:M1 |
| DB optimize | 매 요청 `db_table.optimize.php`가 부하를 유발할 수 있음 | **권장:** bridge 표식으로 include 우회; 대안: 최소 bootstrap | 우회 방식 승인 | html2/common.php:796, local-audit:A3, manual:M1 |
| extend include | `extend/*.php`가 미확인 부수효과를 낼 수 있음 | full bootstrap 유지 후 audit, 또는 allowlist 최소 bootstrap | 실행 범위 | local-audit:A3, manual:M1 |
| redirect | `goto_url`이 JSON 대신 redirect할 수 있음 | output 시작 전 bridge mode에서 차단/포착; 대안: 검증된 정상 경로만 허용 | 오류 응답 규약 | html2/common.php:271,819, local-audit:A3, manual:M1 |
| output/header | `ob_start`, Content-Type/no-cache가 JSON 헤더를 덮을 수 있음 | **권장:** bootstrap 후 buffer 정리, bridge가 JSON 헤더를 마지막 설정 | 헤더 정책 | html2/common.php:823,827-833, local-audit:A3, manual:M1 |
| 404 fallback | bridge 미배포 경로가 404가 아니라 홈 HTML+404를 반환 | V2 adapter에서 content-type/status 검증; Apache V2 경로 명시 | Gate 4 route rule | manual:M3, v2-discovery:B3 |
| 전역 CORS | `Access-Control-Allow-Origin "*"`가 bridge에도 상속될 수 있음 | **권장:** `v2-api/.htaccess`에서 `Header unset Access-Control-Allow-Origin` 후 필요한 origin만 설정 | 사이트 전체 CORS 정책 | manual:M3, v2-discovery:B3 |
| 자원 | prefork 평균 23MB, 가용 238MB/스왑 0에서 viewer 호출이 PHP worker 압박 | 캐시 불가 viewer 호출을 최소화, timeout/worker 조정 후 L4 측정 | 용량 조치 | v2-discovery:B1,B4 |
| mpm_itk | 파일 소유자/실행 사용자 조건이 bridge 배포를 막을 수 있음 | 배포 전 owner/mode를 read-only 확인 | 배포 계정/권한 | v2-discovery:B2 |

[추론] F2 조합은 2026-10-01 SSH banner exchange timeout의 유력 원인이다. 검증: CloudWatch memory/CPU 그래프와 Apache error.log의 `MaxRequestWorkers` 경고 확인. 근거: v2-discovery:B1,B4,B11, manual:M6.
