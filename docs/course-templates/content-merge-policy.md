# Gate 3 콘텐츠 병합·폴백 정책

병합 순서는 유형 기본 JSON → 강좌별 JSON → 기존 API 운영 데이터(운영 전용 필드)다.

- 객체는 재귀 병합한다. 빠진 키는 기본값을 유지한다.
- 일반 배열은 강좌 JSON이 전체 교체한다. 부분 결합으로 순서가 바뀌지 않는다.
- `sections[]`만 안정 키 `id`로 병합하여 wireframe 순서를 유지한다. `{id, visible:false}`는 섹션 숨김이다.
- 명시적 `null`은 지원하지 않으며 검증 실패다. 값을 제거하려면 선택 섹션을 `visible:false`로 바꾼다.
- 미지원 키, 가격 키, Eyebrow는 strict 검증으로 거부한다.
- 강좌 JSON이 없으면 `loadCourseTemplate()`은 `null`을 반환한다. Gate 4 라우터는 반드시 현재 `CourseDetail`을 사용한다. 빈 신규 템플릿을 렌더하지 않는다.
- 강좌 JSON의 `courseId`는 요청 ID와 같고 `templateType`은 기본 파일과 같아야 한다. 불일치는 배포/CI 오류다.
- `legacyHtml: hidden`은 사람이 신규 매핑 검수를 완료한 강좌에만 설정할 수 있다. 기본은 `visible`이다.
