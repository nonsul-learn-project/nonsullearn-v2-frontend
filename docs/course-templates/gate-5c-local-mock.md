# Gate 5-C Local Course Mock

## Final 404 cause

The old development category adapter always emitted a 15-item production-like list fixture, while the detail adapter only had `1001`–`1004`. The visible-list/detail intersection was zero, so every card reached the existing `course === null → notFound()` path.

## Resolution policy

The local catalog now emits only entries backed by `course-full` fixtures and honors category and page inputs. It never fabricates a detail response for IDs copied from the production-like list fixture.

| Category | Page | local URL | fixture kind |
|---|---:|---|---|
| 1010 | 1 | `/courses/1001` | existing harness fixture |
| 1010 | 2 | `/courses/1002` | existing harness fixture |
| 3020 | 1 | `/courses/mock-math-001` | development-only synthetic |
| 4010 | 1 | `/courses/mock-short-001` | development-only synthetic |

The synthetic IDs are not operating IDs, and their names, price, images and descriptions explicitly identify them as development fixtures. Existing `1791259062` and `1787805378` intentionally remain 404 in mock mode until a verified `course-full` response can be captured.

With `COURSE_TEMPLATES=on`, these category IDs resolve to humanities, math and short-answer respectively and Gate 5-B provides the type default JSON. With `COURSE_TEMPLATES=off`, the same fixture detail data renders through `CourseDetail`.

## Local runtime evidence

2026-10-16 local `next dev` probe:

| Switch | URLs | result |
|---|---|---|
| off | `/courses/1001`, `/courses/mock-math-001`, `/courses/mock-short-001` | 200, existing renderer (no `.ct-root`) |
| on | same three URLs | 200, template renderer (`.ct-root`) |
| either | `/courses/1791259062` | 404, as required for an unbacked production-like ID |

`/courses/category/1010`, `/courses/category/3020`, and `/courses/category/4010` also returned 200 with the local catalog.
