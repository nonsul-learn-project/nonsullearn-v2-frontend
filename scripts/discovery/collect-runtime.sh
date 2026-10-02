#!/usr/bin/env bash
#
# Gate 0.5 / 0.9 — Production Runtime Collector
#
# WHERE:   운영 서버 (Linux). 사람이 1회만 실행.
# RUN:     WEB_ROOT="$HOME/html2" bash ~/collect-runtime.sh
#          (선택) ~/v2-home-assets.txt 를 함께 올리면 B8 자산 존재 확인
# OUTPUT:  ~/v2-discovery-YYYYMMDD-HHMM.txt   (이 파일 하나만 생성)
#
# READ-ONLY
#   - DB 쿼리 없음, 서비스 restart/reload 없음, 패키지 설치 없음
#   - 애플리케이션 HTTP 요청 없음 (EC2 메타데이터 169.254.169.254 조회만 예외)
#   - html2 전체 재귀 검색 없음 (지정 파일 / maxdepth 제한)
#   - 세션 파일 이름/내용 출력 없음 (개수와 용량만)
#
# LOAD SAFETY
#   - 시작 시 1분 load average >= CPU 코어 수면 즉시 중단
#   - 모든 명령 nice -n 19 + timeout
#

set -u
set -o pipefail

WEB_ROOT="${WEB_ROOT:-$HOME/html2}"
ASSET_LIST="${ASSET_LIST:-$HOME/v2-home-assets.txt}"
STAMP="$(date +%Y%m%d-%H%M)"
OUTPUT="$HOME/v2-discovery-${STAMP}.txt"
T="${TIMEOUT_SECONDS:-20}"

# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

section() { printf '\n=== [%s] %s ===\n' "$1" "$2" >> "$OUTPUT"; }
note()    { printf '%s\n' "$*" >> "$OUTPUT"; }

low() { nice -n 19 timeout "$T" "$@"; }

run_low() {
  low "$@" >> "$OUTPUT" 2>&1 || note "FAILED_OR_TIMEOUT: $*"
}

redact() {
  if command -v perl >/dev/null 2>&1; then
    perl -pe '
      s/((?:pass(?:word|wd)?|secret|token|api[_-]?key|private[_-]?key|sign[_-]?key|hash[_-]?key|client[_-]?secret|access[_-]?key)\s*(?:=>|[:=])\s*)(["\x27]?)[^"\x27\s;,)]+/$1$2***REDACTED***/gi;
      s/(Authorization:\s*)\S+/$1***REDACTED***/gi;
      s#(mysql(?:dump)?\s[^\n]*?-p)\S+#$1***REDACTED***#gi;
      s#(https?://[^:/\s]+:)[^@\s]+@#$1***REDACTED***@#gi;
    '
  else
    sed -E \
      -e 's/((pass(word|wd)?|secret|token|api[_-]?key|private[_-]?key|sign[_-]?key)[[:space:]]*(=>|[:=])[[:space:]]*)[^[:space:];,)]+/\1***REDACTED***/Ig' \
      -e 's/(-p)[^[:space:]]+/\1***REDACTED***/g'
  fi
}

# ------------------------------------------------------------
# Preconditions
# ------------------------------------------------------------

if [ ! -d "$WEB_ROOT" ]; then
  echo "ERROR: WEB_ROOT not found: $WEB_ROOT"
  echo "Usage: WEB_ROOT=/path/to/html2 bash $0"
  exit 1
fi

: > "$OUTPUT"
chmod 600 "$OUTPUT" 2>/dev/null || true

cat >> "$OUTPUT" <<EOF
Gate 0.5 / 0.9 Production Runtime Discovery
Generated: $(date -Iseconds 2>/dev/null || date)
Host: $(hostname 2>/dev/null || echo UNKNOWN)
WEB_ROOT: $WEB_ROOT
EOF

# ------------------------------------------------------------
# GUARD — load check
# ------------------------------------------------------------

section "GUARD" "Load safety check"

CORES="$(nproc 2>/dev/null || echo 1)"
LOAD1="$(awk '{print $1}' /proc/loadavg 2>/dev/null || true)"
note "CPU_CORES=$CORES"
note "LOAD1=${LOAD1:-UNKNOWN}"

if [ -z "$LOAD1" ]; then
  echo "ABORT: cannot read load average. Output: $OUTPUT"
  note "ABORTED_UNKNOWN_LOAD"
  exit 2
fi

if awk -v l="$LOAD1" -v c="$CORES" 'BEGIN { exit !(l >= c) }'; then
  echo "ABORTED: load $LOAD1 >= cores $CORES. Try again later. Output: $OUTPUT"
  note "ABORTED_HIGH_LOAD"
  exit 3
fi
note "LOAD_GUARD=PASS"

# ------------------------------------------------------------
# B1 — System baseline
# ------------------------------------------------------------

section "B1" "System baseline"
run_low uptime
run_low free -m
run_low df -h
note "-- inodes (session files can exhaust inodes) --"
run_low df -i
note "-- OS --"
if [ -r /etc/os-release ]; then
  grep -E '^(NAME|VERSION|ID)=' /etc/os-release >> "$OUTPUT" 2>&1
else
  note "OS_RELEASE=UNKNOWN"
fi
note "-- EC2 metadata (IMDSv2) --"
TOKEN="$(low curl -fsS -m 3 -X PUT -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' \
  http://169.254.169.254/latest/api/token 2>/dev/null || true)"
if [ -n "$TOKEN" ]; then
  for k in instance-type placement/availability-zone; do
    v="$(low curl -fsS -m 3 -H "X-aws-ec2-metadata-token: $TOKEN" \
      "http://169.254.169.254/latest/meta-data/$k" 2>/dev/null || true)"
    note "$k=${v:-UNKNOWN}"
  done
else
  note "IMDS=UNAVAILABLE (check instance type in AWS console)"
fi
unset TOKEN

# ------------------------------------------------------------
# Apache detection
# ------------------------------------------------------------

APACHECTL=""
for c in apachectl apache2ctl httpd; do
  if command -v "$c" >/dev/null 2>&1; then APACHECTL="$(command -v "$c")"; break; fi
done
for p in /usr/sbin/apachectl /usr/sbin/apache2ctl /usr/sbin/httpd; do
  [ -z "$APACHECTL" ] && [ -x "$p" ] && APACHECTL="$p"
done

APACHE_ETC=""
[ -d /etc/apache2 ] && APACHE_ETC=/etc/apache2
[ -z "$APACHE_ETC" ] && [ -d /etc/httpd ] && APACHE_ETC=/etc/httpd

# ------------------------------------------------------------
# B2 — Apache runtime
# ------------------------------------------------------------

section "B2" "Apache runtime"
note "APACHECTL=${APACHECTL:-UNKNOWN}"
note "APACHE_ETC=${APACHE_ETC:-UNKNOWN}"
if [ -n "$APACHECTL" ]; then
  run_low "$APACHECTL" -v
  note "-- build / MPM --"
  low "$APACHECTL" -V 2>&1 | grep -E 'Server version|Server MPM|threaded|forked|HTTPD_ROOT|SERVER_CONFIG_FILE' >> "$OUTPUT" \
    || note "FAILED: -V"
  note "-- relevant loaded modules --"
  MODS="$(low "$APACHECTL" -M 2>&1 || true)"
  printf '%s\n' "$MODS" | grep -E 'rewrite_module|proxy_module|proxy_http_module|proxy_fcgi_module|ssl_module|headers_module|mpm_|php[0-9_]*_module' >> "$OUTPUT" \
    || note "NO_MATCH_OR_FAILED (raw head below)"
  printf '%s\n' "$MODS" | head -n 5 >> "$OUTPUT"
  note "-- PHP SAPI inference --"
  if printf '%s\n' "$MODS" | grep -qE 'php[0-9_]*_module'; then
    note "PHP_SAPI=apache2handler (mod_php)"
  elif printf '%s\n' "$MODS" | grep -q 'proxy_fcgi_module'; then
    note "PHP_SAPI=fpm (proxy_fcgi) — likely"
  else
    note "PHP_SAPI=UNKNOWN"
  fi
  note "-- vhost map (apachectl -S) --"
  run_low "$APACHECTL" -S
else
  note "APACHE=UNKNOWN"
fi

# ------------------------------------------------------------
# B3 — VirtualHost / Directory / Rewrite / Proxy directives
# ------------------------------------------------------------

section "B3" "VirtualHost, Directory, Rewrite, Proxy directives"

VHOST_FILES=""
if [ -n "$APACHECTL" ]; then
  VHOST_FILES="$(low "$APACHECTL" -S 2>&1 \
    | grep -oE '\(/[^:() ]+:[0-9]+\)' | sed -E 's/^\(//; s/:[0-9]+\)$//' | sort -u || true)"
fi
# fallback: enabled site files + main config
if [ -n "$APACHE_ETC" ]; then
  EXTRA="$(ls -1 \
    "$APACHE_ETC"/sites-enabled/*.conf \
    "$APACHE_ETC"/conf.d/*.conf \
    "$APACHE_ETC"/apache2.conf \
    "$APACHE_ETC"/conf/httpd.conf 2>/dev/null || true)"
  VHOST_FILES="$(printf '%s\n%s\n' "$VHOST_FILES" "$EXTRA" | grep -v '^$' | sort -u)"
fi

if [ -z "$VHOST_FILES" ]; then
  note "VHOST_FILES=UNKNOWN"
else
  while IFS= read -r vf; do
    [ -n "$vf" ] || continue
    note "--- $vf ---"
    if [ -r "$vf" ]; then
      low grep -nE '^[[:space:]]*(<VirtualHost|</VirtualHost|ServerName|ServerAlias|DocumentRoot|<Directory|</Directory|AllowOverride|Options|Require|Alias|Include|IncludeOptional|RewriteEngine|RewriteCond|RewriteRule|RewriteMap|Redirect|ProxyPass|ProxyPassReverse|ProxyPreserveHost|ProxyTimeout|SSLProxyEngine|RequestHeader|Header|SetHandler|SSLEngine|SSLCertificateFile|SSLCertificateChainFile|SSLProtocol|Protocols|ErrorDocument)' \
        "$vf" 2>/dev/null | redact >> "$OUTPUT" || note "NO_MATCH"
    else
      note "NOT_READABLE (permission)"
    fi
  done <<EOF
$VHOST_FILES
EOF
fi

note "-- runtime .htaccess in WEB_ROOT (maxdepth 2, excluding data/) --"
find "$WEB_ROOT" -maxdepth 2 -type f -name '.htaccess' -not -path "$WEB_ROOT/data/*" 2>/dev/null | while IFS= read -r ht; do
  note "--- $ht ---"
  grep -nE '^[[:space:]]*(RewriteEngine|RewriteCond|RewriteRule|Redirect|Options|Require|Deny|Allow|Header|ErrorDocument|php_value|php_flag)' "$ht" 2>/dev/null \
    | redact >> "$OUTPUT" || note "NO_MATCH"
done

note "-- /v2-api path conflict --"
if [ -e "$WEB_ROOT/v2-api" ]; then note "EXISTS $WEB_ROOT/v2-api"; else note "NOT_PRESENT"; fi

# ------------------------------------------------------------
# B4 — MPM / request limits
# ------------------------------------------------------------

section "B4" "MPM / request limits"
if [ -n "$APACHE_ETC" ]; then
  for f in \
    "$APACHE_ETC"/apache2.conf \
    "$APACHE_ETC"/conf/httpd.conf \
    "$APACHE_ETC"/mods-enabled/mpm_*.conf \
    "$APACHE_ETC"/conf.modules.d/*mpm*.conf \
    "$APACHE_ETC"/conf-enabled/*.conf \
    "$APACHE_ETC"/conf.d/*.conf
  do
    [ -f "$f" ] && [ -r "$f" ] || continue
    low grep -nE '^[[:space:]]*(LoadModule mpm_|StartServers|MinSpareServers|MaxSpareServers|MinSpareThreads|MaxSpareThreads|ThreadsPerChild|ThreadLimit|ServerLimit|MaxRequestWorkers|MaxClients|MaxConnectionsPerChild|KeepAlive|KeepAliveTimeout|MaxKeepAliveRequests|Timeout)' \
      "$f" 2>/dev/null | sed "s#^#$f:#" >> "$OUTPUT" || true
  done
else
  note "APACHE_ETC=UNKNOWN"
fi
note "-- live apache process count / RSS (MB) --"
ps -C apache2,httpd -o rss= 2>/dev/null \
  | awk '{n++; s+=$1} END {if (n) printf "APACHE_PROCS=%d TOTAL_RSS_MB=%.0f AVG_RSS_MB=%.1f\n", n, s/1024, s/1024/n; else print "APACHE_PROCS=UNKNOWN"}' >> "$OUTPUT"
note "-- php-fpm process count / RSS (MB) --"
ps -eo comm=,rss= 2>/dev/null | awk '$1 ~ /php-fpm/ {n++; s+=$2} END {if (n) printf "FPM_PROCS=%d TOTAL_RSS_MB=%.0f\n", n, s/1024; else print "FPM_PROCS=0"}' >> "$OUTPUT"
note "-- mysqld RSS (MB) --"
ps -eo comm=,rss= 2>/dev/null | awk '$1 ~ /mysqld|mariadbd/ {s+=$2} END {printf "DB_RSS_MB=%.0f\n", s/1024}' >> "$OUTPUT"

# ------------------------------------------------------------
# B5 — PHP session runtime (SAPI-aware)
# ------------------------------------------------------------

section "B5" "PHP session runtime"
SESSION_KEYS='session\.(save_handler|save_path|name|cookie_lifetime|cookie_path|cookie_domain|cookie_secure|cookie_httponly|cookie_samesite|gc_maxlifetime|gc_probability|gc_divisor|use_strict_mode)'

PHP_BIN="$(command -v php 2>/dev/null || true)"
if [ -n "$PHP_BIN" ]; then
  note "-- CLI (reference only; may differ from web SAPI) --"
  low "$PHP_BIN" -v 2>&1 | head -n 1 >> "$OUTPUT"
  low "$PHP_BIN" -i 2>/dev/null | grep -E "^(Loaded Configuration File|$SESSION_KEYS)" >> "$OUTPUT" \
    || note "CLI_PHP_SESSION=FAILED"
else
  note "PHP_CLI=UNKNOWN"
fi

note "-- web SAPI php.ini candidates (apache2 / fpm) --"
INI_FOUND=0
for ini in /etc/php/*/apache2/php.ini /etc/php/*/fpm/php.ini /etc/php.ini /etc/php-fpm.d/*.conf /etc/php/*/fpm/pool.d/*.conf; do
  [ -f "$ini" ] || continue
  INI_FOUND=1
  note "--- $ini ---"
  low grep -nE "^[[:space:]]*;?[[:space:]]*($SESSION_KEYS[[:space:]]*=|php_(admin_)?value\[session\.)" "$ini" 2>/dev/null \
    >> "$OUTPUT" || note "NO_SESSION_DIRECTIVES"
done
[ "$INI_FOUND" -eq 1 ] || note "WEB_SAPI_INI=UNKNOWN"

note "-- application-level overrides (gnuboard sets its own session path) --"
for f in "$WEB_ROOT/config.php" "$WEB_ROOT/common.php"; do
  [ -f "$f" ] || continue
  low grep -nE 'G5_SESSION_DIR|G5_SESSION_PATH|session_save_path|session_name|session_set_cookie_params|ini_set[[:space:]]*\([[:space:]]*.session|gc_maxlifetime|gc_probability|gc_divisor|cookie_lifetime' "$f" 2>/dev/null \
    | sed "s#^#$(basename "$f"):#" | redact >> "$OUTPUT" || true
done

# ------------------------------------------------------------
# B6 — Session storage aggregate (counts/size only)
# ------------------------------------------------------------

section "B6" "Session storage aggregate"
measure_dir() {
  local label="$1" dir="$2"
  if [ -d "$dir" ]; then
    local cnt size
    cnt="$(low find "$dir" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')"
    size="$(low du -sh "$dir" 2>/dev/null | awk '{print $1}')"
    note "$label: PATH=$dir FILES=${cnt:-UNKNOWN} SIZE=${size:-UNKNOWN}"
    local oldest
    oldest="$(low find "$dir" -maxdepth 1 -type f -printf '%T@\n' 2>/dev/null | sort -n | head -1)"
    if [ -n "$oldest" ]; then
      note "$label: OLDEST_FILE_AGE_HOURS=$(awk -v t="$oldest" -v n="$(date +%s)" 'BEGIN{d=(n-t)/3600; if (d<0) d=0; printf "%.1f", d}')"
    fi
  else
    note "$label: PATH=$dir NOT_PRESENT_OR_NOT_READABLE"
  fi
}
# 1) gnuboard 기본: html2/data/session
measure_dir "APP_SESSION_DIR" "$WEB_ROOT/data/session"
# 2) php.ini save_path (CLI 기준, 참고)
if [ -n "$PHP_BIN" ]; then
  SP="$(low "$PHP_BIN" -r 'echo ini_get("session.save_path");' 2>/dev/null || true)"
  case "$SP" in *";"*) SP="${SP##*;}";; esac
  [ -n "$SP" ] && measure_dir "INI_SESSION_DIR" "$SP"
fi
for d in /var/lib/php/sessions /var/lib/php/session; do
  [ -d "$d" ] && measure_dir "SYSTEM_SESSION_DIR" "$d"
done

# ------------------------------------------------------------
# B7 — Production source SHA256 (relative paths)
# ------------------------------------------------------------

section "B7" "Production source SHA256 (relative to WEB_ROOT)"
for rel in index.php common.php config.php head.php _head.php head.sub.php tail.php _tail.php shop/item.php shop/ajax.list.php bbs/login.php; do
  if [ -f "$WEB_ROOT/$rel" ]; then
    h="$(low sha256sum "$WEB_ROOT/$rel" 2>/dev/null | awk '{print $1}')"
    note "${h:-FAILED}  $rel"
  else
    note "MISSING  $rel"
  fi
done
note "-- mtime of key files (detect recent direct edits) --"
for rel in index.php common.php head.php tail.php; do
  [ -f "$WEB_ROOT/$rel" ] && note "$(date -r "$WEB_ROOT/$rel" '+%Y-%m-%d %H:%M' 2>/dev/null)  $rel"
done

# ------------------------------------------------------------
# B8 — Homepage asset presence
# ------------------------------------------------------------

section "B8" "Homepage asset presence"
if [ -f "$ASSET_LIST" ]; then
  n=0
  while IFS= read -r rel; do
    rel="${rel%%$'\r'}"
    [ -n "$rel" ] || continue
    case "$rel" in \#*) continue;; esac
    rel="${rel#/}"
    case "$rel" in *..*|*\?*) note "SKIPPED_UNSAFE $rel"; continue;; esac
    if [ -f "$WEB_ROOT/$rel" ]; then note "PRESENT  $rel"; else note "MISSING  $rel"; fi
    n=$((n + 1)); [ "$n" -ge 20 ] && break
  done < "$ASSET_LIST"
else
  note "ASSET_LIST_NOT_PROVIDED ($ASSET_LIST)"
fi

# ------------------------------------------------------------
# B9 — Cookie / domain constants (values are not secret)
# ------------------------------------------------------------

section "B9" "Cookie / domain constants"
if [ -r "$WEB_ROOT/config.php" ]; then
  low grep -nE "define[[:space:]]*\([[:space:]]*['\"](G5_COOKIE_DOMAIN|G5_DOMAIN|G5_HTTPS_DOMAIN|G5_SESSION_DIR)['\"]" \
    "$WEB_ROOT/config.php" 2>/dev/null >> "$OUTPUT" || note "NOT_FOUND"
else
  note "CONFIG_NOT_READABLE"
fi

# ------------------------------------------------------------
# B10 — sudo capability (exactly once, non-interactive)
# ------------------------------------------------------------

section "B10" "sudo capability"
low sudo -n -l 2>&1 | redact >> "$OUTPUT" || true

# ------------------------------------------------------------
# B11 — Recent resource incidents
# ------------------------------------------------------------

section "B11" "Recent resource incidents"
DM="$(low dmesg -T 2>&1 || true)"
if printf '%s' "$DM" | grep -qiE 'not permitted|denied'; then
  note "DMESG=NO_PERMISSION"
else
  printf '%s\n' "$DM" | grep -iE 'out of memory|oom-killer|killed process' | tail -n 20 >> "$OUTPUT" \
    || note "DMESG_NO_OOM_LINES"
fi
JK="$(low journalctl -k --since '7 days ago' --no-pager 2>&1 || true)"
if printf '%s' "$JK" | grep -qiE 'not permitted|denied|No journal files|insufficient'; then
  note "JOURNAL=NO_PERMISSION (use AWS console > Get system log)"
else
  printf '%s\n' "$JK" | grep -iE 'out of memory|oom-killer|killed process' | tail -n 20 >> "$OUTPUT" \
    || note "JOURNAL_NO_OOM_LINES"
fi
note "-- swap --"
run_low swapon --show

# ------------------------------------------------------------
# B12 — cron (current user + system cron file names)
# ------------------------------------------------------------

section "B12" "cron"
note "-- current user crontab --"
low crontab -l 2>&1 | redact >> "$OUTPUT" || true
note "-- /etc/cron.d file names only --"
ls -1 /etc/cron.d 2>/dev/null >> "$OUTPUT" || note "UNKNOWN"
note "-- systemd timers (names only) --"
low systemctl list-timers --all --no-pager 2>/dev/null | awk 'NR>1 {print $NF}' | grep -v '^$' | head -n 40 >> "$OUTPUT" || note "UNKNOWN"

# ------------------------------------------------------------
# END
# ------------------------------------------------------------

section "END" "Collector completion"
cat >> "$OUTPUT" <<EOF
COMPLETED_AT=$(date -Iseconds 2>/dev/null || date)
No DB queries. No service restart/reload. No application files modified.
No application HTTP requests (EC2 metadata only).
EOF

echo
echo "Runtime collection complete."
echo "Output: $OUTPUT"
echo "Download:  scp <user>@<server>:$OUTPUT docs/discovery/"
