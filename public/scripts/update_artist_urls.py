#!/usr/bin/env python3
"""
Update artist album URLs in JSON files
"""

import sys

# Mapping of old paths to new paths
REPLACEMENTS = {
    "imgs/bjork/": "imgs/artists/bjork/covers/",
    "imgs/hilary-hahn/": "imgs/artists/hilary-hahn/covers/",
    "imgs/lesley-gore/": "imgs/artists/lesley-gore/covers/",
    "imgs/michael-jackson/": "imgs/artists/michael-jackson/covers/",
    "imgs/miles-davis/": "imgs/artists/miles-davis/covers/",
    "imgs/nas/": "imgs/artists/nas/covers/",
    "imgs/neutral-milk-hotel/": "imgs/artists/neutral-milk-hotel/covers/",
    "imgs/the-beatles/": "imgs/artists/the-beatles/covers/",
}


def update_urls(file_path):
    """Update artist album URLs in a JSON file."""
    with open(file_path, 'r') as f:
        content = f.read()

    updated = False
    for old_path, new_path in REPLACEMENTS.items():
        if old_path in content:
            content = content.replace(old_path, new_path)
            updated = True
            print(f"Updated: {old_path} → {new_path}")

    if updated:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"\nUpdated {file_path}")
        return True
    else:
        print(f"No changes needed in {file_path}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: update_artist_urls.py <json_file>")
        sys.exit(1)

    file_path = sys.argv[1]
    update_urls(file_path)
