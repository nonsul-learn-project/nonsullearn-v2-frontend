# Gate 5-B Regression Report

- `CourseDetailRouter` remains behind `COURSE_TEMPLATES=off` by default.
- Unsupported categories never call the provider and continue to use `CourseDetail`.
- Provider validation failures return `null`, which follows the existing router fallback.
- `CourseOrderForm`, `CourseInfoTabs`, gallery, sanitized Legacy HTML, route metadata, H1 and ISR were not changed.
- JSON has no operating price or checkout field, so API-owned commerce data cannot be overwritten.
