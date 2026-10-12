#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${CONFIRMATION_TRAIL_PORT:-4326}"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser)"
mkdir -p screenshots dist
if [[ ! -f dist/confirmation-trail.html ]]; then python3 build.py; fi
if ! ss -ltn | grep -q "127.0.0.1:$PORT "; then
  nohup python3 server.py > /tmp/confirmation-trail-$PORT.log 2>&1 &
  sleep 1
fi
shot() {
  local url="$1" out="$2" size="$3"; shift 3 || true
  local prof; prof="$(mktemp -d /tmp/ctshot.XXXX)"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --run-all-compositor-stages-before-draw --virtual-time-budget=28000 \
    --window-size="$size" --user-data-dir="$prof" --screenshot="$out" "$@" "$url" >/dev/null 2>&1
  rm -rf "$prof"; echo "  $out ($(wc -c < "$out") bytes)"
}
U="http://127.0.0.1:$PORT"
shot "file://$PWD/dist/confirmation-trail.html#trails" screenshots/00-best-home.png 1440,1100
shot "$U/#trails" screenshots/00-desktop-trails.png 1440,1000
shot "$U/#char" screenshots/01-char.png 1440,1000
shot "$U/#vic" screenshots/02-vic.png 1440,1100
shot "$U/#checklist" screenshots/03-checklist.png 1440,1100
shot "$U/#about" screenshots/04-about.png 1440,1000
shot "$U/#trails" screenshots/05-phone.png 390,844 --user-agent="Mozilla/5.0 (iPhone)"
echo "screenshots done"
