# Complete Production Configuration Map

Scope: canonical legacy tree `html2/`; values are never recorded and all secrets are `[REDACTED]`. Existing MariaDB `nonsullearndb` and `html2/data/` remain Legacy PHP resources; V2 reaches approved read data through existing endpoints or Thin PHP Bridges, never direct DB/runtime access. Evidence class is **VERIFIED_CODE** unless explicitly marked UNKNOWN.

## Storage-location Decision

| Surface | Location | Definition → consumer → feature | Active |
|---|---|---|---|
| DB host/port/name | ENV_DEPLOYMENT | Production `dbconfig.php:G5_MYSQL_*` → `html2/common.php:160-161` → all app | ACTIVE (Production dbconfig existence separately VERIFIED) |
| DB user/password | ENV_SECRET | `G5_MYSQL_USER/PASSWORD` → `sql_connect` → all app | ACTIVE; values UNKNOWN |
| app URL/data root | ENV_DEPLOYMENT | `G5_URL/G5_DATA_PATH` → callbacks/session/tmp/upload → all app | LIKELY_ACTIVE | 
| V2 PHP-session signing | n/a | PHP session authority remains Legacy PHP | not a V2 requirement |
| SMTP constants | ENV_DEPLOYMENT + ENV_SECRET | `G5_SMTP_*` → `lib/mailer.lib.php:31-44` → mail | LIKELY_ACTIVE; tracked password rotation-required |
| `$config/$default` operational fields | MARIADB_SETTING | DB rows → settlement/SMS/social/identity/admin consumers → features | UNKNOWN activation by provider |
| INICIS/LG file material | FILE_SECRET_OR_CERT | key/config paths → provider SDK → payment | UNKNOWN |
| timezone/charset/debug/device | CODE_CONSTANT | `config.php` constants → bootstrap/features | ACTIVE/LIKELY_ACTIVE |
| PHP-only binary adapters | LEGACY_ONLY pending replacement | `plugin/*/bin` → PHP wrapper → identity/payment | UNKNOWN |

## MariaDB Runtime Settings Contract

Table names are **UNKNOWN** from this static audit; the logical records are the `$config` and `$default` rows loaded by `html2/common.php:363-817`. Verify actual table names/columns read-only before implementation.

| Logical record / fields | Consumer | Feature | Secret | V2 treatment |
|---|---|---|---|---|
| `$config.cf_title`, `cf_admin`, `cf_email_*`, `cf_use_email_certify` | `bbs/*`, `lib/mailer.lib.php` | site/mail policy | admin email: sensitive operational data | Legacy PHP only; approved V2 read model if needed |
| `$config.cf_sms_use`, `cf_sms_type`, `cf_icode_server_ip`, `cf_icode_server_port`, `cf_icode_id`, `cf_icode_pw`, `cf_icode_token_key` | `uAdmin/sms_admin/config.php:9-113`; `plugin/sms5/sms5.lib.php:150-400` | SMS/iCode | id/password/token YES | Legacy PHP only |
| `$config.cf_lg_mid`, `cf_lg_mert_key` | `shop/lg/xpay_request.php:47-81` | LG U+ | mert key YES | Legacy PHP only |
| `$config.cf_toss_client_key`, `cf_toss_secret_key` | `shop/toss/toss_approval.php:8-10`; cancel/result | Toss | secret YES | Legacy PHP only |
| `$default.de_inicis_mid`, `de_inicis_sign_key`, `de_inicis_*` flags | `shop/settle_inicis.inc.php:6-58` | INICIS | sign key YES | Legacy PHP only |
| `$default.de_kcp_site_key`, KCP method flags | `shop/settle_kcp.inc.php:30-65` | KCP | site key YES | Legacy PHP only |
| NicePay/KakaoPay/NaverPay/SamsungPay field families | `shop/settle_nicepay.inc.php`, `shop/kakaopay/*`, `shop/settle_naverpay.inc.php`, `mobile/shop/samsungpay/*` | alternate PG | UNKNOWN | Legacy PHP only; activation UNKNOWN |
| `$config.cf_social_login_use`, `cf_social_servicelist` | `extend/social_login.extend.php`; `skin/social/*` | social login | provider values UNKNOWN | Legacy PHP only |
| `$config.cf_cert_use`, `cf_cert_*` | `bbs/register_form.php:146-148`; identity plugins | identity verification | possible provider credential | Legacy PHP only |
| board/group/content/lecture/correction/shop rules, skins, templates, upload/feature flags | `$config/$default`, admin forms | product operations | no by default | Legacy PHP only; Bridge read model if approved |

## Runtime Dependencies

| Dependency | Classification | Evidence | V2 action |
|---|---|---|---|
| `html2/data/` session/tmp/uploads | ENV_DEPLOYMENT `DATA_ROOT` | `config.php:346,352`; `lib/mailer.lib.php:77-83` | mounted/writable runtime dependency |
| request URL/HTTPS/host | ENV_DEPLOYMENT `APP_URL` | `common.php:45-54`; `config.php:312-317` | explicit canonical origin |
| Asia/Seoul, UTF-8, debug/device behavior | CODE_CONSTANT | `config.php:13,261-273,390-443` | TS constants |
| KCP/OKName command binaries | LEGACY_ONLY / external-binary gap | `plugin/kcpcert/bin/*`, `plugin/okname/bin/*` | replace with supported API/adapter or retain compatible runtime |
| KCP payment binaries | LEGACY_ONLY / external-binary gap | `shop/kcp/bin/pp_cli*` | replace/validate before PHP removal |
| cron/systemd | UNKNOWN | no tracked cron/systemd definition found | Production host verification required |

## Key and Certificate Inventory

| Path | Classification | V2 handling | Evidence |
|---|---|---|---|
| `plugin/lgxpay/lgdacom/conf/ca-bundle.crt` | PUBLIC_CERT | provider SDK asset | tracked path |
| `shop/kcp/bin/pub.key` | PUBLIC_KEY | provider SDK asset | tracked path |
| `shop/inicis/key/pgcert.pem` | PUBLIC_CERT (filename/placement only) | mounted SDK asset pending provider confirmation | tracked path |
| `shop/inicis/key/{keypass.enc,INIpayTest/keypass.enc,iniescrow0/keypass.enc,rndseed.binary}` | UNKNOWN | mounted secret file or provider replacement; do not expose as env | tracked paths |
| `plugin/lgxpay/lgdacom/conf/{mall.conf,lgdacom.conf}` | PROVIDER_CONFIG / UNKNOWN_SECRET_CANDIDATE | mounted protected config or provider replacement | tracked paths |

## Complete ENV Namespace

Legacy configuration variables remain under PHP/runtime ownership. Current V2 must not define `DB_*`, `SESSION_SECRET`, `DATA_ROOT`, or provider/SMTP credentials from this map. V2 environment configuration is defined in the V2 repository and supports only its site and Bridge boundary.
