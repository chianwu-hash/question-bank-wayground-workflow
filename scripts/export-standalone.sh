#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/export-standalone.sh [--force] <target-dir>

Exports the question-bank Wayground workflow module as a standalone repo layout.
The target directory must be empty unless --force is provided.
USAGE
}

force=0
if [ "${1:-}" = "--force" ]; then
  force=1
  shift
fi

if [ "$#" -ne 1 ]; then
  usage
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
module_root="$(cd "$script_dir/.." && pwd)"
target_dir="$1"

mkdir -p "$target_dir"
target_root="$(cd "$target_dir" && pwd)"

if [ "$force" -ne 1 ] && [ -n "$(find "$target_root" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
  echo "Target directory is not empty: $target_root" >&2
  echo "Re-run with --force to overwrite files." >&2
  exit 1
fi

(
  cd "$module_root"
  tar \
    --exclude='./automation/output' \
    --exclude='./.git' \
    --exclude='./.env' \
    -cf - .
) | (
  cd "$target_root"
  tar -xf -
)

if [ -f "$target_root/templates/standalone-gitignore.sample" ]; then
  cp "$target_root/templates/standalone-gitignore.sample" "$target_root/.gitignore"
fi

cat <<EOF
Question-bank Wayground workflow module exported.
Target: $target_root
Next steps:
1. cd "$target_root"
2. git init
3. git add .
4. git commit -m "Initial Wayground workflow module"
EOF
