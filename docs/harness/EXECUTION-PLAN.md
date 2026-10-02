# EXECUTION-PLAN.md — 논술런 V2 실행 순서

> 작성: 2026-10-01
> 기준 문서: `docs/harness/GATES.md` (Gate 번호, DoD), `docs/harness/HARNESS.md` (검증 L1~L6), `AGENTS.md` (작업 규칙)
> 이 문서는 **무엇을 어떤 순서로, 누가 하는지**만 다룬다. 통과 기준은 GATES.md가 단일 진실이다.

---

## 1. 핵심 원칙

> **SSH가 필요한 일과 필요 없는 일을 두 줄로 나눠 동시에 진행하고, 두 줄이 만나는 지점(Gate 3, Gate 4)에서만 서로를 기다린다.**

| 트랙 | 내용 | 작업 장소 | 주로 맡는 쪽 |
|---|---|---|---|
| **A. 레포 트랙** | Next.js, Design System, Contract, Adapter, 하네스 | `nonsullearn-v2-frontend` | AI 에이전트 (Claude Code / Codex) |
| **B. 서버 트랙** | 정보 수집, Bridge 배포, Apache 설정 | 운영 서버 + `nonsul-learn-html1` | **사람** (SSH, sudo) |

---

## 2. 전체 순서

```text
            [A. 레포 트랙: SSH 불필요]            [B. 서버 트랙: SSH 필요, 읽기 위주]
Step 0      문서 통합 (Codex)
Step 1      Gate 1 Foundation + 하네스           Gate 0.9 정보 수집
Step 2      Gate 2 기존 디자인 추출              Bridge PHP 작성 (Legacy 레포)
               └──────────── 합류 ────────────┘
Step 3      Gate 3 Legacy Integration   ← viewer, courses 실제 연결
Step 4      Gate 4 Production Routing   ← Apache 프록시 (preview 전용, kill switch)
Step 5      Gate 5 Tracking Parity & Homepage Internal Soak (preview 쿠키)
Step 6      Gate 6 Homepage Cutover (canary → 100%)
Step 7      Gate 7 Analytics 완성
Step 8      Gate 8 강좌 상세 (강좌별 반복)
Step 9~     Gate 9 Growth / Gate 10 Optional
```

---

## 3. 단계별 상세

| Step | Gate | 할 일 | 주로 맡을 쪽 | 완료 기준 |
|---|---|---|---|---|
| **0** | - | Gate 문서 통합 | Codex → 사람 리뷰 | 완료 확인 grep 6개 통과, `docs/harness/GATES.md` 하나만 남음 |
| **1-A** | Gate 1 | Next 프로젝트, env 검증, ESLint 경계, `src/legacy/` 골격, L1/L2 테스트, Vercel 연결 | 에이전트 | Preview URL에서 mock 페이지 동작, CI 통과 |
| **1-B** | Gate 0.9 | Header 필드, Apache/MPM/모듈, 추적 코드, Legacy URL 지도, 인스턴스 기준선 수집 | **사람** (SSH) | Gate 0.9 필수 항목 12개 채움 |
| **2-A** | Gate 2 | legacy 디자인 추출: Bootstrap+main.css 재사용, Header/Footer/MobileNav 컴포넌트화, visual parity 기준선 | 에이전트 | 3개 viewport Header/Footer/MobileNav visual parity 기준 확보 |
| **2-B** | Gate 3 준비 | `_bootstrap.php`, `viewer.php`, `courses.php`, 배포 스크립트 | 에이전트 작성, **배포는 사람** | Legacy 레포에 커밋, `php -l` 통과 |
| **3** | Gate 3 | Bridge 운영 배포, V2 adapter를 `http`로 전환 | 사람 (배포) + 에이전트 (연결) | 스모크 S1~S4 통과 |
| **4** | Gate 4 | Apache 프록시 설정, kill switch 시연 | **사람** (sudo) | S5~S9 통과, 특히 `cookieForwarded:false` |
| **5** | Gate 5 | Tracking Parity & Homepage Internal Soak: 홈 V2, 동일 추적 태그, preview 쿠키 내부 soak, 홈 → PHP 결제 UTM 연속성 | 에이전트 + 사람 (soak, 추적 확인) | P1~P12 및 visual parity 통과, soak 기간 오류 없음, 홈 → PHP 결제 흐름이 GA4에서 이어짐 |
| **6** | Gate 6 | Homepage Cutover: canary 공개(신규 방문자 일부) → 비율 확대 → 100% | 사람 (Apache 설정) + 에이전트 (지표 해석) | 단계마다 L6 경보 없음, 전환율 -20% 이내, 100% 후 7일간 롤백 없음 |
| **7** | Gate 7 | 전체 canonical event, provider 매핑, 채널별 전환 리포트 | 에이전트 | Gate 7 DoD |
| **8** | Gate 8 | 강좌 상세 ISR, 강좌별 parity와 301 | 에이전트 + 사람 (301, parity) | 강좌마다 Slice DoD |

### 합류 지점

| 합류 | 레포 트랙에서 필요한 것 | 서버 트랙에서 필요한 것 |
|---|---|---|
| **Gate 3** | Contract, fixture, http adapter, L1/L2 테스트 | Header 필드 확정(1-B), Bridge 배포(2-B) |
| **Gate 4** | `middleware.ts` origin 보호, `/api/v2-health`, 내부 확인용 페이지 `/_v2/check` (noindex), Vercel origin 도메인 | Apache 모듈/MPM 확인(1-B), sudo 권한 |

---

## 4. 순서를 이렇게 잡은 이유

1. **Step 1을 두 트랙으로 나눈 이유**
   Foundation은 서버 정보 없이도 끝까지 만들 수 있다. 반대로 Bridge와 프록시는 서버 정보가 없으면 확정할 수 없다. 기다리지 않고 동시에 시작하는 것이 가장 빠르다.

2. **Gate 4(프록시)를 홈보다 먼저 둔 이유**
   프록시가 가장 위험한 인프라 변경이다. 외부에 노출되지 않는 `/_v2/check`와 preview 쿠키로 먼저 검증하고, 실제 사용자가 보는 페이지는 그 다음에 올린다.

3. **별도 마케팅 랜딩은 없고 홈이 랜딩 역할이다**
   홈은 Gate 5/6에서 이전한다. 홈 이전 전 별도 랜딩으로 인프라를 미리 검증하는 단계가 없으므로 다음 두 가지로 위험을 줄인다.
   - **Gate 5 내부 soak:** 홈 V2를 preview 쿠키로 며칠간 직접 사용하면서 Header, 링크, 결제 이동, 추적을 확인한다.
   - **Gate 6 canary:** 신규 방문자 일부에게만 먼저 공개하고, 문제가 없으면 비율을 올린다.

4. **홈 → PHP 결제 attribution 연속성**
   광고 유입은 홈으로 들어오고 V2 홈이나 강좌 페이지를 거쳐 PHP 결제로 간다. UTM과 referrer가 두 시스템을 오가도 끊기지 않아야 한다. V2 attribution 쿠키는 메인 도메인 기준으로 쓰고, Legacy가 이미 남기는 값(있다면)과 충돌하지 않는지 Gate 0.9에서 확인한다.

---

## 5. 공통 운영 규칙

1. **운영 반영은 한 번에 Gate 하나.** 레포 작업은 앞서가도 되지만 서버 변경은 하나씩 한다.
2. **서버 작업은 항상 사람이 한다.** 에이전트는 명령 제안과 결과 해석까지만 한다.
3. **운영 반영 전에 롤백 방법을 먼저 확인한다.**

   | 대상 | 롤백 수단 |
   |---|---|
   | V2 경로 전체 | kill switch (`/etc/nonsulrun/v2.off`) — 즉시 |
   | Vercel 배포 | 이전 배포 promote |
   | Apache 설정 | vhost 백업 복원 → reload |
   | Bridge | tar 백업 복원 |

4. **반영은 서버 부하가 적은 시간대에.** 인강 사이트 접속이 몰리는 저녁 시간대는 피한다. EC2 과부하 이력이 있으므로 반영 전후 `free -m`, CPU 크레딧을 확인한다.
5. **모든 Gate 통과는 `docs/gates/<Gate ID>.md`에 증거를 남긴다.**

### Canary 설정 예시 (Gate 6, Apache 확인 후 확정)

```apache
# /etc/nonsulrun/home-bucket.txt  ← 비율 조정은 이 파일만 수정 (v2 1개 : legacy 9개 = 10%)
# b v2|legacy|legacy|legacy|legacy|legacy|legacy|legacy|legacy|legacy
RewriteMap homebucket "rnd:/etc/nonsulrun/home-bucket.txt"

# 버킷 쿠키가 없으면 배정 후 고정 (7일)
RewriteCond %{HTTP_COOKIE} !(^|;\s*)v2_home=
RewriteRule ^/?$ - [CO=v2_home:${homebucket:b}:.<메인도메인>:10080:/:secure:httponly,E=V2HOME:${homebucket:b}]

# v2 버킷이거나 preview 쿠키면 V2 홈 (kill switch 파일이 없을 때만)
RewriteCond /etc/nonsulrun/v2.off !-f
RewriteCond %{HTTP_COOKIE}#%{ENV:V2HOME} (^|;\s*)(v2_home=v2|v2_preview=1)|#v2$
RewriteRule ^/?$ https://v2-origin.<도메인>/ [P,L,E=V2PROXY:1]
```

- 방문자 단위로 고정되므로 같은 사람이 새로고침할 때마다 화면이 바뀌지 않는다.
- GA4에 `home_variant` 속성(v2/legacy)을 남겨 두 그룹의 전환율을 비교한다.
- **이 설정은 초안이다.** 실제 Apache 버전에서 `configtest`와 스테이징 확인 후 확정한다.

---

## 6. 지금 할 일 (2026-10-01 기준)

- [ ] **Step 0:** Codex에 문서 통합 요청 (`codex-prompt-merge-gates.md`)
- [ ] **Step 1-B:** 그동안 서버에서 Gate 0.9 수집 명령 실행
- [ ] Codex 결과 리뷰 → merge
- [ ] **Step 1-A:** Claude Code / Codex로 Gate 1 착수
- [ ] Gate 0.9 결과 공유 → `viewer.php` Contract, Apache 설정 초안을 실제 값으로 확정

---

## 7. 진행 현황판

| Step | Gate | 상태 | 시작 | 완료 | 메모 |
|---|---|---|---|---|---|
| - | Gate 0 | PASS | | | |
| - | Gate 0.5 | PASS | | | 잔여 항목은 Gate 0.9에서 처리 |
| 0 | 문서 통합 | NOT STARTED | | | |
| 1-A | Gate 1 | IN PROGRESS | 2026-10-02 | | 레포 트랙 완료 (`feat/gate-1-foundation`, 커밋 7개, 테스트 290 + L3 20). Vercel Preview 검증 대기 → `docs/gates/gate-1.md`, `docs/runbook/vercel-setup.md` |
| 1-B | Gate 0.9 | IN PROGRESS | | | |
| 2-A | Gate 2 | NOT STARTED | | | |
| 2-B | Gate 3 준비 | NOT STARTED | | | |
| 3 | Gate 3 | NOT STARTED | | | |
| 4 | Gate 4 | NOT STARTED | | | |
| 5 | Gate 5 (추적 parity + soak) | NOT STARTED | | | |
| 6 | Gate 6 (canary → 100%) | NOT STARTED | | | |
| 7 | Gate 7 | NOT STARTED | | | |
| 8 | Gate 8 | NOT STARTED | | | |
