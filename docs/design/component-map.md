# PHP → V2 Component Map

작성일: 2026-10-02  
근거: `../nonsul-learn-html1/html2/head.php`, `tail.php`, `index.php`

## 공통 셸 (Gate 2)

| PHP | V2 컴포넌트 | legacy 위치 | Gate |
|---|---|---|---:|
| `head.php` desktop 메뉴·드롭다운·인증 영역 | `SiteHeader`, `DesktopNav`, `AuthArea` | `head.php:17-124` | 2 |
| `head.php` offcanvas | `MobileNav` | `head.php:126-244` | 2 |
| `tail.php` 메뉴·사업자 정보·패밀리사이트·약관 | `SiteFooter` | `tail.php:5-97` | 2 |
| 공통 레이아웃 | `Container`, `Section`, `Button`, `Link`, `Heading`, `Text` | Bootstrap/`main.css` 클래스 | 2 |

## 홈 (Gate 5)

| 섹션 | legacy 위치 | 상호작용 | 데이터 필드 | Gate |
|---|---|---|---|---:|
| `HeroCarousel` | `index.php:9-112` | Client | slides, CTA link, image, alt | 5 |
| `StatsBar` | `index.php:114-136` | Server | stats(label, value) | 5 |
| `CurriculumSection` | `index.php:138-206` | Server | courses, badges, descriptions, links | 5 |
| `WhySection` | `index.php:208-248` | Server | reasons(number, title, description) | 5 |
| `CompareTable` | `index.php:250-298` | Server | columns, rows | 5 |
| `ProcessSteps` | `index.php:301-333` | Server | steps | 5 |
| `CeoMessage` | `index.php:335-357` | Server | heading, body, credential | 5 |
| `BriefingPartners` | `index.php:359-389` | Server | partners | 5 |
| `Testimonials` | `index.php:391-440` | Server | testimonials(link, label, title, student, quote) | 5 |
| `FaqAccordion` | `index.php:442-662` | Client | faq(question, answer, initiallyOpen) | 5 |

`MobileNav`와 `DesktopNav`의 dropdown은 Client Component다. 나머지 공통 셸과 위 표에서 Server로 표기한 항목은 Server Component다. 홈 데이터 원칙은 `src/content/home.ts`의 타입 있는 데이터다.
