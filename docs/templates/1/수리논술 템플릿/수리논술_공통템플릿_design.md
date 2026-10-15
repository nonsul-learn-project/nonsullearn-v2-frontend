# 논술런 수리논술 공통 상세페이지 — Design System

> Version 1.1 · 2026-10-15
> 기준: 캔버스 수리논술 공통 템플릿 페이지의 `MathTemplate.dc.html` 현재 상태
> 이전 기준: design(10).md v1.0 (Ivory × Aubergine × Electric Violet)
> Related: `수리논술_공통템플릿_wireframe.md`, `수리논술_공통템플릿_copy.md`

## 0. 변경 이력

| 버전 | 내용 |
|---|---|
| 1.0 | 아이보리 라이트 에디토리얼 + 딥 오베르진 + 바이올렛, 인문논술과 같은 구매 흐름 |
| 1.1 | 03 블록 합격 사례에 2026 합격증 34장 자동 흐름 갤러리 추가. 히어로 H1을 섹션 상단 전체 폭으로 배치. 신청 영역을 H2 + 패널 구성으로 정리(요약 문장 없음) |

## 1. 디자인 방향

**Signature: Ivory × Aubergine × Electric Violet**

- 인문논술(블랙 × 코발트 블루)과 첫 화면부터 구별되는 밝고 구조적인 프리미엄 에디토리얼.
- 시각 비율: 라이트 약 60% / 딥 오베르진 약 30% / 바이올렛 강조 약 10%.
- 공식, 그래프, 수학 기호, 종이, 펜, 칠판을 장식으로 쓰지 않는다. 3D 오브젝트 없음.
- Eyebrow 없음. 실제 회차 번호, 강좌명, 범위 라벨(`연구소·브랜드 전체 기준`, `논술런 전체 합격 사례`)은 허용.
- 카드 반복 대신 1px 구분선과 큰 번호로 구조를 만든다.

## 2. 컬러 토큰

| 토큰 | 값 | 역할 |
|---|---|---|
| `--math-bg` | `#F7F4F0` | 메인 웜 아이보리 배경 (히어로, 수강 전·후, 04, FAQ) |
| `--math-surface` | `#FFFFFF` | 03 신뢰 근거, 05 커리큘럼, 07 추천·확인·탭, 합격증 카드 |
| `--math-surface-muted` | `#EFE9F1` | 06 매회 구성 배경, 강사 사진 자리 |
| `--math-ink` | `#251A2D` | 본문, 헤드라인, LineButton |
| `--math-muted` | `#746A79` | 보조 설명, 캡션 |
| `--math-deep` | `#261331` | 02 문제 공감, 히어로 H1, 브랜드 수치 |
| `--math-deep-2` | `#3B1B4C` | 시간 막대 보조 구간, 다크 비활성 버튼 |
| `--math-violet` | `#7540D4` | CTA, 키워드 강조, 번호, 아이콘, 포커스 링 |
| `--math-violet-hover` | `#6231BB` | CTA·링크 hover |
| `--math-lilac` | `#D9C5F2` | 딥 배경 강조 텍스트, 체크 아이콘 |
| `--math-border` | `#DED7E2` | 라이트 구분선, 비활성 버튼 배경 |
| `--math-border-dark` | `#62496C` | 딥 배경 구분선 |
| `--math-on-dark` | `#FAF7FC` | 딥 배경 본문 |

### 섹션별 색 운용

| 블록 | 배경 | 강조 |
|---|---|---|
| 00 고정 바 | 투명 → `rgba(247,244,240,.97)` | 바이올렛 버튼 |
| 01 히어로 | 아이보리 + 라일락 광원 | 오베르진 H1, 바이올렛 강조 구절 |
| 02 문제 공감 | 딥 오베르진 | 라일락 번호·키워드, 1px `#62496C` 구분선 |
| 02 수강 전·후 | 아이보리 | 바이올렛 `수강 후` 라벨 |
| 03 신뢰 근거·합격 사례 | 화이트 | 오베르진 숫자 + 바이올렛 단위 |
| 04 수업 루프·강사 | 아이보리 | 단계 상단 2px 선 (2단계만 바이올렛) |
| 05 커리큘럼 | 화이트 | 바이올렛 회차 번호 |
| 06 매회 구성·첨삭 | 라일락 틴트 `#EFE9F1` | 시간 막대 바이올렛/딥 |
| 07 추천·확인·탭 | 화이트 | 바이올렛 번호, `유의` 라벨도 바이올렛 |
| 07 신청 | 딥 그라데이션 | 화이트 가격, 바이올렛 CTA |
| 07 FAQ | 아이보리 | 1px 구분선 |

### 허용 그라데이션

```css
--math-hero-glow: radial-gradient(circle at 85% 35%, rgba(184,141,229,.22), transparent 55%), #F7F4F0;
--math-cta-depth: linear-gradient(125deg, #261331 0%, #3B1B4C 70%, #4B2663 100%);
```

한 화면에 광원은 1개 이하. 블루, 네온 핑크 금지.

## 3. 타이포그래피

- 한글: `Pretendard Variable` → `Pretendard` → `Noto Sans KR`. 캔버스는 Noto Sans KR로 렌더링.
- 숫자(`.num`): `Inter` + tabular-nums.
- 전역: 17px / line-height 1.6 / letter-spacing -0.015em / `word-break: keep-all`.

| 요소 | 값 (clamp) | Weight | Line-height | Tracking |
|---|---|---:|---:|---:|
| H1 히어로 | `clamp(36px, 5.2vw, 72px)` | 800 | 1.16 | -0.045em |
| H2 문제 공감 | `clamp(28px, 3.6vw, 52px)` | 800 | 1.2 | -0.04em |
| H2 섹션 | `clamp(28px, 3.4vw, 48px)` | 800 | 1.22 | -0.04em |
| H2 신청 | `clamp(30px, 4vw, 56px)` | 800 | 1.2 | -0.045em |
| H2 FAQ | `clamp(24px, 2.4vw, 32px)` | 800 | 1.3 | -0.035em |
| H3 | `clamp(19px, 1.8vw, 24px)` ~ `clamp(22px, 2.2vw, 30px)` | 700~800 | 1.3~1.35 | -0.025~-0.03em |
| 전환 문장 | `clamp(24px, 3vw, 40px)` | 800 | 1.3 | -0.035em |
| 문제 번호·회차 번호 | `clamp(28px, 2.8vw, 40px)` | 700 | 1 | -0.04em |
| 브랜드 수치 | `clamp(40px, 4.4vw, 60px)` | 800 | 1.05 | -0.045em |
| 판매가 (패널) | `clamp(38px, 3.8vw, 52px)` | 800 | 1.05 | -0.035em |
| 본문 | `clamp(15px, 1.25vw, 17~18px)` | 400~500 | 1.6~1.7 | -0.015em |
| 캡션 | 13~14px | 400~700 | 1.6 | 0 |

- 강조는 바이올렛(라이트 배경) 또는 라일락(딥 배경) 글자색만. 배경 블록 강조는 쓰지 않는다.

## 4. 레이아웃·간격

| 속성 | Desktop | Mobile (≤767px) |
|---|---|---|
| 콘텐츠 최대 폭 | 1120px (`content-box`) | 100% |
| 좌우 패딩 | 56px | 24px |
| 섹션 상하 패딩 | 128px (수강 전·후 하단 104px) | 80px |
| 히어로 | min-height 660px, 상하 104px | 동일 비율 |
| 정보 카드 반경 | 10px | 10px |
| 패널 반경 | 12px | 12px |
| 버튼 | 높이 56px, radius 10px | 동일 |
| 고정 바 | 높이 68px, 버튼 46px | 하단 고정 |

## 5. 컴포넌트 규칙

### `MathCourseStickyBar` (00)
- 데스크톱 상단 sticky. 스크롤 480px 이후 `rgba(247,244,240,.97)` + 1px `#DED7E2`.
- 모바일 하단 fixed, 배경 `#FFFFFF`, 강좌명 숨김, safe-area 대응.

### Buttons
- Primary: `#7540D4` → hover `#6231BB`, 흰 글자 16px/700.
- 비활성(라이트): 배경 `#DED7E2`, 글자 `#746A79`.
- 비활성(딥, 신청 패널): 배경 `#3B1B4C`, 글자 `#D9C5F2`, 1px `#62496C`.
- Line: 1px `#251A2D`, 글자 `#251A2D`, hover 배경 `#FFFFFF`.
- focus-visible: 2px `#7540D4`, offset 3px.

### `MathHero` (01)
- H1이 섹션 위쪽 전체 폭에 놓이고, 그 아래 7:5 비율로 텍스트(설명 + 버튼 + 강좌 정보) / 빈 여백(`hero-space`, 모바일에서 숨김).
- 캔버스 고정값: H1 `width 890px; height 290px`, 아래 줄 `height 220px` → 개발 시 반응형으로 교체.

### `MathProblem` (02)
- 딥 오베르진 풀블리드. 3개 항목을 큰 번호(72px 칸) + 제목(200px 칸) + 설명의 가로 행으로, 1px `#62496C` 구분선.
- 둥근 카드 3개로 바꾸지 않는다.
- 전환 문장: 라일락 1줄 + 흰색 대형 문장(최대 960px).

### `BeforeAfterRows` (02)
- 상단 1px `#251A2D` 실선, 행마다 1px `#DED7E2`. `수강 전`(muted) / `수강 후`(700, 바이올렛).

### `BrandStats` (03, 조건부)
- 3열, 상단 1px `#251A2D`, 숫자 `#261331` + 단위 바이올렛. 우측 상단 `연구소·브랜드 전체 기준` 칩.

### `CertificateMarquee` (03, v1.1 신규)
- 실제 합격증 34장(개인정보 가림)이 왼쪽으로 계속 흐르는 띠.
- 카드: 폭 `clamp(200px, 20vw, 248px)`, 3:4, 배경 `#FFFFFF`, 1px `#DED7E2`, radius 12px, 안쪽 10px, `object-fit: contain`.
- 캡션 `NN / 34` (13px, `#746A79`).
- 34장 × 2 이어 붙임, `translateX(0 → -50%)` 60초 linear 무한. 두 번째 묶음 `aria-hidden`.
- 좌우 3% 흐림 mask. 호버·포커스 시 멈춤. `자동 넘김 멈춤 / 재생` LineButton(높이 44px, `aria-pressed`).
- 움직임 줄이기 설정: 애니메이션 없이 가로 스크롤.
- 이미지: 560px WebP를 HTML에 포함(34장 약 0.8MB). 운영 사이트는 서버 경로로 교체.

### `MathMethodSteps` (04)
- 카드 없이 3열 목록. 각 단계 상단 2px 선(01·03 `#251A2D`, 02 `#7540D4`), 번호 15px 바이올렛.

### `MathInstructorProfile` (04)
- 사진 자리 4:5(배경 `#EFE9F1`, 점선 `#DED7E2`, radius 10px, 최대 440px) + 정보. 사진 없으면 칸 제거.
- 강사명 `#261331`, 소개 1~2문장(muted), 이력 3행.

### `MathCurriculumList` (05)
- 상단 1px `#251A2D`, 행마다 1px `#DED7E2`. 번호(72px 칸) + 제목 + 설명 + 메타(작성할 풀이 · 점검 기준) + 오른쪽 강의 시간.
- 제목 옆 설명 1줄: "한 문제의 정답보다, 다음 문제를 풀어낼 기준을 익힙니다."

### `SessionBar` / 매회 구성 카드 (06)
- 시간 막대 56px, 핵심 구간 `#7540D4`, 나머지 `#3B1B4C`.
- 카드: 화이트, 1px `#DED7E2`, radius 10px.

### `FeedbackFlow` (06)
- 화이트 패널, 1px `#DED7E2`, radius 12px. 단계 카드 배경 `#F7F4F0`, 두 번째 카드만 1px 바이올렛.

### `InfoCards` / `NoticeList` (07)
- 카드 배경 `#F7F4F0`, radius 10px, 테두리 없음. `유의` 라벨 바이올렛, `안내` muted.

### `MathPricingPanel` (07)
- 딥 그라데이션 배경 위 패널 `rgba(38,19,49,.6)`, 1px `#62496C`, radius 12px, 패딩 36px.
- 판매가 흰색이 가장 크고 대비가 강하다. 보조 글자 라일락.

### `MathFAQAccordion` (07)
- 아이보리, 최대 800px, 1px 구분선, `+` 아이콘 바이올렛.

## 6. 섹션 리듬

| 블록 | 배경 | 구조 | 강조도 |
|---:|---|---|---:|
| 00 | 아이보리/화이트 | 기능형 바 | 45 |
| 01 | 아이보리 + 라일락 | 전체 폭 H1 + 7:5 하단 | 95 |
| 02 | 딥 오베르진 → 아이보리 | 번호 행 + 대형 문장 → 전·후 표 | 85 |
| 03 | 화이트 | 수치 + 합격증 흐름 띠 | 75 |
| 04 | 아이보리 | 3단계 선 + 2열 프로필 | 65 |
| 05 | 화이트 | 번호형 목록 | 55 |
| 06 | 라일락 틴트 | 시간 막대 + 카드 + 2단계 | 65 |
| 07 | 화이트 → 딥 → 아이보리 | 목록·탭 → 신청 → FAQ | 50 → 95 → 30 |

## 7. 이미지·모션·접근성

- 사진, 합격증, 교재, 영상은 승인된 원본만. 공식·그래프·도형을 AI로 만들어 채우지 않는다.
- 합격증은 `논술런 전체 합격 사례`로 표시(이 강좌 수강 확인 전).
- 모션: 전환 150~250ms. 합격증 띠만 상시 움직이며 멈춤 수단 제공. `prefers-reduced-motion` 존중.
- 대비: 본문 4.5:1, 큰 글씨 3:1. 바이올렛 `#7540D4` 위 흰 글자는 버튼 크기(16px/700) 기준으로 사용.
- 터치 영역 44px 이상, 키보드 포커스 표시.

## 8. CSS 토큰 시작점

```css
.math-course-detail {
  --math-bg: #F7F4F0;
  --math-surface: #FFFFFF;
  --math-surface-muted: #EFE9F1;
  --math-ink: #251A2D;
  --math-muted: #746A79;
  --math-deep: #261331;
  --math-deep-2: #3B1B4C;
  --math-violet: #7540D4;
  --math-violet-hover: #6231BB;
  --math-lilac: #D9C5F2;
  --math-border: #DED7E2;
  --math-border-dark: #62496C;
  --math-on-dark: #FAF7FC;
  --math-content-width: 1120px;
  --math-cert-card-width: clamp(200px, 20vw, 248px);
  --math-cert-loop-duration: 60s;
  color: var(--math-ink);
  background: var(--math-bg);
  font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", sans-serif;
}
```

## 9. 디자인 QA

- [ ] 인문논술 블랙 × 블루와 첫 화면부터 구별된다.
- [ ] 아이보리·오베르진·바이올렛 외 포인트 색이 없다.
- [ ] Eyebrow와 장식용 수학 기호가 한 곳도 없다.
- [ ] 문제 공감은 카드가 아니라 번호 행으로 유지된다.
- [ ] 합격증 띠가 멈춤·움직임 줄이기 설정에 반응한다.
- [ ] 캔버스 고정 크기(히어로 H1, 신청 H2)를 개발 시 반응형으로 바꿨다.
- [ ] CTA·가격·접근성 대비를 확인했다.
