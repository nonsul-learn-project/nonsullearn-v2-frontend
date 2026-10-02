# Tracking / Attribution Inventory

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `http-20261002-1033.txt`, 기존 frontend audit  
상태: DONE

| 항목 | 결과 | 판정 | 근거 |
|---|---|---|---|
| GA4/GTM/Meta/Naver/Kakao | 파일 grep과 렌더링 홈에서 0건 | DONE | local-audit:A8, http:H6 |
| UTM 처리 | 0건 | DONE | local-audit:A9 |
| 검증 meta | Naver/Google verification 존재 | DONE-BASELINE | docs/frontend-migration-audit/08-seo-metadata-analytics.md:3 |

결론: Gate 5는 “추적 parity 유지”가 아니라 “측정 신규 도입”이다. 현 `GATES.md` Gate 5의 “Legacy와 동일 추적 tag” 요구와 충돌한다. Gate 정의 수정 여부를 결정해야 한다. [결정](decisions-needed.md#11-gate-5-재정의).

## 쿠키 충돌 검토

| 기존 이름/형태 | V2 attribution 영향 | 근거 |
|---|---|---|
| `PHPSESSID` | 예약; V2가 사용 금지 | http:H1, v2-discovery:B5 |
| `ck_it_id`, `ck_bn_id` | 동일 이름 사용 금지 | local-audit:A9 |
| `ck_itemlist...`, `ck_visit_ip`, `ck_mb_id`, `ck_auto` | `ck_` prefix 회피 권고 | local-audit:A9 |
| MD5 해시 이름 1일 쿠키 | 이름이 동적이므로 별도 고유 prefix 필요 | http:H1, local-audit:A9 |

[추론] V2 attribution은 명시적 고유 prefix와 host-only/domain 정책을 확정한 뒤 도입해야 한다. 검증: 구현 전 `Set-Cookie` 비교 및 PHP 랜딩→V2→checkout L5 흐름. 근거: local-audit:A9, http:H1.
