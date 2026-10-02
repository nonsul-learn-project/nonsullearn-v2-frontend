#!/usr/bin/env bash
#
# Gate 0.5 / 0.9 — Production HTTP / TLS / Rendered-HTML Collector
#
# WHERE:   개발자 노트북 (macOS bash 3.2 / Linux). 운영 서버에서 실행하지 않음.
# RUN:     cd /path/to/nonsul-learn-html1
#          bash scripts/discovery/collect-http.sh https://<메인 도메인>
# OPTIONAL ASSET_LIST=docs/discovery/home-assets.txt  (없으면 H6에서 추출한 목록 사용)
# OUTPUT:  docs/discovery/http-YYYYMMDD-HHMM.txt
#          docs/discovery/home-assets.from-html.txt  (H6이 렌더링된 홈에서 추출한 자산 후보)
#
# REQUEST BUDGET (총 최대 14회)
#   H1/H2  HEAD /              1
#   H3     TLS handshake       1
#   H4     HEAD /bbs/login.php 1
#   H6     GET  /  (HTML 1회)  1
#   H5     HEAD 자산           최대 10 (1초 간격)
#
# PRIVACY
#   - 쿠키를 보내지 않고 저장하지 않음 (Set-Cookie는 이름과 속성만 기록)
#   - 로그인, POST 없음
#

set -u
set -o pipefail

BASE_URL="${1:-}"
if [ -z "$BASE_URL" ]; then
  echo "Usage: $0 https://<domain>"
  exit 1
fi
case "$BASE_URL" in
  https://*) ;;
  *) echo "ERROR: https:// URL required"; exit 1;;
esac
BASE_URL="${BASE_URL%/}"
HOST="$(printf '%s\n' "$BASE_URL" | sed -E 's#^https://([^/:]+).*#\1#')"
[ -n "$HOST" ] || { echo "ERROR: hostname parse failed"; exit 1; }

STAMP="$(date +%Y%m%d-%H%M)"
OUTPUT="${OUTPUT:-docs/discovery/http-${STAMP}.txt}"
ASSET_LIST="${ASSET_LIST:-}"
ASSETS_FROM_HTML="docs/discovery/home-assets.from-html.txt"
UA="nonsulrun-v2-discovery/1.0 (+gate-0.5-0.9; one-shot)"

mkdir -p "$(dirname "$OUTPUT")"
: > "$OUTPUT"

now_iso() { date '+%Y-%m-%dT%H:%M:%S%z'; }
section() { printf '\n=== [%s] %s ===\n' "$1" "$2" >> "$OUTPUT"; }
note()    { printf '%s\n' "$*" >> "$OUTPUT"; }

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cat >> "$OUTPUT" <<EOF
Gate 0.5 / 0.9 HTTP Discovery
Generated: $(now_iso)
Target: $BASE_URL
Host: $HOST
Rules: no cookies sent/stored, no auth, no POST, max 14 requests
EOF

CURL_BASE="curl --silent --show-error --max-time 15 --connect-timeout 5 -A"

# ------------------------------------------------------------
# H1 + H2 — one HEAD request
# ------------------------------------------------------------

HEADERS="$TMP_DIR/home.headers"
META="$($CURL_BASE "$UA" --head --output "$HEADERS" \
  --write-out 'http_code=%{http_code}\ntime_connect=%{time_connect}\ntime_starttransfer=%{time_starttransfer}\ntime_total=%{time_total}\nremote_ip=%{remote_ip}\nredirect_url=%{redirect_url}\n' \
  "$BASE_URL/" 2>&1 || true)"

section "H1" "Set-Cookie attributes (names/attributes only)"
SC="$(grep -i '^set-cookie:' "$HEADERS" 2>/dev/null | tr -d '\r' || true)"
if [ -z "$SC" ]; then
  note "NO_SET_COOKIE_HEADER"
  case "$META" in *"http_code=30"*) note "NOTE: home responded with a redirect; cookies may be set on the target. See H2 redirect_url.";; esac
else
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    cookie="${line#*: }"
    first="${cookie%%;*}"
    name="${first%%=*}"
    attrs="$(printf '%s\n' "$cookie" | cut -d';' -f2- -s | tr ';' '\n' | sed -E 's/^[[:space:]]+//' \
      | grep -iE '^(path|domain|expires|max-age|samesite|secure|httponly)' | tr '\n' ';' )"
    note "name=$name"
    note "attributes=${attrs:-NONE}"
    printf '%s' "$attrs" | grep -qiE '(^|;)secure(;|$)'   && note "Secure=YES"   || note "Secure=NO"
    printf '%s' "$attrs" | grep -qiE '(^|;)httponly(;|$)' && note "HttpOnly=YES" || note "HttpOnly=NO"
    printf '%s' "$attrs" | grep -qi 'samesite' || note "SameSite=NOT_SET"
    note "---"
  done <<EOF
$SC
EOF
fi

section "H2" "Homepage response (HEAD)"
note "$META"
grep -iE '^(HTTP/|server:|x-powered-by:|cache-control:|expires:|pragma:|age:|vary:|via:|x-cache:|cf-cache-status:|location:|strict-transport-security:|content-security-policy:)' \
  "$HEADERS" 2>/dev/null | tr -d '\r' >> "$OUTPUT" || note "NO_HEADERS"

# ------------------------------------------------------------
# H3 — TLS (no `timeout` dependency; stdin closed)
# ------------------------------------------------------------

section "H3" "TLS certificate"
if command -v openssl >/dev/null 2>&1; then
  CERT="$(openssl s_client -connect "${HOST}:443" -servername "$HOST" </dev/null 2>/dev/null \
    | openssl x509 -noout -issuer -subject -startdate -enddate 2>/dev/null || true)"
  if [ -n "$CERT" ]; then
    note "$CERT"
    END="$(printf '%s\n' "$CERT" | sed -n 's/^notAfter=//p')"
    [ -n "$END" ] && note "NOTE: certificate expires $END"
  else
    note "TLS=UNKNOWN_OR_FAILED"
  fi
  PROTO="$(openssl s_client -connect "${HOST}:443" -servername "$HOST" -brief </dev/null 2>&1 \
    | grep -iE 'Protocol version|Ciphersuite' || true)"
  [ -n "$PROTO" ] && note "$PROTO"
else
  note "OPENSSL_NOT_FOUND"
fi

# ------------------------------------------------------------
# H4 — Login page
# ------------------------------------------------------------

section "H4" "Login page (HEAD)"
$CURL_BASE "$UA" --head --output /dev/null \
  --write-out 'url=%{url_effective}\nhttp_code=%{http_code}\nredirect_url=%{redirect_url}\ntime_total=%{time_total}\n' \
  "$BASE_URL/bbs/login.php" >> "$OUTPUT" 2>&1 || note "FAILED"

# ------------------------------------------------------------
# H6 — Rendered homepage HTML (one GET): tracking IDs + assets
#      (run before H5 so H5 can use the extracted asset list)
# ------------------------------------------------------------

section "H6" "Rendered homepage: tracking IDs and asset paths"
HTML="$TMP_DIR/home.html"
$CURL_BASE "$UA" --location --max-redirs 3 --max-filesize 5000000 \
  --output "$HTML" --write-out 'final_url=%{url_effective}\nhttp_code=%{http_code}\nsize_bytes=%{size_download}\n' \
  "$BASE_URL/" >> "$OUTPUT" 2>&1 || note "FAILED_GET"

if [ -s "$HTML" ]; then
  note "-- tracking identifiers (public IDs) --"
  {
    grep -oE 'GTM-[A-Z0-9]{4,10}' "$HTML" | sort -u | sed 's/^/GTM: /'
    grep -oE "gtag\([[:space:]]*['\"]config['\"][[:space:]]*,[[:space:]]*['\"][A-Z]{1,3}-[A-Z0-9-]{4,}['\"]" "$HTML" \
      | grep -oE "['\"][A-Z]{1,3}-[A-Z0-9-]{4,}['\"]" | tr -d "'\"" | sort -u | sed 's/^/gtag config: /'
    grep -oE "googletagmanager\.com/gtag/js\?id=[A-Z0-9-]+" "$HTML" | sed 's/.*id=//' | sort -u | sed 's/^/gtag.js id: /'
    grep -oE "fbq\([[:space:]]*['\"]init['\"][[:space:]]*,[[:space:]]*['\"][0-9]+['\"]" "$HTML" \
      | grep -oE '[0-9]{6,}' | sort -u | sed 's/^/Meta Pixel: /'
    grep -oE "wcs_add\[['\"]wa['\"]\][[:space:]]*=[[:space:]]*['\"][A-Za-z0-9_]+['\"]" "$HTML" \
      | grep -oE "['\"][A-Za-z0-9_]{6,}['\"]$" | tr -d "'\"" | sort -u | sed 's/^/Naver WCS: /'
    grep -oE "kakaoPixel\([[:space:]]*['\"][0-9]+['\"]" "$HTML" | grep -oE '[0-9]{6,}' | sort -u | sed 's/^/Kakao Pixel: /'
    grep -qE '_nasa' "$HTML" && echo "Naver _nasa conversion object: PRESENT"
    grep -qE 'wcs_do' "$HTML" && echo "Naver wcs_do call: PRESENT"
  } >> "$OUTPUT" 2>/dev/null
  grep -qE 'GTM-|gtag\(|fbq\(|wcs_add|kakaoPixel' "$HTML" || note "NO_TRACKING_SIGNATURES_FOUND"

  note "-- same-host asset paths (images) --"
  grep -oE '(src|href|data-src)=["'"'"'][^"'"'"']+\.(png|jpe?g|webp|gif|svg|avif)(\?[^"'"'"']*)?["'"'"']' "$HTML" \
    | sed -E 's/^(src|href|data-src)=["'"'"']//; s/["'"'"']$//; s/\?.*$//' \
    | sed -E "s#^https?://${HOST}##; s#^//${HOST}##" \
    | grep -vE '^(https?:)?//' \
    | sed -E 's#^\./##; s#^/##' \
    | grep -v '\.\.' \
    | sort -u > "$TMP_DIR/assets.txt" || true
  grep -oE 'url\([[:space:]]*["'"'"']?[^)"'"'"']+\.(png|jpe?g|webp|gif|svg|avif)' "$HTML" \
    | sed -E 's/^url\([[:space:]]*["'"'"']?//' \
    | sed -E "s#^https?://${HOST}##" | grep -vE '^(https?:)?//' | sed -E 's#^/##' \
    | sort -u >> "$TMP_DIR/assets.txt" || true
  sort -u "$TMP_DIR/assets.txt" | head -n 30 > "$ASSETS_FROM_HTML"
  if [ -s "$ASSETS_FROM_HTML" ]; then
    cat "$ASSETS_FROM_HTML" >> "$OUTPUT"
    note "(saved to $ASSETS_FROM_HTML — copy to server as ~/v2-home-assets.txt for B8)"
  else
    note "NO_SAME_HOST_IMAGE_ASSETS"
  fi

  note "-- login/logout/member links in rendered HTML (anonymous view) --"
  grep -oE 'href=["'"'"'][^"'"'"']*(login|logout|register|mypage|member|lecture|item\.php|cart)[^"'"'"']*["'"'"']' "$HTML" \
    | sed -E 's/^href=["'"'"']//; s/["'"'"']$//' | sed -E "s#^https?://${HOST}##" | sort -u | head -n 40 >> "$OUTPUT" || true
else
  note "EMPTY_HTML"
fi

# ------------------------------------------------------------
# H5 — Homepage asset HTTP status (max 10, 1s spacing)
# ------------------------------------------------------------

section "H5" "Homepage asset HTTP status"
LIST=""
if [ -n "$ASSET_LIST" ] && [ -f "$ASSET_LIST" ]; then
  LIST="$ASSET_LIST"
elif [ -s "$ASSETS_FROM_HTML" ]; then
  LIST="$ASSETS_FROM_HTML"
fi
if [ -z "$LIST" ]; then
  note "NO_ASSET_LIST"
else
  note "source=$LIST"
  n=0
  while IFS= read -r rel; do
    rel="$(printf '%s' "$rel" | tr -d '\r')"
    [ -n "$rel" ] || continue
    case "$rel" in \#*) continue;; esac
    rel="${rel#/}"
    case "$rel" in *..*|*\?*|*\#*) note "SKIPPED_UNSAFE $rel"; continue;; esac
    code="$($CURL_BASE "$UA" --head --output /dev/null --write-out '%{http_code}' "$BASE_URL/$rel" 2>/dev/null || echo FAILED)"
    note "$code  $rel"
    n=$((n + 1)); [ "$n" -ge 10 ] && break
    sleep 1
  done < "$LIST"
fi

# ------------------------------------------------------------
# END
# ------------------------------------------------------------

section "END" "Collector completion"
note "COMPLETED_AT=$(now_iso)"
note "No cookies sent or stored. No authentication. No POST."

echo
echo "HTTP collection complete."
echo "Output: $OUTPUT"
[ -s "$ASSETS_FROM_HTML" ] && echo "Asset candidates: $ASSETS_FROM_HTML (upload to server as ~/v2-home-assets.txt)"
exit 0
