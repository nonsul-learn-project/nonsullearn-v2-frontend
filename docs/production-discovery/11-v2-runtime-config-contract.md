# V2 Runtime Configuration Contract

## Scope

Existing Production MariaDB `nonsullearndb`, member/password hashes, and `html2/data/` remain under Legacy PHP ownership. V2 does not directly connect to MariaDB, preserve PHP session state, or use `html2/data/` as runtime storage. It uses typed canonical contracts backed by existing endpoints or narrowly scoped Thin PHP Bridges. No PostgreSQL, Firebase, DB migration, or filesystem migration. Production `html2/data/dbconfig.php` presence is separately VERIFIED; it is not present in Git/checkout.

## Boot Contract

| Variable | Required | Category | Evidence | Contract |
|---|---|---|---|---|
| Legacy DB/session/runtime configuration | no | Legacy PHP-only | `html2/common.php:154-168`; `html2/config.php:346,352` | never place in V2 environment |
| V2 site and Bridge configuration | per V2 repository contract | V2 deployment config | V2 `docs/harness/GATES.md` | public site/route configuration only; no Legacy credentials |

## Feature Contract

Mail, payment, SMS, social and identity remain Legacy PHP/MariaDB-owned. V2 neither receives their credentials nor directly invokes their business flows: `html2/config.php:399-404`, `html2/lib/mailer.lib.php:31-44`, `html2/shop/settle_lg.inc.php:19-43`, `html2/shop/toss/toss_approval.php:8-10`, `html2/uAdmin/sms_admin/config.php:9-113`, `html2/plugin/social/includes/providers.php:4`.

## Compatibility / Unknowns

Legacy PHP retains MariaDB access, password-hash behavior, and `html2/data/` read/write permission (`html2/lib/mailer.lib.php:77-83`). Actual DB values/port, app URL, data permissions/session compatibility and enabled DB-backed providers remain UNKNOWN.

## Implementation Binding

This historical document does not define V2 implementation configuration. The current V2 repository owns its environment contract and must not expose MariaDB fields, PHP session secrets, SMTP credentials, or `DATA_ROOT`.
