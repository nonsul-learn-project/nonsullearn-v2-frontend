# ADR 0009 — Gate 6 컷오버 스위치 (`V2_ENFORCE_PROXY`)

상태: ACCEPTED (ADR 0006의 "Removed before Gate 4" 중 proxy secret 검사와 색인 정책을 되돌린다)
작성일: 2026-10-06

## Context

Gate 6은 홈을 메인 도메인에서 공개한다. 그 순간 두 가지가 동시에 필요하다.

1. Apache를 거치지 않고 Vercel 배포 URL로 직접 들어오는 요청을 막아야 한다. 안 막으면 origin이
   그대로 노출되고, Legacy와 같은 내용이 두 도메인에서 서빙된다.
2. 홈이 검색에 잡혀야 한다. 단 **메인 도메인 기준으로만** 잡혀야 한다.

ADR 0006은 Gate 4 전 단일 환경을 위해 둘 다 제거했다. 이제 되돌리되, 로컬·CI·Preview는 지금처럼
env 없이 빌드되고 통과해야 한다.

## Decision

스위치 하나(`V2_ENFORCE_PROXY`)로 둘을 같이 움직인다. `'true' | 'false'`이며 기본은 `'false'`다.

### proxy secret 검사 (`src/proxy.ts`)

- `V2_ENFORCE_PROXY='true'` **그리고** `V2_PROXY_SECRET`이 있을 때만 검사한다.
- `X-V2-Proxy-Secret`이 없거나 다르면 403. 본문 없음, `Cache-Control: no-store`,
  `X-Robots-Tag: noindex`. 받은 값도 기대값도 응답에 담지 않는다.
- 비교는 상수시간이다. Edge 런타임에 `node:crypto`의 `timingSafeEqual`이 없으므로 TextEncoder로
  바이트를 뽑아 길이와 내용을 XOR로 누산한다. 길이가 달라도 조기 종료하지 않는다.
- 예외: `/_next/static/*`, `/robots.txt`, `/api/v2-health`. 앞의 둘은 `config.matcher`에서도
  제외돼 있지만, matcher가 바뀌어도 자산과 진단 통로가 막히지 않도록 함수 안에서도 센다.
  `/api/v2-health`는 Apache 설정을 고치는 사람이 프록시 동작을 확인하는 유일한 통로다
  (HARNESS.md §6 스모크 S5/S6).

### 색인 (`src/app/page.tsx`)

- `V2_ENFORCE_PROXY='true'`일 때만 홈이 `robots: { index: true, follow: true }`와 canonical을
  내보낸다. 아니면 layout의 `noindex`를 그대로 상속한다.
- canonical 기준은 AGENTS.md §6.3대로 `NEXT_PUBLIC_SITE_URL`이며, 없으면
  `NEXT_PUBLIC_LEGACY_BASE_URL`(기본값 `https://nonsul-learn.com`)로 떨어진다. 즉 env를
  등록하지 않아도 `https://nonsul-learn.com/`이 나온다.
- `robots.txt`는 바꾸지 않는다. 전체 `Disallow: /` 그대로다.

## Why `V2_ENFORCE_PROXY=true` 인데 secret이 없으면 통과시키는가

secret은 Vercel에만 등록하고 로컬 `.env`에는 두지 않는다. env 스키마에서 secret을 강제하면
(`superRefine`) 스위치를 켠 설정을 로컬에서 재현하는 순간 빌드가 깨진다. 반대로 fail closed로
전부 403을 주면 env 하나 누락으로 V2 경로 전체가 죽는다.

따라서 "검사할 기준이 없으면 검사하지 않는다"로 간다. 대신 **운영에서 secret 누락이 조용히
보호를 꺼 버리는 위험**이 남는다. 이건 코드가 아니라 절차로 막는다 — Gate 6 스모크에서
`/api/v2-health`의 `proxied`와 Vercel 배포 URL 직접 호출 403을 사람이 확인한다.

## Consequences

- `V2_ENFORCE_PROXY`를 켜기 전에 Vercel에 `V2_PROXY_SECRET`을 먼저 등록해야 한다. 순서가 바뀌면
  보호 없이 색인만 열린다.
- `robots.txt`가 `Disallow: /`인 동안에는 크롤러가 홈을 가져가지 않으므로 `index` 메타는 실제
  효력이 없다. 컷오버 시점에 `src/app/robots.ts`를 여는 작업이 따로 필요하다.
- 스위치를 끄면 색인과 보호가 동시에 꺼진다. 롤백 시 둘이 어긋나지 않는다.
