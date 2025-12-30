#!/usr/bin/env python3
"""Upload already-downloaded videos to S3."""

import argparse
import logging
import os
import sys
from pathlib import Path

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

LOG = logging.getLogger("upload")


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


def ensure_bucket(s3, bucket: str):
    try:
        s3.head_bucket(Bucket=bucket)
    except ClientError:
        try:
            s3.create_bucket(Bucket=bucket)
            LOG.info("Created bucket %s", bucket)
        except ClientError as e:
            LOG.warning("Bucket %s not created: %s", bucket, e)


def upload_file(s3, bucket: str, key: str, path: Path):
    try:
        LOG.info("Uploading %s → s3://%s/%s", path.name, bucket, key)
        s3.upload_file(str(path), bucket, key)
        return True
    except ClientError as e:
        LOG.error("Upload failed: %s", e)
        return False


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    ap = argparse.ArgumentParser()
    ap.add_argument("storage_path", help="S3 destination (e.g., s3://bucket/prefix)")
    ap.add_argument("local_dir", help="Local directory containing videos")
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

    bucket, s3_prefix = parse_s3_path(args.storage_path)
    s3 = make_s3_client(endpoint, access, secret)
    ensure_bucket(s3, bucket)

    local_path = Path(args.local_dir)
    if not local_path.exists():
        LOG.error("Local directory does not exist: %s", local_path)
        sys.exit(1)

    # Find all video files
    video_files = []
    for ext in [".mp4", ".webm", ".mkv"]:
        video_files.extend(local_path.glob(f"*{ext}"))

    video_files = sorted(video_files)

    if not video_files:
        LOG.error("No video files found in %s", local_path)
        sys.exit(1)

    LOG.info("Found %d video files to upload", len(video_files))

    for video_file in video_files:
        rel_path = video_file.name
        key = f"{s3_prefix}/{rel_path}" if s3_prefix else rel_path

        if not upload_file(s3, bucket, key, video_file):
            LOG.error("Failed to upload %s", video_file.name)
            sys.exit(1)

    LOG.info("All videos uploaded successfully!")


if __name__ == "__main__":
    main()
