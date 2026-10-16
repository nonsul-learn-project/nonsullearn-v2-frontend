# Gate 5-C Mock Consistency

The local catalog/detail invariant is now tested: every card emitted by category `1010` pages 1–2, `3020` page 1, and `4010` page 1 has an exact `course-full` mock entry. No unseen page is fabricated.

| Category/page | IDs | source |
|---|---|---|
| 1010/1 | `1001` | existing harness fixture |
| 1010/2 | `1002` | existing harness fixture |
| 3020/1 | `mock-math-001` | synthetic development fixture |
| 4010/1 | `mock-short-001` | synthetic development fixture |

The category mock and detail mock use the same four source fixtures. This fixes the previous zero-intersection fault without treating production-like list IDs as fixture-backed data.
