# Viewer Contract v1

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `v2-discovery-20261002-1033.txt`, `manual-checks-20261002.md`  
상태: DONE

## 확정안

`displayName`은 Header가 사용하지 않으므로 제외를 권고한다. 불필요한 개인정보 노출과 contract drift를 줄인다. 근거: local-audit:A1,A2,A5, manual:M1.

```json
{ "v": 1, "authenticated": false }
{ "v": 1, "authenticated": true, "capabilities": { "correction": false, "admin": false } }
```

| canonical 필드 | Legacy 원본 | 판정 규칙 | 근거 |
|---|---|---|---|
| `authenticated` | `$member['mb_id']` | 값이 있으면 true | html2/head.php:88, local-audit:A1, manual:M1 |
| `capabilities.correction` | `$member['mb_level']` | `mb_level > 7` | html2/head.php:84-87, local-audit:A2, manual:M1 |
| `capabilities.admin` | `$is_admin` | truthy 여부 | local-audit:A2,A5, manual:M1 |

## 금지 필드

`mb_id`, 이메일, 연락처, 이름, 포인트, session ID. 근거: `GATES.md` Gate 3 Viewer 금지 필드, local-audit:A1.

## 열린 질문

`$is_admin`이 `super`/`group` 등 문자열일 때의 capability 의미: 현재 관리자 링크 노출과 동일하게 truthy로 할지 결정 필요. [결정 기록](decisions-needed.md#10-viewer-contract에서-displayname-제외-확정).
