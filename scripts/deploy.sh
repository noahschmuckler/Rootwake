#!/usr/bin/env bash
# Deploy to GitHub Pages. `scripts/deploy.sh main` publishes the plateau and the
# underworld at the site root (leaving lab/ alone); `scripts/deploy.sh lab`
# publishes the lab branch's entry at /Rootwake/lab/. Run from a clean checkout
# of the branch being deployed.
set -euo pipefail
which=${1:-main}
root=$(git rev-parse --show-toplevel)
wt=$(mktemp -d)
git fetch origin gh-pages
git worktree add "$wt" origin/gh-pages
if [ "$which" = lab ]; then
  npx vite build --base=/Rootwake/lab/
  rm -rf "$wt/lab" && mkdir -p "$wt/lab"
  cp -r "$root/dist/assets" "$wt/lab/assets"
  cp "$root/dist/lab.html" "$wt/lab/index.html"
else
  npx vite build --base=/Rootwake/
  (cd "$wt" && find . -maxdepth 1 ! -name . ! -name .git ! -name lab ! -name hulda -exec rm -rf {} +)
  cp -r "$root/dist/." "$wt/"
  rm -f "$wt/lab.html"
fi
touch "$wt/.nojekyll"
(cd "$wt" && git add -A && git commit -q -m "Deploy ($which): $(git -C "$root" log --oneline -1)" && git push origin HEAD:gh-pages)
git worktree remove --force "$wt"
