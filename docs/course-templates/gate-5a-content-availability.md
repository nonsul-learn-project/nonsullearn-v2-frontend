# Gate 5-A 콘텐츠 가용성

Gate 3 계약상 활성 템플릿에는 검증된 강좌 ID, 유형, Hero 기본/override, section 설정이 필요하다. 실제 강좌별로 강사·커리큘럼·Legacy HTML·상품 갤러리를 판단하려면 `course-full` 상세 응답이 필요하다.

| 상태 | 개수 | 근거 |
|---|---:|---|
| READY | 0 | 유형과 상세 Contract가 모두 확인된 목록 강좌 없음 |
| PARTIAL | 0 | 강좌별 상세를 읽지 못해 선택 필드만 부족하다고 판정할 근거 없음 |
| BLOCKED | 15 | 목록은 있으나 해당 ID의 상세 mock/HTTP 응답과 실제 category가 없음 |
| UNSUPPORTED / UNCLASSIFIED | 15 | 유형 판별 불가; 위 BLOCKED와 같은 대상의 유형 축 표기 |

15개 모두 강좌별 override가 **필요할 가능성**은 있으나, Gate 5-B의 실제 콘텐츠 작성 대상으로 확정하지 않는다. 현재 `src/content/course-templates/provider.ts`에는 의도적으로 실제 override가 없다.
