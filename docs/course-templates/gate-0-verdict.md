# Gate 0 판정 — Source Discovery

작성일: 2026-10-15

## 판정: **PASS**

PASS 조건은 "필수 문서, 예시 HTML, 기존 Next.js 상세페이지의 실제 구현 위치와 역할이 확인되어야 한다"였다.
세 항목 모두 확인했다.

## 1. 수행 작업별 결과

| # | 작업 | 결과 | 근거 |
|---:|---|---|---|
| 1 | 9개 템플릿 MD 파일 존재·내용 확인 | **DONE** — 9개 전부 존재. 파일명이 예상과 다름 (전부 한글, 구분자 불일치) | `source-inventory.md` §1 |
| 2 | `docs/` 하위 HTML 전수 조사 | **DONE** — 3개뿐이며 모두 `HTML/` 안. 폴더 밖 관련 HTML 0건 | `source-inventory.md` §2 |
| 3 | HTML ↔ MD 구조 대조 | **DONE** — 섹션 순서·앵커·조건부 노출 **불일치 0건**. HTML은 자기추출형 React 번들 | `html-reference-map.md` §5 |
| 4 | 기존 상세페이지 라우트 | **DONE** — `src/app/courses/[id]/page.tsx` (ISR 300s) | `current-page-audit.md` §1 |
| 5 | 사용 중 React 컴포넌트 | **DONE** — 7개 + CSS 2개 | `source-inventory.md` §3 |
| 6 | 데이터 페칭·API 구조 | **DONE** — Contract 5종 / Adapter http·mock / `@/legacy/server` 경유 | `source-inventory.md` §4 |
| 7 | 강좌 유형 분류 방식 | **DONE (중요)** — **데이터 필드로는 없다.** `ca_id` 앞 2자리(`10`/`30`/`40`)로만 유도 가능 | `source-inventory.md` §5 |
| 8 | CSS·Tailwind·토큰 사용 방식 | **DONE** — **Tailwind 없음.** Bootstrap 5.3.2 + legacy CSS 미러 + `tokens.css` + CSS Modules | `source-inventory.md` §6 |
| 9 | 구매·로그인·SEO 구현 | **DONE** | `source-inventory.md` §7 |
| 10 | 운영 반영 여부 | **PARTIAL** — 레포·Vercel 배포는 존재. 메인 도메인 서빙 여부는 레포에서 확인 불가 | `source-inventory.md` §8 |

## 2. 핵심 발견 5가지

### F-1. 예시 HTML은 복사해서 쓸 수 있는 정적 HTML이 아니다
캔버스 자기추출형 번들(gzip+base64 → React 18 UMD + `dc-runtime`)이다. 세 파일의 JS는
바이트 단위로 동일하므로 **로직 재사용 가치는 0이고, 가져올 것은 마크업 구조와 공용 CSS 2.8KB뿐이다.**
추출해 보면 마크업은 깨끗하고 포팅이 기계적이다. → `html-reference-map.md`

### F-2. MD 문서와 프로토타입이 동기화되어 있다
HTML의 `data-props` 노브 12개가 wireframe.md §5 "캔버스 Tweaks" 표와 1:1로 일치한다.
**wireframe.md를 조건부 렌더링 명세로 신뢰할 수 있다.**

### F-3. 강좌 유형을 식별할 데이터가 Contract에 없다
`course-full.v1`의 `item.category`는 `{id, name, requiresCertification, requiresAdultCertification}`뿐이다.
유형 판정은 `ca_id` 접두사 규칙으로 V2 안에서 해야 한다. 이미 `siblings.ts`가
`categoryId.slice(0,4)`로 같은 종류의 접두사 로직을 쓰고 있어 선례가 있다.
**Bridge 변경 없이 해결 가능** → Gate 2 Template Resolver.

### F-4. 현재 페이지에 Eyebrow가 1건 있다
`CourseDetail.tsx:53`의 `<span className="hero_sub_title">논술런</span>`이
`<h1>` 바로 위 장식 라벨이다. 요청서 §3 금지 대상 → 제거.

### F-5. 템플릿이 요구하는 카피 필드가 현재 데이터 소스에 거의 없다
copy.md §7이 정의한 강좌별 필드 약 25~30개 중 Bridge가 주는 것은 6~8개뿐이다.
이것이 이 프로젝트 최대 리스크이며 Gate 1에서 전수 대조했다 → `gap-analysis.md` G-01.

## 3. BLOCKED 항목

**없다.** 참조 자료가 누락된 경로는 없었다.

요청서가 예상한 `design.md` / `copy.md` / `wireframe.md`라는 파일명은 존재하지 않지만,
같은 역할의 문서가 한글 파일명으로 9개 모두 있으므로 자료 누락이 아니라 **명명 차이**로 기록한다.
요청서 지시대로 파일을 이동·개명하지 않았다.

## 4. 사람 확인이 필요한 항목

| # | 항목 | 왜 레포에서 확인할 수 없는가 |
|---|---|---|
| A | `/courses/[id]`가 메인 도메인에서 실제로 서빙되는지 | Apache vhost 상태. 운영 서버 대상 명령은 AGENTS.md §9 금지. `pnpm smoke:prod` 또는 설정 확인은 사람 작업 |
| B | `ca_id` `20` 대역(상경논술?)의 존재와 템플릿 배정 | `src/content/static-pages.ts:162`에 계열명만 있고 `ca_id`가 없다 → `gap-analysis.md` G-07 |
| C | 운영 39개 강좌 각각의 `ca_id` 실제 분포 | Bridge 실응답 필요. 대표 강좌 3종 선정에 필요 |
| D | 브랜드 수치(4,005명·15만 부·98%) 기준일·산정 방식 | copy.md §9가 요구하는 확인. 외부 사실 |
| E | 합격증 34장 사용 동의·개인정보 가림 완료 여부 | 법무·운영 확인 |

A·C는 Gate 4(실데이터 바인딩) 전까지, B는 Gate 2 Resolver 확정 전까지,
D·E는 03 블록을 켜기 전까지 필요하다. **Gate 1~2 진행을 막지 않는다.**

## 5. 거버넌스 메모 — Gate 번호 충돌

이 작업은 프로젝트 하네스의 **Gate 8 (Public Frontend Migration — 강좌 상세)**에 해당하며
`docs/harness/GATES.md:37` 기준 `NOT STARTED`다. 하네스 Gate 6(홈 컷오버)과 7도 `NOT STARTED`다.

`AGENTS.md §9`는 "Gate 6 이전 리디자인 또는 클래스명 변경"을 금지 사항으로 못박고 있다.
이 프로젝트는 정의상 리디자인이므로 **순서 충돌이 있다.** 사람 결정 필요 → `gate-2-verdict.md` D4.
