#!/usr/bin/env bash
# Sync local mirror directories to Hetzner Object Storage (S3-compatible)
#
# Behavior:
# - Reads an INI-style config file (default: hetzner/krisyotam.com.conf).
# - Each section represents a mirror. Keys used: path, bucket, slug (optional).
# - Local source directory defaults to ./<path>/<slug> (path may end with or without /).
# - Uses HETZNER_OBJECT_STORAGE_URL, HETZNER_ACCESS_KEY, HETZNER_SECRET_KEY from an env file (default: .env.local) or environment.
# - Uses the AWS CLI to perform `aws s3 sync --endpoint-url <hetzner_endpoint>`.
#
# Usage:
#   ./scripts/sync.sh [--config path/to/conf] [--env path/to/.env.local] [--dry-run]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."

# Defaults
CONFIG_FILE="$REPO_ROOT/hetzner/krisyotam.com.conf"
ENV_FILE="$REPO_ROOT/.env.local"
TRANSPORT_DIR="$REPO_ROOT/public/sync"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --config) CONFIG_FILE="$2"; shift 2;;
    --env) ENV_FILE="$2"; shift 2;;
    --dry-run) DRY_RUN=1; shift;;
    -n) DRY_RUN=1; shift;;
    -h|--help)
      sed -n '1,120p' "$0"
      exit 0
      ;;
    *) echo "Unknown arg: $1"; exit 2;;
  esac
done

if ! command -v aws >/dev/null 2>&1; then
  echo "ERROR: aws CLI not found in PATH. Install and configure awscli v2 to use this script." >&2
  exit 2
fi

get_env_var() {
  local key="$1"
  local file="$2"
  local val=""
  if [ -n "${!key-}" ]; then
    # already exported in environment
    echo "${!key}"
    return
  fi
  if [ -f "$file" ]; then
    # match KEY=VALUE at line start, allow unquoted values and quoted
    val=$(grep -m1 -E "^${key}=" "$file" || true)
    if [ -n "$val" ]; then
      val=${val#${key}=}
      # remove surrounding single or double quotes if present
      val=$(echo "$val" | sed -E 's/^"(.*)"$/\1/' | sed -E "s/^'(.*)'$/\1/")
      echo "$val"
      return
    fi
  fi
  echo ""
}

HETZNER_OBJECT_STORAGE_URL=$(get_env_var HETZNER_OBJECT_STORAGE_URL "$ENV_FILE")
HETZNER_ACCESS_KEY=$(get_env_var HETZNER_ACCESS_KEY "$ENV_FILE")
HETZNER_SECRET_KEY=$(get_env_var HETZNER_SECRET_KEY "$ENV_FILE")

if [ -z "$HETZNER_OBJECT_STORAGE_URL" ] || [ -z "$HETZNER_ACCESS_KEY" ] || [ -z "$HETZNER_SECRET_KEY" ]; then
  echo "ERROR: Missing Hetzner credentials. Provide in environment or in $ENV_FILE the variables:"
  echo "  HETZNER_OBJECT_STORAGE_URL, HETZNER_ACCESS_KEY, HETZNER_SECRET_KEY"
  exit 2
fi

# Normalize endpoint to include scheme
if [[ "$HETZNER_OBJECT_STORAGE_URL" =~ ^https?:// ]]; then
  ENDPOINT="$HETZNER_OBJECT_STORAGE_URL"
else
  ENDPOINT="https://${HETZNER_OBJECT_STORAGE_URL}"
fi

export AWS_ACCESS_KEY_ID="$HETZNER_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$HETZNER_SECRET_KEY"

echo "Using Hetzner endpoint: $ENDPOINT"

process_section() {
  local section_name="$1"
  local path_val="$2"
  local bucket_val="$3"
  local slug_val="$4"
  local src_val="$5"

  # If slug not provided, use section name
  if [ -z "$slug_val" ]; then
    slug_val="$section_name"
  fi

  # Normalize path (remove leading ./ and trailing /)
  path_val=${path_val#./}
  path_val=${path_val%/}

  # If path empty, use slug only
  if [ -n "$path_val" ]; then
    local s3_prefix="${path_val}/${slug_val}"
    local local_src="./${path_val}/${slug_val}"
  else
    local s3_prefix="${slug_val}"
    local local_src="./${slug_val}"
  fi

  # Ensure bucket is set
  if [ -z "$bucket_val" ]; then
    echo "WARNING: section [$section_name] missing bucket; skipping" >&2
    return
  fi

  local s3_target="s3://${bucket_val}/${s3_prefix}/"

  echo "\n==> Section: [$section_name]"
  echo "    intended local source: $local_src"
  echo "    s3 target             : $s3_target"

  upload_src=""

  if [ -d "$local_src" ]; then
    echo "    Using existing local source: $local_src"
    upload_src="$local_src"
  else
    # Use transport directory to download/unpack into public/sync/<slug>
    echo "    Local source not found; preparing transport in: $TRANSPORT_DIR/$slug_val"
    mkdir -p "$TRANSPORT_DIR"
    transport_path="$TRANSPORT_DIR/$slug_val"
    # Clean existing transport dir for fresh download
    rm -rf "$transport_path"
    mkdir -p "$transport_path"

    if [ -z "$src_val" ]; then
      echo "    No src provided in config; skipping section." >&2
      return
    fi

    # If src looks like an archive
    if [[ "$src_val" =~ \.(zip|tar\.gz|tgz|tar)$ ]]; then
      echo "    Downloading archive: $src_val"
      tmpfile="$TRANSPORT_DIR/${slug_val}.archive"
      if command -v curl >/dev/null 2>&1; then
        curl -L -o "$tmpfile" "$src_val"
      else
        wget -O "$tmpfile" "$src_val"
      fi
      echo "    Extracting archive to $transport_path"
      case "$tmpfile" in
        *.zip)
          unzip -q "$tmpfile" -d "$transport_path" ;;
        *.tar.gz|*.tgz)
          tar -xzf "$tmpfile" -C "$transport_path" ;;
        *.tar)
          tar -xf "$tmpfile" -C "$transport_path" ;;
      esac
      rm -f "$tmpfile"
      # If extraction created a single top-level directory, use it
      entries=("$transport_path"/*)
      if [ "${#entries[@]}" -eq 1 ] && [ -d "${entries[0]}" ]; then
        upload_src="${entries[0]}"
      else
        upload_src="$transport_path"
      fi
    else
      # Assume git repository or similar; try git clone
      if ! command -v git >/dev/null 2>&1; then
        echo "    ERROR: git not found; cannot clone $src_val" >&2
        return
      fi
      echo "    Cloning git repo: $src_val"
      if git clone --depth 1 "$src_val" "$transport_path"; then
        upload_src="$transport_path"
        # remove git metadata to avoid uploading .git
        rm -rf "$transport_path/.git"
      else
        echo "    git clone failed for $src_val" >&2
        return
      fi
    fi
  fi

  if [ -z "$upload_src" ]; then
    echo "    Nothing to upload for section [$section_name]" >&2
    return
  fi

  echo "    Uploading from: $upload_src"

  # Build aws s3 sync command
  cmd=(aws s3 sync "$upload_src" "$s3_target" --endpoint-url "$ENDPOINT")
  # include --delete if desired; leave commented for safety
  # cmd+=(--delete)

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "    DRY RUN: ${cmd[*]}"
  else
    echo "    Running sync..."
    "${cmd[@]}"
    echo "    Done."
    # Clean up transport path if it was used (i.e., local_src did not exist)
    if [ ! -d "$local_src" ] && [[ "$upload_src" == "$TRANSPORT_DIR"/* ]]; then
      # remove the per-section transport directory (transport_path)
      transport_path="$TRANSPORT_DIR/$slug_val"
      if [ -d "$transport_path" ]; then
        echo "    Cleaning transport dir: $transport_path"
        rm -rf "$transport_path"
      else
        echo "    Cleaning transport artifact: $upload_src"
        rm -rf "$upload_src"
      fi
    fi
  fi
}

# Parse INI-like config
if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: config file not found: $CONFIG_FILE" >&2
  exit 2
fi

current_section=""
path_val=""
bucket_val=""
slug_val=""
src_val=""

while IFS= read -r rawline || [ -n "$rawline" ]; do
  line="$rawline"
  # trim leading/trailing whitespace
  line="$(echo "$line" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  # skip empty and comment lines
  if [ -z "$line" ] || [[ "$line" =~ ^# ]]; then
    continue
  fi
  if [[ "$line" =~ ^\[(.*)\]$ ]]; then
    # process previous section
    if [ -n "$current_section" ]; then
      process_section "$current_section" "$path_val" "$bucket_val" "$slug_val" "$src_val"
    fi
    current_section="${BASH_REMATCH[1]}"
    path_val=""
    bucket_val=""
    slug_val=""
    src_val=""
    continue
  fi

  if [[ "$line" =~ ^([a-zA-Z_]+)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
    key="${BASH_REMATCH[1]}"
    val="${BASH_REMATCH[2]}"
    # strip optional quotes
    val="$(echo "$val" | sed -E 's/^"(.*)"$/\1/; s/^'\''(.*)'\''$/\1/')"
    case "$key" in
      path) path_val="$val" ;;
      bucket) bucket_val="$val" ;;
      slug) slug_val="$val" ;;
      src) src_val="$val" ;;
      comment) ;; # ignore
      *) echo "    WARNING: unknown key '$key' in section [$current_section], ignoring" ;;
    esac
  fi
done < "$CONFIG_FILE"

# process last section
if [ -n "$current_section" ]; then
  process_section "$current_section" "$path_val" "$bucket_val" "$slug_val" "$src_val"
fi

# Remove the transport directory entirely when finished (it will be recreated on next run)
if [ "$DRY_RUN" -eq 0 ] && [ -d "$TRANSPORT_DIR" ]; then
  echo "\nRemoving transport directory: $TRANSPORT_DIR"
  rm -rf "$TRANSPORT_DIR"
fi

echo "\nAll done."
