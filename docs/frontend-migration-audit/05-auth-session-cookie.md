# Auth, session, and cookie behavior

`common.php` starts PHP session, sets `HttpOnly`, and marks it Secure on HTTPS; cookie domain comes from `G5_COOKIE_DOMAIN` (runtime configuration). It resolves logged-in `$member` and updates login metadata. `bbs/login_check.php` validates member/password, intercept/leave/certification states and supports social hooks. Auto-login sets `ck_mb_id` and `ck_auto` for 31 days. `logout.php` clears them and session state.

Parity requirements: header swaps login/logout; `mb_level > 7` exposes correction link; unauthenticated `/lecture/mypage.php` redirects to login with URL; lecture module displays login alert/redirect behavior; membership forms retain legacy validation/error/return URL semantics. V2 should read session identity through a same-site PHP bridge; PHP retains cookies and auth source of truth.
