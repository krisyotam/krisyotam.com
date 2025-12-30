#!/usr/bin/env python3
"""
Rename existing files in S3 bucket to use sanitized names (lowercase, no spaces).
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

LOG = logging.getLogger("s3rename")


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


def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename for URL-friendliness:
    - Convert to lowercase
    - Replace spaces with hyphens
    - Remove or replace special characters
    - Preserve file extension
    """
    # Split filename and extension
    name, ext = os.path.splitext(filename)

    # Convert to lowercase
    name = name.lower()

    # Replace spaces and underscores with hyphens
    name = re.sub(r'[\s_]+', '-', name)

    # Remove any characters that aren't alphanumeric, hyphens, or dots
    name = re.sub(r'[^a-z0-9\-.]', '', name)

    # Replace multiple consecutive hyphens with a single hyphen
    name = re.sub(r'-+', '-', name)

    # Remove leading/trailing hyphens
    name = name.strip('-')

    # Keep extension as lowercase too
    ext = ext.lower()

    return name + ext


def sanitize_path(path: str) -> str:
    """
    Sanitize a file path (with potential directories) for URL-friendliness.
    Applies sanitization to each path component.
    """
    parts = path.split('/')
    sanitized_parts = []

    for i, part in enumerate(parts):
        if not part:
            continue
        # For the last part (filename), use sanitize_filename to preserve extension
        # For directory names, apply similar sanitization
        if i == len(parts) - 1:
            sanitized_parts.append(sanitize_filename(part))
        else:
            # Directory name sanitization (no extension)
            sanitized = part.lower()
            sanitized = re.sub(r'[\s_]+', '-', sanitized)
            sanitized = re.sub(r'[^a-z0-9\-.]', '', sanitized)
            sanitized = re.sub(r'-+', '-', sanitized)
            sanitized = sanitized.strip('-')
            if sanitized:
                sanitized_parts.append(sanitized)

    return '/'.join(sanitized_parts)


def list_objects(s3, bucket: str, prefix: str = ""):
    """List all objects in the bucket with the given prefix."""
    objects = []
    paginator = s3.get_paginator('list_objects_v2')

    kwargs = {'Bucket': bucket}
    if prefix:
        kwargs['Prefix'] = prefix

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

    ap = argparse.ArgumentParser(description="Rename S3 objects to use sanitized names")
    ap.add_argument("storage_path", help="S3 path (e.g., s3://bucket/prefix)")
    ap.add_argument("--env-file", default=".env.local")
    ap.add_argument("--dry-run", action="store_true", help="Show what would be renamed without making changes")
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

    # List all objects
    LOG.info("Listing objects in s3://%s/%s", bucket, s3_prefix or "(root)")
    objects = list_objects(s3, bucket, s3_prefix)

    if not objects:
        LOG.info("No objects found")
        return

    LOG.info("Found %d objects", len(objects))

    # Process each object
    renamed_count = 0
    for obj in objects:
        source_key = obj['Key']

        # Remove the prefix to get the relative path
        if s3_prefix and source_key.startswith(s3_prefix + '/'):
            rel_path = source_key[len(s3_prefix) + 1:]
        elif s3_prefix == source_key[:len(s3_prefix)]:
            rel_path = source_key[len(s3_prefix):].lstrip('/')
        else:
            rel_path = source_key

        # Sanitize the relative path
        sanitized_rel_path = sanitize_path(rel_path)

        # Construct the new key
        if s3_prefix:
            dest_key = f"{s3_prefix}/{sanitized_rel_path}"
        else:
            dest_key = sanitized_rel_path

        # Check if renaming is needed
        if source_key == dest_key:
            LOG.debug("Skipping %s (already sanitized)", source_key)
            continue

        LOG.info("Will rename: %s → %s", source_key, dest_key)
        renamed_count += 1

        if not args.dry_run:
            # Copy to new name
            if not copy_object(s3, bucket, source_key, dest_key):
                LOG.error("Failed to copy %s, aborting", source_key)
                sys.exit(1)

            # Delete old object
            if not delete_object(s3, bucket, source_key):
                LOG.error("Failed to delete old object %s, aborting", source_key)
                sys.exit(1)

    if args.dry_run:
        LOG.info("Dry run complete. Would rename %d objects", renamed_count)
    else:
        LOG.info("Successfully renamed %d objects", renamed_count)


if __name__ == "__main__":
    main()
