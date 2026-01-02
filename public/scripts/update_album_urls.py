#!/usr/bin/env python3
"""
Update album URLs in JSON files
"""

import json
import sys

# Mapping of old paths to new paths
REPLACEMENTS = {
    "imgs/albums/abbey-road.jpg": "imgs/the-beatles/abbey-road.jpg",
    "imgs/albums/hilary-hahn-paganini-violin-concerto-no-1-spohr-violin-concerto-no-8.jpg": "imgs/hilary-hahn/hilary-hahn-paganini-violin-concerto-no-1-spohr-violin-concerto-no-8.jpg",
    "imgs/albums/ilmatic.jpg": "imgs/nas/ilmatic.jpg",
    "imgs/albums/in-the-aeroplane-over-the-sea.jpg": "imgs/neutral-milk-hotel/in-the-aeroplane-over-the-sea.jpg",
    "imgs/albums/kindofblue.jpg": "imgs/miles-davis/kindofblue.jpg",
    "imgs/albums/lesley-gore-sings-of-mixed-up-hearts.webp": "imgs/lesley-gore/lesley-gore-sings-of-mixed-up-hearts.webp",
    "imgs/albums/off-the-wall.jpg": "imgs/michael-jackson/off-the-wall.jpg",
    "imgs/albums/vespertine.jpg": "imgs/bjork/vespertine.jpg",
}


def update_urls(file_path):
    """Update album URLs in a JSON file."""
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
        print("Usage: update_album_urls.py <json_file>")
        sys.exit(1)

    file_path = sys.argv[1]
    update_urls(file_path)
