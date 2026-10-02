# Provider Runtime Contract

All provider status is static-source based; module presence alone never proves activation. Values are `[REDACTED]`.

| Provider / feature | Status | Current config location | Definition → consumer | Legacy endpoint → V2 endpoint proposal | V2 requirement |
|---|---|---|---|---|---|
| LG U+ | LIKELY_ACTIVE (given historical order context; credentials unverified) | MariaDB `cf_lg_*` | `settle_lg.inc.php:19-43` → `shop/lg/xpay_request.php:47-81` | `shop/lg/returnurl.php`, mobile `shop/lg/{returnurl,note_url,cancel_url}.php` → `/api/payments/lg/{return,notify,cancel}` | preserve return/cash-notice/cancel handlers |
| Toss | LIKELY_ACTIVE (given historical order context) | MariaDB `cf_toss_*` | `shop/toss/toss_approval.php:8-10` | `shop/toss/{returnurl,toss_approval,toss_cancel,toss_result}.php` → `/api/payments/toss/{return,approve,cancel,result}` | preserve authorization/cancel flow |
| INICIS | UNKNOWN | MariaDB `de_inicis_*` + files | `settle_inicis.inc.php:6-58` | `shop/inicis/{inistdpay_return,inistdpay_result,inipay_cancel}.php` → `/api/payments/inicis/{return,result,cancel}` | confirm enabled and file contract |
| KCP | UNKNOWN | MariaDB `de_kcp_*` + binaries | `settle_kcp.inc.php:30-65` | `shop/kcp/{pp_ax_hub,pp_cli_hub,orderpartcancel}.php` → `/api/payments/kcp/{approve,cancel}` | binary/API replacement decision |
| NicePay | UNKNOWN | MariaDB fields UNKNOWN | `shop/settle_nicepay.inc.php` | `shop/nicepay/{nicepay_result,cancel_process}.php` → `/api/payments/nicepay/{result,cancel}` | verify config/activation |
| KakaoPay | UNKNOWN | MariaDB fields UNKNOWN | `shop/kakaopay/*` | `shop/kakaopay/{*_return,*_result}.php` → `/api/payments/kakaopay/{return,result,cancel}` | verify |
| NaverPay | UNKNOWN | MariaDB fields UNKNOWN | `shop/settle_naverpay.inc.php`, `shop/naverpay/*` | order/wish endpoints → `/api/payments/naverpay/*` | verify |
| SamsungPay | UNKNOWN | MariaDB `de_inicis_mid` reference | `mobile/shop/samsungpay/orderform.1.php:17` | mobile order script → `/api/payments/samsungpay/*` | verify |
| iCode SMS | UNKNOWN | MariaDB `cf_icode_*` | `uAdmin/sms_admin/config.php:9-113` → `sms5.lib.php` | no inbound callback proven | retain DB config; optional vault later |
| Google/Naver/Kakao/Facebook/Twitter/Payco social | UNKNOWN | MariaDB social fields | `plugin/social/includes/providers.php:4` | Twitter `callback.php`, `redirect.php` → `/api/auth/twitter/{callback,redirect}`; other callbacks provider-specific UNKNOWN | verify per provider before route registration |
| OKName / KCP cert / INI cert | UNKNOWN | MariaDB `cf_cert_*` + binaries/files | `bbs/register_form.php:146-148` → plugin adapters | `plugin/okname/{hpcert1,hpcert2,ipin1,ipin2}.php`, `plugin/{kcpcert,inicert}/*` → `/api/identity/{provider}/*` | preserve callback state; replace binary adapters |
| AWS/S3 | UNKNOWN | source bucket/region/profile | `src/aws-upload.php:4-45` | no callback proven | retain only if upload integration uses it |

## Callback Rules

All V2 proposals are route contracts, not confirmed external registrations. Build paths under the canonical `APP_URL`, preserve provider request/response semantics, and register them with providers only after read-only verification of enabled DB configuration. Existing source has no single committed Production callback base; request-derived `G5_URL` evidence is `html2/common.php:45-54`.

## Security/Session

V2 session is separate from PHP session: `SESSION_SECRET` is required in `v2/src/config/env.ts`; do not attempt PHP-session interoperability. Cookie domain/path/HTTPS final values are UNKNOWN. `G5_COOKIE_DOMAIN` is defined at `html2/config.php:279`.
