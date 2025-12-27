#!/usr/bin/env python3
"""Small, clear utilities to list S3-compatible objects and write structured JSON."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any, Dict, List
from urllib.parse import urlsplit
import os

import boto3
from botocore.config import Config


def normalize_endpoint(endpoint: str) -> str:
    endpoint = endpoint.strip()
    if endpoint.startswith("http://") or endpoint.startswith("https://"):
        return endpoint.rstrip("/")
    return f"https://{endpoint.rstrip('/')}"


def normalize_root(root: str) -> str:
    root = root.strip()
    if not root.startswith(("http://", "https://")):
        root = "https://" + root
    return root.rstrip("/")


def build_public_url(key: str, replace_root: str) -> str:
    replace_root = normalize_root(replace_root)
    key = key.lstrip("/")
    return f"{replace_root}/{key}"


def get_s3_client(endpoint_url: str, access_key: str | None, secret_key: str | None, region: str | None, insecure: bool):
    session = boto3.session.Session()
    config = Config(signature_version="s3v4")
    return session.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        endpoint_url=endpoint_url,
        region_name=region,
        config=config,
        verify=not insecure,
    )


def fetch_buckets(client) -> List[Dict[str, Any]]:
    return client.list_buckets().get("Buckets", [])


def list_objects_for_bucket(client, bucket_name: str) -> List[Dict[str, Any]]:
    paginator = client.get_paginator("list_objects_v2")
    out: List[Dict[str, Any]] = []
    for page in paginator.paginate(Bucket=bucket_name):
        out.extend(page.get("Contents", []))
    return out


def build_tree_from_objects(objects: List[Dict[str, Any]]) -> Dict[str, Any]:
    tree: Dict[str, Any] = {}

    for obj in objects:
        key = obj["Key"]
        parts = key.split("/") if key else []
        node = tree
        for p in parts[:-1]:
            node = node.setdefault(p, {})
        node.setdefault("__files", []).append({
            "key": key,
            "size": obj.get("Size", 0),
            "last_modified": obj["LastModified"].isoformat() if obj.get("LastModified") else None,
        })

    return tree


def generate_output_structure(client, endpoint_root: str) -> Dict[str, Any]:
    out: Dict[str, Any] = {"buckets": []}

    for b in fetch_buckets(client):
        bucket_name = b["Name"]
        objs = list_objects_for_bucket(client, bucket_name)

        objects_list = []
        for obj in objs:
            key = obj["Key"]
            objects_list.append({
                "bucket": bucket_name,
                "key": key,
                "size": obj.get("Size", 0),
                "last_modified": obj["LastModified"].isoformat() if obj.get("LastModified") else None,
                "original_url": f"{endpoint_root}/{bucket_name}/{key}",
                # Derive a public URL from a hardcoded mapping of known buckets to site roots.
                # There are only three public roots for this project.
                "public_url": build_public_url(
                    key,
                    {
                        "doc": "https://krisyotam.com/doc",
                        "src": "https://krisyotam.com/src",
                        "public-archive": "https://krisyotam.com/archive",
                        "public_archive": "https://krisyotam.com/archive",
                    }.get(bucket_name, "https://krisyotam.com/doc"),
                ),
            })

        out["buckets"].append({
            "name": bucket_name,
            "objects": objects_list,
            "tree": build_tree_from_objects(objs),
        })

    return out


def write_json(path: str, data: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def parse_args(argv=None):
    p = argparse.ArgumentParser()
    p.add_argument("--endpoint", default="https://hel1.your-objectstorage.com")
    p.add_argument("--access-key")
    p.add_argument("--secret-key")
    p.add_argument("--region")
    p.add_argument(
        "--output",
        default="objects.json",
        help="Output file for the full objects listing; per-bucket files will also be written.",
    )
    p.add_argument("--insecure", action="store_true")
    return p.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)

    # Allow HETZNER_* env vars to provide defaults when CLI flags are not set.
    # This makes the script work with the project's .env.local values for Hetzner object storage.
    endpoint_env = os.environ.get("HETZNER_OBJECT_STORAGE_URL")
    if endpoint_env:
        # Respect the explicit CLI --endpoint if it was provided and differs from the default.
        # But if the user didn't set --endpoint, accept the env var.
        if not args.endpoint or args.endpoint == "https://hel1.your-objectstorage.com":
            args.endpoint = endpoint_env
        else:
            # If both are present, prefer the CLI but notify.
            print("Note: using CLI --endpoint over HETZNER_OBJECT_STORAGE_URL", file=sys.stderr)

    if args.access_key is None:
        args.access_key = os.environ.get("HETZNER_ACCESS_KEY")
        if args.access_key:
            print("Note: using HETZNER_ACCESS_KEY from environment", file=sys.stderr)

    if args.secret_key is None:
        args.secret_key = os.environ.get("HETZNER_SECRET_KEY")
        if args.secret_key:
            print("Note: using HETZNER_SECRET_KEY from environment", file=sys.stderr)

    endpoint_root = normalize_endpoint(args.endpoint)
    client = get_s3_client(endpoint_root, args.access_key, args.secret_key, args.region, args.insecure)

    try:
        data = generate_output_structure(client, endpoint_root)
    except Exception as e:
        print("Error:", e, file=sys.stderr)
        sys.exit(2)

    write_json(args.output, data)

    out_dir = os.path.dirname(args.output) or "."
    for bucket in data["buckets"]:
        bname = bucket["name"]
        name_map = {
            "doc": "doc",
            "src": "src",
            "public-archive": "archive",
            "public_archive": "archive",
        }
        norm = name_map.get(bname, bname)
        path = os.path.join(out_dir, f"{norm}.json")
        write_json(path, {"buckets": [{**bucket, "name": norm}]})

    print(f"Wrote {sum(len(b['objects']) for b in data['buckets'])} objects")


if __name__ == "__main__":
    main()
