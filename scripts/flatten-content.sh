#!/bin/bash
# flatten-content.sh — Migrate MDX content to ~/content/ repos
#
# Copies all .mdx files from src/app/(content)/TYPE/content/**/*.mdx
# into flat ~/content/TYPE/ directories. Detects filename collisions.
# Initializes git repos for each content type.
#
# Usage: bash scripts/flatten-content.sh [--dry-run]

set -euo pipefail

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT_BASE="${CONTENT_DIR:-$HOME/content}"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "=== DRY RUN MODE ==="
fi

# Content types to migrate (must have content/ subdirectory with MDX files)
TYPES=(blog diary essays fiction news notes ocs papers progymnasmata reviews verse)

collisions=0
total_files=0
total_types=0

for type in "${TYPES[@]}"; do
    src_dir="$SITE_DIR/src/app/(content)/$type/content"

    if [[ ! -d "$src_dir" ]]; then
        echo "SKIP $type: no content directory"
        continue
    fi

    # Find all MDX files
    mdx_files=$(find "$src_dir" -name "*.mdx" -type f 2>/dev/null)
    count=$(echo "$mdx_files" | grep -c . 2>/dev/null || true)

    if [[ "$count" -eq 0 ]]; then
        echo "SKIP $type: no MDX files"
        continue
    fi

    dest_dir="$CONTENT_BASE/$type"

    echo ""
    echo "=== $type ($count files) ==="

    # Check for filename collisions
    collision_check=$(echo "$mdx_files" | xargs -I{} basename {} | sort | uniq -d)
    if [[ -n "$collision_check" ]]; then
        echo "  WARNING: filename collisions detected:"
        echo "$collision_check" | while read f; do
            echo "    - $f"
            echo "      Locations:"
            find "$src_dir" -name "$f" -type f | while read loc; do
                echo "        $loc"
            done
        done
        collisions=$((collisions + 1))
    fi

    if [[ "$DRY_RUN" == true ]]; then
        echo "  Would create: $dest_dir"
        echo "  Would copy $count files"
        total_files=$((total_files + count))
        total_types=$((total_types + 1))
        continue
    fi

    # Create destination
    mkdir -p "$dest_dir"

    # Copy files (flat)
    copied=0
    echo "$mdx_files" | while read f; do
        base=$(basename "$f")
        dest="$dest_dir/$base"

        if [[ -f "$dest" ]]; then
            echo "  COLLISION: $base already exists, skipping duplicate"
        else
            cp "$f" "$dest"
        fi
    done

    # Count what we actually copied
    actual=$(find "$dest_dir" -name "*.mdx" -type f | wc -l)
    echo "  Copied $actual files to $dest_dir"

    # Init git repo
    if [[ ! -d "$dest_dir/.git" ]]; then
        cd "$dest_dir"
        git init -q
        git add -A
        git commit -q -m "Initial content migration from krisyotam.com"
        echo "  Git repo initialized"
        cd "$SITE_DIR"
    else
        echo "  Git repo already exists"
    fi

    total_files=$((total_files + actual))
    total_types=$((total_types + 1))
done

echo ""
echo "=== Summary ==="
echo "Types migrated: $total_types"
echo "Files: $total_files"
if [[ "$collisions" -gt 0 ]]; then
    echo "Types with collisions: $collisions"
fi
