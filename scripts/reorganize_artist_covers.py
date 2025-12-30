#!/usr/bin/env python3
"""
Reorganize artist album covers to /imgs/artists/[artist]/covers/ structure
"""

import argparse
import logging
import os
import sys

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

LOG = logging.getLogger("reorganize-artists")

# Artist directories to move
ARTISTS = [
    "bjork",
    "hilary-hahn",
    "lesley-gore",
    "michael-jackson",
    "miles-davis",
    "nas",
    "neutral-milk-hotel",
    "the-beatles",
]


def make_s3_client(endpoint: str, access: str, secret: str):
    cfg = Config(signature_version="s3v4")
    return boto3.client(
        "s3",
        aws_access_key_id=access,
        aws_secret_access_key=secret,
        endpoint_url=endpoint,
        config=cfg,
    )


def list_objects(s3, bucket: str, prefix: str):
    """List all objects in the bucket with the given prefix."""
    objects = []
    paginator = s3.get_paginator('list_objects_v2')

    kwargs = {'Bucket': bucket, 'Prefix': prefix}

    for page in paginator.paginate(**kwargs):
        if 'Contents' in page:
            objects.extend(page['Contents'])

    return objects


def copy_object(s3, bucket: str, source_key: str, dest_key: str):
    """Copy an object within the same bucket."""
    try:
        copy_source = {'Bucket': bucket, 'Key': source_key}
        s3.copy_object(CopySource=copy_source, Bucket=bucket, Key=dest_key)
        LOG.info("Copied s3://%s/%s → s3://%s/%s", bucket, source_key, bucket, dest_key)
        return True
    except ClientError as e:
        LOG.error("Copy failed: %s", e)
        return False


def delete_object(s3, bucket: str, key: str):
    """Delete an object from the bucket."""
    try:
        s3.delete_object(Bucket=bucket, Key=key)
        LOG.info("Deleted s3://%s/%s", bucket, key)
        return True
    except ClientError as e:
        LOG.error("Delete failed: %s", e)
        return False


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    ap = argparse.ArgumentParser(description="Reorganize artist album covers")
    ap.add_argument("--env-file", default=".env.local")
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

    bucket = "doc"
    s3 = make_s3_client(endpoint, access, secret)

    total_moved = 0

    for artist in ARTISTS:
        old_prefix = f"imgs/{artist}/"

        LOG.info("Processing artist: %s", artist)

        # List all objects for this artist
        objects = list_objects(s3, bucket, old_prefix)

        if not objects:
            LOG.warning("No objects found for %s", artist)
            continue

        LOG.info("Found %d objects for %s", len(objects), artist)

        for obj in objects:
            source_key = obj['Key']
            # Extract filename from source key
            filename = source_key.replace(old_prefix, '')

            # New structure: imgs/artists/[artist]/covers/[filename]
            dest_key = f"imgs/artists/{artist}/covers/{filename}"

            if args.dry_run:
                LOG.info("Would move: %s → %s", source_key, dest_key)
            else:
                # Copy to new location
                if not copy_object(s3, bucket, source_key, dest_key):
                    LOG.error("Failed to copy %s, aborting", source_key)
                    sys.exit(1)

                # Delete from old location
                if not delete_object(s3, bucket, source_key):
                    LOG.error("Failed to delete %s, aborting", source_key)
                    sys.exit(1)

                total_moved += 1

    if args.dry_run:
        LOG.info("Dry run complete")
    else:
        LOG.info("Successfully moved %d files", total_moved)
        LOG.info("\nURL mapping for updates:")
        for artist in ARTISTS:
            LOG.info("  imgs/%s/ → imgs/artists/%s/covers/", artist, artist)


if __name__ == "__main__":
    main()
