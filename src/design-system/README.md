# design-system

Gate 2에서 채운다. Legacy 디자인을 **추출**하는 곳이며 새 디자인을 만드는 곳이 아니다 (ADR 0002).

```text
legacy/      Legacy 원본 CSS 복사본. 직접 수정 금지, 동기화 절차로만 갱신 (AGENTS.md §9)
tokens.css   Bootstrap 변수와 main.css의 실제 값 추출
primitives/  Container, Section, Button, Link, Heading, Text
```

순수 UI 영역이므로 `@/legacy`와 `@/analytics`를 import하지 않는다 (ESLint가 막는다).
