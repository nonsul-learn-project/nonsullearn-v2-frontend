#!/usr/bin/env bash
#
# L4 — 운영 스모크 (HARNESS.md §6 S1~S11).
#
# ※ 사람이 배포 직후에 실행한다. 에이전트는 이 스크립트를 실행하지 않는다 (AGENTS.md §9, CLAUDE.md).
# ※ Gate 3(Bridge 배포) / Gate 4(Apache 프록시) 전에는 S1~S6, S9 가 당연히 실패한다. 그게 정상이다.
#
# 사용법:
#   SMOKE_BASE_URL=https://<메인도메인> \
#   SMOKE_ORIGIN_URL=https://v2-origin.<도메인> \
#   SMOKE_PROXY_SECRET=<X-V2-Proxy-Secret 값> \
#   [SMOKE_PHPSESSID=<테스트 계정 세션>] \
#   pnpm smoke:prod
#
# 판정: S1~S9 중 하나라도 실패하면 **배포 실패**다.
#   Bridge 문제면 Bridge 롤백, Proxy 문제면 kill switch(/etc/nonsulrun/v2.off) 또는 vhost 롤백.
#   S10(TTFB) 실패는 경고다. 2회 연속이면 조사한다.
#
# 결과는 docs/gates/<gate>.md 에 실행 시각과 함께 붙인다.

set -uo pipefail

FIXTURES_DIR="src/legacy/contracts/fixtures"

: "${SMOKE_BASE_URL:?SMOKE_BASE_URL 이 필요하다 (예: https://example.com)}"
: "${SMOKE_ORIGIN_URL:?SMOKE_ORIGIN_URL 이 필요하다 (예: https://v2-origin.example.com)}"
SMOKE_PROXY_SECRET="${SMOKE_PROXY_SECRET:-}"
SMOKE_PHPSESSID="${SMOKE_PHPSESSID:-}"

PASS=0
FAIL=0
WARN=0

pass() { printf '  \033[32mPASS\033[0m %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf '  \033[31mFAIL\033[0m %s\n' "$1"; FAIL=$((FAIL + 1)); }
warn() { printf '  \033[33mWARN\033[0m %s\n' "$1"; WARN=$((WARN + 1)); }
skip() { printf '  \033[90mSKIP\033[0m %s\n' "$1"; }
head_() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# curl 공통 옵션. 운영에 부담을 주지 않게 타임아웃을 짧게 둔다.
CURL=(curl --silent --show-error --max-time 10)

# 응답 본문과 헤더를 받아 둔다.
fetch() {
  local url="$1"; shift
  local body_file="$1"; shift
  local header_file="$1"; shift
  "${CURL[@]}" "$@" --dump-header "$header_file" --output "$body_file" --write-out '%{http_code}' "$url"
}

header_value() { # header_file, name
  tr -d '\r' < "$1" | awk -v IGNORECASE=1 -v n="$2:" '$1 == n { $1=""; sub(/^ /,""); print }' | tail -1
}

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

printf '\033[1mL4 운영 스모크\033[0m  %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
printf '  base   = %s\n  origin = %s\n' "$SMOKE_BASE_URL" "$SMOKE_ORIGIN_URL"

# ─────────────────────────────────────────────────────────────────────────────
head_ 'Bridge — viewer (Gate 3)'

# S1: 쿠키 없이 호출하면 비로그인 JSON 이어야 한다.
status=$(fetch "$SMOKE_BASE_URL/v2-api/viewer.php" "$TMP/s1.body" "$TMP/s1.head")
if [[ "$status" == "200" ]] \
  && grep -q '"v"[[:space:]]*:[[:space:]]*1' "$TMP/s1.body" \
  && grep -q '"authenticated"[[:space:]]*:[[:space:]]*false' "$TMP/s1.body"; then
  pass "S1 GET /v2-api/viewer.php (쿠키 없음) → 200, v==1, authenticated==false"
else
  fail "S1 GET /v2-api/viewer.php (쿠키 없음) → status=$status"
fi

# S2: 로그인 상태는 캐시되면 안 된다.
cache_control=$(header_value "$TMP/s1.head" 'Cache-Control')
content_type=$(header_value "$TMP/s1.head" 'Content-Type')
if [[ "$cache_control" == *"no-store"* ]] && [[ "$content_type" == *"application/json"* ]]; then
  pass "S2 viewer 헤더 → Cache-Control: no-store, Content-Type: application/json"
else
  fail "S2 viewer 헤더 → Cache-Control='$cache_control' Content-Type='$content_type'"
fi

# S3: Bridge 는 읽기 전용이다. POST 를 받아들이면 안 된다.
status=$(fetch "$SMOKE_BASE_URL/v2-api/viewer.php" "$TMP/s3.body" "$TMP/s3.head" --request POST)
if [[ "$status" != "200" ]]; then
  pass "S3 POST /v2-api/viewer.php → $status (200 아님)"
else
  fail "S3 POST /v2-api/viewer.php → 200. Bridge 는 읽기 전용이어야 한다"
fi

# ─────────────────────────────────────────────────────────────────────────────
head_ 'Bridge — courses (Gate 3)'

# S4: 응답의 key 집합이 fixture 와 같아야 한다. 값이 아니라 **모양**을 본다.
status=$(fetch "$SMOKE_BASE_URL/v2-api/courses.php" "$TMP/s4.body" "$TMP/s4.head")
if [[ "$status" == "200" ]] && grep -q '"items"' "$TMP/s4.body"; then
  if command -v node >/dev/null 2>&1; then
    if node -e '
      const fs = require("fs");
      const actual = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      const fixture = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
      if (actual.v !== 1) { console.error("v !== 1"); process.exit(1); }
      if (!Array.isArray(actual.items)) { console.error("items 가 배열이 아니다"); process.exit(1); }
      if (actual.items.length === 0) { console.error("items 가 비어 있다"); process.exit(1); }
      const expected = Object.keys(fixture.items[0]).sort().join(",");
      const got = Object.keys(actual.items[0]).sort().join(",");
      if (expected !== got) {
        console.error(`key 집합 불일치\n  fixture: ${expected}\n  실제:    ${got}`);
        process.exit(1);
      }
    ' "$TMP/s4.body" "$FIXTURES_DIR/course.list.json" 2>"$TMP/s4.err"; then
      pass "S4 GET /v2-api/courses.php → 200, v==1, items 배열, key 집합 == fixture"
    else
      fail "S4 key 집합 비교 실패: $(tr '\n' ' ' < "$TMP/s4.err")"
    fi
  else
    warn "S4 node 가 없어 key 집합을 비교하지 못했다 (status=$status)"
  fi
else
  fail "S4 GET /v2-api/courses.php → status=$status"
fi

# ─────────────────────────────────────────────────────────────────────────────
head_ 'Proxy (Gate 4)'

# S5: 프록시를 거친 요청은 proxied == true 여야 한다.
if [[ -n "$SMOKE_PROXY_SECRET" ]]; then
  status=$(fetch "$SMOKE_BASE_URL/api/v2-health" "$TMP/s5.body" "$TMP/s5.head")
  if [[ "$status" == "200" ]] && grep -q '"proxied"[[:space:]]*:[[:space:]]*true' "$TMP/s5.body"; then
    pass "S5 GET /api/v2-health (메인 도메인) → proxied == true"
  else
    fail "S5 GET /api/v2-health → status=$status, body=$(tr -d '\n' < "$TMP/s5.body")"
  fi
else
  skip "S5 SMOKE_PROXY_SECRET 이 없다"
fi

# S6: **가장 중요하다.** Apache 가 Cookie 를 제거했는지 확인한다.
#     V2 는 PHP 세션 쿠키를 받아서는 안 된다 (AGENTS.md §2 절대 원칙 2).
status=$(fetch "$SMOKE_BASE_URL/api/v2-health" "$TMP/s6.body" "$TMP/s6.head" \
  --header 'Cookie: PHPSESSID=dummy-not-a-real-session')
if [[ "$status" == "200" ]] && grep -q '"cookieForwarded"[[:space:]]*:[[:space:]]*false' "$TMP/s6.body"; then
  pass "S6 /api/v2-health + PHPSESSID 쿠키 → cookieForwarded == false"
else
  fail "S6 cookieForwarded 가 false 가 아니다. Apache 가 Cookie 를 제거하지 않았다. status=$status"
fi

# ─────────────────────────────────────────────────────────────────────────────
head_ 'Legacy 무영향'

# S7: 로그인 페이지가 살아 있어야 한다.
status=$(fetch "$SMOKE_BASE_URL/bbs/login.php" "$TMP/s7.body" "$TMP/s7.head")
if [[ "$status" == "200" ]]; then
  pass "S7 GET /bbs/login.php → 200"
else
  fail "S7 GET /bbs/login.php → $status"
fi

# S8: 쇼핑 경로가 살아 있어야 한다.
status=$(fetch "$SMOKE_BASE_URL/shop/" "$TMP/s8.body" "$TMP/s8.head")
if [[ "$status" == "200" || "$status" =~ ^30[0-9]$ ]]; then
  pass "S8 GET /shop/ → $status"
else
  fail "S8 GET /shop/ → $status"
fi

# ─────────────────────────────────────────────────────────────────────────────
head_ 'Origin 보호'

# S9: origin 직접 접근은 메인 도메인으로 308 이거나 최소한 noindex 여야 한다.
status=$("${CURL[@]}" --output /dev/null --dump-header "$TMP/s9.head" \
  --write-out '%{http_code}' "$SMOKE_ORIGIN_URL/")
robots_tag=$(header_value "$TMP/s9.head" 'X-Robots-Tag')
location=$(header_value "$TMP/s9.head" 'Location')
if [[ "$status" == "308" && "$location" == "$SMOKE_BASE_URL"* ]]; then
  pass "S9 GET origin/ → 308 → $location"
elif [[ "$robots_tag" == *"noindex"* ]]; then
  pass "S9 GET origin/ → $status, X-Robots-Tag: noindex"
else
  fail "S9 GET origin/ → status=$status, Location='$location', X-Robots-Tag='$robots_tag'"
fi

# ─────────────────────────────────────────────────────────────────────────────
head_ '성능 (경고만)'

# S10: /_v2/check TTFB 3회 중 중앙값이 600ms 이하.
ttfbs=()
for _ in 1 2 3; do
  ttfbs+=("$("${CURL[@]}" --output /dev/null --write-out '%{time_starttransfer}' \
    "$SMOKE_BASE_URL/_v2/check")")
done
median=$(printf '%s\n' "${ttfbs[@]}" | sort -g | sed -n '2p')
median_ms=$(awk -v t="$median" 'BEGIN { printf "%.0f", t * 1000 }')
if [[ "$median_ms" -le 600 ]]; then
  pass "S10 /_v2/check TTFB 중앙값 ${median_ms}ms (<= 600ms)"
else
  warn "S10 /_v2/check TTFB 중앙값 ${median_ms}ms (> 600ms). 2회 연속이면 조사한다"
fi

# ─────────────────────────────────────────────────────────────────────────────
head_ '선택 — 테스트 계정'

# S11: 로그인 세션으로 호출해도 개인정보 필드가 없어야 한다.
if [[ -n "$SMOKE_PHPSESSID" ]]; then
  status=$(fetch "$SMOKE_BASE_URL/v2-api/viewer.php" "$TMP/s11.body" "$TMP/s11.head" \
    --header "Cookie: PHPSESSID=$SMOKE_PHPSESSID")
  if [[ "$status" == "200" ]] \
    && grep -q '"authenticated"[[:space:]]*:[[:space:]]*true' "$TMP/s11.body" \
    && ! grep -qE '"(mb_id|mb_email|mb_hp|mb_name|mb_password|displayName)"' "$TMP/s11.body"; then
    pass "S11 테스트 계정 viewer → authenticated==true, 금지 필드 없음"
  else
    fail "S11 테스트 계정 viewer → status=$status 또는 금지 필드가 있다"
  fi
else
  skip "S11 SMOKE_PHPSESSID 가 없다"
fi

# ─────────────────────────────────────────────────────────────────────────────
printf '\n\033[1m결과\033[0m  PASS=%d  FAIL=%d  WARN=%d\n' "$PASS" "$FAIL" "$WARN"
if [[ "$FAIL" -gt 0 ]]; then
  printf '\033[31mS1~S9 중 실패가 있으면 배포 실패다. 롤백 수단은 docs/harness/EXECUTION-PLAN.md §5 를 본다.\033[0m\n'
  exit 1
fi
printf '\033[32m모든 필수 검사 통과.\033[0m 결과를 docs/gates/<gate>.md 에 붙인다.\n'
