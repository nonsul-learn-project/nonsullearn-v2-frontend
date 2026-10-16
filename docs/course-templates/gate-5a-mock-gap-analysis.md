# Gate 5-A Mock 정합성 분석

## 목록과 상세의 격차

- category fixture: 15개 page-1 항목, pagination은 총 30개/2페이지라고 주장.
- category mock: `page`를 반영하지 않아 page 2도 같은 fixture가 된다.
- detail mock: `1001`, `1002`, `1003`, `1004` 4개 fixture만 제공.
- 두 집합의 교집합: **0개**.

따라서 목록의 15개 링크는 모두 `getCourseDetailMock(id) → null`이고, `/courses/[id]`의 `notFound()`로 이어진다. 이는 mock의 완결성 문제이며 운영 Bridge에서 해당 강좌가 없다는 증거가 아니다.

특히 `1791259062`와 `1781593666`은 이 격차의 두 사례다. 목록 링크 자체의 ID 형식은 상세 route contract를 통과한다.

## 이번 Gate의 조치

요청 범위에 따라 fixture, adapter, API, UI는 수정하지 않았다. 후속 단계에서는 Bridge의 공개 상세 응답을 Contract로 검증한 뒤, 동일 ID의 `course-full` fixture를 추가하거나 목록 mock을 상세 mock과 정합시켜야 한다.
