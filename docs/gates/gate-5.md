# Gate 5 — Homepage sections (V2)

작성일: 2026-10-06  
상태: **REPOSITORY IMPLEMENTATION DONE — Vercel Preview / internal soak evidence pending**

## 0단계: Legacy 홈 섹션 목록

기준 파일은 읽기 전용 Legacy clone의 `html2/index.php`이다. Header/Footer는 `_head.php`와
`_tail.php`가 소유하므로 아래 홈 본문 섹션 수에는 포함하지 않는다.

| # | 섹션 이름 | Legacy 파일 위치 | 데이터 출처 | 비고 |
|---:|---|---|---|---|
| 1 | HeroCarousel | `html2/index.php:9-111` | 정적 | 강사 이미지는 `/data/teacher/HP3L51W1RDDF` |
| 2 | StatsBar | `html2/index.php:115-136` | 정적 | 4개 지표 |
| 3 | CurriculumSection | `html2/index.php:138-206` | 정적 | Contract 없음 — 원본도 정적 카드 |
| 4 | WhySection | `html2/index.php:209-248` | 정적 | 4개 차별점 |
| 5 | CompareTable | `html2/index.php:250-298` | 정적 | 4개 비교 행 |
| 6 | ProcessSteps | `html2/index.php:301-333` | 정적 | 3단계 |
| 7 | CeoMessage | `html2/index.php:336-357` | 정적 | CEO 메시지 |
| 8 | BriefingPartners | `html2/index.php:360-389` | 정적 | 3개 파트너 |
| 9 | Testimonials | `html2/index.php:392-440` | 정적 | 3개 후기 |
| 10 | FaqAccordion | `html2/index.php:443-662` | 정적 | 14개 FAQ |

정확히 10개임을 확인했다. 홈페이지 본문에 Bridge Contract의 동적 항목은 없다. 따라서 Contract를
확장하지 않았으며, 원본의 정적 문구/수치/링크는 `src/content/home.ts`에 타입 데이터로 옮겼다.

## 구현과 검증

- 섹션별 컴포넌트: `src/features/home/`의 10개 컴포넌트와 `HomeSections.tsx` 조립체.
- Hero Carousel(4초 자동 전환/이전/다음/인디케이터) 및 FAQ Accordion은 Bootstrap JS 없이 React로 재현.
- handoff CTA는 `legacyRoutes`를 통해 생성하고 `track('cta_click')` 후 이동한다.
- `tests/component/home-sections.test.tsx`: 10개 섹션의 정적 fixture 렌더를 검증한다.
- `pnpm test`: **351 passed** (기존 341개에서 감소 없음).
- `env -i PATH="$PATH" HOME="$HOME" pnpm build`: **PASS**.

## 이미지 remotePatterns 근거

추가한 항목:

```ts
{ protocol: 'https', hostname: 'nonsul-learn.com', pathname: '/data/**' }
{ protocol: 'https', hostname: 'nonsul-learn.com', pathname: '/src/nonsul-learn/img/**' }
```

- 실제 Legacy 경로: `html2/index.php:32`의
  `https://nonsul-learn.com/data/teacher/HP3L51W1RDDF`.
- V2 입력: `legacyAssetUrl('/data/teacher/HP3L51W1RDDF')`.
- 기본 `NEXT_PUBLIC_LEGACY_ASSET_HOST`는 `nonsul-learn.com`이므로 위 호출 출력은 실제 Legacy URL과 같다.
- Hero 배경은 Legacy CSS의 고정 경로 세 개를 `legacyAssetUrl()`로 변환한다.
  `/src/nonsul-learn/img/visualbg001.jpg`, `visualbg002.jpg`, `visualbg003.jpg`.
- `HeroCarousel.module.css`가 원본 CSS의 URL 배경을 무효화하고, `next/image` 사진(0) →
  Legacy 오버레이(1) → 콘텐츠(2) 순으로 쌓는다. 오버레이 값은
  `linear-gradient(135deg, rgba(11, 28, 61, 0.88) 0%, rgba(0, 0, 0, 0.75) 100%)`다.
- `src/design-system/src/nonsul-learn/img/`의 Gate 2 동기화 사본은 삭제하지 않았으며, 런타임
  Hero의 사용처는 없다.

## 스크린샷 비교와 남은 차이

로컬 V2에서 Hero 1~3을 375×812와 1440×900으로 캡처했다. 세 장 모두 `next/image fill`,
`sizes="100vw"`, `object-fit: cover`, `object-position: center`이며 첫 슬라이드만 priority다.
사용자가 제공한 Legacy 2번 데스크톱 캡처와 비교해 사진 중심/잘림, 오버레이 밝기 및 텍스트 가독성이
일치했다. 2번(1411×1058)은 모바일에서 상하 잘림이 더 크지만 강사와 강의실 중심이 유지된다.

Vercel Preview URL 및 Legacy 페이지의 캡처 권한/URL은 이 작업공간에 제공되지 않았다. 따라서 다음은
배포 후 사람이 남겨야 하는 Gate 5 증거다.

1. Legacy 및 Vercel Preview를 375×812, 768×1024, 1440×900에서 나란히 캡처한다.
2. Hero 자동전환을 멈춘 뒤 같은 1~3번 슬라이드를 비교한다.
3. Preview에서 `/src/nonsul-learn/img/visualbg001.jpg`~`003.jpg` 및
   `https://nonsul-learn.com/data/teacher/HP3L51W1RDDF` 이미지가 로드되는지 확인한다.
4. 로그인 Header 상태는 이번 Gate 범위 밖이며 Gate 4 이후 확인한다.

## 변경 파일

- `next.config.ts` — 위 단일 image remote pattern.
- `src/content/home.ts` — 원본 홈 정적 데이터.
- `src/features/home/*` — 10개 섹션 및 조립체.
- `src/app/page.tsx` — Gate 1 placeholder를 홈 섹션 조립으로 교체.
- `tests/component/home-sections.test.tsx` — 섹션 렌더 테스트.
