# Gate 5-C Full Course Validation

## Scope

This is a complete validation of the accessible **local development catalog**, not an assertion about the operating catalog. Gate 5-A established that no operating Bridge inventory is available in this environment.

| Metric | Local mock | Operating catalog |
|---|---:|---:|
| surveyed cards | 4 | unavailable |
| detail fixture present | 4 | unavailable |
| supported template classification | 4 | unavailable |
| universal default merge succeeds | 4 | unavailable |
| override present | 0 | unavailable |
| template eligible when switch on | 4 | unavailable |
| legacy fallback due missing/invalid content | 0 | unavailable |
| unsupported | 0 | unavailable |
| content errors | 0 | unavailable |

The four local entries are `1001`, `1002`, `mock-math-001`, and `mock-short-001`. The first two are existing harness fixtures; the latter two are explicitly synthetic development fixtures. The validation iterates every visible category/page card, verifies a corresponding detail fixture, resolves its type, and validates its universal default content.

`1791259062` and `1787805378` are not included in this catalog because they have no verified local detail fixture. They remain Legacy-404 candidates rather than falsely valid courses.
