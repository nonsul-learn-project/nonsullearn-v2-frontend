# Gate 4 component map

`CourseDetailRouter` is the only page-level switch. It preserves `CourseDetail` whenever `COURSE_TEMPLATES=off`, category resolution is unknown, or no verified course JSON exists.

| Component | Responsibility |
|---|---|
| `CourseDetailRouter` | kill switch and legacy fallback |
| `resolveCourseTemplate` | verified category prefixes 10/30/40 only |
| `CourseTemplate` | scoped renderer, common sections, preserved order form/gallery/tabs/HTML |
| `HumanitiesTemplate`, `MathTemplate`, `ShortAnswerTemplate` | named template entry points; palette and structural variation are selected by `data-course-theme` |
| `CourseOrderForm`, `CourseInfoTabs` | unchanged existing checkout, gallery, review, question, and Legacy-detail behavior |
