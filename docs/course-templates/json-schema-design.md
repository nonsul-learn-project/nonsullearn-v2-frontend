# Gate 3 JSON Schema 설계

스키마는 JSON Schema Draft 2020-12이며 `src/content/course-templates/schemas/`에 있다. 공통 스키마는 `course-content.schema.json`, 유형 스키마는 해당 타입을 `const`로 좁히는 얇은 확장이다. 런타임은 Ajv 2020 검증기를 먼저 적용하고, 동일한 strict 구조의 Zod 계약(`types.ts`)으로 TypeScript 경계를 좁힌다.

```json
{
  "schemaVersion": 1,
  "courseId": "__default__",
  "templateType": "math",
  "hero": { "marketingHeadline": "푸는 데서 멈추지 말고, 풀이를 답안으로 써보세요.", "highlight": "풀이를 답안으로" },
  "sections": [{ "id": "proof", "visible": false }],
  "assets": { "productImagePolicy": "legacy-gallery" },
  "contentMetadata": { "sourceDocuments": ["수리논술 공통템플릿 copy.md"], "legacyHtml": "visible" }
}
```

`__default__`는 유형 기본 파일 전용 예약 ID이며 실제 강좌 파일에는 사용할 수 없다. 실제 강좌 가격, 판매 상태, 주문/결제 값은 의도적으로 모델 밖에 있다.
