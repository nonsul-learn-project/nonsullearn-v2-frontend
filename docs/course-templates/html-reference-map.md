# Gate 0 — 예시 HTML 분석 및 MD 문서 대조

작성일: 2026-10-15
대상: `docs/templates/1/HTML/{인문논술,수리논술,약술논술} 상세페이지 템플릿.html`

## 1. 결론 먼저

**이 HTML 3개는 정적 HTML이 아니다.** 캔버스(디자인 도구)가 내보낸 **자기추출형 번들**이며,
실제 마크업은 gzip+base64 블롭 안에 들어 있다. 브라우저에서 열면 JS가 블롭을 풀어
React 18 UMD 런타임으로 그린다.

따라서:

- **마크업과 CSS는 "복사해서 쓰는" 대상이 아니라 "읽고 옮기는" 대상이다.** 자동 변환 불가.
- 그러나 추출해 보면 **마크업 구조는 매우 깨끗하고 포팅이 기계적이다.** 재사용 가치가 높다.
- 공용 CSS 블록(2.8KB)은 **거의 그대로 재사용 가능하다.**

## 2. 파일 구조

각 파일은 390행이고, 그중 2행이 전체 용량의 99%를 차지한다.

| 구성 | 위치 | 내용 |
|---|---|---|
| 부트스트랩 HTML + 로더 스크립트 | 1~374행 | `__bundler_placeholder`, 블롭 해제 로직 |
| `<script type="__bundler/manifest">` | 376행 (758~818KB) | 자원 맵. gzip+base64 |
| `<script type="__bundler/ext_resources">` | 380행 | CDN 참조 (react 18.3.1, react-dom 18.3.1) |
| `<script type="__bundler/page_order">` | 384행 | `[]` |
| `<script type="__bundler/template">` | 388행 (1.26~1.29MB) | **JSON 인코딩된 실제 HTML 문서** |

### manifest 안의 JS 3개 — 세 파일 모두 동일 (md5 일치)

| 크기 | 정체 | 재사용 가치 |
|---|---|---|
| 10,751 B | `react.production.min.js` | 없음 (레포는 React 19.2.4) |
| 131,835 B | `react-dom.production.min.js` | 없음 |
| 45,305 B | `dc-runtime` (캔버스 전용 템플릿 런타임, `// GENERATED from dc-runtime/src/*.ts`) | 없음 |

→ **세 템플릿의 JS는 바이트 단위로 같다.** 디자인 차이는 전부 `__bundler/template`의 마크업·스타일에 있다.
즉 HTML에서 가져올 것은 **마크업과 CSS뿐이고, 로직은 0이다.**

manifest의 나머지 항목은 Inter 웹폰트 woff2 조각들과 합격증 이미지 34장(560px WebP, 약 0.8MB)이다.

## 3. 템플릿 본문의 실제 모양

`__bundler/template`을 디코드하면 다음 구조가 나온다 (base64 data URI 제거 후 인문 465KB → 마크업만 60KB).

```html
<x-dc>
  <helmet>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <style>  /* 385KB — Inter @font-face 조각 전부. 버린다 */ </style>
    <style>  /*  2.8KB — 공용 유틸 CSS. 재사용한다  */ </style>
  </helmet>
  <div class="page" style="...">
    <!-- 기존 공통 헤더 자리 -->
    <div style="height:56px; border:1px dashed ...">[ 기존 논술런 공통 헤더 ]</div>
    <!-- BLOCK 00 · Sticky Commerce -->
    <div class="sbar" style="... background: {{bar.bg}}; border-bottom: 1px solid {{bar.line}}">
      ...
      <sc-if value="{{showList}}"><s class="num">{{d.listPrice}}</s></sc-if>
      <span class="num">{{d.salePrice}}</span>
      <sc-if value="{{sale.on}}"><a class="btn" href="#enroll">{{d.ctaLabel}}</a></sc-if>
      <sc-if value="{{sale.off}}"><button class="btn btn-off" disabled>{{sale.label}}</button></sc-if>
    </div>
    ... BLOCK 01 ~ 07 ...
  </div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"dataMode":{...},"bodyTone":{...},...}'>
```

### 템플릿 문법

| 문법 | 의미 | React 대응 |
|---|---|---|
| `{{d.title}}` | 데이터 보간 | `{content.title}` |
| `{{t.bgA}}`, `{{bar.bg}}` | 테마 토큰 보간 | CSS 커스텀 프로퍼티 `var(--ct-bg-a)` |
| `<sc-if value="{{sale.on}}">` | 조건부 렌더 | `{saleOn && (...)}` |
| `<sc-for>` (커리큘럼·합격증) | 반복 | `.map()` |
| `sc-camel-view-box="0 0 24 24"` | SVG 속성 케이스 보정 | `viewBox="0 0 24 24"` |
| `class="num"` | tabular-nums 숫자 | 그대로 유지 |

`data-props`에 선언된 노브가 **wireframe.md의 "캔버스 Tweaks" 표와 1:1로 일치한다** (인문 기준):

```
dataMode(enum fields|sample) · bodyTone(enum dark|light) · saleState(enum available|sold_out|coming_soon|unknown)
hasDiscount(bool) · enrollInfo(bool) · showSession(bool) · showProof(bool) · instructorPhoto(bool)
previewVideo(bool) · lessonCount(int 1~24, 기본 4) · featMaterial(bool) · featFeedback(bool)
$preview: { width: 1440, height: 9400 }
```

→ **문서가 실제 프로토타입과 동기화되어 있다.** wireframe.md §5를 조건부 렌더링 명세로 믿고 써도 된다.

## 4. 재사용 가능한 CSS (인문 기준, 2,804 B)

세 템플릿 모두 같은 구조이고 색상 값만 다르다. 이 블록은 **토큰화해서 공용으로 올릴 수 있다.**

```css
.wrap { max-width:1120px; margin:0 auto; padding:0 40px; box-sizing:border-box }
.sec  { padding:120px 0; scroll-margin-top:80px }
.num  { font-family:Inter,...; font-variant-numeric:tabular-nums }
.btn  { display:flex; align-items:center; justify-content:center; min-height:54px; padding:0 24px;
        border-radius:8px; background:#315EF5; color:#fff; font-weight:700; font-size:16px;
        border:0; cursor:pointer; transition:filter .2s }
.btn:hover { filter:brightness(1.12) }
.btn-off   { background:#1D2A43; color:#8B9AB5; cursor:not-allowed }
.btn-line  { ...; border:1px solid #315EF5; background:transparent; min-height:52px }
.btn:focus-visible, .btn-line:focus-visible, .lnk:focus-visible,
.tab:focus-visible, summary:focus-visible { outline:2px solid #91ADFF; outline-offset:3px }
.lnk  { min-height:44px; font-size:15px; font-weight:600; text-decoration:underline; text-underline-offset:4px }
.tab  { min-height:48px; padding:0 20px; border:0; background:transparent; font:inherit }
details summary { list-style:none; cursor:pointer }
details summary::-webkit-details-marker { display:none }
details .pm { transition:transform .2s }
details[open] .pm { transform:rotate(45deg) }

@media (max-width:767px) {
  .wrap { padding:0 24px }
  .sec  { padding:80px 0 }
  .sbar { position:fixed !important; top:auto !important; bottom:0; left:0; right:0;
          background:#050814 !important; border-top:1px solid #303B50 !important;
          border-bottom:0 !important; padding-bottom:env(safe-area-inset-bottom) }
  .sbar-name { display:none !important }
  .page { padding-bottom:96px }
}
@media (max-width:360px) { .wrap { padding:0 18px } }
html { scroll-behavior:smooth }
@media (prefers-reduced-motion:reduce) { *{transition:none!important} html{scroll-behavior:auto} }

/* 합격증 흐름 띠 */
.cert-view  { overflow:hidden; padding:4px 0 8px;
              mask-image:linear-gradient(90deg,transparent 0,#000 3%,#000 97%,transparent 100%) }
.cert-track { display:flex; width:max-content; animation:certFlow 60s linear infinite }
.cert-view:hover .cert-track,
.cert-view:focus-within .cert-track { animation-play-state:paused !important }
@keyframes certFlow { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@media (prefers-reduced-motion:reduce) {
  .cert-track { animation:none }
  .cert-view  { overflow-x:auto; mask-image:none }
}
```

**재사용 판정**: 색상 리터럴만 `var(--ct-*)`로 바꾸면 세 테마가 이 한 벌을 공유한다.
`.cert-view` / `.cert-track`의 호버·포커스 정지와 `prefers-reduced-motion` 분기는
직접 다시 쓰기 어려운 품질이므로 **그대로 가져오는 것을 권장한다.**

세 번째 `<style>` 블록(76 B, `x-dc>*{display:none!important}`)은 캔버스 런타임 전용 — 버린다.

## 5. 섹션 구조 — HTML vs MD 문서 대조

세 파일 모두 마크업이 **두 번** 들어 있다 (정적 미리보기용 `data-dc-static` 복제 + 템플릿 본문).
따라서 아래 `<section>` 개수는 실제 블록 수의 2배다.

| | 인문 | 수리 | 약술 |
|---|---|---|---|
| `<section>` 총개수 | 20 | 22 | 22 |
| 실제 블록 수 | 10 | 11 | 11 |
| 02 블록 분할 | 통합 (문제 공감 + 수강 전·후 한 섹션) | 02-A / 02-B 분리 | 02-A / 02-B 분리 |

인문 템플릿에서 추출한 섹션 목록 (앵커 id 포함):

| 순서 | `id` / 특징 | 배경 | MD 문서와 일치? |
|---|---|---|---|
| 00 | `div.sbar` (sticky) | `{{bar.bg}}` | ○ wireframe §1 |
| 01 | (id 없음) 히어로 | `--gradient-hero` 리터럴 | ○ |
| 02 | `section.sec` | `{{t.bgA}}` | ○ (문제 공감 + 수강 전·후 통합) |
| 03 | `section.sec` | `{{t.bgB}}` + `border-top` | ○ |
| 04 | **`#method`** | `{{t.bgA}}` | ○ |
| 05 | **`#curriculum`** | `{{t.bgB}}` | ○ |
| 06 | `section.sec` | `--gradient-learning` 리터럴 | ○ |
| 07-A | `section.sec` | `{{t.bgA}}` | ○ |
| 07-B | `section` (`padding:0 0 96px`) 탭 | `{{t.bgA}}` | ○ |
| 07-C | **`#enroll`** | `--gradient-cta` 리터럴 | ○ |
| 07-D | **`#faq`** | `{{t.bgA}}` | ○ |

**불일치 0건.** 섹션 순서·앵커·배경·조건부 노출이 wireframe.md와 그대로 맞는다.

### 문서에만 있고 HTML에는 없는 것

| 항목 | 설명 |
|---|---|
| `#cases` 앵커 | 인문 wireframe §2가 03 블록 합격 사례에 `#cases`를 표시했으나 추출한 마크업에 해당 id가 없다. 영향 없음 (내부 링크 없음) — 구현 시 추가하면 된다 |
| 수리 신청 영역 요약 문장 | 수리 wireframe §2가 직접 적어 두었다: "현재 강좌 요약 문장이 없고, H2 앞에 빈 칸(flex 6)이 남아 있다. 요약 문장을 다시 넣을지, 빈 칸을 지울지 정해야 한다" → **열린 결정** |

### HTML에만 있고 문서에는 없는 것 (= 구현 시 버릴 것)

| 항목 | 처리 |
|---|---|
| `[ 기존 논술런 공통 헤더 ]` / `[ 기존 논술런 공통 푸터 ]` 점선 자리표시자 | 버린다 — V2는 `SiteShell`이 소유 |
| 캔버스 고정 크기 (`width:880px; height:195px` 등 히어로 H1) | **반드시 버린다.** design.md §8 체크리스트도 "개발 시 반응형 값으로 바꾼다"고 명시 |
| Inter `@font-face` 조각 전체 (385KB) | 버린다 — 웹폰트 전략은 별도 결정 |
| `dc-runtime`, `<x-dc>`, `<sc-if>`, `data-props` | 버린다 — React 조건부 렌더로 대체 |
| 합격증 34장 base64 WebP (약 0.8MB) | **운영에서는 서버 경로로 교체.** 세 design.md 모두 명시 |
| 예시 강좌 더미 데이터 | 실제 데이터로 취급하지 않는다 (요청서 §2) |

## 6. 더미 데이터 — 실제 정보로 쓰지 말 것

예시 HTML과 copy.md의 `예시` 열에 들어 있는 다음 값들은 **「인문논술 기본반 압축특강 4회」라는
예시 강좌의 값**이며, 다른 강좌의 사실로 사용할 수 없다. copy.md §1도 같은 경고를 담고 있다.

| 종류 | 예시 값 | 비고 |
|---|---|---|
| 가격 | `440,000원` → `284,800원` | 반드시 `item.listPrice` / `item.price`로 대체 |
| 강좌명 | 인문논술 기본반 압축특강 4회 | `item.name` |
| 수강 기간 | 시작 후 90일 | `item.extra[2]` |
| 신청 기간 / 정원 | 2026.09.10~ / 60명 | `item.extra[3]` / `item.extra[4]` |
| 브랜드 수치 | `4,005명` · `15만 부` · `98%` | copy.md §9가 "기준일·산정 방식을 확인했다" 체크를 요구. **미확인 상태** |
| 합격 사례 글 3건 | 고려대 미디어학과 / 연세대 정치외교 / 연세대 경영 | `dataMode: sample`에서만 표시되는 예시. 검증 전 사용 금지 |
| 합격증 34장 | 2026학년도 합격증 | 사용 동의·개인정보 가림 완료 여부 미확인 |
| 교재비 차감액 | 회당 15,000원 / 총 60,000원 | 강좌별로 다르다 |
| 강사명·이력 | 전부 `[ ]` 빈 자리 | 생성 금지 (요청서 §12) |

## 7. 포팅 난이도 평가

| 대상 | 난이도 | 근거 |
|---|---|---|
| 섹션 구조 → JSX | **낮음** | 마크업이 평평하고 의미적. `<sc-if>` → `&&`, `<sc-for>` → `.map()` 기계적 변환 |
| 공용 CSS 2.8KB | **낮음** | 색상만 토큰화 |
| inline style → CSS Modules | **중간** | 마크업 전체가 inline `style`이다. AGENTS.md §6.5(색상 하드코딩 금지)를 지키려면 전부 옮겨야 한다. 분량이 많다 |
| 합격증 흐름 띠 | **중간** | CSS는 그대로 쓰되 이미지 34장을 서버 자산으로 올리고 `next/image` 정책을 정해야 한다 |
| `clamp()` 타이포 스케일 | **낮음** | design.md 표가 값을 전부 명시 |
| 테마 3종 분기 | **낮음** | 같은 구조 + 다른 토큰. 단 02/03/04 섹션의 **레이아웃이 유형별로 다르다** (인문 4카드 / 수리 3번호행 / 약술 2×2 격자) → 공용화 불가 구간 |
| 캔버스 고정 크기 해제 | **낮음** | 지우면 끝. design.md가 지시 |
