#!/usr/bin/env bash
set -euo pipefail

# Safe removal script for the `directory` feature.
# Usage:
#   1) Dry-run (default):
#        bash scripts/remove-directory.sh
#      This will list files that would be removed and create a backup tarball,
#      but it will NOT delete anything until you re-run with --yes.
#
#   2) Confirmed run:
#        bash scripts/remove-directory.sh --yes
#
# The script will:
# - Find and optionally delete `app/directory`
# - Find and optionally delete any `app/api/directory*` route files/folders
# - Find and optionally delete any `data/directory*` json files
# - Comment-out (safer than deleting) the two export lines in `components/index.ts`
# - Create a timestamped backup tarball in `backups/remove-directory-<ts>.tar.gz`

ROOT_DIR="$(pwd)"
TS=$(date +%Y%m%dT%H%M%S)
BACKUP_DIR="$ROOT_DIR/backups/remove-directory-$TS"
BACKUP_TAR="$ROOT_DIR/backups/remove-directory-$TS.tar.gz"

DRY_RUN=true
CONFIRM_FLAG="--yes"
if [ "${1:-}" = "$CONFIRM_FLAG" ]; then
  DRY_RUN=false
fi

echo "Running remove-directory script"
echo "Project root: $ROOT_DIR"
echo

# Gather candidates
declare -a CANDIDATES

add_if_exists() {
  local p="$1"
  if [ -e "$p" ]; then
    CANDIDATES+=("$p")
  fi
}

add_if_exists "$ROOT_DIR/app/directory"
add_if_exists "$ROOT_DIR/app/directory/page.tsx"
add_if_exists "$ROOT_DIR/app/directory/directory-client.tsx"
add_if_exists "$ROOT_DIR/app/directory/directory.css"

# any api routes that include "directory" in the path
shopt -s nullglob
for f in "$ROOT_DIR"/app/api/**/*directory*  "$ROOT_DIR"/app/api/*directory*; do
  # skip .next and node_modules matches
  if [[ "$f" == *".next"* ]] || [[ "$f" == *"node_modules"* ]]; then
    continue
  fi
  add_if_exists "$f"
done

# any data files named directory*
for f in "$ROOT_DIR"/data/**/directory* "$ROOT_DIR"/data/directory*; do
  if [[ "$f" == *"node_modules"* ]] || [[ "$f" == *".next"* ]]; then
    continue
  fi
  add_if_exists "$f"
done
shopt -u nullglob

# components to remove
add_if_exists "$ROOT_DIR/components/directory-page-header.tsx"
add_if_exists "$ROOT_DIR/components/directory-category-header.tsx"

echo "Candidates found to back up / remove:"
if [ ${#CANDIDATES[@]} -eq 0 ]; then
  echo "  (none)"
else
  for p in "${CANDIDATES[@]}"; do
    echo "  - $p"
  done
fi

echo
echo "This script will create a backup tarball at: $BACKUP_TAR"

if [ "$DRY_RUN" = true ]; then
  echo
  echo "DRY RUN: No files will be deleted. To perform deletion, re-run with --yes"
  echo "If you want the script to run non-interactively, pass --yes."
  echo
  # Still create a backup of the candidates so you can inspect them
fi

if [ ${#CANDIDATES[@]} -gt 0 ]; then
  mkdir -p "$BACKUP_DIR"
  echo "Creating backup tarball..."
  # Use tar; ensure files are added relative to project root
  (cd "$ROOT_DIR" && tar -czf "$BACKUP_TAR" "${CANDIDATES[@]/$ROOT_DIR\//}")
  echo "Backup created: $BACKUP_TAR"
else
  echo "No files to back up. Exiting."
  exit 0
fi

if [ "$DRY_RUN" = true ]; then
  echo
  echo "Dry run complete. No deletions performed."
  echo "To delete the above files and comment exports, run:"
  echo "  bash scripts/remove-directory.sh --yes"
  exit 0
fi

echo
read -p "Are you sure you want to permanently delete the above files? Type 'DELETE' to confirm: " CONFIRM
if [ "$CONFIRM" != "DELETE" ]; then
  echo "Confirmation failed; aborting. No changes made. Backup is at: $BACKUP_TAR"
  exit 1
fi

echo "Deleting files..."
for p in "${CANDIDATES[@]}"; do
  if [ -e "$p" ]; then
    echo "  rm -rf $p"
    rm -rf "$p"
  fi
done

echo "Commenting out directory exports in components/index.ts (safer than deleting)."
COMP_INDEX="$ROOT_DIR/components/index.ts"
if [ -f "$COMP_INDEX" ]; then
  cp "$COMP_INDEX" "$COMP_INDEX.bak.remove-directory-$TS"
  # prefix matching lines with a comment marker and a script annotation
  sed -E "s/^(\s*)export \{ DirectoryCategoryHeader \} from '\.\/directory-category-header';/\1\/\/ DELETED_BY_SCRIPT: export { DirectoryCategoryHeader } from '.\/directory-category-header';/" -i "$COMP_INDEX"
  sed -E "s/^(\s*)export \{ DirectoryPageHeader \} from '\.\/directory-page-header';/\1\/\/ DELETED_BY_SCRIPT: export { DirectoryPageHeader } from '.\/directory-page-header';/" -i "$COMP_INDEX"
  echo "  components/index.ts updated (backup at $COMP_INDEX.bak.remove-directory-$TS)"
else
  echo "  components/index.ts not found; skipping index edits"
fi

echo "Done. Backup tarball: $BACKUP_TAR"
echo "If something broke, you can extract the backup and restore files."
echo
echo "Next recommended steps:"
echo "  - Run 'git status' and review changes."
echo "  - Run your dev server and smoke-test the site (npm run dev)."
echo "  - Remove leftover references to '/api/directory' or metadata entries if you want a full clean (some references are safe — they gracefully handle missing endpoints)."

exit 0
