# ADR 0002 — Design Parity: Legacy CSS 재사용

상태: ACCEPTED  
작성일: 2026-10-02

## 맥락

별도 마케팅 랜딩은 없으며 `html2/index.php` 홈이 랜딩 역할을 한다. V2의 목적은 새 디자인이 아니라 기존 PHP 화면의 디자인을 유지한 component 단위 이전이다.

## 결정

- Legacy와 동일한 Bootstrap 5.3.2 CSS(jsDelivr)와 `main.css`를 global CSS로 사용한다. `main.css` 복사본은 `src/design-system/legacy/main.css`에 두고 원본 `html2/src/nonsul-learn/css/main.css` 및 복사 시점 SHA256 `e0dce7a53e7c3643c0eaa180a85bde3d2ff01016b209e4302acfc9d100367f1a`를 기록한다.
- Bootstrap 변수와 `main.css`의 실제 값을 `src/design-system/tokens.css`에 추출만 한다. 새 값은 만들지 않는다.
- Legacy와 같은 마크업 구조·클래스명을 유지하고, Bootstrap JS 대신 React로 carousel/accordion/dropdown/offcanvas 동작을 재현한다.
- 폰트는 Legacy의 Noto Sans KR(Google Fonts CSS, weight 300/400/500/700/900)를 같은 결과로 로드한다. 초기 이미지는 `NEXT_PUBLIC_LEGACY_ASSET_HOST`에서 참조하며 공용 로고/favicon만 `public/` 복사를 허용한다.
- `head.php`/`tail.php` 구조를 `SiteHeader`, `DesktopNav`, `AuthArea`, `MobileNav`, `SiteFooter`로 매핑한다. 홈 문구·수치·FAQ·후기·링크는 `src/content/home.ts`에 타입 있게 둔다.
- legacy 기준 이미지는 사람이 `scripts/capture-legacy-baseline.ts`로 한 번 캡처해 `tests/visual/baseline/legacy/`에 커밋한다. 375×812, 768×1024, 1440×900에서 visual diff를 비교한다. 초기 `maxDiffPixelRatio`는 2%(TBD-조정 가능)이며 Gate 2는 리뷰 필수, Gate 6은 필수 통과다.
- 접근성 결함 수정은 시각 차이가 거의 없는 범위에서 허용하며, 차이가 생기면 parity 문서에 의도된 변경으로 기록한다.

## 대안

Tailwind 재구현은 기각한다. 기존 클래스·DOM·CSS 결과를 재구현하면 visual parity 기준이 바뀌고, Gate 2의 추출 목적과 맞지 않는다.

## 결과

장점: 기존 화면과의 비교가 직접적이고 stylesheet drift를 SHA256으로 추적한다. 비용: Legacy CSS 복사본 동기화, visual baseline 관리, React 상호작용 재현이 필요하다.

## 재검토

Gate 6 이후 페이지 단위 스타일 정리 필요성을 검토한다. Gate 6 전 리디자인, Bootstrap 제거, 클래스명 변경은 범위 밖이다.
