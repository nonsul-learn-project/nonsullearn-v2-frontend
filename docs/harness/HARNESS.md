# HARNESS.md — Integration Harness 기준

> 하네스 = **V2와 Legacy 사이 연결이 깨졌을 때, 운영 전에 또는 운영 직후 즉시 알 수 있게 하는 검증 장치의 묶음.**
> 이 문서는 각 층의 위치, 실행 방법, Pass/Fail 기준을 정의한다. Gate 통과 조건은 [`GATES.md`](./GATES.md)다.

---

## 1. 층 구조

| 층 | 이름 | 언제 | 누가 | 대상 | Gate 통과 조건에서의 사용 | 실패 시 |
|---|---|---|---|---|---|---|
| **L1** | Contract | 매 커밋 (CI) | 자동 | fixture ⇄ zod schema | Gate 1, Gate 3, 적용 Slice | merge 차단 |
| **L2** | Component | 매 커밋 (CI) | 자동 | mock 시나리오별 UI | Gate 1~3, 적용 Slice | merge 차단 |
| **L3** | Preview E2E | PR (Vercel Preview) | 자동 | 페이지 렌더, SEO, 모바일 | Gate 1~2, 적용 Slice | merge 차단 |
| **L4** | Smoke | 배포 직후 | 사람 실행 (스크립트) | 운영 Bridge + Proxy + Legacy 무영향 | Gate 3~6 | 즉시 롤백 / kill switch |
| **L5** | Parity | 컷오버 전 | 사람 (체크리스트) | Legacy 화면 vs V2 화면 | Gate 5 홈 P1~P12, Gate 6, Gate 8 | 컷오버 금지 |
| **L6** | Monitor | 운영 상시 | 경보 | 오류율, 성능, EC2 리소스 | Gate 5 soak, Gate 6 canary, Gate 9 | 조사 → 필요 시 kill switch |

원칙:
- **아래 층이 깨진 상태로 위 층을 진행하지 않는다.**
- 하네스 기준 완화(테스트 삭제, skip, 임계값 상향)는 `docs/decisions/`에 ADR을 남긴 경우에만.

---

## 2. 단일 진실: Fixture

```text
src/legacy/contracts/fixtures/
├── viewer.anonymous.json
├── viewer.member.json
├── viewer.corrector.json
├── viewer.invalid.has-mb_id.json        ← 반드시 parse 실패해야 함
├── viewer.invalid.wrong-version.json    ← 반드시 parse 실패해야 함
├── course.on-sale.json
├── course.sold-out.json
├── course.list.json
└── course.invalid.extra-field.json
```

규칙:
- 파일명: `<contract>.<scenario>.json`, 실패해야 하는 것은 `<contract>.invalid.<reason>.json`.
- mock adapter, L1 테스트, L4 스모크(key 비교)가 **모두 같은 fixture를 사용**한다.
- 실제 Bridge 응답이 바뀌면 fixture를 먼저 고치는 것이 아니라, **Contract 변경 여부를 판단**하고 버전 정책(`AGENTS.md` §7.2)을 따른다.
- fixture에 실제 회원 정보 금지. 이름은 `테스트회원` 등 가상값.

---

## 3. L1 — Contract

**위치:** `tests/contract/*.test.ts` · **실행:** `pnpm test:contract`

| 검사 | Pass 조건 |
|---|---|
| 정상 fixture | 모든 `<contract>.<scenario>.json`이 schema parse 성공 |
| invalid fixture | 모든 `*.invalid.*.json`이 parse **실패** |
| strict | schema가 `.strict()` — 알 수 없는 필드 거부 |
| 금지 필드 | `mb_id`, `mb_email`, `mb_hp`, `mb_password`, `it_*` 원본 컬럼명이 schema에 없음 |
| 버전 | `v` 필드가 `z.literal(<현재 버전>)` |
| 커버리지 | 모든 contract에 정상 1개 이상 + invalid 1개 이상 fixture 존재 (테스트가 자동 검사) |

```ts
// tests/contract/fixtures.test.ts (골격)
const files = glob.sync('src/legacy/contracts/fixtures/*.json');
for (const f of files) {
  const [contract, scenario] = path.basename(f, '.json').split(/\.(.+)/);
  const schema = schemas[contract];
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  test(`${contract}/${scenario}`, () => {
    const r = schema.safeParse(data);
    expect(r.success).toBe(!scenario.startsWith('invalid'));
  });
}
```

---

## 4. L2 — Component

**위치:** `tests/component/*.test.tsx` · **실행:** `pnpm test:component` (Vitest + Testing Library)

### viewer (`features/header/AuthArea`)

| 시나리오 | Pass 조건 |
|---|---|
| `loading` | skeleton 렌더, 고정 폭(레이아웃 이동 없음) |
| `anonymous` | 로그인 링크 = `legacyRoutes.login(현재경로)` |
| `member` | 정보수정·로그아웃 링크 |
| `corrector` | 첨삭 메뉴 노출 |
| `member`(비첨삭) | 첨삭 메뉴 **미노출** |
| `unavailable` | 로그인 버튼 노출, 에러 UI 없음, `track('bridge_error')` 1회 |

### course (`features/course-detail`)

| 시나리오 | Pass 조건 |
|---|---|
| `on-sale` | 가격 표시, CTA href = `legacyRoutes.checkout(id)`, 클릭 시 `begin_checkout` |
| `sold-out` | CTA 비활성 + 안내 문구 |
| `missing` | 페이지가 `notFound()` 호출 |
| `error` | 마지막 성공 데이터 또는 안내, 페이지 crash 없음 |

### analytics

| 검사 | Pass 조건 |
|---|---|
| canonical 이름 | `events.ts`에 없는 이벤트명으로 `track()` 호출 시 타입 에러 |
| disabled | `ANALYTICS_ENABLED=false`면 provider 호출 0회 |
| UTM | `?utm_source=x` 첫 진입 시 attribution 쿠키 기록, 재진입 시 덮어쓰지 않음(first-touch) |

---

## 5. L3 — Preview E2E

**위치:** `tests/e2e/*.spec.ts` · **실행:** `pnpm test:e2e` (로컬 mock) / PR에서 Vercel Preview URL 대상

| 검사 | 대상 | Pass 조건 |
|---|---|---|
| 렌더 | `/`, `/_v2/check`, `/courses/<sample>` | HTTP 200, 콘솔 error 0 |
| SEO | 위 페이지 | `<title>`, description, OG, **canonical이 `NEXT_PUBLIC_SITE_URL` 기준** |
| robots | `/robots.txt` | Production만 allow, Preview는 disallow |
| 모바일 | 375×812 | `document.scrollingElement.scrollWidth <= 375` |
| Handoff | 로그인 링크, CTA | href가 `NEXT_PUBLIC_LEGACY_BASE_URL` + Legacy 경로 |
| 404 | `/courses/does-not-exist` | 404 페이지 |
| 성능 (참고) | Lighthouse 모바일 | 성능 점수 80 이상 (경고, 차단 아님) |

---

## 6. L4 — Smoke (운영)

**위치:** `scripts/smoke-prod.sh` · **실행:** `pnpm smoke:prod` (사람만, 배포 직후)
**대상 env:** `SMOKE_BASE_URL`, `SMOKE_ORIGIN_URL`, (선택) `SMOKE_PHPSESSID`

| # | 검사 | Pass 조건 |
|---|---|---|
| S1 | `GET /v2-api/viewer.php` (쿠키 없음) | 200, JSON, `v==1`, `authenticated==false` |
| S2 | viewer 헤더 | `Cache-Control: no-store`, `Content-Type: application/json` |
| S3 | `POST /v2-api/viewer.php` | 200 아님 |
| S4 | `GET /v2-api/courses.php` | 200, `v==1`, `items` 배열, key 집합 = fixture key 집합 |
| S5 | `GET /api/v2-health` (preview 쿠키) | `proxied==true` |
| S6 | `GET /api/v2-health` + `PHPSESSID=dummy` 쿠키 | **`cookieForwarded==false`** |
| S7 | `GET /bbs/login.php` | 200 (Legacy 무영향) |
| S8 | `GET /shop/` | 200 또는 30x |
| S9 | `GET <origin>/` 직접 | 메인 도메인으로 308 또는 `X-Robots-Tag: noindex` |
| S10 | `/_v2/check` TTFB | 600ms 이하 (3회 중 중앙값) |
| S11 | (선택) 테스트 계정 viewer | `authenticated==true`, `mb_id` 키 없음 |

- **S1~S9 중 하나라도 실패 → 배포 실패.** Bridge 문제면 Bridge 롤백, Proxy 문제면 kill switch 또는 vhost 롤백.
- S10 실패는 경고. 2회 연속이면 조사.
- 결과는 `docs/gates/<gate>.md`에 실행 시각과 함께 붙인다.

---

## Visual Parity — Gate 2 / Gate 5

**실행:** `pnpm test:visual`

**legacy 기준 이미지:** `tests/visual/baseline/legacy/`
**legacy 캡처:** `scripts/capture-legacy-baseline.ts`를 사람이 운영 도메인에 대해 1회 실행해 기준 이미지를 커밋한다. 에이전트는 운영 도메인에 반복 요청하지 않는다.

| 대상 Gate | 화면 | viewport |
|---|---|---|
| Gate 2 | Header, Footer, 열린 MobileNav | 375×812, 768×1024, 1440×900 |
| Gate 5 | 홈 전체 | 375×812, 768×1024, 1440×900 |

캡처 전 carousel 자동 전환과 animation을 정지한다. 초기 허용치는 `maxDiffPixelRatio: 2%`이며 **TBD-조정 가능**이다. 허용치를 초과하면 Gate 2에서는 merge 차단이 아닌 diff 이미지를 PR에 첨부한 리뷰 필수, Gate 6 컷오버에서는 필수 통과다.

## 7. L5 — Parity (컷오버 전)

**기록:** `docs/parity/<page>.md` (아래 템플릿 복사)
**방법:** 브라우저에 `v2_preview=1` 쿠키를 설정하고 Legacy와 V2를 나란히 비교.

```md
# Parity — <page> (<날짜>, <확인자>)

| # | 시나리오 | Legacy | V2 | 결과 | 메모 |
|---|---|---|---|---|---|
| P1 | 비로그인 → 로그인 → 원래 페이지 복귀 | | | ☐ | |
| P2 | 일반 회원 Header (이름, 로그아웃) | | | ☐ | |
| P3 | 첨삭 권한 회원 Header / 메뉴 | | | ☐ | |
| P4 | 로그아웃 후 비로그인 표시 | | | ☐ | |
| P5 | 세션 만료(3h) 후 비로그인 표시 | | | ☐ | |
| P6 | Bridge 차단 시 사이트 정상 + 로그인 버튼 | - | | ☐ | |
| P7 | kill switch 시 Legacy 화면 즉시 복귀 | - | | ☐ | |
| P8 | 모바일 내비게이션 전 메뉴 | | | ☐ | |
| P9 | 주요 링크 전수 (Header, Footer, CTA) 목적지 일치 | | | ☐ | |
| P10 | CTA → Legacy 결제 → **결제 완료** (테스트 결제/0원 상품) | | | ☐ | |
| P11 | GA4 실시간 / Meta Pixel Helper / Naver 전환 이벤트 수신 | | | ☐ | |
| P12 | UTM 진입 → 결제 페이지에서 attribution 쿠키 읽힘 | - | | ☐ | |
| P13 | (강좌) 기존 URL → 새 URL 301 | | - | ☐ | |
| P14 | 콘텐츠 차이 (의도된 변경 목록과 일치) | | | ☐ | |
| P15 | Footer 법적 표시 사항 글자 단위 일치 | | | ☐ | |
| P16 | 3개 viewport visual diff 허용치 이내 | | | ☐ | |
```

- 페이지 유형별 필수 항목: 홈 = P1~P12, P15~P16 / 강좌 = 전 항목. 별도 마케팅 랜딩은 없으며 홈이 parity 대상이다.
- **필수 항목 전부 ☑ 전 컷오버 금지.**

---

## 8. L6 — Monitor (운영)

| 지표 | 출처 | 경보 기준 (초기값) | 대응 |
|---|---|---|---|
| `bridge_error` / viewer 호출 | GA4 | 1% 초과 (1시간) | Bridge 응답, EC2 상태 확인 |
| Vercel 5xx 비율 | Vercel | 1% 초과 (5분) | 최근 배포 롤백 |
| Apache 502/504 | Apache 로그 | 발생 | Vercel 상태 확인, 필요 시 kill switch |
| EC2 상태 검사 실패 | CloudWatch | 1회 | 즉시 대응 (재부팅 등) |
| CPU 크레딧 잔액 | CloudWatch | 기준선의 20% 미만 | 원인 조사, 사양 검토 |
| 메모리 사용률 | CloudWatch Agent / `free -m` | 85% 초과 | 원인 조사 |
| LCP (모바일, p75) | Vercel Analytics / CrUX | 2.5초 초과 | 성능 개선 작업 |
| CLS (p75) | 동일 | 0.1 초과 | 레이아웃 수정 |
| 전환율 | GA4 | 컷오버 전 7일 평균 대비 -20% 이상 (3일) | 원인 분석, 필요 시 롤백 |

---

## 9. 환경별 하네스 동작

| | 로컬 | Vercel Preview | Production |
|---|---|---|---|
| viewer source | mock | mock | http |
| course source | mock | mock (Gate 3 전까지) | http |
| L1, L2 | ○ | ○ (CI) | - |
| L3 | ○ (mock) | ○ | - |
| L4 | - | - | ○ |
| L5 | - | - | ○ (Gate 5 내부 soak 및 Gate 6 canary 전 preview 쿠키) |
| L6 | - | - | ○ |

---

## 10. 하네스 변경 절차

1. 변경 이유를 `docs/decisions/NNNN-harness-<주제>.md`에 기록 (무엇을, 왜, 위험).
2. 이 문서 갱신.
3. PR 제목에 `[harness]`. AI 에이전트는 이 변경을 단독으로 하지 않는다.
