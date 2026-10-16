# Gate 5-C.1 — Design & Copy Mapping

Date: 2026-10-16  
Scope: `feat/course-detail-templates` only. The source Markdown and HTML files were read but not changed.

## Source comparison

| Source block | Humanities | Math | Short answer | Implementation status |
| --- | --- | --- | --- | --- |
| 00 sticky application bar | Course title, operating price, application anchor | Same | Same | IMPLEMENTED — operating fields remain from `CourseFull` |
| 01 hero | dark navy / cobalt, reading-to-answer copy | ivory / aubergine, solving-to-written-solution copy | ivory / forest, concept-to-precise-answer copy | IMPLEMENTED — source hero copy in default JSON; course H1 remains the operating course name |
| 02-A problem empathy | four documented problem statements | documented condition / reasoning / writing rows | documented concept / question / writing / review rows | IMPLEMENTED |
| 02-B learning outcome | documented before/after rows | documented before/after rows | documented before/after rows | IMPLEMENTED |
| 03 proof and success cases | conditional verified data | conditional verified data | conditional verified data | IMPLEMENTED AS CONDITIONAL — hidden without verified override |
| 04 learning loop | three documented steps | three documented steps | three documented steps | IMPLEMENTED; course-specific explanation remains override-only |
| 04 instructor | verified instructor data | verified instructor data | verified instructor data | MISSING BY DESIGN — hidden until approved override exists |
| 05 curriculum | actual course sessions | actual course sessions | actual course sessions | PARTIAL — renderer supports it, defaults deliberately hide it until actual curriculum is supplied |
| 06 session / feedback | actual delivery and feedback conditions | actual delivery and feedback conditions | actual delivery and feedback conditions | MISSING BY DESIGN — no factual default exists |
| 07 recommendation / pre-course checks | fixed recommendation plus factual delivery terms | same | same | PARTIAL — operating lecture count/period and official-guideline notice render; course-specific terms remain legacy/override owned |
| 07 reviews, inquiries, notices | existing board integration | existing board integration | existing board integration | IMPLEMENTED through `CourseInfoTabs` |
| 07 enrolment / FAQ | existing checkout plus factual FAQ | same | same | IMPLEMENTED / CONDITIONAL — `CourseOrderForm` is reused; FAQ only renders approved override data |
| Legacy HTML and gallery | preserve legacy content | preserve legacy content | preserve legacy content | IMPLEMENTED through existing components and policy |

## Copy ownership

The defaults contain only literal common copy from the three `copy.md` documents: hero headlines, problem statements, learning outcome rows, learning-loop labels, enrolment headings, and source CTA labels. They contain no statistics, instructor profile, curriculum lessons, success case, pricing, or availability claim.

`CourseFull` remains the owner of course name/H1, price, order form data, category, description HTML, gallery and duration/count values. An override may add verified course-specific content; it does not override operating price or checkout fields.

## Explicit non-mappings

Source placeholders such as `[강사명]`, `[회차 라벨]`, `[첨삭 횟수]`, `[합격증]`, and `[환불 조건]` are not copy to fabricate. Their sections are intentionally hidden until approved data exists. Decorative eyebrows are absent.
