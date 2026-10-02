# Gate 0.5 / 0.9 Discovery Summary — 2026-10-02

근거 파일: `local-audit-20261002-1033.txt`, `v2-discovery-20261002-1033.txt`, `http-20261002-1033.txt`, `manual-checks-20261002.md`  
상태: Gate 0.5 PASS, Gate 0.9 IN PROGRESS

## 판정

| Gate | 상태 | 한 줄 근거 |
|---|---|---|
| 0.5 | PASS (8/8) | Production boundary의 필수 8항목을 확인했다. |
| 0.9 | IN PROGRESS | 증거 수집은 완료됐으나 용량·권한·Vercel·테스트 계정·attribution 결정이 남았다. |

## 운영 환경 한눈에 보기

| 인스턴스 | 메모리 | 스왑 | OS | Apache/MPM | PHP/SAPI | DB | 세션 | TLS | 동거 사이트 수 | 웹 루트 | uptime |
|---|---:|---:|---|---|---|---|---|---|---:|---|---|
| t3.micro | 911MB (가용 238MB) | 0 | Ubuntu 24.04.4 | 2.4.58 prefork+itk | mod_php/apache2handler | MariaDB `nonsullearndb` | files `/var/lib/php/sessions` | LE, TLSv1.3 | 7 | `/home/nonsul-learn.com/html2` | 162일 |

근거: v2-discovery:B1,B2,B5,B6; http:H3; docs/production-discovery/11-v2-runtime-config-contract.md:5.

## 핵심 발견 Top 7

| # | 발견 | 영향 | 대응 | 근거 |
|---:|---|---|---|---|
| 1 | 11 핵심 파일 운영=baseline | 핵심 코드 결론은 DONE | hash 기준 유지 | manual:M1 |
| 2 | 911MB/스왑 0 vs 150 worker | Gate 4 안정성 위험 | 용량 결정 | v2-discovery:B1,B4 |
| 3 | proxy 모듈 미로드·sudo 미확정 | Apache proxy 불가 | 권한/모듈 준비 | v2-discovery:B2,B10 |
| 4 | 7 vhost 동거 | reload가 전 사이트 영향 | 점검창/rollback | v2-discovery:B2,B3 |
| 5 | session은 시스템 files | bridge/session parity 범위 확정 | 40분 idle 검증 | v2-discovery:B5,B6,B12 |
| 6 | `common.php` 부수효과 | viewer bridge 오염 가능 | bootstrap 우회 결정 | local-audit:A3, manual:M1 |
| 7 | tracking·UTM 0건 | Gate 5는 신규 측정 도입 | Gate 정의 결정 | local-audit:A8,A9, http:H6 |

## 위험 신호

| 단계 | 신호 | 근거 |
|---|---|---|
| 🔴 즉시 | 서버 재부팅 대기, SSH password auth, 메모리/worker 불균형 | manual:M4,M5; v2-discovery:B1,B4 |
| 🟡 Gate 4 전 | proxy 모듈·sudo·origin/kill switch·CORS 정책 미결정 | v2-discovery:B2,B10; manual:M3 |
| 🟢 참고 | 홈 TTFB 약 91ms, TLS/certbot 정상 근거 | http:H2,H3; v2-discovery:B12 |

## 남은 일

| 담당 | 일 | 블로킹 Gate |
|---|---|---|
| 사람/AWS 콘솔 | CloudWatch CPU credit·alarm 확인 | 0.9/4 |
| 운영 담당 | sudo, 키 전환, reboot 점검창 | 0.9/4 |
| 사업/운영 | Vercel plan, origin, kill switch | 0.9/4 |
| 사람 | 일반/level 8 이상 테스트 계정, session idle test | 0.9/3~5 |
| 설계 담당 | visitor 우회, displayName, Gate 5/CORS 결정 | 3~5 |

## 기존 문서와의 CONFLICT

| 기존 주장 | 이번 증거 | 처리 | 근거 |
|---|---|---|---|
| teacher asset 존재·배포 parity가 BLOCKING | 대상 asset HTTP 200, 11개 핵심 hash 일치 | CONFLICT: 기존 문서는 수정하지 않음; 이번 수집 기준으로 해소 | docs/production-discovery/04-homepage-runtime.md:18, manual:M1,M2 |
| session handler/path 및 live cookie가 BLOCKING | files `/var/lib/php/sessions`, HTTP Set-Cookie 확인 | CONFLICT: 기존 문서는 수정하지 않음; 실제 idle 만료는 별도 검증 필요 | docs/production-discovery/05-session-cookie-runtime.md:17, v2-discovery:B5,B6, http:H1 |
| vhost/TLS/rewrite topology가 BLOCKING | vhost, TLS, AllowOverride/MultiViews, `.htaccess` 수집 완료 | CONFLICT: 기존 문서는 수정하지 않음 | docs/production-discovery/08-gate-1.5-final-verdict.md:4, v2-discovery:B2,B3, http:H3 |

## 문서 지도

| 문서 | 내용 |
|---|---|
| `gates/gate-0.5.md` | Gate 0.5 8/8 PASS |
| `gates/gate-0.9.md` | prerequisite 표와 PASS 잔여 |
| `viewer-contract-v1.md` | viewer JSON 최소 contract |
| `bridge-risks.md` | common bootstrap 위험 |
| `legacy-url-map.md` | V2 handoff URL |
| `protected-routes.md` | proxy 금지 검증 목록 |
| `tracking-inventory.md` | tracking/UTM/cookie 현황 |
| `apache-readiness.md` | Gate 4 인프라 준비도 |
| `decisions-needed.md` | 사람의 결정 목록 |
