# 논술런 V2 — 구현 계획서: 방식 1 (Apache 정문 + Vercel) (v0.2)

> 작성: 2026-10-01
> 짝 문서: `03-prerequisites-and-harness.md` (준비물, 하네스 기준), `01-php-bridge-design.md` (Bridge 상세)

---

## 1. 목표와 범위

**목표:** 결제, 로그인, 강의실 및 마케팅 랜딩을 건드리지 않고 **홈 → 강좌 상세** 순서로 V2(Next.js on Vercel)를 메인 도메인에 올린다.

| 포함 | 제외 (PHP Handoff 유지) |
|---|---|
| 홈 `/`, 강좌 상세 `/courses/*` | 마케팅 랜딩, 로그인, 회원가입, 세션 |
| 홈 `/` | 장바구니, 결제, PG callback |
| 강좌 상세 `/courses/*` (ISR) | 강의 재생, 내 강의실, LMS |
| Header 로그인 상태 (viewer) | 첨삭, 관리자 |
| 추적 / Attribution | 파일 업로드 |

### 왜 랜딩부터인가

새 랜딩 페이지는 **기존 화면과 비교할 대상(parity)이 없어서** 가장 위험이 낮다. 프록시, Bridge, 추적, kill switch를 실제 트래픽으로 먼저 검증한 뒤 홈과 강좌 상세를 옮긴다.

---

## 2. 구성 요소별 설계

### 2.1 Apache (정문)

```apache
# vhost(443) 안. 필요 모듈: rewrite, proxy, proxy_http, ssl, headers
SSLProxyEngine On
ProxyPreserveHost Off                       # Vercel은 자기 도메인 Host로 라우팅
ProxyTimeout 15

<Proxy "https://v2-origin.<도메인>/">
    ProxySet keepalive=On connectiontimeout=5 timeout=15
</Proxy>

RewriteEngine On

# ── kill switch: 파일이 있으면 아래 V2 규칙 전부 무시 (reload 불필요)
RewriteCond /etc/nonsulrun/v2.off -f
RewriteRule ^ - [S=3]

# ── V2 정적 자산 (항상)
RewriteRule ^/_next/(.*)$ https://v2-origin.<도메인>/_next/$1 [P,L,E=V2PROXY:1]

# ── 내부 확인, 강좌 (마케팅 랜딩은 PHP 유지)
RewriteRule ^/(_v2/check|courses/.*|api/v2-health)$ https://v2-origin.<도메인>/$1 [P,L,E=V2PROXY:1]

# ── 홈: 컷오버 전에는 preview 쿠키가 있을 때만
RewriteCond %{HTTP_COOKIE} (^|;\s*)v2_preview=1
RewriteRule ^/?$ https://v2-origin.<도메인>/ [P,L,E=V2PROXY:1]

# ── 프록시 요청에만 적용되는 헤더
RequestHeader unset Cookie                       env=V2PROXY   # PHP 세션을 Vercel로 보내지 않음
RequestHeader set   X-V2-Proxy-Secret "<비밀값>"  env=V2PROXY   # origin 직접 접근 차단용
RequestHeader set   X-Forwarded-Host  "<메인 도메인>" env=V2PROXY
ProxyPassReverse / https://v2-origin.<도메인>/
```

운영 조작:

| 조작 | 명령 | 반영 |
|---|---|---|
| V2 전체 끄기 | `sudo touch /etc/nonsulrun/v2.off` | 즉시 |
| V2 다시 켜기 | `sudo rm /etc/nonsulrun/v2.off` | 즉시 |
| 홈 컷오버 | 홈 규칙의 `RewriteCond` 줄 삭제 → `apachectl configtest && sudo systemctl reload apache2` | reload |
| 설정 롤백 | vhost 백업본 복원 → reload | reload |

주의:
- **`RequestHeader ... env=` 와 `[P]` 조합은 실제 Apache 버전에서 동작 확인이 필요하다.** 스모크의 `cookieForwarded:false` 검사가 이를 검증한다.
- MPM이 prefork라면 프록시 요청도 PHP가 로드된 프로세스를 점유한다. 랜딩 트래픽이 큰 광고 집행 전에 `MaxRequestWorkers`와 메모리 여유를 확인한다.
- `/_next/static/*`은 Vercel이 장기 캐시 헤더를 주므로 브라우저 캐시로 대부분 해결된다.

### 2.2 Vercel / Next.js

```text
Framework   Next.js (App Router, 최신 안정 버전), TypeScript strict
Region      icn1 (서울)
Domains     v2-origin.<도메인> → Production
Env         NEXT_PUBLIC_SITE_URL=https://<메인 도메인>
            LEGACY_BRIDGE_BASE=https://<메인 도메인>/v2-api
            V2_PROXY_SECRET=<Apache와 동일>
            NEXT_PUBLIC_VIEWER_SOURCE=http   (Preview 환경은 mock)
```

**Origin 보호 (middleware):**

```ts
// src/middleware.ts
export function middleware(req: NextRequest) {
  const viaProxy = req.headers.get('x-v2-proxy-secret') === process.env.V2_PROXY_SECRET;
  if (!viaProxy && process.env.VERCEL_ENV === 'production') {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, process.env.NEXT_PUBLIC_SITE_URL);
    return NextResponse.redirect(url, 308);
  }
  const res = NextResponse.next();
  if (!viaProxy) res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}
```

**메타데이터:** `metadataBase = NEXT_PUBLIC_SITE_URL`. canonical, OG URL, sitemap 모두 메인 도메인 기준.

**진단 endpoint (`/api/v2-health`):**

```ts
export const dynamic = 'force-dynamic';
export function GET(req: Request) {
  return Response.json({
    proxied: req.headers.get('x-v2-proxy-secret') === process.env.V2_PROXY_SECRET,
    cookieForwarded: req.headers.has('cookie'),
    sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
```

**이미지:** Legacy 공개 자산(`/data/...`)은 `next.config`의 `images.remotePatterns`에 메인 도메인을 등록해서 사용.

### 2.3 PHP Bridge (2개)

`01-php-bridge-design.md`의 `_bootstrap.php`, 배포 스크립트를 그대로 쓰고, endpoint를 하나 추가한다.

| Endpoint | 호출자 | 쿠키 | 캐시 | 내용 |
|---|---|---|---|---|
| `viewer.php` | **브라우저** (same-origin) | PHP 세션 사용 | `no-store, private` | 로그인 여부, 표시 이름, capabilities |
| `courses.php` | **Vercel 서버** (ISR) | 사용 안 함 | `public, max-age=60` | 판매 중 강좌 목록 / 단건 공개 정보 |

`courses.php` 설계 메모:
- **공개 정보만:** 제목, 요약, 강사, 대표 이미지, 정가/판매가, 판매 상태, Legacy 결제 시작 URL 파라미터.
- **판매 상태와 가격은 PHP의 기존 함수 결과를 그대로 사용.** 테이블을 직접 해석해서 재계산하지 않는다 (품절, 판매기간, 회원 등급별 가격 등 hidden semantics 보존).
- 회원별 가격이나 수강 여부처럼 **사람마다 다른 값은 넣지 않는다.** 필요하면 나중에 브라우저용 `course-access.php`를 별도로 만든다.
- 기존 `shop/ajax.list.php`가 같은 정보를 이미 주는지 먼저 확인한다 (Existing Endpoint First).

`viewer.php`는 `common.php`를 타기 때문에 매 페이지뷰마다 EC2에 PHP + DB 요청이 생긴다. 랜딩 광고 트래픽이 크다면 **랜딩에서는 Header auth 영역을 아예 빼거나**, 스크롤/상호작용 후 지연 호출하는 것을 기본으로 한다.

### 2.4 Next.js 내부 구조

`03` 문서 §2.1 구조를 따른다. 핵심 규칙만 다시 적는다.

- `app/`, `features/`, `components/`는 `@/legacy` index만 import (ESLint `no-restricted-imports`로 강제).
- Legacy URL 문자열은 `legacy/handoff/routes.ts`에만 존재.
- UI는 `level` 숫자를 모르고 `can.correction`만 본다.
- Bridge 실패는 예외가 아니라 상태(`unavailable`)다. 페이지가 깨지지 않는다.

**강좌 상세 페이지:**

```ts
// src/app/courses/[id]/page.tsx
export const revalidate = 300;                     // 5분 ISR
export async function generateStaticParams() { return []; }   // 첫 요청 시 생성

export default async function CoursePage({ params }) {
  const course = await getCourse(params.id);      // adapter → bridge-server → courses.php
  if (!course) notFound();
  return <CourseDetail course={course} />;        // CTA href = legacyRoutes.checkout(course.id)
}
```

Bridge가 죽어 있을 때 ISR은 **마지막으로 성공한 페이지를 계속 보여준다.** 이게 EC2 장애 시 V2 강좌 페이지가 버티는 방식이다.

### 2.5 추적 (Gate 2를 컷오버 조건으로 당김)

홈과 강좌 상세는 이미 광고 유입과 전환 측정이 걸려 있다. V2로 바꾸는 순간 추적이 끊기면 마케팅 데이터가 비므로, **컷오버 전에 최소 추적 parity를 확보한다.**

1. 현재 Legacy에 심어진 태그 목록화 (03 §1.2)
2. V2에 동일 태그를 `src/analytics/`의 `track()` 경유로 심기
3. 최소 canonical event: `page_view`, `cta_click`, `course_view`, `begin_checkout`(Legacy 결제로 넘어가는 순간)
4. `purchase`는 Legacy 결제 완료 페이지에 이미 있는 태그를 유지 (V2가 건드리지 않음)
5. UTM은 V2에서 first-party 쿠키로 저장 → Legacy 결제 페이지에서도 읽을 수 있게 **메인 도메인 쿠키**로 기록

---

## 3. 실행 단계

### Phase 0. 사전 준비 (SSH 읽기 작업, 반나절)

- [ ] `03` 문서 §1 체크리스트 전부 수집
- [ ] Vercel 플랜, origin 도메인, URL 체계 결정
- [ ] 운영 서버 상태 기준선 기록, CloudWatch 경보 2개(상태 검사 실패, CPU 크레딧) 설정

**종료 조건:** 체크리스트 전부 ☑

### Phase 1. Foundation (SSH 불필요)

- [ ] Next.js 프로젝트 생성, TS strict, ESLint boundary 규칙, Vitest, Playwright
- [ ] Vercel 연결, 리전 `icn1`, env 설정, `v2-origin` 도메인 연결
- [ ] middleware (origin 보호), `/api/v2-health`, metadataBase
- [ ] `src/legacy/` 골격: contracts + fixtures + mock adapter + handoff routes
- [ ] L1, L2 테스트 CI 연결 (GitHub Actions 또는 Vercel 빌드 단계)

**종료 조건:** Vercel Preview에서 mock 데이터로 `/_v2/check`, `/courses/sample` 렌더링, CI 통과

### Phase 2. Bridge (SSH 필요)

- [ ] `common.php` 부수효과 확인 → `_bootstrap.php` 확정
- [ ] `viewer.php`, `courses.php` 작성 → `deploy-bridge.sh`로 배포
- [ ] L4 Bridge 스모크 통과
- [ ] V2 adapter를 `http`로 전환 (Production env)

**종료 조건:** 메인 도메인에서 `/v2-api/viewer.php`, `/v2-api/courses.php` 정상 응답, Legacy 영향 없음

### Phase 3. Proxy 개통 (SSH + sudo)

- [ ] vhost 백업 → §2.1 설정 추가 (홈 규칙은 preview 쿠키 조건 유지)
- [ ] `apachectl configtest` → reload
- [ ] L4 전체 스모크 (특히 `cookieForwarded:false`)
- [ ] **kill switch 시연:** `touch v2.off` → `/_v2/check`이 Legacy로 복귀하는지 → `rm` 후 복귀

**종료 조건:** L4 전체 통과, kill switch 동작 확인

### Phase 4. 홈 내부 soak (preview 쿠키)

- [ ] 홈 V2, 추적 태그 + UTM 저장, CTA → Legacy 결제 URL 확인
- [ ] PHP 마케팅 랜딩 → V2 홈/강좌 → PHP 결제 attribution 연속성 확인
- [ ] preview 쿠키로 L5 P1~P12 및 내부 soak

**종료 조건:** L5 P1~P12 통과, 추적 parity와 attribution 연속성 확인

### Phase 5. Homepage 컷오버

- [ ] 홈 V2 제작 (Header viewer 포함)
- [ ] preview 쿠키로 L5 체크리스트 전부 통과
- [ ] 홈 규칙 `RewriteCond` 제거 → reload
- [ ] 24시간 L6 관찰, 이상 시 kill switch

### Phase 6. Course Detail (강좌별 점진)

- [ ] `/courses/[id]` ISR 페이지, CTA = Legacy 결제 시작
- [ ] 강좌 1개 선택 → L5 (결제 완료까지) → Legacy 상세 URL 301
  ```apache
  RewriteCond %{QUERY_STRING} (^|&)it_id=(<강좌ID>)(&|$)
  RewriteRule ^/shop/item\.php$ /courses/%2? [R=301,L]
  ```
- [ ] 문제 없으면 강좌를 순차 추가 (301 대상 목록을 Apache `RewriteMap`으로 관리하면 편함)

---

## 4. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| EC2 과부하 / 장애 | 프록시가 정문이라 V2도 같이 안 보임 | CloudWatch 경보, 인스턴스 사양 검토. 장기적으로는 방식 2 또는 별도 프록시 |
| Vercel 장애 / 느림 | V2 경로 502/504 | kill switch로 즉시 Legacy 복귀 (랜딩은 Legacy 대체 페이지 필요 시 준비) |
| PHP 쿠키가 Vercel로 새는 설정 실수 | 세션 노출 | 스모크 `cookieForwarded:false`를 배포 차단 조건으로 |
| origin 도메인 검색 노출 | 중복 콘텐츠 | middleware 리다이렉트 + noindex, 스모크 검사 |
| 가격 변경 반영 지연 (ISR 5분) | 잘못된 가격 노출 | 결제 금액은 Legacy가 최종 계산하므로 금전 사고는 없음. 지연 허용 범위를 운영과 합의 |
| 추적 단절 | 광고 성과 측정 불가 | 추적 parity를 컷오버 필수 조건으로 (L5) |
| `viewer.php` 호출량 | EC2 PHP 부하 | 랜딩은 auth 영역 제외/지연, `session_write_close()` |

---

## 5. 다음 액션 (이번 주)

1. Phase 0 수집 명령 실행 → 결과 공유 (Header 필드, MPM, 모듈, 추적 코드가 우선)
2. Vercel 플랜과 origin 도메인 결정
3. Phase 1 착수: Next 프로젝트 + `src/legacy/` 골격 + 하네스 L1/L2
