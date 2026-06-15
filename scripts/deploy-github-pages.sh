#!/usr/bin/env bash
set -euo pipefail

# Build and publish the static Next/Fumadocs export in ./out to GitHub Pages.
# Defaults are for https://indigofeather.github.io/finance-docs/.
# Override when needed:
#   GH_PAGES_BRANCH=gh-pages \
#   NEXT_PUBLIC_BASE_PATH=/finance-docs \
#   NEXT_PUBLIC_SITE_URL=https://indigofeather.github.io/finance-docs \
#   ./scripts/deploy-github-pages.sh
#
# Custom domain example:
#   GH_PAGES_CNAME=finance-docs.ycnets.com \
#   NEXT_PUBLIC_BASE_PATH= \
#   NEXT_PUBLIC_SITE_URL=https://finance-docs.ycnets.com \
#   ./scripts/deploy-github-pages.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REMOTE="${GH_PAGES_REMOTE:-origin}"
BRANCH="${GH_PAGES_BRANCH:-gh-pages}"
REMOTE_URL="$(git remote get-url "$REMOTE")"
REPO_NAME="$(basename "${REMOTE_URL%.git}")"
OWNER="$(printf '%s' "$REMOTE_URL" | sed -E 's#.*github.com[:/]([^/]+)/.*#\1#')"

if [[ -z "${NEXT_PUBLIC_BASE_PATH+x}" ]]; then
  export NEXT_PUBLIC_BASE_PATH="/$REPO_NAME"
fi

if [[ -z "${NEXT_PUBLIC_SITE_URL+x}" ]]; then
  export NEXT_PUBLIC_SITE_URL="https://$OWNER.github.io/$REPO_NAME"
fi

printf 'Deploying static site to GitHub Pages\n'
printf '  remote: %s (%s)\n' "$REMOTE" "$REMOTE_URL"
printf '  branch: %s\n' "$BRANCH"
printf '  NEXT_PUBLIC_BASE_PATH=%s\n' "$NEXT_PUBLIC_BASE_PATH"
printf '  NEXT_PUBLIC_SITE_URL=%s\n' "$NEXT_PUBLIC_SITE_URL"

bun run lint
bun run build

test -d out || {
  echo 'Error: out/ was not generated.' >&2
  exit 1
}

test -f out/.nojekyll || touch out/.nojekyll

DEPLOY_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$DEPLOY_DIR"
}
trap cleanup EXIT

git -C "$DEPLOY_DIR" init -q
git -C "$DEPLOY_DIR" checkout -B "$BRANCH" >/dev/null
git -C "$DEPLOY_DIR" remote add origin "$REMOTE_URL"

cp -a out/. "$DEPLOY_DIR"/

if [[ -n "${GH_PAGES_CNAME:-}" ]]; then
  printf '%s\n' "$GH_PAGES_CNAME" > "$DEPLOY_DIR/CNAME"
fi

git -C "$DEPLOY_DIR" add -A
if git -C "$DEPLOY_DIR" diff --cached --quiet; then
  echo 'No changes to deploy.'
  exit 0
fi

git -C "$DEPLOY_DIR" commit -m "deploy: static site $(date -u +'%Y-%m-%dT%H:%M:%SZ')" >/dev/null
git -C "$DEPLOY_DIR" push origin "$BRANCH" --force

echo "Deployed to $NEXT_PUBLIC_SITE_URL"
