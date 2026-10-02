# Production Configuration Gaps and Readiness

No Production DB/API/filesystem access occurred. Follow-up is read-only and must never place values in Git.

## Required Read-only Verification

| Gap | Exact target | Why |
|---|---|---|
| DB bootstrap | Production `html2/data/dbconfig.php`: defined `G5_MYSQL_*`, port, non-DB constants | confirm Legacy PHP bootstrap only; do not populate V2 DB variables |
| logical settings tables | table/columns backing `$config` and `$default` loaded in `html2/common.php:363-817` | identify only dependency slices needed for an endpoint/Thin PHP Bridge contract |
| provider activation | fields: `cf_lg_*`, `cf_toss_*`, `de_inicis_*`, `de_kcp_*`, Nice/Kakao/Naver/Samsung field families | decide routes/files/binaries actually required |
| SMS | `cf_sms_*`, `cf_icode_*` | confirm provider and settings |
| social/identity | `cf_social_*`, `cf_cert_*` and provider-specific rows | confirm enabled providers/callbacks |
| filesystem | Production `html2/data/` writable subpaths/session/tmp/uploads | preserve Legacy PHP runtime; do not configure V2 access |
| scheduled jobs/host services | deployment crontab/systemd/process manager | no repository definition found |
| key material | listed files in map 12 | classify private vs provider/public and mount/replace safely |

## Readiness Matrix

| Feature | Config discovered | Storage location decided | Runtime value verified | Callback mapped | V2 readiness |
|---|---|---|---|---|---|
| DB/Auth | YES | YES | PARTIAL | n/a | READY_WITH_CONDITIONS |
| Filesystem | YES | YES | NO | n/a | READY_WITH_CONDITIONS |
| Email | YES | YES | NO | n/a | READY_WITH_CONDITIONS (rotation) |
| LG | YES | YES | NO | YES proposal | READY_WITH_CONDITIONS |
| Toss | YES | YES | NO | YES proposal | READY_WITH_CONDITIONS |
| INICIS | YES | YES | NO | YES proposal | UNKNOWN |
| KCP | YES | YES | NO | PARTIAL | UNKNOWN |
| Other PG | PARTIAL | YES | NO | PARTIAL | UNKNOWN |
| SMS | YES | YES | NO | no inbound proven | UNKNOWN |
| Social Login | YES | YES | NO | PARTIAL | UNKNOWN |
| Identity Verification | YES | YES | NO | YES proposal | UNKNOWN |
| AWS/S3 | YES | PARTIAL | NO | n/a | UNKNOWN |
| Session/Cookie | PARTIAL | YES | NO | n/a | READY_WITH_CONDITIONS |

## V2 Config Readiness

**READY_WITH_CONDITIONS.** Legacy PHP retains MariaDB runtime business/provider settings and file/certificate dependencies. V2 requires only approved endpoint/Thin PHP Bridge contracts; PHP removal is not in scope.
