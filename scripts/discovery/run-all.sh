#!/usr/bin/env bash
#
# Gate 0.5 / 0.9 — Discovery 일괄 실행 (사람이 Mac에서 실행)
#
# RUN (Legacy 레포 루트에서):
#   bash scripts/discovery/run-all.sh https://<메인 도메인>
#
# OPTIONS (환경변수):
#   SSH_TARGET   기본 nonsul-learn@43.202.37.184
#   SSH_KEY      예: ~/.ssh/nonsulrun.pem   (없으면 ~/.ssh/config 설정 사용)
#   V2_REPO      기본 ../nonsullearn-v2-frontend
#   WEB_ROOT     서버의 html2 경로. 기본 서버 사용자 홈의 html2
#   SKIP_SERVER  1이면 서버 단계 생략 (로컬 + HTTP만)
#
# 순서: 1 로컬 감사 → 2 HTTP 수집 → 3 서버 업로드/실행/다운로드/정리 → 4 비밀값 점검
# 서버 단계 직전에 확인(y/N)을 받는다.
#

set -u
set -o pipefail

BASE_URL="${1:-}"
[ -n "$BASE_URL" ] || { echo "Usage: bash $0 https://<domain>"; exit 1; }

SSH_TARGET="${SSH_TARGET:-nonsul-learn@43.202.37.184}"
SSH_KEY="${SSH_KEY:-}"
V2_REPO="${V2_REPO:-../nonsullearn-v2-frontend}"
WEB_ROOT="${WEB_ROOT:-}"
SKIP_SERVER="${SKIP_SERVER:-0}"

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git -C "$HERE" rev-parse --show-toplevel 2>/dev/null)" || { echo "ERROR: Legacy 레포 안의 scripts/discovery/run-all.sh 로 실행하세요."; exit 1; }
cd "$REPO_ROOT" || exit 1
mkdir -p docs/discovery

SSH_OPTS=(-o ConnectTimeout=20 -o ServerAliveInterval=15)
[ -n "$SSH_KEY" ] && SSH_OPTS+=(-i "$SSH_KEY")

step() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

for f in audit-local.sh collect-http.sh collect-runtime.sh; do
  [ -f "$HERE/$f" ] || { echo "ERROR: $HERE/$f 없음"; exit 1; }
done

# ------------------------------------------------------------
step "1/4 로컬 감사 (audit-local.sh)"
# ------------------------------------------------------------
if [ -d "$V2_REPO" ]; then
  V2_REPO="$V2_REPO" bash "$HERE/audit-local.sh" || echo "WARN: audit-local 실패 (계속 진행)"
else
  echo "WARN: V2_REPO '$V2_REPO' 없음 → V2 문서 검색 없이 실행"
  bash "$HERE/audit-local.sh" || echo "WARN: audit-local 실패 (계속 진행)"
fi

# ------------------------------------------------------------
step "2/4 HTTP 수집 (collect-http.sh $BASE_URL)"
# ------------------------------------------------------------
bash "$HERE/collect-http.sh" "$BASE_URL" || echo "WARN: collect-http 실패 (계속 진행)"
ASSETS="docs/discovery/home-assets.from-html.txt"

# ------------------------------------------------------------
step "3/4 서버 수집 ($SSH_TARGET)"
# ------------------------------------------------------------
if [ "$SKIP_SERVER" = "1" ]; then
  echo "SKIP_SERVER=1 → 서버 단계 생략"
else
  echo "운영 서버에서 읽기 전용 수집 스크립트를 1회 실행합니다."
  echo "  - 업로드: collect-runtime.sh$( [ -s "$ASSETS" ] && echo ', v2-home-assets.txt')"
  echo "  - 실행 후 결과를 내려받고 서버의 임시 파일 3개를 삭제합니다."
  printf "진행할까요? [y/N] "
  read -r ans
  if [ "$ans" != "y" ] && [ "$ans" != "Y" ]; then
    echo "서버 단계를 건너뜁니다."
  else
    scp "${SSH_OPTS[@]}" "$HERE/collect-runtime.sh" "$SSH_TARGET:~/collect-runtime.sh" \
      || { echo "ERROR: 업로드 실패 (SSH 접속 확인)"; exit 1; }
    if [ -s "$ASSETS" ]; then
      scp "${SSH_OPTS[@]}" "$ASSETS" "$SSH_TARGET:~/v2-home-assets.txt" || echo "WARN: 자산 목록 업로드 실패 (B8 생략됨)"
    fi

    REMOTE_ENV=""
    [ -n "$WEB_ROOT" ] && REMOTE_ENV="WEB_ROOT='$WEB_ROOT' "
    LOG="$(mktemp)"
    # shellcheck disable=SC2029
    ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "${REMOTE_ENV}bash ~/collect-runtime.sh" 2>&1 | tee "$LOG"
    RC="${PIPESTATUS[0]}"

    REMOTE_OUT="$(sed -n 's/^Output: *//p' "$LOG" | tail -1 | tr -d '\r')"
    rm -f "$LOG"

    if [ -n "$REMOTE_OUT" ]; then
      scp "${SSH_OPTS[@]}" "$SSH_TARGET:$REMOTE_OUT" docs/discovery/ \
        && echo "다운로드: docs/discovery/$(basename "$REMOTE_OUT")" \
        || echo "ERROR: 결과 다운로드 실패. 서버에 남은 파일: $REMOTE_OUT"
    else
      echo "WARN: 서버 결과 파일 경로를 찾지 못했습니다."
    fi

    case "$RC" in
      0) ;;
      3) echo "NOTE: 서버 부하가 높아 수집이 중단됐습니다. 30분 뒤 다시 실행하세요 (SKIP 없이)." ;;
      *) echo "WARN: 서버 스크립트 종료 코드 $RC" ;;
    esac

    echo "서버 임시 파일 정리"
    ssh "${SSH_OPTS[@]}" "$SSH_TARGET" 'rm -f ~/collect-runtime.sh ~/v2-home-assets.txt ~/v2-discovery-*.txt' \
      || echo "WARN: 서버 정리 실패. 직접 삭제하세요: ~/collect-runtime.sh ~/v2-home-assets.txt ~/v2-discovery-*.txt"
  fi
fi

# ------------------------------------------------------------
step "4/4 비밀값 잔존 점검"
# ------------------------------------------------------------
LEAKS="$(grep -niE 'password|passwd|secret|sk_live|sign_?key|api_?key' docs/discovery/*.txt 2>/dev/null \
  | grep -v 'REDACTED' || true)"
if [ -n "$LEAKS" ]; then
  echo "!!! 확인 필요: 마스킹되지 않은 것으로 보이는 줄이 있습니다. 커밋 전에 검토하세요."
  printf '%s\n' "$LEAKS" | head -n 20
else
  echo "OK: 마스킹되지 않은 비밀값 패턴 없음"
fi

step "완료"
ls -1 docs/discovery/ | grep -E 'local-audit-|http-|v2-discovery-|home-assets' || true
echo
echo "다음: 위 결과 파일로 감사 프롬프트(prompt-audit-gate-0.5-0.9.md)를 실행하세요."
