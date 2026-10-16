# Gate 5-A 카테고리·유형 분류

## 결론

검증 가능한 강좌별 `ca_id`가 없어 **15개 모두 UNCLASSIFIED**다. `10/30/40` resolver는 Gate 2에서 확인한 운영 카테고리 규칙이지만, 현재 accessible mock은 그 규칙을 검증할 데이터가 아니다.

| 검사 | 결과 | 영향 |
|---|---|---|
| fixture 메타데이터 | category `10`, 이름 `인문논술` | fixture 원본의 단일 표기일 뿐 |
| mock `getCategoryList(id, page)` | 요청한 `id`로 category.id만 치환 | 1010/3020/4010/4020 모두 같은 15개 items 반환 |
| item별 categoryId | category-list contract에 없음 | 실제 소속을 알 수 없음 |
| 제목 | 수리 제목 1개와 인문/무표기 제목 혼재 | 제목 기반 분류는 금지 |

따라서 `humanities: 0`, `math: 0`, `short-answer: 0`, `unsupported/unclassified: 15`로 기록한다. 운영 Bridge에서 각 카테고리의 모든 페이지를 읽고, 각 상세 `item.category.id`를 확인한 뒤에만 resolver 결과를 확정할 수 있다.
