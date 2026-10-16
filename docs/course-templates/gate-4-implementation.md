# Gate 4 implementation

The `/courses/[id]` server page retains its ISR, metadata, authorization redirect and Bridge reads. It now passes the existing data to `CourseDetailRouter`.

The switch is `COURSE_TEMPLATES=off` by default. `src/content/course-templates/provider.ts` has no real course entries because Gate 5 owns verified production course JSON. Therefore every current course safely uses `CourseDetail`; the new renderer is covered by contract/resolver tests and is ready for a verified override.

New rendering is scoped under `.ct-root[data-course-theme]`; global Bootstrap and Legacy styles are untouched. The renderer deliberately reuses `CourseOrderForm` and `CourseInfoTabs`, preserving form field names, gallery popups, community UI and sanitized Legacy HTML.
