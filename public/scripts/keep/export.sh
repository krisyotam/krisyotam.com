#!/usr/bin/env bash
# ==============================================================================
# export.sh — Reconstruct full MDX files (frontmatter + content) from DB
#
# MDX files in the repo are content-only. This script queries content.db to
# prepend the comment header and YAML frontmatter block to each file, writing
# the result to ~/export/ (preserving directory structure).
#
# Usage:
#   bash public/scripts/keep/export.sh            # export all
#   bash public/scripts/keep/export.sh --type blog # export one type
#
# @type script
# @path public/scripts/keep/export.sh
# ==============================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
DB="$ROOT/public/data/content.db"
CONTENT_BASE="$ROOT/src/app/(content)"
EXPORT_DIR="$HOME/export"

# Standard content types with DB metadata
STANDARD_TYPES=(blog essays notes papers diary fiction news ocs progymnasmata reviews verse)

# Parse args
FILTER_TYPE=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --type) FILTER_TYPE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ ! -f "$DB" ]]; then
  echo "ERROR: content.db not found at $DB"
  exit 1
fi

# Get tags for a content entry
get_tags() {
  local content_type="$1"
  local content_id="$2"
  sqlite3 "$DB" "SELECT t.title FROM tags t JOIN content_tags ct ON ct.tag_id = t.id WHERE ct.content_type = '$content_type' AND ct.content_id = $content_id ORDER BY t.title"
}

# Format tags as YAML array
format_tags_yaml() {
  local IFS=$'\n'
  local tags=($1)
  if [[ ${#tags[@]} -eq 0 ]]; then
    echo "[]"
    return
  fi
  local result="["
  for i in "${!tags[@]}"; do
    [[ $i -gt 0 ]] && result+=", "
    result+="${tags[$i]}"
  done
  result+="]"
  echo "$result"
}

# Generate comment header
gen_header() {
  local slug="$1" type="$2" category="$3"
  cat <<EOF
# ==============================================================================
# DOCUMENT: ${slug}.mdx
# TYPE:     $(echo "$type" | tr '[:lower:]' '[:upper:]')
#
# RATIONALE:
#   This document uses human-readable YAML front matter as a durable metadata
#   layer. In the event of database loss or corruption, content and metadata
#   can be reconstructed directly from source files.
#
# REQUIREMENTS:
#   - YAML front matter MUST be present
#   - @type @author, and @path MUST be defined
#
# @author Kris Yotam
# @type ${type}
# @path src/app/(content)/${type}/content/${category}/${slug}.mdx
# ==============================================================================
EOF
}

# Generate YAML frontmatter for standard types
gen_yaml_standard() {
  local slug="$1" title="$2" preview="$3" cover="$4" category="$5"
  local status="$6" confidence="$7" importance="$8"
  local start_date="$9" end_date="${10}" tags_yaml="${11}"
  cat <<EOF

# ==============================================================================
title: "${title}"
slug: ${slug}
date: ${start_date}
updated: ${end_date}
status: ${status}
certainty: ${confidence}
importance: ${importance}
author: "Kris Yotam"
description: "${preview}"
tags: ${tags_yaml}
category: ${category}
sequences: []
cover: "${cover}"
# ==============================================================================
EOF
}

# Generate YAML frontmatter for diary type
gen_yaml_diary() {
  local slug="$1" title="$2" preview="$3" category="$4"
  local start_date="$5" end_date="$6" tags_yaml="$7"
  cat <<EOF

# ==============================================================================
title: "${title}"
slug: ${slug}
preview: "${preview}"
start_date: ${start_date}
end_date: ${end_date}
tags: ${tags_yaml}
category: ${category}
# ==============================================================================
EOF
}

exported=0
skipped=0

for type in "${STANDARD_TYPES[@]}"; do
  [[ -n "$FILTER_TYPE" && "$type" != "$FILTER_TYPE" ]] && continue

  content_dir="$CONTENT_BASE/$type/content"
  [[ ! -d "$content_dir" ]] && continue

  echo "--- Processing: $type ---"

  # Query all entries from this content type
  while IFS='|' read -r id slug title preview cover category status confidence importance start_date end_date; do
    [[ -z "$slug" ]] && continue

    # Find the MDX file
    mdx_file="$content_dir/${category}/${slug}.mdx"
    if [[ ! -f "$mdx_file" ]]; then
      echo "  SKIP (no file): $slug"
      ((skipped++)) || true
      continue
    fi

    # Get tags
    raw_tags="$(get_tags "$type" "$id")"
    tags_yaml="$(format_tags_yaml "$raw_tags")"

    # Read existing content
    content="$(cat "$mdx_file")"

    # Build output
    header="$(gen_header "$slug" "$type" "$category")"
    if [[ "$type" == "diary" ]]; then
      yaml="$(gen_yaml_diary "$slug" "$title" "$preview" "$category" "$start_date" "$end_date" "$tags_yaml")"
    else
      yaml="$(gen_yaml_standard "$slug" "$title" "$preview" "$cover" "$category" \
        "$status" "$confidence" "$importance" "$start_date" "$end_date" "$tags_yaml")"
    fi

    # Write to export dir
    out_dir="$EXPORT_DIR/$type/content/$category"
    mkdir -p "$out_dir"
    out_file="$out_dir/${slug}.mdx"

    printf '%s%s\n\n%s\n' "$header" "$yaml" "$content" > "$out_file"
    ((exported++)) || true

  done < <(
    if [[ "$type" == "diary" ]]; then
      sqlite3 -separator '|' "$DB" \
        "SELECT id, slug, title, COALESCE(preview,''), COALESCE(cover_image,''), COALESCE(category_slug,''), '', '', '', COALESCE(start_date,''), COALESCE(end_date,'') FROM $type"
    else
      sqlite3 -separator '|' "$DB" \
        "SELECT id, slug, title, COALESCE(preview,''), COALESCE(cover_image,''), COALESCE(category_slug,''), COALESCE(status,'Draft'), COALESCE(confidence,'possible'), COALESCE(importance,5), COALESCE(start_date,''), COALESCE(end_date,'') FROM $type"
    fi
  )
done

echo ""
echo "=== Export Complete ==="
echo "Exported: $exported"
echo "Skipped:  $skipped"
echo "Output:   $EXPORT_DIR/"
