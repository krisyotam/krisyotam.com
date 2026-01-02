#!/usr/bin/env python3
"""
Upload Discord emojis to S3 bucket
"""

import argparse
import logging
import os
import sys
from pathlib import Path

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

LOG = logging.getLogger("upload-emojis")


def make_s3_client(endpoint: str, access: str, secret: str):
    cfg = Config(signature_version="s3v4")
    return boto3.client(
        "s3",
        aws_access_key_id=access,
        aws_secret_access_key=secret,
        endpoint_url=endpoint,
        config=cfg,
    )


def upload_file(s3, bucket: str, key: str, path: Path) -> bool:
    """Upload a file to S3."""
    try:
        s3.upload_file(str(path), bucket, key)
        return True
    except ClientError as e:
        LOG.error("Upload failed for %s: %s", path.name, e)
        return False


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    ap = argparse.ArgumentParser(description="Upload Discord emojis to S3")
    ap.add_argument("emoji_dir", help="Directory containing emoji files")
    ap.add_argument("--env-file", default=".env.local")
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

    bucket = "doc"
    s3 = make_s3_client(endpoint, access, secret)

    # Get all emoji files
    emoji_dir = Path(args.emoji_dir)
    emoji_files = list(emoji_dir.glob("*.png")) + list(emoji_dir.glob("*.gif"))

    LOG.info("Found %d emoji files to upload", len(emoji_files))

    # Upload each file
    success_count = 0
    for i, emoji_path in enumerate(emoji_files, 1):
        s3_key = f"imgs/discord-emojis/{emoji_path.name}"

        LOG.info("[%d/%d] Uploading %s", i, len(emoji_files), emoji_path.name)

        if upload_file(s3, bucket, s3_key, emoji_path):
            success_count += 1
        else:
            LOG.error("Failed to upload %s", emoji_path.name)

    LOG.info("Successfully uploaded %d/%d emojis", success_count, len(emoji_files))


if __name__ == "__main__":
    main()
