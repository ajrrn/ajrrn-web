#!/usr/bin/env bash
# Quick post-deploy check of the live site.  Usage: scripts/smoke-production.sh [domain]
set -u
D="${1:-ajrrn.org}"
fail=0
check() { # url expected-status [expected-redirect-substring]
  local out; out=$(curl -sS -o /dev/null -m 20 -w "%{http_code} %{redirect_url}" "$1" 2>&1)
  local code=${out%% *}; local loc=${out#* }
  if [[ "$code" == "$2" && ( -z "${3:-}" || "$loc" == *"$3"* ) ]]; then printf "ok   %-45s %s %s\n" "$1" "$code" "$loc"
  else printf "FAIL %-45s got: %s (expected %s %s)\n" "$1" "$out" "$2" "${3:-}"; fail=1; fi
}
check "https://$D/" 200
check "https://www.$D/" 301 "https://$D/"
for l in fr es ar; do check "https://$l.$D/" 200; done
check "https://$D/fr/about/" 301 "https://fr.$D/about/"
check "https://fr.$D/about" 307 "https://fr.$D/about/"
check "https://$D/this-page-does-not-exist/" 404
check "https://$D/assets/css/site.css" 200
check "https://$D/robots.txt" 200
check "https://ar.$D/sitemap.xml" 200
# Language + production link mode
for l in en fr es ar; do
  host=$([[ $l == en ]] && echo "$D" || echo "$l.$D")
  html=$(curl -sS -m 20 "https://$host/")
  grep -q "<html lang=\"$l\"" <<<"$html" && echo "ok   $host lang=$l" || { echo "FAIL $host lang"; fail=1; }
  grep -q 'name="robots" content="noindex' <<<"$html" && { echo "FAIL $host is noindex (built in preview mode?)"; fail=1; } || true
  grep -q "href=\"/$l/" <<<"$html" && { echo "FAIL $host has /$l/ links (built without SITE_MODE=subdomain?)"; fail=1; } || true
done
[[ $fail == 0 ]] && echo "All production checks passed." || { echo "Some checks FAILED."; exit 1; }
