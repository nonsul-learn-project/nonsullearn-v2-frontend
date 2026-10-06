# Home Hero 슬라이드 parity (Gate 5)

대상: 홈 Hero 캐러셀(`src/features/home/HeroCarousel.tsx`)만. Hero 밖 섹션과 Header/Footer는
이 작업에서 건드리지 않았다.

## 1. 측정 방법

- 도구: `node scripts/parity-hero.mjs` (Playwright Chromium, 사람이 실행)
- Legacy: `https://nonsul-learn.com/` — 새 browser context라 쿠키 없음(항상 비로그인 화면)
- V2: 로컬 dev 서버 (`http://localhost:3000/`)
- 폭: 1440 / 768 / 375 (height 900), `deviceScaleFactor: 1`
- 슬라이드 3장 전부: `window.setInterval`을 무력화해 자동 전환을 멈추고 `.active`를 직접 이동
- y는 **슬라이드 상단 기준 상대값**. Header 높이 차이(§5)를 Hero 측정에서 분리하기 위함이다.
- 측정 항목: `getBoundingClientRect`(x, y, width, height) + `getComputedStyle`(display,
  flex-direction, justify-content, align-items, gap, padding, margin, width/height/min-height,
  max-width, aspect-ratio, position, top, font-family, font-size, line-height, word-break)

## 2. DOM 구조 비교 (수정 전)

Legacy `index.php` ↔ V2 `HeroCarousel.tsx`. 레이아웃에 영향을 준 차이는 **굵게** 표시.

| # | 위치 | Legacy | V2 (수정 전) | 레이아웃 영향 |
|---|---|---|---|---|
| 1 | `.carousel-item` 자식 | `.container` 하나 | `.background`(next/image) + `.overlay` + `.container` | 없음 — 둘 다 `position: absolute`로 흐름에서 빠진다 |
| 2 | `.container` class | `container` | `container` + CSS Module class | 없음 (`position: relative`, `z-index`만 추가) |
| 3 | `.hero-title` / `.hero-desc` 줄바꿈 | `텍스트<br>텍스트` | `<span>텍스트<br></span>` 반복 | 없었으나 DOM 계층이 다르고 마지막 줄 뒤 `<br>`이 하나 더 붙는다 |
| 4 | 슬라이드 1 CTA inline style | `background:var(--accent-color); border:none;` | 없음 | **버튼 높이 46px → 48px** (Bootstrap border 1px × 2) |
| 5 | 슬라이드 2 CTA class | `… px-4 text-primary fw-bold` | `… px-4 fw-bold` | 없음 (글자색만) |
| 6 | 슬라이드 2·3 `.instructor-single-box` class | 추가 class 없음 | `position-relative overflow-hidden rounded-4 shadow` | 없음 (radius 20px → 16px, 그림자 중복) |
| 7 | 슬라이드 2·3 `.instructor-info` | `instructor-info text-center text-white` | `+ p-4 w-100`, inline `position:relative; z-index:3; margin-top:auto` | **핵심 원인**: `margin-top: auto`가 info를 카드 바닥으로 밀고 아이콘 원을 카드 윗변에 붙인다. `p-4`로 높이 +48px, `w-100`으로 너비 183px → 298px |

CSS 쪽 차이(DOM이 아니라 적용되는 선택자 차이):

| # | 선언 | Legacy | V2 (수정 전) | 레이아웃 영향 |
|---|---|---|---|---|
| 8 | `.container { max-width }` | `common.css`가 `1400px !important` | Bootstrap 기본값 (1440px→1320px, 768px→720px) | **좌측 문구 블록이 1440px에서 40px, 768px에서 24px 더 안쪽에서 시작** |
| 9 | `html, body { font-family }` | `common.css` → `'Noto Sans KR', sans-serif` | `globals.css` → `system-ui, …` | **모든 텍스트 폭 4~10px 차이. 375px 슬라이드 3 제목은 legacy 3줄 / V2 2줄(높이 36px 차이)** |
| 10 | `html, body { word-break }` | `common.css` → `keep-all` | 기본값 `normal` | **한글 단어 중간 줄바꿈 → 줄 수 차이** |

8~10은 Legacy `common.css`가 V2로 미러링되지 않아 생긴 차이다(§5 참고). V2가 추가한 CSS
(`.slide { background-image: none }`, `.background`/`.overlay`)는 레이아웃에 영향이 없음을
측정으로 확인했다 — 세 요소 모두 absolute이고, 수정 후 모든 rect 차이가 0이다.

## 3. 측정표

### 수정 전 — Δ(V2 − Legacy) `x / y / w / h`, `0`은 네 값 모두 0

#### 1440px

| 요소 | 슬라이드 1 | 슬라이드 2 | 슬라이드 3 |
|---|---|---|---|
| 좌측 컨테이너 `.hero-text-align` | 40 / -1 / -46.7 / 2 | 40 / 0 / -46.7 / 0 | 40 / 0 / -46.7 / 0 |
| 좌측 배지 `.hero-badge` | 40 / -1 / -9.1 / 0 | 40 / 0 / -5.9 / 0 | 40 / 0 / -6.6 / 0 |
| 좌측 제목 `.hero-title` | 40 / -1 / -46.7 / 0 | 40 / 0 / -46.7 / 0 | 40 / 0 / -46.7 / 0 |
| 좌측 설명 `.hero-desc` | 40 / -1 / -46.7 / 0 | 40 / 0 / -46.7 / 0 | 40 / 0 / -46.7 / 0 |
| 좌측 버튼 `.hero-btn-wrapper > a` | 40 / -1 / -5.4 / 2 | 40 / 0 / -9 / 0 | 40 / 0 / -10.1 / 0 |
| 카드 `.instructor-single-box` | -23.3 / 0 / 0 / 0 | -23.3 / 0 / 0 / 0 | -23.3 / 0 / 0 / 0 |
| 아이콘 원 `.instructor-avatar-icon` | – | -23.3 / **-92.1** / 0 / 0 | -23.3 / **-77.6** / 0 / 0 |
| 카드 내부 컨테이너 `.instructor-info` | -23.3 / 0 / 0 / 0 | -80.7 / **44.1** / 114.6 / 48 | -80.7 / **29.6** / 114.6 / 48 |
| 카드 제목 `h4` | -23.3 / 0 / 0 / 0 | -56.7 / **68.1** / 66.6 / 0 | -56.7 / **53.6** / 66.6 / 0 |
| 카드 부제 `p` | -23.3 / 0 / 0 / 0 | – | -56.7 / **53.6** / 66.6 / 0 |
| 카드 배지 `.badge` | -21.4 / 0 / -3.9 / 0 | -19.3 / **68.1** / -8.1 / 0 | -19.8 / **53.6** / -7 / 0 |

#### 768px

| 요소 | 슬라이드 1 | 슬라이드 2 | 슬라이드 3 |
|---|---|---|---|
| 좌측 컨테이너 `.hero-text-align` | 24 / 0 / -48 / 2 | 24 / 0 / -48 / 0 | 24 / 0 / -48 / 0 |
| 좌측 배지 `.hero-badge` | 4.5 / 0 / -9.1 / 0 | 2.9 / 0 / -5.9 / 0 | 3.3 / 0 / -6.6 / 0 |
| 좌측 제목 `.hero-title` | 24 / 0 / -48 / 0 | 24 / 0 / -48 / 0 | 24 / 0 / -48 / 0 |
| 좌측 설명 `.hero-desc` | 24 / 0 / -48 / 0 | 24 / 0 / -48 / 0 | 24 / 0 / -48 / 0 |
| 좌측 버튼 `.hero-btn-wrapper > a` | 2.7 / 0 / -5.4 / 2 | 4.5 / 0 / -9 / 0 | 5 / 0 / -10.1 / 0 |
| 카드 `.instructor-single-box` | 0 / 2 / 0 / 0 | 0 | 0 |
| 아이콘 원 `.instructor-avatar-icon` | – | 0 / **-55.4** / 0 / 0 | 0 / **-40.9** / 0 / 0 |
| 카드 내부 컨테이너 `.instructor-info` | 0 / 2 / 0 / 0 | -32.3 / 7.4 / 64.6 / 48 | -32.3 / -7.1 / 64.6 / 48 |
| 카드 제목 `h4` | 0 / 2 / 0 / 0 | -8.3 / **31.4** / 16.6 / 0 | -8.3 / **16.9** / 16.6 / 0 |
| 카드 부제 `p` | 0 / 2 / 0 / 0 | – | -8.3 / **16.9** / 16.6 / 0 |
| 카드 배지 `.badge` | 1.9 / 2 / -3.9 / 0 | 4 / **31.4** / -8.1 / 0 | 3.5 / **16.9** / -7 / 0 |

#### 375px

| 요소 | 슬라이드 1 | 슬라이드 2 | 슬라이드 3 |
|---|---|---|---|
| 좌측 컨테이너 `.hero-text-align` | 0 / 0 / 0 / 2 | 0 | 0 / 0 / 0 / **-36.4** |
| 좌측 배지 `.hero-badge` | 4.5 / 0 / -9.1 / 0 | 2.9 / 0 / -5.9 / 0 | 3.3 / 0 / -6.6 / 0 |
| 좌측 제목 `.hero-title` | 0 | 0 | 0 / 0 / 0 / **-36.4** |
| 좌측 설명 `.hero-desc` | 0 | 0 | 0 / **-36.4** / 0 / 0 |
| 좌측 버튼 `.hero-btn-wrapper > a` | 2.7 / 0 / -5.4 / 2 | 4.5 / 0 / -9 / 0 | 5 / **-36.4** / -10.1 / 0 |
| 카드 `.instructor-single-box` | 0 / 2 / 0 / 0 | 0 | 0 / **-36.4** / 0 / 0 |
| 아이콘 원 `.instructor-avatar-icon` | – | 0 / **-56.1** / 0 / 0 | 0 / **-78** / 0 / 0 |
| 카드 내부 컨테이너 `.instructor-info` | 0 / 2 / 0 / 0 | -36.8 / 8.1 / 73.6 / 48 | -35.6 / **-42.8** / 71.2 / 48 |
| 카드 제목 `h4` | 0 / 2 / 0 / 0 | -12.8 / **32.1** / 25.6 / 0 | -11.6 / **-18.8** / 23.2 / 0 |
| 카드 부제 `p` | 0 / 2 / 0 / 0 | – | -11.6 / **-18.8** / 23.2 / 0 |
| 카드 배지 `.badge` | 1.9 / 2 / -3.9 / 0 | 4 / **32.1** / -8.1 / 0 | 3.5 / **-18.8** / -7 / 0 |

### 수정 후

3개 폭 × 슬라이드 3장 × 측정 요소 14개 전부 **Δx / Δy / Δw / Δh = 0.00px**.
`node scripts/parity-hero.mjs` 출력 마지막 줄: `최대 위치/크기 차이: 0px`.
남은 computed style 차이는 Hero `.container`의 `position: static → relative`, `top: auto → 0px`
하나뿐이다(§4-③, 레이아웃 영향 0 — 모든 rect가 일치한다).

## 4. 원인과 수정

| 증상 | 원인 | 수정 |
|---|---|---|
| 아이콘 원이 카드 윗변에, 제목·배지가 카드 아래쪽 (슬라이드 2·3) | V2가 사진 슬라이드용 `p-4 w-100` + inline `margin-top: auto`를 모든 슬라이드의 `.instructor-info`에 붙였다. `margin-top: auto`가 `.instructor-single-box`의 `justify-content: center`를 무력화한다 | `hasPhoto`로 분기해 아이콘 슬라이드는 Legacy와 같은 `instructor-info text-center text-white`만 쓰고 inline style을 주지 않는다. 카드의 `position-relative overflow-hidden rounded-4 shadow`도 사진 슬라이드에만 붙인다 |
| 좌측 문구 블록이 더 오른쪽에서 시작 | Legacy `common.css`의 `.container { max-width: 1400px !important }`가 V2에 없어 Bootstrap 기본값(1320px / 720px)이 적용 | `HeroCarousel.module.css`에서 Hero `.container`에만 `max-width: 1400px`. 클래스를 두 번 적어(`.content.content`) Bootstrap 미디어쿼리 `.container`(0,1,0)보다 우선순위를 높였다 — 선언 순서에 의존하지 않기 위함 |
| 텍스트 폭·줄 수 차이 (375px 슬라이드 3 제목 2줄 vs 3줄) | Legacy는 `common.css`에서 `'Noto Sans KR'` + `word-break: keep-all`, V2 `globals.css`는 `system-ui` + `normal` | Hero 루트에만 `font-family: 'Noto Sans KR', sans-serif; word-break: keep-all` (Hero 밖 섹션을 건드리지 않기 위해 전역 대신 범위 한정) |
| 슬라이드 1 버튼 높이 46px vs 48px | Legacy 버튼의 inline `border: none`이 V2에 없어 Bootstrap border 1px × 2가 남았다 | 슬라이드별 버튼 class/inline style을 Legacy 그대로 재현 (`border: none`, `background: var(--nonsul-color-accent)`, 슬라이드 2의 `text-primary`). `--accent-color`는 `common.css` 소유라 값을 `tokens.css`의 `--nonsul-color-accent`로 추출했다 |
| — (구조 정리) | 줄바꿈을 `<span>텍스트<br></span>`로 감싸 DOM 계층이 Legacy와 달랐다 | 줄 **사이**에만 `<br>`을 넣어 Legacy와 동일한 `텍스트<br>텍스트` 구조로 변경 |

`main.css` 원본은 수정하지 않았다 — `pnpm check:legacy-css`(SHA256 검사) 통과.
③ V2 `.container`의 `position: relative`는 next/image 배경 레이어 위에 본문을 올리기 위한 것이며
Legacy는 CSS `background-image`를 써서 필요가 없다. 모든 rect가 일치하므로 유지한다.

## 5. 남은 차이 (이 작업 범위 밖)

1. **Header 높이** — Hero 블록의 문서상 절대 y가 Legacy 75 / 75 / 67px (1440 / 768 / 375)인데
   V2는 세 폭 모두 86px이다. 즉 Hero 자체가 아니라 그 위 Header가 11px(모바일 19px) 더 높다.
   Header는 다른 섹션이라 손대지 않았고, 이 문서의 측정은 슬라이드 상단 기준 상대 y를 쓴다.
2. **`common.css` 미러링 안 됨** — 위 §2의 8~10을 Hero 범위에서만 보정했다. 같은 차이가 홈의
   모든 섹션에 남아 있고(모든 `.container`가 80px 좁고, 본문 글꼴이 `system-ui`),
   `main.css`가 쓰는 `var(--accent-color)` 7곳은 변수 정의가 없어 지금 무효다.
   근본 해결은 `src/design-system/legacy/`에 `common.css`를 원본 그대로 미러링하고
   `verify-legacy-css.mjs`에 SHA를 추가하는 것이다 → 별도 작업으로 제안.
