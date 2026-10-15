# Gate 3 콘텐츠 필드 인벤토리

기준 자료는 세 유형의 `copy.md`·`wireframe.md`와 `docs/templates/1/HTML/` 예시 3종이다. Gate 1·2의 31개 Legacy 요소 매핑도 재사용했다. `design.md`는 표현 규칙만 제공하므로 콘텐츠 필드를 추가하지 않았다. `Eyebrow`는 어느 계약에도 없다.

| JSON path | 의미·형식 | 필수 | 유형 | 원본 / 출처 | 기본값 / 누락 렌더링 |
|---|---|---:|---|---|---|
| `schemaVersion`, `courseId`, `templateType` | 버전, 대상 ID, enum | 예 | 공통 | Gate 3 기술 메타 | 없음 / 검증 실패 |
| `hero.marketingHeadline`, `highlight` | 마케팅 문장·강조 문자열 | 예 | 공통 | 01 Hero / JSON | 유형 기본값 / 검증 실패 |
| `hero.keywords`, `summary`, `target`, `ctaLabel` | 키워드·소개·대상·CTA 문자열 | 아니오 | 공통 | 01 / JSON, `item.basic`, `information` | API fallback 또는 요소 숨김 |
| `sections[].id`, `visible` | wireframe 순서의 노출 제어 | 예 | 공통 | 02–07 / JSON | 기본 순서 / 검증 실패 |
| `assets.instructorPhoto`, `previewVideoUrl`, `certificates[]` | 이미지 `{src,alt}`·절대 https 영상 URL | 아니오 | 공통 | 03·04 / JSON | 숨김 |
| `assets.productImagePolicy` | 상품 이미지 보존 방식 | 예 | 공통 | Gate 2 G-02 / LEGACY | `legacy-gallery`; `item.images[]` 사용 |
| `proof.brandStats[]`, `preservationScope` | 검증 근거가 있는 브랜드 수치 3개 | 아니오 | 공통 | 03 / JSON | 기본 off; 증거 없으면 숨김 |
| `learningSystem.methodLine`, `promise`, `steps[]` | 문제 전환·약속·3단계 학습법 | 아니오 | 공통 | 02·04 / JSON | 고정 카피 또는 숨김 |
| `instructor.name`, `introduction`, `careers[]` | 강사 정보·최대 3개 이력 | 아니오 | 공통 | 04 / JSON | 강사 블록 숨김 |
| `curriculum.introduction`, `lessons[]` | 설명·회차별 title/description/output/check/duration | 아니오 | 공통 | 05 / JSON | 커리큘럼 숨김 |
| `learningSystem.session[]`, `feedback` | 매회 구성, 첨삭 횟수·안내 | 아니오 | 공통 | 06 / JSON | 06 숨김 |
| `faq[]` | 질문·답변 | 아니오 | 공통 | 07 FAQ / JSON | FAQ 숨김; 약관은 Legacy route |
| `contentMetadata.sourceDocuments`, `legacyHtml`, `reviewedAt` | 근거 문서, HTML 보존 정책, 검수일 | 예(검수일 제외) | 공통 | Gate 3 기술 메타 | `legacyHtml: visible`; 누락은 실패 |
| 운영 가격·정가·판매상태·주문 | 숫자/상태/폼 | 해당 | 공통 | 00·07 / EXISTING | `CourseFull`; JSON 경로 없음 |
| 후기·문의·공지, SEO H1 | 게시판 상태, 강좌명 | 해당 | 공통 | 07 / EXISTING | 기존 컴포넌트·`item.name` |
| `headHtml`, `descriptionHtml`, `tailHtml` | 기존 설명 HTML 세 종류 | 해당 | 공통 | 07-E / LEGACY | `legacyHtml`이 visible일 때 sanitize 후 보존 |

유형 차이는 레이아웃과 고정 카피에 있다: 인문 문제 4카드·시간 없는 커리큘럼, 수리 문제 3행·풀이/시간, 약술 문제 4항목 2×2·짧은 답안이다. 이 차이는 `templateType`으로 검증·선택하며, 문서에 없는 별도 콘텐츠 필드를 만들지 않았다.
