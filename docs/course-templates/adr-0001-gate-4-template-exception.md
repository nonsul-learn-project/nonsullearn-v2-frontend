# ADR 0001 — Gate 4 강좌 상세 템플릿 예외

상태: ACCEPTED (2026-10-16)

## 결정

사용자는 `feat/course-detail-templates` 브랜치에서 인문·수리·약술형 강좌 상세 템플릿 UI와 CSS를 구현하도록 승인했다. 이는 AGENTS.md §9의 Gate 6 이전 리디자인 금지에 대한 **강좌 상세 템플릿 개발 한정 예외**다.

## 경계

- 허용: `CourseDetailRouter`, JSON 콘텐츠 연결, scoped CSS, 세 템플릿과 테스트.
- 계속 금지: 운영 배포, 기준 브랜치 병합, Apache/Proxy 변경, PHP Bridge/운영 API contract 변경, 결제·주문 로직 변경.
- `COURSE_TEMPLATES` 기본값은 off이며, JSON 부재·검증 실패·유형 미결정은 기존 `CourseDetail`로 폴백한다.
- 강좌 URL, SEO, ISR, 구매·결제 기능은 기존 구현이 소유한다.

## 결과

이 예외는 다른 페이지 또는 기존 마이그레이션 Gate 제한을 완화하지 않는다. Gate 5 콘텐츠 작성과 운영 배포는 이 결정의 범위 밖이다.
