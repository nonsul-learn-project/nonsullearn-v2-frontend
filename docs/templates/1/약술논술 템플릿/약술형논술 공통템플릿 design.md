# 논술런 약술형논술 공통 상세페이지 — Design System

> Version 1.1 · 2026-10-15
> 기준: 캔버스 약술형논술 공통 템플릿 페이지의 `ShortTemplate.dc.html` 현재 상태
> 이전 기준: design(11).md v1.0 (Forest Editorial)
> Theme: **Forest Editorial / Ivory × Deep Forest × Emerald**
> Related: `약술형논술_공통템플릿_wireframe.md`, `약술형논술_공통템플릿_copy.md`

## 0. 변경 이력

| 버전 | 내용 |
|---|---|
| 1.0 | 아이보리 × 딥 포레스트 × 에메랄드, 인문·수리와 같은 구매 흐름 |
| 1.1 | 03 블록 합격 사례에 2026 합격증 34장 자동 흐름 갤러리 추가 |

## 1. 아트디렉션

- 인문논술(블랙 × 코발트 블루), 수리논술(아이보리 × 오베르진 × 바이올렛)과 확연히 구분한다.
- 핵심 감각: editorial restraint, precise grids, strong typography, deep green contrast, restrained gradients.
- 금지: 교육 일러스트(책·펜·원고지·칠판), 공식 배경, 3D 오브젝트, 잦은 글로우, 반복되는 3열 카드, 네온, 유리 질감, 허위 이미지·실적.
- Eyebrow 전면 금지. 가격·상태·합격 사례 범위 라벨은 허용.

## 2. 컬러 토큰

| Token | HEX | 용도 |
|---|---|---|
| `--sa-bg` | `#F6F7F1` | 메인 웜 아이보리 (02-B, 07 추천·확인, FAQ) |
| `--sa-surface` | `#FFFFFF` | 고정 바, 03, 05, 07 탭, 정보 카드, 합격증 카드 |
| `--sa-surface-muted` | `#EDF2E9` | 04 수업 루프·강사 (라이트 세이지) |
| `--sa-forest` | `#102B24` | 02-A 배경, 헤드라인, Primary 버튼, 회차 번호 |
| `--sa-forest-deep` | `#091C17` | 신청 영역, 06 그라데이션 시작 |
| `--sa-emerald` | `#168B62` | H1 강조 구절, 단계 화살표, 포커스 링 (큰 글자·장식만) |
| `--sa-emerald-ink` | `#0D6749` | 작은 글자 에메랄드(번호, `수강 후` 라벨, 체크 아이콘, 링크). `#168B62`가 작은 글씨 대비 4.5:1에 못 미쳐 대신 쓴다 |
| `--sa-emerald-light` | `#B7E7CF` | 다크 배경 강조 텍스트, 다크 Primary 버튼 |
| `--sa-ink` | `#1B2722` | 본문 |
| `--sa-muted` | `#60716A` | 보조 텍스트 |
| `--sa-border` | `#D5DFD6` | 라이트 구분선 |
| `--sa-border-dark` | `#35564B` | 다크 구분선 |
| `--sa-error` | `#A84646` | `유의` 라벨만 |

보조 색 (토큰 외, 현재 템플릿에서 사용)

| HEX | 용도 |
|---|---|
| `#D3E6DC` | 다크 배경 본문 (민트 그레이) |
| `#16382D` | 다크 패널·시간 막대 보조 구간·다크 비활성 버튼 |
| `#174637` | Primary 버튼 hover |
| `#D3F2E1` | 다크 Primary 버튼 hover |

### 색 사용 원칙

- 라이트(아이보리·화이트) 약 55%, 딥 포레스트 약 35%, 에메랄드 약 10%.
- 히어로는 밝게 시작하고, 문제 공감·매회 구성·신청은 딥 포레스트로 반전.
- 에메랄드는 H1 한 구절, 주요 강조, 단계 화살표에만.

### 그라데이션

```css
--sa-hero: linear-gradient(120deg, #F6F7F1 0%, #EAF3E9 72%, #D8EBDD 100%);
--sa-dark-feature: linear-gradient(135deg, #091C17 0%, #163E30 65%, #102B24 100%);
--sa-final-cta: radial-gradient(ellipse at 80% 15%, rgba(32,145,98,.22), transparent 50%), #091C17;
```

## 3. 타이포그래피

- 우선 `Pretendard Variable` → `Pretendard` → `Noto Sans KR` → `Apple SD Gothic Neo`. 캔버스는 Noto Sans KR로 렌더링.
- 숫자(`.num`): `Inter` + tabular-nums.
- 전역: 17px / line-height 1.65 / letter-spacing -0.015em / `word-break: keep-all`.

| 요소 | 값 (clamp) | Weight | Line-height | Tracking |
|---|---|---:|---:|---:|
| Hero H1 | `clamp(36px, 5.4vw, 76px)` | 800 | 1.15 | -0.045em |
| Section H2 | `clamp(28px, 3.4~3.6vw, 48px)` | 800 | 1.25 | -0.04em |
| 신청 H2 | `clamp(30px, 4vw, 56px)` | 800 | 1.22 | -0.045em |
| FAQ H2 | `clamp(26px, 2.6vw, 36px)` | 800 | 1.3 | -0.04em |
| H3 | `clamp(21px, 2.2vw, 30px)` | 700 | 1.35 | -0.03em |
| 카드 제목 | `clamp(19px, 1.8vw, 24px)` | 700 | 1.35 | -0.03em |
| 전환 문장 | `clamp(22px, 2.6vw, 36px)` | 800 | 1.35 | -0.035em |
| 회차 번호 | `clamp(32px, 3.6vw, 52px)` | 700 | 1 | -0.045em |
| 브랜드 수치 | `clamp(32px, 3.6vw, 48px)` | 800 | 1.1 | -0.04em |
| Price | `clamp(32px, 3.4vw, 48px)` | 800 | 1.2 | -0.04em |
| Body | `clamp(15px, 1.25vw, 17~18px)` | 400~500 | 1.65 | -0.015em |
| Meta | 13~14px | 500~700 | 1.5 | 0 |

## 4. 레이아웃 토큰

| 속성 | Desktop | Mobile (≤767px) |
|---|---|---|
| 최대 콘텐츠 폭 | 1120px (`content-box`) | 가용 폭 |
| 좌우 여백 | 56px | 22px |
| 섹션 상하 패딩 | 128px (02-B 하단 112px) | 80px |
| 히어로 | min-height 660px, 상하 104px | 동일 비율 |
| 패널 radius | 12px | 12px |
| 버튼 radius | 10px | 10px |
| 버튼 높이 | 56px (고정 바 48px) | 동일 |
| 고정 바 | 높이 72px | 하단 고정 |

- 섹션 헤드라인은 히어로·커리큘럼 좌측, 신청 중앙 등으로 정렬을 변주한다.

## 5. 섹션별 아트디렉션

| 블록 | 배경 | 레이아웃 | 강조 방식 |
|---|---|---|---|
| 00 Sticky | 화이트 | 논술런 + 강좌명 + 가격 + 버튼 | 포레스트 버튼 |
| 01 Hero | 아이보리 → 세이지 그라데이션 | 좌측 대형 H1, 우측 강좌 정보(왼쪽 2px 포레스트 선) | 에메랄드 한 구절 |
| 02-A Problem | 딥 포레스트 | 대형 메시지 + 4개 항목 2×2 구분선 | 민트 번호·강조 |
| 02-B Outcomes | 아이보리 | 머리행(2px) + 전/후 3행 | 굵기 대비 |
| 03 Proof | 화이트 | 검증 수치(조건부) + 합격증 흐름 띠 | 포레스트 숫자 |
| 04 Method/Instructor | 라이트 세이지 | 3단계 가로 + 화살표, 2열 프로필 | 상단 2px 선, 에메랄드 화살표 |
| 05 Curriculum | 화이트 | 큰 회차 숫자 + 구분선 | 숫자와 행간 |
| 06 Session/Feedback | 다크 포레스트 그라데이션 | 시간 막대 + 첨삭 2단계 | 민트 핵심 구간 |
| 07 Recommend/Info | 아이보리 | 체크 목록 + 정보 카드 | 체크 아이콘 |
| 07 Tabs | 화이트 | 선형 탭 | 하단 2px 포레스트 |
| 07 Pricing | 다크 + 에메랄드 광원 | 중앙 대형 문장 + 판매 패널 | 민트 CTA |
| 07 FAQ | 아이보리 | 구분선 아코디언 | 단정한 마무리 |

## 6. 컴포넌트 사양

### Buttons
- Primary Light: 배경 `#102B24`, 흰 글자, hover `#174637`. 문구 뒤 화살표(→ 또는 ↓).
- Primary Dark: 배경 `#B7E7CF`, 글자 `#102B24`, hover `#D3F2E1`.
- Secondary(Line): 투명, 1px `#102B24`, hover 배경 `#FFFFFF`.
- 비활성 라이트: `#D5DFD6` / `#60716A`. 비활성 다크: `#16382D` / `#B7E7CF` / 1px `#35564B`.
- focus-visible: 2px `#168B62`, offset 3px.

### Sticky Commerce
- 데스크톱 상단 sticky, 배경 항상 화이트. 스크롤 480px 이후 하단 1px `#D5DFD6`.
- 왼쪽에 `논술런` 워드(15px/800, 포레스트) + 강좌명 + 배지.
- 모바일 하단 fixed, 강좌명 영역 숨김, safe-area 대응.

### Problem Grid (02-A)
- `minmax(min(420px, 100%), 1fr)` 2열, 열 간격 56px, 상단·행 하단 1px `#35564B`.
- 번호(24~32px, 민트) + 제목(19~24px/700) + 설명(`#D3E6DC`).

### Outcome Table (02-B)
- 머리행: `수강 전`(muted) / `수강 후 기대할 학습 행동`(`#0D6749`), 하단 2px `#102B24`.
- 본문 3행, 1px `#D5DFD6`.

### Verified Stats (03, 조건부)
- 3열, 상단 1px `#102B24`. 값 자리 `검증된 수치`, 항목 `[수치 항목 n]`, 기준 `[ 기준일 · 집계 대상 · 산정 방식 · 약술형논술 포함 여부 ]`.
- 범위 칩 없음. 주석으로 "검증된 수치가 없으면 이 영역을 숨깁니다" 안내.

### CertificateMarquee (03, v1.1 신규)
- 실제 합격증 34장(개인정보 가림)이 왼쪽으로 계속 흐르는 띠.
- 카드: 폭 `clamp(200px, 20vw, 248px)`, 3:4, 배경 `#FFFFFF`, 1px `#D5DFD6`, radius 12px, 안쪽 10px, `object-fit: contain`.
- 캡션 `NN / 34` (13px, `#60716A`).
- 34장 × 2, `translateX(0 → -50%)` 60초 linear 무한, 두 번째 묶음 `aria-hidden`. 좌우 3% 흐림 mask.
- 호버·포커스 시 멈춤. `자동 넘김 멈춤 / 재생` Line 버튼(높이 44px, `aria-pressed`).
- 움직임 줄이기 설정: 애니메이션 없이 가로 스크롤.
- 이미지: 560px WebP를 HTML에 포함(34장 약 0.8MB). 운영 사이트는 서버 경로로 교체.

### Method Steps (04)
- 3단계 가로 배치, 각 단계 상단 2px `#102B24`, 단계 사이 에메랄드 `→`(장식, `aria-hidden`). 좁은 화면에서 줄바꿈.

### Instructor (04)
- 사진 자리 4:5(화이트, 점선 `#D5DFD6`, radius 12px, 최대 440px). 없으면 영역 제거.
- H3 `강사 소개` + 강사명(24~32px/800) + 소개 + 이력 3행(번호 `#0D6749`).

### Curriculum rows (05)
- 상단 1px `#102B24`, 행 1px `#D5DFD6`, 행 패딩 32px.
- 회차 번호(80px 칸, 32~52px, 포레스트) + 라벨 + 제목 + 개념·유형 설명 + 메타(작성할 답안 · 점검 기준) + 오른쪽 강의 시간.
- 7강 이상 펼치기.

### Session Bar (06)
- 3칸 고정: 개념·유형 학습(flex 1, `#16382D` + 1px `#35564B`) / 문항 풀이·답안 작성(flex 2, 민트 `#B7E7CF`, 포레스트 글자) / 해설·검토(flex 1). 높이 64px, radius 10px, 칸마다 라벨 + 시간.
- 첨삭 포함 시 막대 아래 1px 위아래 선 사이에 `첨삭 [N]회 포함` 한 줄.

### Feedback Flow (06)
- H3 + 두 카드(`#16382D`, radius 12px, 패딩 28px). 두 번째 카드만 1px `#B7E7CF` 테두리. 사이 민트 `→`.

### Recommend / Info (07)
- 추천 목록: 번호 대신 체크 아이콘(`#0D6749`).
- 정보 카드: 화이트, 1px `#D5DFD6`, radius 12px, 라벨 + 값 (보조 줄 없음).
- 안내 목록: `안내`(muted) / `유의`(`#A84646`).

### Pricing Panel (07)
- 최대 680px, 배경 `#16382D`, 1px `#35564B`, radius 12px, 패딩 36px. 보조 글자 민트, 판매가 흰색 최대 크기, CTA Primary Dark.

### FAQ (07)
- 아이보리, 최대 800px, 상단 1px `#102B24`, `+` 아이콘 `#0D6749`.

## 7. 접근성·반응형·모션

- 텍스트 대비 WCAG AA(본문 4.5:1, 큰 글씨 3:1). 작은 에메랄드 글자는 `#0D6749`.
- 키보드 포커스, 탭·아코디언 접근성, 터치 영역 44px 이상.
- 모션 150~250ms. 합격증 띠만 상시 움직이며 멈춤 수단 제공. `prefers-reduced-motion` 지원.
- 320px부터 1440px 이상까지 확인. 캔버스 고정값 히어로 H1 `950 × 204px`는 개발 시 반응형으로 교체.

## 8. CSS 토큰 초안

```css
:root[data-course-theme="short-answer"] {
  --sa-bg: #F6F7F1;
  --sa-surface: #FFFFFF;
  --sa-surface-muted: #EDF2E9;
  --sa-forest: #102B24;
  --sa-forest-deep: #091C17;
  --sa-forest-panel: #16382D;
  --sa-emerald: #168B62;
  --sa-emerald-ink: #0D6749;
  --sa-emerald-light: #B7E7CF;
  --sa-on-dark: #D3E6DC;
  --sa-ink: #1B2722;
  --sa-muted: #60716A;
  --sa-border: #D5DFD6;
  --sa-border-dark: #35564B;
  --sa-error: #A84646;
  --sa-radius: 12px;
  --sa-content-width: 1120px;
  --sa-cert-card-width: clamp(200px, 20vw, 248px);
  --sa-cert-loop-duration: 60s;
}
```

## 9. 디자인 QA

- [ ] 인문 블랙 × 블루, 수리 바이올렛과 시각적으로 구분된다.
- [ ] 아이보리·포레스트·에메랄드 외 포인트 색이 없다(유의 라벨 제외).
- [ ] Eyebrow가 한 개도 없다.
- [ ] 작은 에메랄드 글자에 `#0D6749`를 썼다.
- [ ] 합격증 띠가 멈춤·움직임 줄이기 설정에 반응한다.
- [ ] 가격·상태·CTA·FAQ가 반응형으로 정확히 작동한다.