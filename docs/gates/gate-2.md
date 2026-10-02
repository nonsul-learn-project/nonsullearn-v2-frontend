# Gate 2 — Design Parity Foundation

작성일: 2026-10-02
상태: **PARTIAL — L5 baseline capture 대기**

| 항목 | 결과 | 증거 |
|---|---|---|
| Gate 1 문서 동기화 | DONE | `a9435fc`, ADR 0003~0005 반영 |
| Bootstrap 5.3.2, legacy CSS, Noto Sans KR | DONE | `a9435fc`, `scripts/verify-legacy-css.mjs` |
| main.css URL assets | DONE | `src/design-system/src/nonsul-learn/img/` (3 files) |
| Tokens / primitives | DONE | `src/design-system/tokens.css`, `src/design-system/primitives/` |
| Header/Footer/MobileNav/Auth | DONE | `dd8c3e3`, `tests/component/site-shell.test.tsx` |
| Visual harness | DONE (baseline pending) | `8b7a17e`, `tests/visual/shell.spec.ts` |
| `pnpm check` | PASS | 299 Vitest tests + build |

Visual parity: **PENDING (사람: baseline 캡처 후 `pnpm test:visual`)**.

Gate 1 remains `IN PROGRESS` because Vercel Preview evidence is pending; this does not block Gate 2 repository work.
