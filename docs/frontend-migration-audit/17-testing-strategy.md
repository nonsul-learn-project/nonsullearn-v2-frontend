# Testing strategy

Create a captured, sanitized parity fixture set from read-only Production responses/data. For each migrated route test HTML/title/meta, links/query preservation, screenshot at desktop/mobile, keyboard menu/carousel behavior, anonymous/member/level-8 state, empty/error/not-found states, and PHP adapter error/redirect mapping. Contract-test each gateway against a non-production legacy environment. Run checkout, auth, LMS progress, correction and board write tests only against staging with test accounts and test PG configuration; Production remains read-only for this gate.
