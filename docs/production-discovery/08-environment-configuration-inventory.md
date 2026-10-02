# Environment Configuration Inventory

Audit point: `chore/gitignore-normalization` / `54cf71dc96bee20cf98d5afba48d657629cb0d96`. Static/read-only repository work; all values are `[REDACTED]`. `html2/` is canonical Production. Production `html2/data/dbconfig.php` existence is separately **VERIFIED**; it is absent from Git/this checkout.

## Executive Summary

Existing MariaDB `nonsullearndb` remains the Production database and source of truth for Legacy PHP Core domains. Current V2 does not directly use MariaDB, legacy password hashes, or `html2/data/`; it obtains narrowly scoped read data through verified existing endpoints or Thin PHP Bridges using canonical contracts. No PostgreSQL, Firebase, database migration, or filesystem migration is in scope. PHP boot includes `data/dbconfig.php`. **VERIFIED_CODE**: `html2/common.php:58-60,154-168`; `html2/config.php:281,346,352`.

`G5_SMTP_USER/PASS` are tracked in `html2/config.php:403-404` and consumed by PHPMailer at `html2/lib/mailer.lib.php:35-44`; rotate them. Payment/SMS/social/identity/site/shop settings remain in existing MariaDB `$config`/`$default`; do not migrate or copy them to `.env`.

## Configuration Sources

| Source | Definitions | V2 disposition | Evidence |
|---|---|---|---|
| Production `html2/data/dbconfig.php` | `G5_MYSQL_*` | Legacy PHP-only DB bootstrap; not a V2 env contract | `html2/common.php:154-168`; Production presence VERIFIED |
| `html2/config.php` | timezone, URL/path, charset, cookie, SMTP | code behavior; SMTP env | `html2/config.php:13,273,279,281,312-358,399-404` |
| existing MariaDB `config/default` | `$config/$default` | Legacy PHP reads rows; V2 uses endpoint/Bridge read models only | `html2/common.php:363-817` |
| `html2/src/aws-upload.php` | bucket/region/profile | conditional retained feature | `html2/src/aws-upload.php:4-45` |

## Area Results

### DB

`G5_MYSQL_HOST/USER/PASSWORD/DB` feed Legacy PHP `sql_connect`/`sql_select_db`; charset is `G5_DB_CHARSET`. **VERIFIED_CODE**: `html2/common.php:154-168`; `html2/lib/common.lib.php:1738-1754`; `html2/config.php:273,281`. Password is SECRET; host/port/name are Legacy PHP deployment configuration. They are not V2 variables. Actual values/port: UNKNOWN.

### FS, URL, Session/Cookie

`G5_PATH/G5_URL` derive from request path/host; `G5_DATA_PATH` derives Legacy PHP data/session paths. **VERIFIED_CODE**: `html2/common.php:45-54`; `html2/config.php:312-358`. `html2/data/` remains Legacy PHP runtime storage, not V2 runtime storage. Attachment staging: `html2/lib/mailer.lib.php:77-83`. Cookie domain, permissions and session compatibility: UNKNOWN.

### Payment / SMTP / SMS

LG uses DB `cf_lg_mid/cf_lg_mert_key`; Toss uses `cf_toss_client_key/cf_toss_secret_key`; INICIS/KCP use `de_inicis_*`/`de_kcp_site_key`. **VERIFIED_CODE**: `html2/shop/lg/xpay_request.php:47-81`; `html2/shop/toss/toss_approval.php:8-10`; `html2/shop/settle_inicis.inc.php:6-58`; `html2/shop/settle_kcp.inc.php:30-65`. Keep these in MariaDB; vault extraction is optional post-cutover hardening. SMTP maps to `SMTP_*` and is mail-feature critical. **VERIFIED_CODE**: `html2/config.php:399-404`; `html2/lib/mailer.lib.php:31-44`. iCode fields are DB-backed/admin configured and consumed by SMS code. **VERIFIED_CODE**: `html2/uAdmin/sms_admin/config.php:9-113`; `html2/plugin/sms5/sms5.lib.php:150-168,295-400`.

### Cloud / OAuth / Identity / Key / App / Business

AWS uploader defines bucket/region/profile; credential file is absent from checkout. **VERIFIED_CODE**: `html2/src/aws-upload.php:4-45`. Hybrid social providers/enablement are DB-backed. **VERIFIED_CODE**: `html2/plugin/social/includes/providers.php:4`; `html2/skin/social/social_login.skin.php:4,22`. OKName/KCP/INI adapters exist. **VERIFIED_CODE**: `html2/plugin/{okname,kcpcert,inicert}/_common.php:2`; `html2/bbs/register_form.php:146-148`. Timezone/charset/debug are code constants. **VERIFIED_CODE**: `html2/config.php:13,261-273,390-443`. Site/admin/notification, board/lecture/shop rules, payment modes and feature flags remain MariaDB business settings. **VERIFIED_CODE**: `html2/common.php:363-817`; `html2/uAdmin/config_form.php`; `html2/uAdmin/shop_admin/configform.php`.

## html vs html2

| Config | html | html2 | Relation |
|---|---|---|---|
| DB bootstrap | missing checkout file | missing checkout; Production exists | SAME checkout / ONLY_HTML2 Production role |
| G5 URL/path/charset | present | present | SAME |
| SMTP auth | absent | tracked definitions | ONLY_HTML2 |
| DB payment/SMS consumers | present | present | SAME |

## Definition → Consumer Graph

```
Production html2/data/dbconfig.php:G5_MYSQL_* → Legacy PHP → MariaDB nonsullearndb
V2 → verified existing endpoint or Thin PHP Bridge → Legacy PHP → MariaDB nonsullearndb
html2/config.php:G5_DATA_PATH → Legacy PHP data/session/tmp/uploads
html2/config.php:G5_SMTP_* → mailer.lib.php → mail (FEATURE_CRITICAL)
MariaDB config/default → shop/settle_* + sms5 → checkout/notifications (FEATURE_CRITICAL when enabled)
```

## Unknowns

Production DB endpoint/port/credentials/co-located definitions, `APP_URL`, cookie domain, data permissions/session compatibility, active external providers and their values are UNKNOWN.
