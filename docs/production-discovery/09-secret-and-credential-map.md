# Secret and Credential Map

All values are `[REDACTED]`. Production `dbconfig.php` exists by separate VERIFIED investigation but is not in Git/checkout. V2 does not directly connect to MariaDB; Legacy PHP retains database authority and V2 uses verified endpoints or Thin PHP Bridges.

## Summary

Tracked SMTP credential symbols are confirmed. DB credentials come from Production `dbconfig.php`; payment/SMS/social/identity credentials remain MariaDB-backed. Any vault move is optional post-cutover hardening.

## Tracked Secret Candidates

| Definition | Value | Git state | Consumer | Evidence |
|---|---|---|---|---|
| `G5_SMTP_PASS` | `[REDACTED]` | TRACKED_SECRET | PHPMailer password | `html2/config.php:404`; `html2/lib/mailer.lib.php:35-38` |
| `G5_SMTP_USER` | `[REDACTED]` | TRACKED_SECRET | PHPMailer account | `html2/config.php:403`; `html2/lib/mailer.lib.php:37,44` |
| INICIS `keypass.enc/rndseed.binary` | `[REDACTED]` | UNKNOWN_SECRET_CANDIDATE | INICIS SDK | `html2/shop/inicis/key/` |
| LG `mall.conf/lgdacom.conf` | `[REDACTED]` | UNKNOWN_SECRET_CANDIDATE | LG SDK | `html2/plugin/lgxpay/lgdacom/conf/` |

## Ignored Runtime Secret Files

| Path | State | Evidence |
|---|---|---|
| `html2/data/dbconfig.php` | MISSING checkout / VERIFIED Production | `html2/common.php:154-160`; separate production investigation |
| `html2/src/credentials.ini` | MISSING | filesystem/Git check |

## Service Map

| Service | Definition | Secret Present | Git State | Consumer | Rotation | Evidence |
|---|---|---|---|---|---|---|
| DB | Production `G5_MYSQL_PASSWORD` | YES `[REDACTED]` | Production only | `sql_connect` | UNKNOWN | `html2/common.php:154-168` |
| SMTP | `G5_SMTP_USER/PASS` | YES `[REDACTED]` | TRACKED_SECRET | PHPMailer | ROTATION_REQUIRED | `html2/config.php:403-404`; `html2/lib/mailer.lib.php:35-44` |
| Payment | DB `cf_lg_*`, `cf_toss_*`, `de_*` | UNKNOWN | MariaDB | settlement | UNKNOWN | `html2/shop/settle_*.inc.php` |
| SMS | DB `cf_icode_*` | UNKNOWN | MariaDB | SMS | UNKNOWN | `html2/uAdmin/sms_admin/config.php:9-113` |
| OAuth/Cloud/Cert | DB/provider/key candidates | UNKNOWN | UNKNOWN | feature adapters | UNKNOWN | `html2/plugin/social/includes/providers.php:4`; `html2/src/aws-upload.php:4-45` |

## Rotation Requirements

SMTP: **ROTATION_REQUIRED**. DB and DB-backed providers: **UNKNOWN**; retain MariaDB defaults and assess independently after cutover. Public CA/public-key material: **NO_ROTATION_EVIDENCE**.

## Unknowns

Actual values, active services, credential validity/scopes/age, DB port and key classification are UNKNOWN; no Production config/DB/API was read.
