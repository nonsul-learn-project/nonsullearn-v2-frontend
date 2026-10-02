# Runbook — Vercel 설정 (사람이 하는 작업)

> 작성: 2026-10-02 (Gate 1)
> 에이전트는 Vercel CLI 로 production 배포나 env 변경을 하지 않는다 (`CLAUDE.md` 실행 금지 표).
> 이 문서는 **사람이 순서대로 따라가는 절차서**다.

Gate 1 의 PASS CONDITION 은 "mock 기반 V2 페이지를 Vercel Preview 로 검증할 수 있다" 다.
**Production 배포는 이 단계에서 연결하지 않는다.**

---

## 1. 레포 import

1. Vercel 대시보드 → **Add New → Project** → GitHub 레포 `nonsul-learn-project/nonsullearn-v2-frontend` 선택
2. 확인할 것
   - **Framework Preset**: `Next.js` (자동 감지)
   - **Package Manager**: `pnpm` (자동 감지). 안 되면 수동 지정 — `package.json` 의 `packageManager` 가 버전을 고정한다
   - **Node.js Version**: `22.x` (`.nvmrc` 기준)
   - **Build Command / Output Directory**: 기본값 그대로
   - **Root Directory**: 비워 둔다
3. **첫 배포를 바로 실행하지 않는다.** env 를 먼저 등록한다 — 없으면 빌드가 실패한다
   (`src/env.*.ts` 가 import 시점에 검증한다).

---

## 2. 환경변수 등록

단일 진실은 레포의 [`.env.example`](../../.env.example) 이다. 아래 표는 그 파일을 환경별 값으로 채운 것이다.

`<메인도메인>` 과 `<origin도메인>` 은 Gate 0.9 결정 #6 에서 확정한다
(`docs/discovery/decisions-needed.md`). 확정 전에는 Production 열을 채우지 않는다.

| 변수 | Development | Preview | Production |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Preview URL 또는 `http://localhost:3000` | `https://<메인도메인>` |
| `NEXT_PUBLIC_LEGACY_BASE_URL` | (빈 문자열) | `https://<메인도메인>` | (빈 문자열) |
| `NEXT_PUBLIC_LEGACY_ASSET_HOST` | `localhost` | `<메인도메인>` | `<메인도메인>` |
| `NEXT_PUBLIC_VIEWER_SOURCE` | `mock` | `mock` | `http` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` | `false` | `false` → Gate 5 에서 `true` |
| `COURSE_SOURCE` | `mock` | `mock` → Gate 3 에서 `http` | `http` |
| `LEGACY_BRIDGE_BASE` | `http://localhost:3000/v2-api` | `https://<메인도메인>/v2-api` | `https://<메인도메인>/v2-api` |
| `LEGACY_BRIDGE_TIMEOUT_MS` | `3000` | `3000` | `3000` |
| `COURSE_REVALIDATE_SECONDS` | `300` | `300` | `300` |
| `V2_PROXY_SECRET` | mock이면 생략 가능 | mock이면 생략 가능 | Gate 4 전 `V2_RELEASE_GUARD=off`이면 생략 가능, Gate 4부터 **32자 이상** |
| `V2_ENFORCE_PROXY` | `false` | `false` | `false` (Production 은 자동 강제) |
| `V2_RELEASE_GUARD` | `off` | `off` | Gate 4 전 `off`, Gate 4 routing 검증부터 **`on`** |
| `VERCEL_ENV` | — | — | — (Vercel 이 자동 주입. **등록하지 않는다**) |
| `VERCEL_GIT_COMMIT_SHA` | — | — | — (Vercel 이 자동 주입. **등록하지 않는다**) |

### `V2_PROXY_SECRET` 생성

```bash
openssl rand -hex 32   # 64자 hex 출력 → 그대로 사용
```

- 이 값은 Apache vhost 의 `RequestHeader set X-V2-Proxy-Secret` 과 **정확히 같아야** 한다 (Gate 4).
- Vercel 과 Apache 양쪽에만 둔다. **레포, PR, 이슈, 채팅에 붙여넣지 않는다.**
- 유출되면 교체 순서: Vercel env 수정 → 재배포 → Apache vhost 수정 → `apachectl configtest` → reload.

### Production release guard

`V2_RELEASE_GUARD=off`가 기본값이다. 이는 Gate 1~3 동안 Production branch의 Vercel build가
환경변수 미등록 상태에서도 mock placeholder로 성공하도록 하는 임시 상태다. 빌드 로그에는
`[env] release guard OFF — Gate 4 전까지만 허용` 경고가 찍힌다. 외부 공개/route cutover에는
사용하면 안 된다.

Gate 4 routing 검증을 시작하기 전에 Production 환경변수를 모두 등록하고
`V2_RELEASE_GUARD=on`으로 바꾼다. 이때 아래 조합은 **빌드가 실패한다** (`src/env.server.ts`).
Vercel 로그에 `production env 금지 조합:` 으로 이유가 찍힌다.

- `NEXT_PUBLIC_VIEWER_SOURCE` 또는 `COURSE_SOURCE` 가 `http` 가 아님
- `V2_PROXY_SECRET` 이 32자 미만

`COURSE_SOURCE=http`이면 guard 상태와 무관하게 `LEGACY_BRIDGE_BASE`가 필요하다. http source는
`V2_PROXY_SECRET`도 16자 이상 필요하며, guard가 on인 Production에서는 32자 이상으로 강화된다.

### Preview 의 `COURSE_SOURCE`

`docs/harness/HARNESS.md` §9 는 Preview 의 course source 를 `http` 로 정한다.
그건 **Bridge 가 배포된 뒤**(Gate 3) 이야기다. Gate 1~2 동안 Preview 는 `mock` 이어야 한다.
Gate 3 에서 `courses.php` 배포를 확인한 뒤 Preview 값을 `http` 로 바꾸고, 바꾼 날짜를
`docs/gates/gate-3.md` 에 기록한다.

---

## 3. 배포 범위

| 항목 | Gate 1 에서 | 언제 |
|---|---|---|
| Preview 배포 (PR 마다) | **사용한다** | 지금 |
| Production 배포 | **연결하지 않는다** | Gate 4 이후, origin 도메인 확정 후 |
| 커스텀 도메인 (origin) | 등록하지 않는다 | Gate 4 |

Production 을 지금 연결하지 않는 이유: origin 도메인 체계가 Gate 0.9 결정 #6 대기 상태이고,
`V2_PROXY_SECRET` 을 Apache 양쪽에 맞춰 두지 않은 상태에서 origin 이 공개되면
`src/proxy.ts` 의 308 리디렉트가 의도대로 동작하는지 검증되지 않은 채 노출된다.

**Vercel 설정에서 할 것**: Settings → Git → Production Branch 를 `main` 으로 두되,
origin 도메인을 붙이기 전까지 Production 배포 URL 을 외부에 공유하지 않는다.

---

## 4. 플랜 확인

Gate 0.9 결정 #5 항목이다 (`docs/discovery/decisions-needed.md`).

- 논술런은 유료 강의를 판매하는 **상업적 서비스**다. Hobby 플랜은 상업적 사용이 허용되지 않는다.
- Gate 4(프록시) 전에 상업적 사용이 가능한 플랜으로 확정한다.
- 확정 결과를 `docs/gates/gate-0.9.md` 에 기록한다.

---

## 5. Preview URL 에서 확인할 것

Preview 배포가 올라오면 아래 5개를 직접 눈으로 본다.

| # | URL | 기대 |
|---|---|---|
| 1 | `/_v2/check` | 200. `V2 Check` 제목. Auth Area 가 **anonymous** (회원가입·로그인 링크) |
| 2 | `/_v2/check?viewer=corrector` | **첨삭제출현황** 링크가 보인다 |
| 3 | `/_v2/check?viewer=unavailable` | 에러 화면이 아니라 **로그인 버튼**이 보인다 |
| 4 | `/api/v2-health` | `{"proxied":false,"cookieForwarded":false,"sha":"<커밋>","env":"preview"}` |
| 5 | `/robots.txt` | `Disallow: /` — Preview 는 색인되지 않아야 한다 |

추가로 확인하면 좋은 것

- 개발자도구 Network 에서 `/api/v2-health` 응답에 **쿠키 값이나 헤더 원문이 없는지**
- 375px 폭에서 `/_v2/check` 에 **가로 스크롤이 없는지**
- `/does-not-exist` 가 404 페이지인지

1~5 중 하나라도 어긋나면 Gate 1 은 PASS 가 아니다. 결과를 `docs/gates/gate-1.md` 에 적는다.

---

## 6. 이 단계에서 하지 않는 것

- Apache vhost 수정 (Gate 4)
- `/v2-api/*.php` Bridge 배포 (Gate 3, `nonsul-learn-html1` 레포)
- 운영 도메인 DNS 변경 (Gate 4~6)
- 추적 ID 등록 (Gate 5)
- `pnpm smoke:prod` 실행 — Bridge 와 프록시가 없는 상태라 S1~S6, S9 가 실패하는 것이 정상이다
