# Gate 3 콘텐츠 출처 매트릭스

`OPTIONAL`은 출처가 아니라 `required`/`visible`로 표현한다. JSON이 운영 데이터를 덮어쓰지 않는다.

| 영역 | source | 책임 / 충돌 정책 |
|---|---|---|
| `courseId`, 강좌명(H1), canonical·기존 URL | EXISTING | `CourseFull.item`; JSON은 식별 일치 검증만 한다. H1은 강좌명으로 유지한다 (G-09). |
| 판매가·정가·문의가·품절·재고·옵션·결제 | EXISTING | `CourseFull`, 기존 주문 폼이 최종 원본이다. 스키마에 price/listPrice/salePrice를 두지 않아 덮어쓰기가 불가능하다. |
| 마케팅 헤드라인·키워드·학습 설명·강사·회차·FAQ | JSON | 유형 기본값 + 강좌 오버라이드. API에 같은 요약이 있으면 JSON 값 우선, 없으면 `item.basic`/`information` fallback. |
| 이미지/영상 | JSON + LEGACY | 신규 강사·증빙 자산은 JSON; 상품 갤러리는 `item.images[]`와 기존 원본 팝업을 보존한다 (G-02). |
| 후기·문의·공지 | EXISTING | 기존 게시판·리뷰 contract가 원본; JSON은 개수·본문을 복제하지 않는다. |
| `it_head_html`, `it_explan`, `it_tail_html` | LEGACY | `contentMetadata.legacyHtml`이 `visible`인 동안 sanitizer를 거쳐 07-E에서 보존한다 (G-10). |
| 브랜드 수치·합격 사례 | JSON | 근거(`basis`)와 승인된 자산이 모두 있을 때만 `proof`를 켠다. 기본은 off. |

G-01의 미출처 20개는 JSON의 hero/instructor/curriculum/learningSystem/faq/proof 필드로 자리를 확정했을 뿐, 실제 운영 콘텐츠가 작성되었다는 뜻은 아니다.
