#!/usr/bin/env python3
"""
Download all blinkies from Adrian's Blinkie Collection and upload to Hetzner S3.
"""

import os
import re
import sys
import requests
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urljoin
import boto3
from botocore.config import Config
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")

BASE_URL = "https://adriansblinkiecollection.neocities.org/"
S3_BUCKET = "doc"
S3_PREFIX = "imgs/blinkies"

def get_s3_client():
    """Create S3 client for Hetzner object storage."""
    endpoint = os.environ.get("HETZNER_OBJECT_STORAGE_URL")
    access = os.environ.get("HETZNER_ACCESS_KEY")
    secret = os.environ.get("HETZNER_SECRET_KEY")

    if not all([endpoint, access, secret]):
        print("Missing S3 credentials in .env.local")
        sys.exit(1)

    if not endpoint.startswith(("http://", "https://")):
        endpoint = "https://" + endpoint

    return boto3.client(
        "s3",
        aws_access_key_id=access,
        aws_secret_access_key=secret,
        endpoint_url=endpoint,
        config=Config(signature_version="s3v4"),
    )

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for URL-friendliness."""
    name, ext = os.path.splitext(filename)
    name = name.lower()
    name = re.sub(r'[\s_]+', '-', name)
    name = re.sub(r'[^a-z0-9\-.]', '', name)
    name = re.sub(r'-+', '-', name)
    name = name.strip('-')
    return name + ext.lower()

def scrape_blinkie_urls(url: str) -> list[str]:
    """Scrape all image URLs from the blinkie collection page."""
    print(f"Fetching {url}...")
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')

    image_urls = []
    for img in soup.find_all('img'):
        src = img.get('src')
        if src:
            # Convert relative URLs to absolute
            full_url = urljoin(url, src)
            # Only include gif/png images
            if full_url.lower().endswith(('.gif', '.png', '.jpg', '.jpeg', '.webp')):
                image_urls.append(full_url)

    # Remove duplicates while preserving order
    seen = set()
    unique_urls = []
    for u in image_urls:
        if u not in seen:
            seen.add(u)
            unique_urls.append(u)

    return unique_urls

def download_image(url: str, dest_dir: Path) -> Path | None:
    """Download an image to the destination directory."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # Get filename from URL
        filename = url.split('/')[-1].split('?')[0]
        filename = sanitize_filename(filename)

        dest_path = dest_dir / filename

        # Handle duplicates by adding a number
        counter = 1
        original_name, ext = os.path.splitext(filename)
        while dest_path.exists():
            filename = f"{original_name}-{counter}{ext}"
            dest_path = dest_dir / filename
            counter += 1

        dest_path.write_bytes(response.content)
        return dest_path
    except Exception as e:
        print(f"  Failed to download {url}: {e}")
        return None

def upload_to_s3(s3_client, local_path: Path, s3_key: str) -> bool:
    """Upload a file to S3."""
    try:
        # Determine content type
        ext = local_path.suffix.lower()
        content_types = {
            '.gif': 'image/gif',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
        }
        content_type = content_types.get(ext, 'application/octet-stream')

        s3_client.upload_file(
            str(local_path),
            S3_BUCKET,
            s3_key,
            ExtraArgs={'ContentType': content_type}
        )
        return True
    except Exception as e:
        print(f"  Failed to upload {local_path.name}: {e}")
        return False

def main():
    # Create temp directory for downloads
    temp_dir = Path("temp_blinkies")
    temp_dir.mkdir(exist_ok=True)

    # Scrape all blinkie URLs
    print("Scraping blinkie URLs...")
    urls = scrape_blinkie_urls(BASE_URL)
    print(f"Found {len(urls)} blinkies")

    # Initialize S3 client
    s3 = get_s3_client()

    # Download and upload each blinkie
    success_count = 0
    fail_count = 0

    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] Processing {url.split('/')[-1]}...")

        # Download
        local_path = download_image(url, temp_dir)
        if not local_path:
            fail_count += 1
            continue

        # Upload
        s3_key = f"{S3_PREFIX}/{local_path.name}"
        if upload_to_s3(s3, local_path, s3_key):
            print(f"  Uploaded to /doc/{s3_key}")
            success_count += 1
        else:
            fail_count += 1

        # Remove local file after upload
        local_path.unlink()

    # Cleanup temp directory
    try:
        temp_dir.rmdir()
    except:
        pass

    print(f"\nDone! Uploaded {success_count} blinkies, {fail_count} failed")
    print(f"URLs will be: https://krisyotam.com/doc/imgs/blinkies/[filename]")

if __name__ == "__main__":
    main()
