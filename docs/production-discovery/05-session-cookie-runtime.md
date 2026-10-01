# Session and cookie runtime

## Confirmed implementation topology

`html2/common.php` starts the PHP session before resolving the member. Default cookie name is `PHPSESSID`; it becomes `G5…PHPSESSID` only under the source-defined special document-root/domain conditions. Cookie path is `/`; `HttpOnly` is true; `Secure` is true when PHP observes HTTPS. `G5_COOKIE_DOMAIN` is configured at runtime (tracked default is empty). Session lifetime configuration is 10,800 seconds. `session_save_path()` is commented out, so the actual save handler/path is PHP runtime configuration and is **STILL_UNKNOWN**.

When certification or shop is enabled, `session_start_samesite()` may append `Secure; HttpOnly; SameSite=None` on compatible HTTPS clients. Otherwise no SameSite attribute is explicitly emitted by this source. The active branch depends on runtime `$config` and request User-Agent/HTTPS state.

Member resolution is: session `ss_mb_id` → `get_member()` → intercept/leave/token checks → `$member`; `$is_member` is true iff `$member['mb_id']` is set. A guest gets `mb_level = 1`. `head.php` exposes login/logout based on `mb_id` and conditionally shows correction navigation for `mb_level > 7`. Login writes `ss_mb_id`; auto-login uses `ck_mb_id` and `ck_auto`; logout clears those cookies and session state. URLs are `/bbs/login.php` and `/bbs/logout.php`.

## V2 implication

Next.js must never parse, write, or access PHP session storage. On the same HTTPS host, the browser calls the PHP-backed `ViewerAdapter` through same-origin `/v2-api/viewer.php` and receives a sanitized viewer model. Apache removes the `Cookie` header when proxying to Vercel, so the Next.js server cannot inspect the PHP session. Treat cookie name/domain, actual SameSite, and active save handler as deployment configuration, not compile-time assumptions.

## Runtime status

Cookie name/path/security source behavior is **RESOLVED**. Actual host cookie domain, actual Set-Cookie attributes per active branch, session handler/path, and a live anonymous/authenticated response are **BLOCKING** for declaring cross-runtime session coexistence verified. Host-key verification now succeeds, but the read-only SSH run could not authenticate, so no remote PHP configuration was inspected. No HTTP probe was used because it could create or mutate a PHP session.
