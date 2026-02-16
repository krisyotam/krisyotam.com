#!/bin/bash
# link-content.sh — Symlink ~/content/ repos into the site
#
# Replaces each src/app/(content)/TYPE/content/ directory with a symlink
# to ~/content/TYPE/. Run after flatten-content.sh.
#
# Usage: bash scripts/link-content.sh

set -euo pipefail

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_BASE="${CONTENT_DIR:-$HOME/content}"

TYPES=(blog diary essays fiction news notes ocs papers progymnasmata reviews verse)

for type in "${TYPES[@]}"; do
    target="$CONTENT_BASE/$type"
    link="$SITE_DIR/src/app/(content)/$type/content"

    if [[ ! -d "$target" ]]; then
        echo "SKIP $type: $target does not exist"
        continue
    fi

    # Remove existing content directory (back it up first if it's a real dir)
    if [[ -L "$link" ]]; then
        echo "  $type: symlink already exists, replacing"
        rm "$link"
    elif [[ -d "$link" ]]; then
        echo "  $type: removing old content directory"
        rm -rf "$link"
    fi

    ln -s "$target" "$link"
    echo "  $type: $link -> $target"
done

echo ""
echo "Done. All content directories are now symlinks."
