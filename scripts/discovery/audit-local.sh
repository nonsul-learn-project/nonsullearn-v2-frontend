#!/usr/bin/env bash
#
# Gate 0.5 / 0.9 — Local Baseline & Existing Evidence Audit
#
# WHERE:   개발자 노트북 (macOS bash 3.2 / Linux bash 4+ 모두 지원)
# RUN:     cd /path/to/nonsul-learn-html1
#          V2_REPO=../nonsullearn-v2-frontend bash scripts/discovery/audit-local.sh
# OUTPUT:  docs/discovery/local-audit-YYYYMMDD-HHMM.txt
#
# SAFETY
#   - 로컬 레포만 읽음. SSH / HTTP / DB 없음
#   - 소스 수정 없음. 쓰는 파일은 리포트 1개뿐
#   - 모든 grep 출력은 redact()를 거침 (perl 기반, macOS 호환)
#   - PG 디렉터리는 A8/A9 전수 grep에서 제외 (키 노출 방지)
#
# NOTE
#   이 리포트는 "로컬 baseline" 사실만 증명한다.
#   운영과 일치하는지는 collect-runtime.sh(B7 해시)와 collect-http.sh로 확인한다.
#

set -u
set -o pipefail

# ------------------------------------------------------------
# Configuration
# ------------------------------------------------------------

WEB_ROOT="${WEB_ROOT:-html2}"
V2_REPO="${V2_REPO:-}"
STAMP="$(date +%Y%m%d-%H%M)"
OUTPUT="${OUTPUT:-docs/discovery/local-audit-${STAMP}.txt}"
MAX_MATCHES="${MAX_MATCHES:-300}"

# grep 전수 검색에서 제외할 디렉터리 (basename 기준)
COMMON_EXCLUDES="--exclude-dir=.git --exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=data --exclude-dir=cache --exclude-dir=session"
# PG 관련 디렉터리 (A8/A9 등 전수 grep에서 추가 제외)
PG_EXCLUDES="--exclude-dir=inicis --exclude-dir=kcp --exclude-dir=lg --exclude-dir=toss --exclude-dir=nicepay --exclude-dir=kakaopay --exclude-dir=naverpay --exclude-dir=payco --exclude-dir=inicert"

# ------------------------------------------------------------
# Portable helpers
# ------------------------------------------------------------

die() { echo "ERROR: $*" >&2; exit 1; }

now_iso() { date '+%Y-%m-%dT%H:%M:%S%z'; }

sha256_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

# 비밀값 마스킹 (perl: macOS/Linux 공통, 대소문자 무시)
redact() {
  perl -pe '
    s/((?:pass(?:word|wd)?|secret|token|api[_-]?key|private[_-]?key|sign[_-]?key|hash[_-]?key|merchant[_-]?key|client[_-]?secret|secret[_-]?key|access[_-]?key)\s*(?:=>|[:=])\s*)(["\x27]?)[^"\x27\s;,)]+/$1$2***REDACTED***/gi;
    s/(\[\s*["\x27][^"\x27]*(?:key|secret|pass|sign|token)[^"\x27]*["\x27]\s*\]\s*=>?\s*)(["\x27])[^"\x27]*(["\x27])/$1$2***REDACTED***$3/gi;
    s/(define\s*\(\s*["\x27][^"\x27]*(?:KEY|SECRET|PASS|TOKEN|PWD)[^"\x27]*["\x27]\s*,\s*)(["\x27])[^"\x27]*(["\x27])/$1$2***REDACTED***$3/gi;
    s/(mysqli?_connect\s*\([^)]*)/$1 ***ARGS_REDACTED***/gi;
  '
}

# stdin → 최대 MAX_MATCHES 줄 출력, 잘리면 TRUNCATED 표시
emit_limited() {
  local tmp total
  tmp="$(mktemp)"
  cat > "$tmp"
  total="$(wc -l < "$tmp" | tr -d ' ')"
  if [ "$total" -eq 0 ]; then
    echo "(no matches)"
  else
    head -n "$MAX_MATCHES" "$tmp"
    if [ "$total" -gt "$MAX_MATCHES" ]; then
      echo "!!! TRUNCATED: showing $MAX_MATCHES of $total lines (MAX_MATCHES=$MAX_MATCHES)"
    fi
  fi
  rm -f "$tmp"
}

section() { printf '\n=== [%s] %s ===\n' "$1" "$2" >> "$OUTPUT"; }
note()    { printf '%s\n' "$*" >> "$OUTPUT"; }

# grep_files PATTERN FILE...  (존재하는 파일만, 없으면 NO_FILES)
grep_files() {
  local pattern="$1"; shift
  local existing=()
  local f
  for f in "$@"; do
    [ -f "$f" ] && existing+=("$f")
  done
  if [ "${#existing[@]}" -eq 0 ]; then
    note "NO_FILES"
    return 0
  fi
  grep -nE --binary-files=without-match "$pattern" "${existing[@]}" 2>/dev/null \
    | redact | emit_limited >> "$OUTPUT"
}

# grep_tree PATTERN EXTRA_EXCLUDES DIR...  (존재하는 디렉터리/파일만)
grep_tree() {
  local pattern="$1"; shift
  local extra="$1"; shift
  local targets=()
  local t
  for t in "$@"; do
    [ -e "$t" ] && targets+=("$t")
  done
  if [ "${#targets[@]}" -eq 0 ]; then
    note "NO_TARGETS"
    return 0
  fi
  # shellcheck disable=SC2086
  grep -RInE --binary-files=without-match $COMMON_EXCLUDES $extra \
    --exclude='*.min.js' --exclude='*.map' \
    "$pattern" "${targets[@]}" 2>/dev/null \
    | redact | emit_limited >> "$OUTPUT"
}

# 문서 검색 대상: docs/, 루트 *.md, V2 레포 docs/ 와 루트 *.md
doc_targets() {
  [ -d docs ] && echo "docs"
  for f in ./*.md; do [ -f "$f" ] && echo "$f"; done
  if [ -n "$V2_REPO" ] && [ -d "$V2_REPO" ]; then
    [ -d "$V2_REPO/docs" ] && echo "$V2_REPO/docs"
    for f in "$V2_REPO"/*.md; do [ -f "$f" ] && echo "$f"; done
  fi
}

grep_docs() {
  local pattern="$1"
  local targets=()
  local t
  while IFS= read -r t; do
    [ -n "$t" ] && targets+=("$t")
  done <<EOF
$(doc_targets)
EOF
  if [ "${#targets[@]}" -eq 0 ]; then
    note "NO_DOC_TARGETS"
    return 0
  fi
  grep -RInE --binary-files=without-match --exclude-dir=.git --exclude-dir=node_modules \
    --include='*.md' --include='*.txt' --exclude='local-audit-*' \
    "$pattern" "${targets[@]}" 2>/dev/null \
    | redact | emit_limited >> "$OUTPUT"
}

# ------------------------------------------------------------
# Preconditions
# ------------------------------------------------------------

command -v perl >/dev/null 2>&1 || die "perl이 필요합니다 (redaction용)."
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Git 레포 안에서 실행하세요."

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT" || die "레포 루트로 이동 실패"
[ -d "$WEB_ROOT" ] || die "canonical web root '$WEB_ROOT' 없음"

if [ -n "$V2_REPO" ] && [ ! -d "$V2_REPO" ]; then
  echo "WARN: V2_REPO='$V2_REPO' 경로가 없습니다. V2 문서 검색을 건너뜁니다." >&2
  V2_REPO=""
fi

mkdir -p "$(dirname "$OUTPUT")"
: > "$OUTPUT"

cat >> "$OUTPUT" <<EOF
Gate 0.5 / 0.9 Local Audit
Generated: $(now_iso)
Repository: $REPO_ROOT
Canonical baseline: $WEB_ROOT
V2 repository: ${V2_REPO:-NOT_PROVIDED}
MAX_MATCHES: $MAX_MATCHES

IMPORTANT
- This report proves LOCAL BASELINE facts only.
- Production parity requires collect-runtime.sh (B7 hashes) and collect-http.sh.
- Lines ending with "!!! TRUNCATED" are partial. Re-run with a larger MAX_MATCHES if needed.
EOF

# ------------------------------------------------------------
# L0 Repository
# ------------------------------------------------------------

section "L0" "Repository baseline"
{
  echo "BRANCH=$(git branch --show-current 2>/dev/null || echo UNKNOWN)"
  echo "HEAD=$(git rev-parse HEAD)"
  echo "-- STATUS (short) --"
  git status --short | head -n 50
  echo "-- RECENT COMMITS --"
  git log --oneline --decorate -n 40
} >> "$OUTPUT" 2>&1

# ------------------------------------------------------------
# L1 Existing documents
# ------------------------------------------------------------

section "L1" "Existing discovery documents (excluding $WEB_ROOT/)"
find . -maxdepth 6 -type f \
  \( -name '*.md' -o -name 'runtime-*.txt' -o -name 'http-*.txt' -o -name 'v2-discovery-*.txt' -o -name 'local-audit-*.txt' \) \
  -not -path './.git/*' -not -path './node_modules/*' -not -path "./$WEB_ROOT/*" \
  2>/dev/null | sort | emit_limited >> "$OUTPUT"

if [ -n "$V2_REPO" ]; then
  note "-- V2 repo docs --"
  find "$V2_REPO" -maxdepth 4 -type f -name '*.md' \
    -not -path '*/node_modules/*' -not -path '*/.git/*' \
    2>/dev/null | sort | emit_limited >> "$OUTPUT"
fi

# ------------------------------------------------------------
# L2 Known claims in documents only
# ------------------------------------------------------------

section "L2" "Known production/discovery claims (documents only)"
grep_docs 'canonical|DocumentRoot|PHP 8\.3|MariaDB 10\.11|nonsullearndb|66 ?tables|테이블.*66|ss_mb_id|get_member|PHPSESSID|10800|10,800|VirtualHost|ProxyPass|RewriteRule|session\.save_|mb_level'

# ============================================================
# PART A — html2 static evidence
# ============================================================

HEADER_FILES=(
  "$WEB_ROOT/head.php"
  "$WEB_ROOT/_head.php"
  "$WEB_ROOT/head.sub.php"
  "$WEB_ROOT/mobile/head.php"
  "$WEB_ROOT/mobile/_head.php"
)
while IFS= read -r f; do
  [ -n "$f" ] && HEADER_FILES+=("$f")
done <<EOF
$(find "$WEB_ROOT/theme" -maxdepth 4 -type f \( -name 'head.php' -o -name '_head.php' -o -name 'head.sub.php' \) 2>/dev/null)
EOF

# ---------------- A1
section "A1" "Header member information"
note "-- header files present --"
for f in "${HEADER_FILES[@]}"; do [ -f "$f" ] && note "$f"; done
note "-- member/auth usage --"
grep_files '\$member\[|\$is_member|\$is_admin|\$is_guest|mb_level|mb_name|mb_nick|mb_point|memo' "${HEADER_FILES[@]}"

# ---------------- A2
section "A2" "Level / capability branches"
grep_files 'mb_level[[:space:]]*[<>=!]=?[[:space:]]*[0-9]+|\$is_admin|\$is_member' "${HEADER_FILES[@]}"
note "-- lecture/ uAdmin/ --"
grep_tree 'mb_level[[:space:]]*[<>=!]=?[[:space:]]*[0-9]+|\$is_admin' "" "$WEB_ROOT/lecture" "$WEB_ROOT/uAdmin"

# ---------------- A3
section "A3" "common.php side effects (bridge include risk)"
grep_files 'visit_insert|visit|REMOTE_ADDR|cf_intercept_ip|cf_possible_ip|header[[:space:]]*\(|goto_url|alert[[:space:]]*\(|G5_IS_MOBILE|is_mobile|maintenance|점검|^[[:space:]]*(echo|print)[[:space:](]|include|require|session_save_path|session_start|ob_start' \
  "$WEB_ROOT/common.php" "$WEB_ROOT/config.php"
note "-- where visit_insert is included --"
grep_tree 'visit_insert' "$PG_EXCLUDES" "$WEB_ROOT"

# ---------------- A4
section "A4" "Session / cookie source configuration"
grep_files 'session_name|session_save_path|G5_SESSION_PATH|G5_SESSION_DIR|session\.save_|ini_set[[:space:]]*\([[:space:]]*["'"'"']session|session_set_cookie_params|session_start|gc_maxlifetime|cookie_lifetime|G5_COOKIE_DOMAIN|G5_DOMAIN|G5_HTTPS_DOMAIN|PHPSESSID|SameSite|httponly|secure|10800|gc_probability|gc_divisor' \
  "$WEB_ROOT/config.php" "$WEB_ROOT/common.php"

# ---------------- A5
section "A5" "Legacy URL map evidence"
ROUTE_FILES=(
  "$WEB_ROOT/head.php" "$WEB_ROOT/_head.php" "$WEB_ROOT/tail.php" "$WEB_ROOT/_tail.php"
  "$WEB_ROOT/mobile/head.php" "$WEB_ROOT/mobile/tail.php"
)
while IFS= read -r f; do
  [ -n "$f" ] && ROUTE_FILES+=("$f")
done <<EOF
$(find "$WEB_ROOT/theme" -maxdepth 4 -type f \( -name 'head.php' -o -name 'tail.php' -o -name '_head.php' -o -name '_tail.php' \) 2>/dev/null)
EOF
grep_files 'login|logout|register|join|mypage|member|lecture|correct|첨삭|item\.php|cart|order|orderform|checkout|shop/|G5_BBS_URL|G5_SHOP_URL|G5_URL' "${ROUTE_FILES[@]}"
note "-- login return parameter --"
grep_files '\$url|\$_GET\[.url|return_url|login_url|urlencode' "$WEB_ROOT/bbs/login.php" "$WEB_ROOT/bbs/login_check.php" "$WEB_ROOT/bbs/logout.php"

# ---------------- A6
section "A6" "Course detail / price / availability"
note "-- entry files --"
for f in "$WEB_ROOT/shop/item.php" "$WEB_ROOT/shop/list.php" "$WEB_ROOT/mobile/shop/item.php" "$WEB_ROOT/shop/ajax.list.php"; do
  [ -f "$f" ] && note "PRESENT $f" || note "MISSING $f"
done
note "-- item.php parameters & price/status references --"
grep_files '\$_GET|\$_REQUEST|it_id|ca_id|it_price|it_cust_price|get_price|it_soldout|it_stock_qty|it_use|it_tel_inq|판매|품절|기간' \
  "$WEB_ROOT/shop/item.php" "$WEB_ROOT/mobile/shop/item.php"
note "-- price/status functions (definitions only) --"
grep_tree 'function[[:space:]]+(get_price|get_it_|is_soldout|get_item|item_)' "$PG_EXCLUDES" "$WEB_ROOT/lib" "$WEB_ROOT/shop"

# ---------------- A7
section "A7" "shop/ajax.list.php contract"
AJAX="$WEB_ROOT/shop/ajax.list.php"
if [ -f "$AJAX" ]; then
  note "LINES=$(wc -l < "$AJAX" | tr -d ' ')"
  note "-- INPUT --";  grep_files '\$_GET|\$_POST|\$_REQUEST|filter_input' "$AJAX"
  note "-- OUTPUT --"; grep_files 'json_encode|echo|print|Content-Type|header[[:space:]]*\(' "$AJAX"
  note "-- AUTH --";   grep_files '\$member|\$is_member|\$is_admin|ss_mb_id|login' "$AJAX"
  note "-- INCLUDES --"; grep_files 'include|require' "$AJAX"
else
  note "MISSING: $AJAX"
fi

# ---------------- A8
section "A8" "Tracking inventory (files)"
grep_tree 'gtag[[:space:]]*\(|googletagmanager|GTM-[A-Z0-9]{4,}|["'"'"']G-[A-Z0-9]{6,}|["'"'"']AW-[0-9]+|fbq[[:space:]]*\(|wcs_add|wcs_do|kakaoPixel|_nasa' \
  "$PG_EXCLUDES" "$WEB_ROOT"
note "-- DB-configured script hooks (tracking may live in DB, verify with collect-http H6) --"
grep_files 'cf_add_script|cf_analytics|cf_add_meta|de_add_script|add_javascript|config\[.cf_' \
  "$WEB_ROOT/head.sub.php" "$WEB_ROOT/tail.sub.php" "$WEB_ROOT/head.php" "$WEB_ROOT/tail.php"

# ---------------- A9
section "A9" "UTM / referrer handling"
grep_tree 'utm_(source|medium|campaign|content|term)|HTTP_REFERER|document\.referrer' "$PG_EXCLUDES" "$WEB_ROOT"
note "-- setcookie / session writes outside PG (attribution candidates) --"
grep_tree 'setcookie[[:space:]]*\(|set_cookie[[:space:]]*\(|set_session[[:space:]]*\([[:space:]]*["'"'"'](utm|ref|inflow|campaign)' "$PG_EXCLUDES" "$WEB_ROOT"

# ---------------- A10
section "A10" "Homepage public assets (index.php)"
INDEX="$WEB_ROOT/index.php"
if [ -f "$INDEX" ]; then
  note "-- includes --"
  grep_files 'include|require' "$INDEX"
  note "-- asset references --"
  grep_files '(src|href)[[:space:]]*=|data/|/img/|/images/|background-image|url[[:space:]]*\(|get_banner|shop_banner' "$INDEX"
  note "-- candidate asset paths (for home-assets.txt; verify against collect-http H6) --"
  grep -oE '["'"'"'(][^"'"'"'()]*\.(png|jpe?g|webp|gif|svg|avif)' "$INDEX" 2>/dev/null \
    | sed -E 's/^["'"'"'(]//; s#^\./##; s#^/##' | grep -v '<?' | sort -u | emit_limited >> "$OUTPUT"
else
  note "MISSING: $INDEX"
fi

# ---------------- A11
section "A11" "Protected legacy routes (must NOT be proxied)"
note "-- callback/return/result/notify candidates --"
find "$WEB_ROOT" -maxdepth 5 -type f \
  \( -iname '*callback*.php' -o -iname '*return*.php' -o -iname '*result*.php' -o -iname '*notify*.php' \
     -o -iname '*approval*.php' -o -iname '*cancel*.php' -o -iname '*refund*.php' -o -iname '*noti*.php' \
     -o -iname '*vbank*.php' -o -iname '*_res*.php' -o -iname 'orderformupdate*.php' -o -iname 'personalpayformupdate*.php' \) \
  -not -path "$WEB_ROOT/data/*" 2>/dev/null | sort | emit_limited >> "$OUTPUT"
note "-- PG directories --"
find "$WEB_ROOT" -maxdepth 4 -type d \
  \( -iname '*inicis*' -o -iname 'kcp' -o -iname 'lg' -o -iname '*nice*' -o -iname '*toss*' -o -iname '*pay*' -o -iname 'inicert' -o -iname 'kcpcert' \) \
  2>/dev/null | sort | emit_limited >> "$OUTPUT"
note "-- upload handlers --"
grep_tree '\$_FILES|move_uploaded_file|is_uploaded_file' "" "$WEB_ROOT/bbs" "$WEB_ROOT/shop" "$WEB_ROOT/lecture" "$WEB_ROOT/uAdmin" "$WEB_ROOT/plugin"
note "-- admin roots --"
for d in "$WEB_ROOT/adm" "$WEB_ROOT/admin" "$WEB_ROOT/uAdmin"; do
  [ -d "$d" ] && note "PRESENT $d"
done
note "-- .htaccess files in baseline (local evidence for B3 Rewrite) --"
find "$WEB_ROOT" -maxdepth 3 -type f -name '.htaccess' -not -path "$WEB_ROOT/data/*" 2>/dev/null | sort | emit_limited >> "$OUTPUT"
while IFS= read -r ht; do
  [ -n "$ht" ] || continue
  note "--- $ht ---"
  grep -nE '^[[:space:]]*(RewriteEngine|RewriteCond|RewriteRule|Redirect|Options|Require|Deny|Allow|Header|ErrorDocument|php_value|php_flag)' "$ht" 2>/dev/null \
    | redact | emit_limited >> "$OUTPUT"
done <<EOF
$(find "$WEB_ROOT" -maxdepth 1 -type f -name '.htaccess' 2>/dev/null)
EOF
note "-- existing /v2-api path conflict check --"
if [ -e "$WEB_ROOT/v2-api" ]; then note "EXISTS $WEB_ROOT/v2-api"; else note "NOT_PRESENT $WEB_ROOT/v2-api"; fi

# ============================================================
# Existing Gate evidence (documents)
# ============================================================

section "G05" "Existing Gate 0.5 runtime claims (documents only)"
grep_docs 'homepage revision|teacher asset|Set-Cookie|session\.save_handler|session\.save_path|VirtualHost|SSLCertificate|TLS|RewriteRule|ProxyPass|reverse proxy|sha256|drift'

section "G09" "Gate 0.9 requirements source (V2 repo)"
if [ -n "$V2_REPO" ]; then
  for f in "$V2_REPO/AGENTS.md" "$V2_REPO/docs/harness/GATES.md" "$V2_REPO/docs/harness/EXECUTION-PLAN.md"; do
    if [ -f "$f" ]; then note "PRESENT $f"; else note "MISSING $f"; fi
  done
  note "-- Gate 0.9 section lines --"
  grep_files 'Gate 0\.9|Prerequisites|MPM|MaxRequestWorkers|Vercel|origin|kill switch|CloudWatch|테스트 계정|test account' \
    "$V2_REPO/docs/harness/GATES.md" "$V2_REPO/docs/harness/EXECUTION-PLAN.md"
else
  note "V2_REPO_NOT_PROVIDED (set V2_REPO=../nonsullearn-v2-frontend)"
fi

# ============================================================
# B7-LOCAL hashes (relative paths, comparable with collect-runtime B7)
# ============================================================

section "B7-LOCAL" "Local baseline SHA256 (relative to $WEB_ROOT)"
for rel in index.php common.php config.php head.php _head.php head.sub.php tail.php _tail.php shop/item.php shop/ajax.list.php bbs/login.php; do
  if [ -f "$WEB_ROOT/$rel" ]; then
    printf '%s  %s\n' "$(sha256_of "$WEB_ROOT/$rel")" "$rel" >> "$OUTPUT"
  else
    note "MISSING  $rel"
  fi
done

# ============================================================
# Part C artifacts & security
# ============================================================

section "PART-C" "Existing final artifacts"
for f in viewer-contract-v1 bridge-risks legacy-url-map protected-routes tracking-inventory apache-readiness decisions-needed; do
  p="docs/discovery/$f.md"
  if [ -f "$p" ]; then note "PRESENT $p ($(wc -l < "$p" | tr -d ' ') lines)"; else note "MISSING $p"; fi
done

section "SEC" "Potentially sensitive tracked files (names only)"
git ls-files 2>/dev/null \
  | grep -Ei '(^|/)(\.env($|\.)|credentials?|secrets?|id_rsa|id_ed25519|dbconfig\.php|.*\.pem$|.*\.key$|.*\.p12$|.*\.pfx$)' \
  | emit_limited >> "$OUTPUT"

# ============================================================
# Next
# ============================================================

cat >> "$OUTPUT" <<'EOF'

=== [NEXT] Runtime evidence still required ===
collect-runtime.sh : B1-B12 (Apache, vhost, AllowOverride, MPM, PHP SAPI/session, data/session, prod hashes, sudo, cron)
collect-http.sh    : H1-H6 (Set-Cookie, TTFB, TLS, login, assets, rendered tracking IDs)
AWS console        : instance type, Elastic IP, CPU credit 7d, system log, CloudWatch alarms
Human decisions    : Vercel plan, origin hostname, kill switch path, test accounts, visit-log bypass
Do not upgrade baseline evidence to DONE for runtime items without runtime evidence.
EOF

echo "Created: $OUTPUT"
