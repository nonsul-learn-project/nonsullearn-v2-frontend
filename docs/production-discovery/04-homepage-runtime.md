# Production homepage runtime verification

Date: 2026-10-01 KST. The SSH ED25519 host identity for `43.202.37.184:22` is now reconciled: it matches `known_hosts`, and the connection reaches the Production SSH service. Strict read-only verification was then attempted with the execution environment's available keys, but authentication was rejected before a remote command could run (`publickey,keyboard-interactive`). No host-key bypass or replacement, remote command, database query, HTTP request, or file mutation occurred.

## Evidence that is resolved

- Canonical Production root is `html2`, as stipulated and independently recorded in `03-upload-storage-inventory.md`: `/home/nonsul-learn.com/html2`.
- The tracked canonical entry follows `/` → `html2/index.php` → `common.php` → `_head.php` → `head.php` → page body → `_tail.php` → `tail.php`.
- `html2/.htaccess` enables rewriting but its only active fallback is `ErrorDocument 404 /index.php`; its example redirects and route rewrite are commented out.
- The current tracked `html2/index.php` differs materially from `html/index.php`: it is a static Bootstrap hero/content homepage. It contains no `get_banner()` call and none of banner IDs `1/3/5/9/15` or `2/4/6/10/16`.

## Banner runtime conclusion

The former homepage-banner-slot premise applies to `html/index.php`, not the canonical tracked `html2/index.php`. Therefore **no BannerAdapter is required for the current canonical homepage source**. `lib/lms.lib.php:get_banner()` and `skin/banner/basic/type1.skin.php` remain available for non-home surfaces, but are not a homepage dependency.

The banner renderer, when used elsewhere, selects `g5_shop_banner_table` by exact `bn_id` and current time between `bn_begin_time`/`bn_end_time`, ordered by `bn_order, bn_id DESC`. It renders only if `data/banner/<bn_id>` exists; URL uses `data/banner/<bn_id>?ver=<bn_time>`; external destinations pass through `shop/bannerhit.php?bn_id=…&url=…`; `bn_new_win` controls target. The actual live rows, active state, and image mapping for the former slots remain **STILL_UNKNOWN** because no safe Production connection was established.

The canonical current page directly references a public legacy teacher asset under `data/teacher/<opaque-id>`. Prior read-only inventory confirms `data/teacher` is present. Current existence and deployment-version parity are **BLOCKING** until a successfully authenticated, read-only file stat and index hash comparison are completed.

## Difference from prior homepage migration audit (Gate 6)

The original audit used `html/index.php` for the homepage slot analysis. The canonical-root correction invalidates that homepage-specific banner dependency; it does not change other route findings.

## Current runtime-verification status

Host-key mismatch is **RESOLVED**. Production `/` execution/root and deployed `html2/index.php` hash, direct teacher-asset existence, and all other remote runtime facts remain **BLOCKING** because SSH authentication was unavailable to this verification run. No authentication fallback or state-changing probe was attempted.
