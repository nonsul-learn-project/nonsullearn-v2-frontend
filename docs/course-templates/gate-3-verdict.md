# Gate 3 판정

## 결과: PASS (계약·검증 범위)

세 템플릿의 copy/wireframe과 예시 HTML, Gate 1·2 매핑을 바탕으로 필드 인벤토리·출처 경계·Draft 2020-12 스키마·strict TypeScript 계약·기본 JSON·병합/폴백 로더·L1 테스트를 추가했다. 기존 상세 UI, `CourseDetail.tsx`, `CourseOrderForm.tsx`, PHP Bridge는 변경하지 않았다.

G-01은 JSON 필드로 관리 위치를 확정했고, G-02는 `legacy-gallery`, G-09는 API 강좌명 H1 유지, G-10은 기본 `legacyHtml: visible`으로 계약화했다.

운영 콘텐츠 작성과 사람 확인이 필요한 사실(실강좌 ID, 강사 이력, 합격 사례/자산, 브랜드 통계 근거)은 이 Gate의 PASS에 포함하지 않는다. 이들은 기본 비노출이며 Gate 4에서 검증된 강좌 오버라이드로만 활성화할 수 있다.

Gate 4 연결점은 `loadCourseTemplate(courseId, templateType, override)`와 `CourseTemplateContent`다. 반환값이 `null`이면 현재 `CourseDetail`을 사용해야 한다.
