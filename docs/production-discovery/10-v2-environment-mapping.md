# V2 Environment Mapping

## Boot Required / Feature Variables

Existing Production MariaDB `nonsullearndb`, legacy password hashes, and `html2/data/` remain Legacy PHP concerns. V2 does not directly connect to MariaDB, retain PHP session state, or use Legacy runtime storage. No PostgreSQL, Firebase, DB migration or filesystem migration. Production `html2/data/dbconfig.php` exists separately VERIFIED, though absent from checkout. **VERIFIED_CODE**: `html2/common.php:154-168`; `html2/config.php:281,346,352`.

V2 receives Legacy data through typed canonical contracts backed by verified existing endpoints or narrowly scoped Thin PHP Bridges. `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SESSION_SECRET`, and `DATA_ROOT` are not V2 environment variables. Payment/SMS/social/identity remain PHP/MariaDB-backed; vault migration is optional post-cutover hardening.

## Mapping

| Proposed Env | Legacy Definition | Legacy Symbol | Category | Dependency | html2 Used | Consumers | Secret | V2 Required | Priority | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| V2 DB/session/runtime variables | n/a | n/a | prohibited in current V2 architecture | n/a | n/a | n/a | n/a | NO | n/a | `AGENTS.md`; V2 Gate architecture | use endpoint/Thin PHP Bridge contracts instead |
| `NEXT_PUBLIC_SITE_URL` and Bridge configuration | V2 deployment | n/a | V2 deployment config | Bridge/route scope | n/a | Next.js/Bridge client | no secret in public values | YES where applicable | per V2 Gate | V2 `docs/harness/GATES.md` | no DB/runtime credential |

## MariaDB Business Settings to Retain

Legacy PHP reads the existing `$config/$default`: site/admin/notification preferences; board, lecture, correction and shop rules; payment enablement/test/escrow and credentials; SMS/social/identity configuration; templates, upload limits and feature switches. V2 must not copy, migrate, or directly read them; expose only approved read models through an endpoint or Thin PHP Bridge. **VERIFIED_CODE**: `html2/common.php:363-817`; `html2/uAdmin/sms_admin/config.php:9-113`; `html2/shop/settle_*.inc.php`.

## Code Constants / Deprecated / Unresolved

Timezone, UTF-8 charset, debug/device behavior and thumbnail policy may be independently implemented as V2 presentation behavior. **VERIFIED_CODE**: `html2/config.php:13,261-273,390-443`. Removed assumptions: PostgreSQL, Firebase, `DATABASE_URL`, `LEGACY_DB_*`, direct DB access, and DB/filesystem migration. UNKNOWN: actual dbconfig values, `APP_URL`, cookie/session compatibility, data permissions, and active providers.

## Migration Checklist

1. Do not supply Production DB config to V2.
2. Preserve MariaDB schema/query and password-hash behavior in Legacy PHP.
3. Keep `html2/data/` under Legacy PHP runtime management.
4. Define each V2 read through an existing endpoint or Thin PHP Bridge canonical contract.
5. Keep DB-backed external-service settings in Legacy PHP/MariaDB through cutover; assess vaulting separately.

## `.env.example` Draft (report only)

```dotenv
# V2 must not contain Legacy DB, PHP session, runtime storage, or SMTP credentials.
# Use only V2 site/Bridge configuration defined by the V2 repository's env contract.
```
