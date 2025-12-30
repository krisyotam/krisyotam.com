#!/usr/bin/env python3
"""
Download sequence cover images and upload them to S3.
"""

import argparse
import json
import logging
import os
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

LOG = logging.getLogger("sequence-covers")


def parse_s3_path(path: str):
    if path.startswith("s3://"):
        path = path[len("s3://"):]
    path = path.lstrip("/")
    if "/" in path:
        bucket, prefix = path.split("/", 1)
    else:
        bucket, prefix = path, ""
    return bucket, prefix.rstrip("/")


def make_s3_client(endpoint: str, access: str, secret: str):
    cfg = Config(signature_version="s3v4")
    return boto3.client(
        "s3",
        aws_access_key_id=access,
        aws_secret_access_key=secret,
        endpoint_url=endpoint,
        config=cfg,
    )


def get_file_extension(url: str) -> str:
    """Extract file extension from URL."""
    parsed = urlparse(url)
    path = parsed.path
    ext = os.path.splitext(path)[1]
    if not ext:
        # Default to .jpg if no extension found
        return ".jpg"
    return ext.lower()


def download_image(url: str, dest_path: Path) -> bool:
    """Download an image from a URL to a local path."""
    try:
        LOG.info("Downloading %s", url)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as f:
                f.write(response.read())
        return True
    except Exception as e:
        LOG.error("Failed to download %s: %s", url, e)
        return False


def upload_file(s3, bucket: str, key: str, path: Path) -> bool:
    """Upload a file to S3."""
    try:
        LOG.info("Uploading %s → s3://%s/%s", path.name, bucket, key)
        s3.upload_file(str(path), bucket, key)
        return True
    except ClientError as e:
        LOG.error("Upload failed: %s", e)
        return False


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    ap = argparse.ArgumentParser(description="Download and upload sequence cover images")
    ap.add_argument("sequences_json", help="Path to sequences.json file")
    ap.add_argument("--env-file", default=".env.local")
    ap.add_argument("--tmp-dir", help="Temporary directory for downloads")
    ap.add_argument("--dry-run", action="store_true", help="Show what would be done")
    args = ap.parse_args()

    load_dotenv(args.env_file)

    endpoint = os.environ.get("HETZNER_OBJECT_STORAGE_URL")
    access = os.environ.get("HETZNER_ACCESS_KEY")
    secret = os.environ.get("HETZNER_SECRET_KEY")

    if not all([endpoint, access, secret]):
        LOG.error("Missing S3 credentials")
        sys.exit(2)

    if not endpoint.startswith(("http://", "https://")):
        endpoint = "https://" + endpoint

    # Read sequences.json
    with open(args.sequences_json, 'r') as f:
        data = json.load(f)

    sequences = data.get("sequences", [])
    if not sequences:
        LOG.error("No sequences found in JSON")
        sys.exit(1)

    # Filter sequences with cover URLs
    to_process = []
    for seq in sequences:
        cover_url = seq.get("cover-url", "").strip()
        slug = seq.get("slug", "")

        if not cover_url or not slug:
            continue

        # Skip if already pointing to our S3 bucket
        if "krisyotam.com/doc/site/sequences/" in cover_url:
            LOG.debug("Skipping %s (already on S3)", slug)
            continue

        to_process.append({
            "slug": slug,
            "url": cover_url,
            "title": seq.get("title", "")
        })

    LOG.info("Found %d sequences with external cover images", len(to_process))

    if args.dry_run:
        for item in to_process:
            ext = get_file_extension(item["url"])
            LOG.info("Would download %s → %s%s", item["url"], item["slug"], ext)
        return

    # Create temp directory
    if args.tmp_dir:
        tmp_dir = Path(args.tmp_dir)
    else:
        import tempfile
        tmp_dir = Path(tempfile.mkdtemp(prefix="sequence-covers-"))

    tmp_dir.mkdir(parents=True, exist_ok=True)
    LOG.info("Using temporary directory: %s", tmp_dir)

    # Initialize S3 client
    bucket = "doc"
    s3 = make_s3_client(endpoint, access, secret)

    # Process each sequence
    for item in to_process:
        slug = item["slug"]
        url = item["url"]
        ext = get_file_extension(url)

        # Download to temp file
        filename = f"{slug}{ext}"
        local_path = tmp_dir / filename

        if not download_image(url, local_path):
            LOG.warning("Skipping upload for %s (download failed)", slug)
            continue

        # Upload to S3
        s3_key = f"cover/sequences/{filename}"
        if not upload_file(s3, bucket, s3_key, local_path):
            LOG.error("Failed to upload %s", filename)
            continue

        LOG.info("Successfully processed %s", slug)

        # Clean up local file
        local_path.unlink()

    # Clean up temp directory
    try:
        tmp_dir.rmdir()
        LOG.info("Cleaned up temporary directory")
    except Exception as e:
        LOG.warning("Could not remove temp dir %s: %s", tmp_dir, e)

    LOG.info("Done!")


if __name__ == "__main__":
    main()
