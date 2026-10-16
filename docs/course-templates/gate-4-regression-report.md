# Gate 4 regression report

- Course route, metadata, canonical, revalidate and certification redirect are unchanged.
- `CourseOrderForm` and its POST fields were not changed; the renderer reuses it.
- Product gallery, reviews, questions and `descriptionHtml` stay in existing components.
- `headHtml`/`tailHtml` are sanitized and output only under the Gate 3 `legacyHtml: visible` policy.
- Unknown category, disabled switch, absent JSON and invalid JSON route to the existing `CourseDetail`.
