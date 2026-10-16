# Gate 5-C.1 — Implementation Report

Date: 2026-10-16

## Implemented

- Reworked the shared course-template renderer into source-order blocks: sticky bar, hero, empathy, outcomes, learning loop, optional proof/curriculum, course information, enrolment, community, optional FAQ, and retained Legacy HTML.
- Added source-derived common copy for all three types without adding course facts.
- Applied scoped theme tokens and separate compositions: humanities uses a dark navy/cobalt technical editorial layout, math uses an ivory/aubergine three-column condition/reasoning layout, and short answer uses an ivory/forest editorial layout with a sage learning-loop band.
- Made the sticky bar display the existing operating price and route only to the existing order form anchor. No checkout request, API Contract, route, SEO, or ISR setting changed.
- Added contract coverage for the three source hero defaults and for default hiding of unverified content.

## Responsive implementation

The stylesheet includes desktop grid composition and a single-column breakpoint at 767px. At narrow widths the sticky title/price collapse, hero changes to one column, problem grids and learning loops stack, and course-info cards stack. This provides the intended 320px, 390px, 768px and 1440px layout rules in code.

## Intentional conditional content

The templates still do not render instructor profiles, curriculum lessons, proof statistics/certificates, feedback promises, or FAQs without a verified override. This is required by the copy sources and Gate content contract: the source documents label those values as actual course data, not reusable default marketing copy.

## Preserved integration

- `CourseOrderForm`, its POST fields, option selection and Legacy handoff remain unchanged.
- `CourseInfoTabs`, reviews/questions and sanitized Legacy HTML remain mounted.
- Product gallery remains the existing `CourseOrderForm` integration.
- Course name remains the page H1 and existing metadata/ISR path is untouched.
