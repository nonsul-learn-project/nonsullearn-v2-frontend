# Gate 0 Final Audit

> Audit date: 2026-10-01 (Asia/Seoul). Scope: read-only static audit of
> `/Users/gimdohyeon/nonsul-learn-html1` and the current V2 working tree. No
> Production host, database, provider, credential value, or runtime was accessed.

## Executive Verdict

**FAIL — remediate the tracked SMTP credential exposure before Gate 0 promotion.**

Legacy source is recoverable from Git, `html2/` is present, and the repository
has a deliberate source/runtime boundary. The V2 tree has no DB client, PHP
session forwarding implementation, payment implementation, or tracked
Production artifact.

The Legacy repository's prior value-redacted credential audit records
`G5_SMTP_USER` and `G5_SMTP_PASS` in `html2/config.php` as `TRACKED_SECRET`.
That fails the Gate 0 requirement of no critical secret blocker. This audit did
not inspect or print either value. Remediate through the approved secret
incident/history process and rotate the affected SMTP credential.

There is also a documentation conflict: Legacy
`docs/production-discovery/16-runtime-dependency-map.md` says “V2 uses existing
MariaDB directly,” while this repository's controlling `AGENTS.md` and
`docs/harness/GATES.md` prohibit V2 direct DB access. No current V2 code follows
the unsafe statement, but correct it before Gate 1.

## Evidence

| Evidence | Result |
|---|---|
| Legacy repository root | `/Users/gimdohyeon/nonsul-learn-html1` |
| Git worktree | clean at audit time |
| Branch / remote | `gate-1.5-frontend-migration`; `origin` configured; HEAD `d2f2215` equals `origin/gate-1.5-frontend-migration`, confirmed with `git ls-remote` |
| Git source inventory | 12,607 tracked paths; 6,244 under `html2/`; 4,475 PHP files under `html2/` |
| Canonical root evidence | `html2/` includes `.htaccess`, `common.php`, `index.php`, `bbs/`, `shop/`, `lecture/`, `lib/`, `plugin/`, `data/`, assets |
| Runtime policy | `.gitignore` default-denies data payloads, credentials, dumps, cache/session/log/tmp/upload content, and private-key material except reviewed allowlists |
| Runtime checkout | only four tracked data guard files; missing payload is not evidence about Production |
| Auth | login/logout/register/password source plus `common.php`; 46 source files matching session/member bootstrap terms |
| Payment | 217 provider-path files and 92 approval/callback/cancel/refund references, including KCP, INICIS, LG, NICEPAY, Toss, KakaoPay, Samsung Pay |
| LMS/correction | 230 source paths matching lecture/LMS/correction terms |
| V2 isolation | no tracked dump, runtime data, certificate/key, direct DB client, PHP session forwarding, or payment implementation found |

## Required DOD

| Requirement | Status | Evidence | Risk |
|---|---|---|---|
| Legacy source is Git-preserved | PASS | clean worktree; remote-backed commit; 12,607 tracked paths | Low |
| Remote repository exists | PASS | configured `origin`; remote branch resolves to HEAD | Low |
| Important PHP source and canonical `html2` retained | PASS | auth, PG, LMS/correction, entrypoints, assets under `html2/` | Low for snapshot; Production drift UNKNOWN |
| Runtime storage separated from source | PASS | `data/` default-deny policy, guard-only checkout | Medium |
| Runtime-safe deployment rule exists | PARTIAL | Git policy exists; no verified Production deploy/runbook | High at cutover |
| MariaDB retained; no Gate 0 migration | PASS | no DB action; controlling V2 architecture retains PHP/MariaDB | Low |
| Production dump/PII not tracked | PASS | dump patterns ignored; no Production dump found | Low for tree; history/Production UNKNOWN |
| PHP auth and session authority preserved | PASS | retained login/logout/password/register/common source; V2 policy retains authority | Low |
| Password migration excluded | PASS | no V2 auth implementation | Low |
| PG integration/callback source retained | PASS | provider handlers and wrapper source retained | Low |
| Payment not reimplemented in TS | PASS | no V2 payment implementation | Low |
| Payment credential remains unchanged | UNKNOWN | no credential/provider was accessed | High if changed externally |
| Cron/filesystem/external-binary dependency recorded | PARTIAL | source retains KCP/OKName binaries; cron/systemd activation UNKNOWN | Medium |
| New secret added to V2 | PASS | tracked boundary scan found none | Low |
| Existing secret risk documented | PASS | value-redacted map identifies tracked SMTP credential | **Critical until remediated** |
| Git source rollback available | PASS | remote-backed commit | Low for tracked source only |
| Bridge-only rollback strategy | PARTIAL | future `html2/v2-api/` island feasible; no tested deployment procedure | Medium |
| V2 route rollback strategy | PARTIAL | Apache rollback/kill-switch architecture exists; vhost runtime unverified | Medium/High |
| Runtime data excluded from Git rollback | PASS | default-deny runtime boundary | Low if respected operationally |
| TS/PHP/MariaDB ownership documentation consistent | PARTIAL | current V2 docs correct; older Legacy direct-DB wording conflicts | Medium |
| UNKNOWN is not inferred as PASS | PASS | recorded below | Low |

## Production Preservation

Git is a source snapshot, **not** a complete Production filesystem clone.

| Class | Boundary finding |
|---|---|
| Git-managed source | `html2/` PHP, assets, vendor, provider wrapper source; parallel `html/` tree |
| Production-only runtime | `html2/data/` payloads, cache, sessions, logs, temp, uploads |
| User/correction files | excluded under `data/file/` except index guards |
| Generated data | dumps, exports, cache/session/tmp/log outputs excluded |
| Secrets | runtime DB config/credential INI ignored; selected key/cert-like assets need classification |
| Database | outside Git; baseline remains `nonsullearndb`, 66 tables; not accessed |
| External binaries | KCP payment/certification and OKName binaries tracked; active use UNKNOWN |

`html/` and `html2/` coexist (6,281 and 6,244 tracked files). `html2` is the
stated canonical root, but Production revision/root drift is UNKNOWN. Do not
sync both trees or infer absence in Git means absence in Production.

## Git Integrity

The Legacy worktree was clean and the checked-out commit is present on `origin`,
so tracked source has a known recovery point. That does not recover runtime
data, database data, secrets, uploads, or Production configuration.

The V2 worktree has pre-existing user modifications to `AGENTS.md`, `CLAUDE.md`,
harness documents, and an untracked `docs/harness/GATES.md`. This audit did not
modify, reset, clean, stage, or otherwise alter them.

## Runtime Data

`html2/data/` is default-deny. Its intended categories include cache, session,
log, tmp, member/member-image, content, event, FAQ, and briefing/correcting/
notice files. The checkout contains only `.htaccess` and three index guards.

Required operational conditions:

1. Keep runtime storage persistent and outside release artifacts.
2. Never use `git clean -fd`, `git reset --hard`, `rsync --delete`, or broad
   overwrites in a Production directory containing runtime data.
3. Deploy a reviewed source allowlist/release directory and preserve runtime
   paths plus protected provider material.
4. Test restoration of uploads, correction files, generated assets, and any
   persistent session data before public cutover.

## Secrets

| Path | Secret type | Git state | Risk | Action required |
|---|---|---|---|---|
| `html2/config.php` | SMTP user/password | `TRACKED_SECRET` in prior value-redacted audit | **Critical** | approved incident process: rotate, remove from current source, remediate history/access, rescan without values |
| `html2/data/dbconfig.php` | DB credentials | ignored / absent from checkout; previously recorded as Production-only | High | preserve as protected runtime config; never copy to V2/Git |
| `html2/shop/inicis/key/*` | provider encrypted/binary material | UNKNOWN candidate | High if active | protected value-redacted classification review |
| `html2/plugin/lgxpay/lgdacom/conf/*` | provider configuration candidate | UNKNOWN candidate | High if active | protected value-redacted classification review |

Tracked `pgcert.pem`, KCP `pub.key`, and the LG CA bundle are not presumed
private from extension alone; their active classification is UNKNOWN. No values
are included in this report.

## Database

The known baseline is MariaDB `nonsullearndb` with 66 tables. No connection,
dump, or migration was run. Production dump/export patterns are ignored and no
tracked Production dump was found. V2 must use public reads or a thin PHP Bridge,
never a DB driver; correct the conflicting Legacy documentation accordingly.

## Authentication

`common.php`, login, login-check, logout, registration, and password workflows
remain tracked. No endpoint was invoked. PHP remains the authority for session,
password, membership, and permissions; V2 must not server-read/forward
`PHPSESSID` or migrate passwords.

## Payment

Checkout, approval/return/result, cancel/refund-related PHP and provider wrapper
source are retained under `html2/shop/`, `html2/mobile/shop/`, and plugins. No
payment/callback was called and V2 has no replacement implementation. Provider
enablement, callback registration, credential validity, and protected-file
availability remain UNKNOWN and are cutover blockers for affected routes.

## Cron / Runtime

Static source retains KCP `pp_cli*`, KCP certification `ct_cli*`, and OKName
binary families. No crontab, systemd declaration, or Production scheduler was
verified. **Production cron activation: UNKNOWN.**

## Rollback

| Scenario | Assessment | Basis / condition |
|---|---|---|
| Incorrect Legacy tracked PHP source change | SAFE | controlled source-only release can use a prior remote-backed commit |
| Failed Thin PHP Bridge release | PARTIAL | isolate future bridge in `html2/v2-api/`; rollout must preserve all other paths; no tested Production procedure |
| Failed V2 homepage route | PARTIAL | Apache can return route ownership to PHP in design; runtime vhost/rewrite/kill switch unverified |
| Deployment overwrites runtime `data/` | UNSAFE | `.gitignore` is not an operational control; no verified volume/backup/deploy-exclusion evidence |

## Deployment Boundary

Operate future `html2/v2-api/` as a selected-file, Git-managed island. Do not
make the full Production web root a Git working tree or use deletion-based sync.
Apache/Vercel routing changes are separately approved operations. Actual
Production deployment protection is UNKNOWN.

## V2 Isolation

V2 currently tracks no Production dump, PHP runtime data, user uploads, PHP
credential, PG certificate/private key, SSH key, dependency/build output, direct
DB client, PHP session forwarding, or payment code. The remaining risk is the
contradictory direct-DB documentation.

## UNKNOWN

- Production-to-Git drift and live canonical-root revision.
- Production, database, and upload/data backup; restore testing; emergency runbook.
- Production deployment method and runtime-path protections.
- Apache VirtualHost/rewrite/proxy, kill switch, direct-origin behavior.
- Active cron/systemd/PHP CLI jobs and binary use.
- Active provider config, callback registration, protected files, credentials.
- Runtime topology, ownership/mode, storage backend, and Production owner boundary.

## Required Actions

1. Treat the tracked SMTP credential as a security incident: rotate, remove it
   from current tracked config, and perform approved history/access remediation
   without disclosing values.
2. Correct Legacy direct-MariaDB wording to the controlling rule: V2 uses only
   PHP Bridge/public-read boundaries and no DB driver.
3. Before Production deployment, approve and document source-only deployment
   that excludes `html2/data/`, credentials, protected provider files, logs,
   sessions, uploads, and generated output.
4. Establish and test DB/runtime-data restore and rollback; record owners and
   evidence without committing backup data.
5. Complete authorized read-only checks for deployed revision, runtime paths,
   Apache/kill switch, scheduler activation, provider file requirements.

## Recommended Actions

- Record canonical `html2` release references and a repeatable drift comparison.
- Add protected secret scanning to CI/PR review without logging match values.
- Define emergency route rollback before Gate 4.
- Keep a value-redacted third-party binary/PG runtime dependency inventory.

## Gate Promotion Decision

**Do not promote Gate 0 to PASS.** Reassess after the SMTP secret is remediated
and scanned. The Production UNKNOWNs do not block local Foundation work once that
blocker and the architecture-document conflict are resolved, but they must be
closed before their respective routing/cutover gates.

## Final Required Summary

1. **Gate 0 Verdict:** FAIL.
2. **PASS basis:** remote-backed Legacy source, retained canonical `html2` core,
   runtime default-deny boundary, retained auth/payment/LMS source, no V2
   DB/payment/session implementation, and no destructive audit action.
3. **Remaining UNKNOWN:** drift, backups/restores, deployment, Apache runtime,
   cron, provider assets, runtime topology/ownership.
4. **Gate 1 blocker:** tracked SMTP credential and unsafe direct-DB wording.
5. **Production cutover blockers:** runtime-safe deployment/restore, Apache and
   kill-switch validation, drift evidence, active cron/provider/runtime checks.
6. **Do now (max 5):** perform the five Required Actions above; do not deploy,
   rotate, or modify Production from this audit task.
