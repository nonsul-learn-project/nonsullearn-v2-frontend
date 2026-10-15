# 논술런 인문논술 공통 상세페이지 — Design System

> Version 1.4 · 2026-10-15
> 기준: 캔버스 「인문논술 기본반 압축특강 4회 상세페이지」 › 인문논술 공통 템플릿 페이지의 `Template.dc.html` 현재 상태
> 이전 기준: design(9).md v1.1 (Dark Tech Editorial)
> Related: `인문논술_공통템플릿_wireframe.md`, `인문논술_공통템플릿_copy.md`

## 0. 변경 이력

| 버전 | 내용 |
|---|---|
| 1.1 | 다크 테크 에디토리얼, 8블록, 상단 고정 신청 바, Eyebrow 제거 |
| 1.3 | A안 카피 적용, `bodyTone`(dark/light) 추가 |
| 1.4 | 03 블록 합격 사례에 2026 합격증 34장 자동 흐름 갤러리 추가, 히어로 H1 문구 조정(정확한 + 강조 블록) |

## 1. 디자인 목표

- 일반적인 교육 광고가 아니라 프리미엄 테크 제품 캠페인처럼 표현한다.
- 큰 타이포그래피와 정밀한 그리드, 1px 구분선 중심으로 구성한다.
- 시각적 강도는 히어로, 문제 공감, 마지막 신청 영역에 집중하고 커리큘럼과 FAQ는 읽기 쉽게 절제한다.
- 글로우와 그라데이션은 히어로, 매회 구성, 신청 영역 세 곳에서만 쓴다.
- 책, 펜, 종이, 답안지 같은 교육 장식 이미지는 쓰지 않는다.
- 강사 사진, 강의 맛보기 같은 실제 자료 자리는 플레이스홀더로 두고, 운영 페이지에서는 자료가 없으면 숨긴다.
- 제목 위 장식용 작은 라벨(Eyebrow)은 쓰지 않는다. `연구소·브랜드 전체 기준`, `논술런 전체 합격 사례`, `수강 전`·`수강 후` 같은 정보성 라벨은 유지한다.

## 2. 컬러 토큰

### 2-1. 고정 토큰 (본문 톤과 무관)

| Token | Hex | Usage |
|---|---|---|
| `bg.canvas` | `#050814` | 페이지 배경, 히어로·신청 영역 바탕 |
| `bg.navy` | `#0E1B3D` | 히어로 그라데이션 중간색 |
| `bg.surface` | `#151D2D` | 신청 패널, 첨삭 단계 카드 |
| `bg.surfaceElevated` | `#1D2A43` | 매회 구성 시간 막대(보조 구간), 비활성 버튼 |
| `accent.primary` | `#315EF5` | CTA 배경, 히어로 강조 블록, 시간 막대 핵심 구간 |
| `accent.soft` | `#91ADFF` | 다크 배경 강조 텍스트, 아이콘, 포커스 링 |
| `text.primary` | `#FFFFFF` | 다크 배경 제목 |
| `text.secondary` | `#BCC8DE` | 다크 배경 본문 |
| `text.muted` | `#8B9AB5` | 캡션, 보조 정보 |
| `border.subtle` | `#303B50` | 구분선, 카드 테두리 |
| `warn.onDark` | `#FFB86B` | 다크 톤 `유의` 라벨 (보조 색) |
| `warn.onLight` | `#A85C00` | 라이트 톤 `유의` 라벨 (보조 색) |

### 2-2. 본문 톤 토큰 (`bodyTone`)

02~07 본문 섹션은 `bodyTone` 값에 따라 아래 토큰을 바꿔 쓴다. 히어로, 06 매회 구성, 신청 영역은 톤과 관계없이 다크로 고정한다.

| 역할 | 키 | dark (기본) | light |
|---|---|---|---|
| 섹션 배경 A | `t.bgA` | `#050814` | `#FFFFFF` |
| 섹션 배경 B | `t.bgB` | `#050814` | `#F7F9FC` |
| 제목 | `t.title` | `#FFFFFF` | `#111827` |
| 본문 | `t.body` | `#BCC8DE` | `#111827` |
| 보조 | `t.muted` | `#8B9AB5` | `#697386` |
| 강조 | `t.accent` | `#91ADFF` | `#315EF5` |
| 구분선 | `t.line` | `#303B50` | `#E2E7EF` |
| 카드 | `t.cardA` | `#151D2D` | `#F5F7FA` |
| 미디어 자리 | `t.media` | `#1D2A43` | `#EEF2F7` |
| 미디어 자리 테두리 | `t.mediaLine` | `#3A4866` | `#C7CFDC` |

**비율 가이드**: 다크 계열 약 70~80%, 중립 텍스트·면 15~25%, 블루 강조 5~10%.

### 2-3. 그라데이션

```css
--gradient-hero: radial-gradient(ellipse at 85% 55%, rgba(49,94,245,.32) 0%, transparent 52%),
                 linear-gradient(130deg, #050814 10%, #0E1B3D 65%, #050814 100%);
--gradient-learning: linear-gradient(135deg, #10275D 0%, #0A1732 58%, #060B16 100%);
--gradient-cta: radial-gradient(ellipse at 50% 95%, rgba(49,94,245,.27), transparent 60%), #050814;
```

텍스트 외곽 발광, 텍스트 그라데이션은 쓰지 않는다.

## 3. 타이포그래피

- 한글: `Pretendard Variable` → `Pretendard` → `Noto Sans KR` → sans-serif.
- 숫자·가격·회차 번호(`.num`): `Inter` + `font-variant-numeric: tabular-nums`. 한글 문장에 Inter 단독 적용 금지.
- 캔버스 시안은 Pretendard 대신 Google Fonts의 Noto Sans KR로 렌더링된다. 개발 시 Pretendard 기준으로 줄바꿈과 높이를 다시 확인한다.
- 전역: `font-size 17px`, `line-height 1.65`, `letter-spacing -0.015em`, `word-break: keep-all`.

| Style | 값 (clamp) | Weight | Line-height | Tracking |
|---|---|---:|---:|---:|
| H1 히어로 | `clamp(36px, 5.2vw, 72px)` | 800 | 1.2 | -0.04em |
| H2 섹션 | `clamp(28px, 3.4vw, 48px)` | 800 | 1.28 | -0.035em |
| H2 신청 | `clamp(32px, 4.4vw, 60px)` | 800 | 1.22 | -0.04em |
| H2 FAQ | `clamp(24px, 2.4vw, 32px)` | 800 | 1.3 | -0.03em |
| H3 소제목 | `clamp(22px, 2.2vw, 30px)` | 800 | 1.3 | -0.03em |
| H3 카드 | `clamp(19px, 1.8vw, 24px)` | 700 | 1.35 | -0.025em |
| 전환 문장 | `clamp(22px, 2.3vw, 32px)` | 800 | 1.4 | -0.03em |
| 브랜드 수치 | `clamp(40px, 4.4vw, 60px)` | 800 | 1.05 | -0.04em |
| 판매가 (패널) | `clamp(36px, 3.6vw, 48px)` | 800 | 1.1 | -0.03em |
| 본문 | `clamp(15px, 1.25vw, 17~18px)` | 400~500 | 1.65~1.7 | -0.015em |
| 캡션 | 13~14px | 400~700 | 1.6 | 0 |

- 제목은 의미 단위로 줄바꿈한다. 한 화면의 강조 색은 1~2개 구절 이내.
- 히어로 H1의 `{heroMark}`는 `#315EF5` 배경 블록(좌우 패딩 14px, radius 6px, `inline-block`)으로 강조한다. 다른 제목의 강조는 `t.accent` 글자색만 쓴다.

## 4. 레이아웃 토큰

| Token | Desktop | Mobile (≤767px) |
|---|---|---|
| 콘텐츠 최대 폭 (`.wrap`) | 1120px | 100% |
| 좌우 패딩 | 40px | 24px (≤360px: 18px) |
| 섹션 상하 패딩 (`.sec`) | 120px | 80px |
| 히어로 | min-height 650px, 상하 96px | 동일 비율 |
| 블록 내부 큰 간격 | 48~56px (07은 96px) | 동일 |
| 카드 간격 | 20px | 20px |
| 카드 반경 | 12px | 12px |
| 라벨 칩 반경 | 6px | 6px |
| 버튼 반경 | 8px | 8px |
| 버튼 높이 | 54px (고정 바 46px) | 동일 |
| 그리드 | `repeat(auto-fit, minmax(220~260px, 1fr))` | 1열로 자연 전환 |

반응형 기준: mobile 0~767px / tablet 768~1023px / desktop 1024px 이상.

## 5. 컴포넌트 사양

### `CourseStickyBar` (00)
- Desktop: 히어로 위 `position: sticky; top: 0`. 처음엔 배경 투명, 스크롤 480px를 넘으면 `rgba(5,8,20,.96)` + 하단 1px `#303B50`.
- 구성: 강좌명(16px/700, 말줄임) + 배지(14px, muted) / 정가 취소선(13px) + 판매가(18px/800) / CTA 버튼(min-width 168px, 높이 46px).
- Mobile: 하단 `position: fixed`, 배경 `#050814`, 상단 1px 보더, 강좌명 숨김, `env(safe-area-inset-bottom)` 확보. 본문 하단에 96px 여유.

### `PrimaryButton`
- 배경 `#315EF5`, 흰 글자, 16px/700, hover 시 `brightness(1.12)`.
- 비활성(`.btn-off`): 배경 `#1D2A43`, 글자 `#8B9AB5`, `cursor: not-allowed`, `disabled` 속성.
- `focus-visible`: 2px `#91ADFF` 아웃라인, offset 3px.

### `LineButton`
- 투명 배경, 1px `#315EF5` 테두리, 글자 `t.title`, 높이 52px. 강의 맛보기, 커리큘럼 펼치기, 합격증 자동 넘김 멈춤에 쓴다.

### `ProblemCards` (02)
- 4개 카드, `t.cardA` 배경 + 1px `t.line`, radius 12px, 패딩 28px. 번호(14px/700, `t.accent`) + 문장(17~20px/700).
- 아래 전환 문장은 중앙 정렬, 강조 문장은 `t.accent`.

### `BeforeAfterRows` (02)
- 1px 구분선 행 3개. `수강 전`(13px, muted) / `수강 후`(13px/700, accent) 라벨 + 문장. 두 칸은 `flex: 1 1 300px`로 좁은 화면에서 세로로 쌓인다.

### `BrandStats` (03)
- 3열, 상단 1px `t.title` 실선 + 각 칸 하단 1px `t.line`. 숫자(40~60px/800) + 단위(0.45em, accent) + 항목(15~17px/700) + 기준 표기(13px, muted).
- 우측 상단에 `연구소·브랜드 전체 기준` 칩(1px 테두리, radius 6px, 13px).

### `CertificateMarquee` (03, v1.4 신규)
- 실제 합격증 34장(개인정보 가림)이 왼쪽으로 계속 흐르는 띠.
- 카드: 폭 `clamp(200px, 20vw, 248px)`, 비율 3:4, 배경 `#FFFFFF`, 1px `t.line`, radius 12px, 안쪽 여백 10px, 이미지 `object-fit: contain`.
- 캡션: `NN / 34` (13px, `.num`, muted).
- 카드 간격은 카드 오른쪽 16px 패딩으로 만든다(이음매가 생기지 않도록 gap 대신 패딩).
- 34장을 두 번 이어 붙이고 `translateX(0 → -50%)`를 60초 동안 linear 무한 반복. 두 번째 묶음은 `aria-hidden="true"`.
- 좌우 끝 3%는 mask 그라데이션으로 흐리게 처리.
- 마우스를 올리거나 키보드 포커스가 들어가면 멈춘다. 하단 오른쪽 `자동 넘김 멈춤 / 자동 넘김 재생` 토글 버튼(LineButton, 높이 44px, `aria-pressed`).
- `prefers-reduced-motion: reduce`이면 애니메이션 없이 가로 스크롤로 바뀐다.
- 이미지 형식: 원본 GIF(1000×1400)를 가로 560px WebP로 줄여 HTML 안에 넣었다(34장 약 0.8MB). 운영 사이트에서는 서버 이미지 경로로 바꾼다.

### `ProofTextList` (03, 예시 데이터에서만)
- 갤러리 아래 글 사례 목록. 2~3열, 각 행 1px 하단선. 메타(13px) / 결과(16~18px/700) / 후기 요지(15px).

### `MethodSteps` (04)
- 3개 카드(`t.cardA`, radius 12px, 패딩 32px). 번호는 28~36px/700 accent.

### `InstructorProfile` (04)
- 사진 자리(4:5, max 440px, `flex 5`) + 정보(`flex 7`, max 680px). 사진이 없으면 정보가 전체 폭.
- 이력 3행: 번호(13px/700 accent) + 내용, 1px 구분선.

### `CurriculumList` (05)
- 상단 1px `t.title` 실선, 행마다 1px `t.line`, 행 패딩 32px.
- 회차 번호(28~40px/700 accent, 폭 96px) + 라벨(13px) + 제목(19~24px/700) + 설명 + 메타(쓰는 답안 · 점검 기준, 14px).
- 7강 이상이면 6강까지만 보이고 가운데 LineButton으로 펼친다.

### `SessionBar` (06)
- 높이 56px 가로 막대, 칸 사이 6px, 칸 비율은 시간 비율(`flex: 시간`). 핵심 구간 `#315EF5`, 나머지 `#1D2A43`. 장식 요소이므로 `aria-hidden`.
- 아래 카드: 1px `#303B50`, 배경 `rgba(5,8,20,.35)`.

### `FeedbackFlow` (06)
- 테두리 박스(배경 `rgba(5,8,20,.5)`) 안에 제목·예외 안내 + `답안 업로드 → 첨삭 확인` 2단계. 두 번째 카드만 1px `#315EF5` 테두리.

### `InfoCards` / `NoticeList` (07)
- 정보 카드: `t.cardA`, radius 12px, 라벨(13px) + 값(18~22px/700) + 보조(14px).
- 안내 목록: 라벨 `안내`(muted) / `유의`(`warn.onDark` 또는 `warn.onLight`) + 문장.

### `BoardTabs` (07)
- 선택 탭: 글자 `t.title` 700 + 하단 2px `t.accent` 안쪽 그림자. 비선택: muted 500. `role="tab"`, `aria-selected`.

### `PricingPanel` (07)
- 최대 폭 640px, 배경 `#151D2D`, 1px `#303B50`, radius 12px, 패딩 36px.
- 판매가가 가장 크게 보인다. 강의·수강 기간·신청 기간·모집 정원 행, 포함 태그(체크 아이콘 `#91ADFF`), CTA, 환불 핵심 조건 + `환불 기준 보기` 링크.

### `FAQAccordion` (07)
- 최대 폭 800px, 상단 1px `t.title`, 항목마다 1px `t.line`. 질문 16~19px/700, 높이 64px 이상, `+` 아이콘이 열리면 45도 회전.
- 환불 FAQ는 답변 아래 번호 목록 5항목.

## 6. 섹션별 시각 리듬

| 블록 | 배경 | 구성 | 강조도 (내부 가이드) |
|---|---|---|---:|
| 00 고정 신청 바 | 투명 → 다크 | 얇은 커머스 바 | 60 |
| 01 히어로 | 히어로 그라데이션 | 대형 타이포 + 강조 블록 | 95 |
| 02 문제 공감 + 수강 전·후 | `t.bgA` | 중앙 메시지 + 4카드 + 구분선 표 | 85 |
| 03 신뢰 근거 + 합격 사례 | `t.bgB` | 수치 3열 + 합격증 흐름 띠 | 80 |
| 04 수업 루프 + 강사 | `t.bgA` | 3카드 + 비대칭 2열 | 70 |
| 05 커리큘럼 | `t.bgB` | 번호·구분선 목록 | 55 |
| 06 매회 구성 + 첨삭 | 러닝 그라데이션 | 시간 막대 + 카드 + 2단계 | 70 |
| 07 추천·확인·탭 | `t.bgA` | 목록 + 정보 카드 | 50 |
| 07 신청 | CTA 그라데이션 | 중앙 대형 문장 + 패널 | 95 |
| 07 FAQ | `t.bgA` | 아코디언 | 30 |

## 7. 이미지·모션 정책

- AI 생성 인물, 가상 합격증, 가상 후기, 가상 교재 이미지 금지.
- 합격증은 개인정보를 가린 실제 원본만 쓰고, 이 강좌 수강이 확인되지 않으면 `논술런 전체 합격 사례`로 표시한다.
- 모션: 상태 전환 150~300ms. 합격증 띠만 상시 움직이며, 멈춤 수단(호버·포커스·토글 버튼)을 둔다.
- `prefers-reduced-motion`: 전환 효과 제거, 합격증 띠는 수동 가로 스크롤, 부드러운 스크롤 해제.
- 히어로 핵심 텍스트는 HTML 텍스트로 즉시 표시한다.

## 8. 접근성·품질 게이트

- [ ] 텍스트 대비 WCAG AA(본문 4.5:1, 큰 글씨 3:1).
- [ ] 320~390px에서 가로 넘침이 없다(합격증 띠는 내부에서만 움직임).
- [ ] CTA, 탭, FAQ, 커리큘럼 펼치기, 합격증 멈춤 버튼을 키보드로 조작할 수 있다.
- [ ] 터치 영역 44px 이상.
- [ ] 합격증 이미지마다 대체 텍스트(`2026학년도 논술전형 합격증 N (개인정보 가림)`)가 있다.
- [ ] 가격·할인·구매 버튼을 이미지에 넣지 않는다.
- [ ] 캔버스에서 고정한 히어로 H1 크기(폭 880px, 높이 195px)는 개발 시 반응형 값으로 바꾼다.

## 9. CSS 토큰 시작점

```css
:root[data-course-theme="humanities"] {
  --hm-bg: #050814;
  --hm-navy: #0E1B3D;
  --hm-surface: #151D2D;
  --hm-surface-elevated: #1D2A43;
  --hm-accent: #315EF5;
  --hm-accent-soft: #91ADFF;
  --hm-text: #FFFFFF;
  --hm-text-secondary: #BCC8DE;
  --hm-text-muted: #8B9AB5;
  --hm-border: #303B50;
  --font-sans: "Pretendard Variable", Pretendard, "Noto Sans KR", sans-serif;
  --font-num: Inter, "Pretendard Variable", sans-serif;
  --content-width: 1120px;
  --radius-card: 12px;
  --radius-button: 8px;
  --cert-card-width: clamp(200px, 20vw, 248px);
  --cert-loop-duration: 60s;
}
```
