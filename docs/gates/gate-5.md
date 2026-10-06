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

## Hero parity — 변경 전 값 대조 (PR 설명용)

| 항목 | Legacy 값 / 출처 | 현재 V2 값 | 판정·수정 방향 |
|---|---|---|---|
| 1. 배경 사진 | `main.css:65-74`: `visualbg001`~`003.jpg`; `cover center no-repeat` | 세 장 모두 `next/image fill`, `cover center` | 사진 경로·정렬은 일치. 유지 |
| 2. 배지 아이콘 | `index.php:23,50,78`: `fa-fire`, `fa-bolt`, `fa-video`, 모두 `text-warning` (`#ffc107`) | 아이콘 마크업 없음 | 같은 Font Awesome 6.4.2 및 `<i>` 클래스를 복구 |
| 3. 카드 아이콘 | `index.php:60,89`: `fa-user-gear`, `fa-user-graduate`; `.instructor-avatar-icon`의 `color:#fff`, `font-size:3.5rem` | `⚙`, `🎓` 이모지 | 이모지 제거, 같은 Font Awesome 클래스 사용 |
| 4. 카드 내부 배치 | `.instructor-single-box`: `flex-direction:column; align-items:center; justify-content:center`; 아이콘 원 `110×110px`, `margin-bottom:18px`; 1번은 inline `min-height:280px; align-items:flex-end` | 공통 CSS는 상속하지만 1번 inline 값 없음 | 1번 inline 배치 값을 같은 JSX style로 복구; 2·3은 공통 CSS 유지 |
| 5. 카드 질감 | `background:linear-gradient(180deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.03) 100%)`; `border:1px solid rgba(255,255,255,.2)`; `backdrop-filter:blur(5px)` | 같은 legacy CSS 상속 | 일치. 사진 적용 뒤에도 변경하지 않음 |
| 6. 하단 표시줄 | Bootstrap 5.3.2 `.carousel-indicators [data-bs-target]`: `30×3px`, 좌·우 `3px`, `#fff`, opacity `.5` / active `1`, bottom `1rem` | `data-bs-target` 속성 없음 → 위 selector 미적용 | 각 버튼에 Legacy의 `data-bs-target="#heroCarousel"`, `data-bs-slide-to` 추가 |
| 7. 콘텐츠 시작·타이포 | Bootstrap `.container`: 1400px 이상 `max-width:1320px`, 기본 gutter `1.5rem`; legacy 1399.98px 이하 `width:100%; padding-inline:20px`; title 최종 값 `font-weight:800`, `line-height:1.3`, `letter-spacing:-.5px` | 같은 `.container`, `.hero-title` CSS 상속 | 일치. 변경 없음 |

공통 Hero 오버레이는 `main.css:54-62`의
`linear-gradient(135deg, rgba(11, 28, 61, 0.88) 0%, rgba(0, 0, 0, 0.75) 100%)`이고,
현재 V2도 같은 값이다. 설정 파일 변경은 필요하지 않다.

### Hero parity — 수정 후 결과

| 항목 | 결과 | 남은 차이 |
|---|---|---|
| 1. 배경 사진 | PASS — 1~3 모두 원본 경로, `fill`, `cover center`, 첫 장 `priority` 적용 | Legacy의 모든 viewport 원본 캡처 대기 |
| 2. 배지 아이콘 | PASS — Font Awesome 6.4.2의 fire/bolt/video와 `text-warning` 적용 | 없음 |
| 3. 카드 아이콘 | PASS — user-gear/user-graduate, 흰색 `3.5rem` 적용 | 없음 |
| 4. 카드 내부 배치 | PASS — 110px 원, 18px 하단 여백, flex 중앙 정렬 및 1번의 280px/`align-items:flex-end` 복구 | 없음 |
| 5. 카드 질감 | PASS — Legacy gradient, blur(5px), border 값 그대로 상속 | 없음 |
| 6. 하단 표시줄 | PASS — Bootstrap selector가 적용되는 target/slide 속성을 복구해 30×3px, 3px 간격, 흰색·opacity 값 일치 | 없음 |
| 7. 컨테이너·타이포 | PASS — 기존 Bootstrap container와 Legacy title CSS를 그대로 사용 | 없음 |

V2 1~3번을 각각 375×812와 1440×900으로 수정 후 재캡처했다. 사용자가 제공한 Legacy
2번 데스크톱 캡처와는 아이콘, 카드 배치, 인디케이터, 사진 중심·밝기를 대조했다. Legacy의
1·3번 및 모바일 원본 캡처는 아직 제공되지 않아 해당 나란히 비교 증거만 대기 상태다.

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
