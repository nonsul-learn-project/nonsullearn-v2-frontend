# Runtime Dependency Map

This map records Legacy PHP runtime dependencies and their boundary for the current V2 architecture. PHP removal is not in scope. It is static-source evidence only; Production presence is UNKNOWN until authorized read-only verification is performed.

| Dependency | Legacy definition → consumer → feature | V2 disposition | Production verification |
|---|---|---|---|
| MariaDB | `data/dbconfig.php:G5_MYSQL_*` → `common.php:160-168` → Legacy PHP app | retain under Legacy PHP; V2 uses existing read endpoint or Thin PHP Bridge canonical contract | host/port/user/password definition presence + `$config/$default` schema |
| `html2/data` | `G5_DATA_PATH` → session/tmp/uploads → Legacy PHP runtime storage | retain under Legacy PHP; no V2 runtime mount | directory/mode/subpath stat |
| SMTP | `G5_SMTP_*` → `mailer.lib.php:31-44` → mail | retain under Legacy PHP; no V2 credential | active setting and mail feature usage |
| LG/Toss/other PG DB rows | `$config/$default` → `shop/settle_*.inc.php` → checkout | retain under Legacy PHP/MariaDB; no V2 direct access | enabled/test/credential PRESENT/EMPTY fields |
| provider endpoints | request-derived `G5_URL` → return/cancel/result PHP handlers | retain Legacy PHP ownership; V2 routes hand off | provider registration (dashboard excluded here) |
| public/provider key files | key/cert/config paths → SDK | mount as protected provider asset where still required | file existence/classification |
| INICIS encrypted/binary material | `shop/inicis/key/*` → INICIS SDK | protected mounted secret file or provider replacement | file existence + provider guidance |
| KCP payment binaries | `shop/kcp/bin/pp_cli*` → KCP wrappers | PHP-specific; replace or retain compatible adapter | executable/file existence and active KCP state |
| KCP certification binaries | `plugin/kcpcert/bin/ct_cli*` → cert wrapper | PHP-specific; replace adapter | active identity state |
| OKName binaries | `plugin/okname/bin/okname*` → HP/IPIN wrapper | PHP-specific; replace adapter | active identity state |
| Apache rewrite/vhost | `.htaccess` → request routing | replace with Next/reverse-proxy routing | Production vhost/alias/rewrite inspection |
| cron/systemd/PHP CLI | no tracked declaration | UNKNOWN; may be removed/rebuilt | Production host inspection |

## Dependency Counts

- 1 database runtime dependency
- 1 retained filesystem dependency
- 1 optional SMTP dependency
- 8 provider families with static handlers/config consumers
- 9 key/certificate/config candidate paths
- 3 external binary families (KCP payment, KCP certification, OKName)
- 3 host-runtime classes requiring Production inspection (vhost/rewrite, cron, systemd/PHP jobs)

## Current V2 Boundary

PHP library/session behavior, PHP SDK wrappers, MariaDB business settings, `DATA_ROOT`, and binary wrapper code remain Legacy PHP dependencies. V2 does not directly access them. V2 reads use typed canonical contracts through verified existing endpoints or narrowly scoped Thin PHP Bridges; transaction and provider traffic remain with PHP. No provider/binary is marked active solely from source presence. Direct database ownership may be considered only in a separately approved future domain migration after semantics, security, rollback, and parity verification.
