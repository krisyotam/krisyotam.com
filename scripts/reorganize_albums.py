#!/usr/bin/env python3
"""
Reorganize album covers from doc/imgs/albums/ to doc/imgs/[artist]/[album]
"""

import argparse
import logging
import os
import re
import sys

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

LOG = logging.getLogger("reorganize-albums")

# Mapping of album filename to artist name (lowercase, URL-safe)
ALBUM_TO_ARTIST = {
    "abbey-road.jpg": "the-beatles",
    "hilary-hahn-paganini-violin-concerto-no-1-spohr-violin-concerto-no-8.jpg": "hilary-hahn",
    "ilmatic.jpg": "nas",
    "in-the-aeroplane-over-the-sea.jpg": "neutral-milk-hotel",
    "kindofblue.jpg": "miles-davis",
    "lesley-gore-sings-of-mixed-up-hearts.webp": "lesley-gore",
    "off-the-wall.jpg": "michael-jackson",
    "vespertine.jpg": "bjork",
}


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

    ap = argparse.ArgumentParser(description="Reorganize album covers by artist")
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
    old_prefix = "imgs/albums"

    s3 = make_s3_client(endpoint, access, secret)

    # List all objects in the old location
    LOG.info("Listing objects in s3://%s/%s", bucket, old_prefix)
    objects = list_objects(s3, bucket, old_prefix)

    album_files = [obj for obj in objects if obj['Key'].split('/')[-1]]  # skip directories

    if not album_files:
        LOG.info("No album files found")
        return

    LOG.info("Found %d album files to reorganize", len(album_files))

    # Generate mapping of old to new paths
    moves = []
    for obj in album_files:
        source_key = obj['Key']
        filename = source_key.split('/')[-1]

        if filename not in ALBUM_TO_ARTIST:
            LOG.warning("No artist mapping for %s, skipping", filename)
            continue

        artist = ALBUM_TO_ARTIST[filename]
        # Extract album name from filename (remove extension)
        album_name = os.path.splitext(filename)[0]
        ext = os.path.splitext(filename)[1]

        dest_key = f"imgs/{artist}/{album_name}{ext}"
        moves.append((source_key, dest_key, filename))

    if args.dry_run:
        for source_key, dest_key, filename in moves:
            LOG.info("Would move: %s → %s", source_key, dest_key)
        LOG.info("\nURL changes needed:")
        LOG.info("  imgs/albums/%s → imgs/%s", "{album}", "{artist}/{album}")
        return

    # Perform moves
    for source_key, dest_key, filename in moves:
        LOG.info("Moving: %s → %s", source_key, dest_key)

        # Copy to new location
        if not copy_object(s3, bucket, source_key, dest_key):
            LOG.error("Failed to copy %s, aborting", source_key)
            sys.exit(1)

        # Delete from old location
        if not delete_object(s3, bucket, source_key):
            LOG.error("Failed to delete %s, aborting", source_key)
            sys.exit(1)

    LOG.info("Successfully reorganized %d album covers", len(moves))

    # Print mapping for URL updates
    LOG.info("\nAlbum to Artist mapping for URL updates:")
    for filename, artist in sorted(ALBUM_TO_ARTIST.items()):
        album_name = os.path.splitext(filename)[0]
        ext = os.path.splitext(filename)[1]
        LOG.info("  %s → imgs/%s/%s%s", filename, artist, album_name, ext)


if __name__ == "__main__":
    main()
