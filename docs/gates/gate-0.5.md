# Gate 0.5 — Production Discovery

작성일: 2026-10-02  
근거 파일: `local-audit-20261002-1033.txt`, `v2-discovery-20261002-1033.txt`, `http-20261002-1033.txt`, `manual-checks-20261002.md`, 기존 `docs/production-discovery/`  
상태: PASS (8/8)

| 필수 조사 항목 | 결과 | 판정 | 근거 |
|---|---|---|---|
| web root | `/home/nonsul-learn.com/html2` | DONE | v2-discovery:B3, docs/production-discovery/03-upload-storage-inventory.md:103 |
| runtime | Apache 2.4.58 prefork+itk, mod_php | DONE | v2-discovery:B2 |
| database | Legacy MariaDB `nonsullearndb`, V2 직접 접속 금지 | DONE-BASELINE | docs/production-discovery/11-v2-runtime-config-contract.md:5 |
| session source | files, `/var/lib/php/sessions`; app `data/session` 미사용 | DONE | v2-discovery:B5,B6 |
| homepage execution path | `/` → `html2/index.php` → `common.php` → `_head.php`/`head.php` → `_tail.php`/`tail.php` | DONE | manual:M1, docs/production-discovery/04-homepage-runtime.md:8 |
| assets | seo/img 13, logo 2, teacher asset HTTP 200 | DONE | v2-discovery:B8, http:H5, manual:M2 |
| payment dependency | PG/결제 보호 경로 존재 | DONE-BASELINE | local-audit:A11 |
| runtime storage | PHP session 저장소와 `html2/data/session` 상태 기록 | DONE | v2-discovery:B5,B6 |

## 발견 사항

- `.htaccess`의 활성 RewriteRule은 없고 404는 `/index.php`로 내부 처리된다. `MultiViews`가 확장자 없는 URL을 해석한다. `Access-Control-Allow-Origin "*"`가 전역 설정되어 있다. Gate 4에서 V2 경로는 별도 처리해야 한다. 근거: manual:M3, v2-discovery:B3.
- 11개 핵심 파일은 운영과 baseline이 동일하다. 근거: manual:M1.
- TLS, Set-Cookie, teacher asset, vhost/Rewrite/Proxy 런타임 검증은 완료됐다. 근거: http:H1,H3, manual:M2, v2-discovery:B2,B3.
