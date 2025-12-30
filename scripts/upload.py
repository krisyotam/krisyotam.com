#!/usr/bin/env python3
"""
Download a YouTube playlist or video via yt-dlp and upload to S3-compatible
object storage with crash-safe persistence.
"""

from __future__ import annotations

import argparse
import glob
import time
import json
import logging
import re
import subprocess
import os
import shutil
import sys
import tempfile
from pathlib import Path
from typing import List, Tuple

from dotenv import load_dotenv
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

LOG = logging.getLogger("ytarchive")


def parse_s3_path(path: str) -> Tuple[str, str]:
    if path.startswith("s3://"):
        path = path[len("s3://") :]
    path = path.lstrip("/")
    if "/" in path:
        bucket, prefix = path.split("/", 1)
    else:
        bucket, prefix = path, ""
    return bucket, prefix.rstrip("/")


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


def download_to_dir(
    url: str,
    out_dir: str,
    cookies: str | None,
    cookies_from_browser: str | None,
    quiet: bool,
) -> int:
    # Legacy single CLI-run wrapper kept for compatibility with other callers.
    exe = shutil.which("yt-dlp") or sys.executable

    cmd = [exe if exe.endswith("yt-dlp") else sys.executable]
    if not exe.endswith("yt-dlp"):
        cmd += ["-m", "yt_dlp"]

    cmd += [
        "--yes-playlist",
        "--no-part",
        "--ignore-errors",
        "--merge-output-format",
        "mp4",
        "-f",
        "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
        "-o",
        os.path.join(out_dir, "%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s"),
    ]

    if quiet:
        cmd += ["--quiet", "--no-warnings"]

    if cookies:
        cmd += ["--cookies", cookies]

    if cookies_from_browser:
        cmd += ["--cookies-from-browser", cookies_from_browser]

    cmd += [url]

    LOG.info("Running yt-dlp CLI: %s", " ".join(cmd[:3]) + " ...")
    proc = subprocess.run(cmd)
    return proc.returncode


def _run_yt_dlp_cmd(cmd: List[str]) -> int:
    """Helper to run a yt-dlp CLI command and return its exit code."""
    LOG.debug("Running: %s", " ".join(cmd))
    proc = subprocess.run(cmd)
    return proc.returncode


def list_playlist_entries(url: str, cookies: str | None, cookies_from_browser: str | None, quiet: bool) -> dict:
    """Return dumped JSON for a playlist (parsed) or raise on failure.

    Uses yt-dlp --dump-single-json so we can enumerate entries and preserve
    playlist metadata (title, entry count, etc.).
    """
    exe = shutil.which("yt-dlp") or sys.executable
    cmd = [exe if exe.endswith("yt-dlp") else sys.executable]
    if not exe.endswith("yt-dlp"):
        cmd += ["-m", "yt_dlp"]

    cmd += ["--yes-playlist", "--dump-single-json", url]
    if cookies:
        cmd += ["--cookies", cookies]
    if cookies_from_browser:
        cmd += ["--cookies-from-browser", cookies_from_browser]
    if quiet:
        cmd += ["--quiet", "--no-warnings"]

    LOG.info("Listing playlist entries via yt-dlp")
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if p.returncode != 0:
        LOG.error("Failed to list playlist: %s", p.stderr.strip().splitlines()[-1] if p.stderr else "")
        raise RuntimeError("Failed to list playlist entries")

    try:
        data = json.loads(p.stdout)
    except Exception as exc:
        LOG.error("Could not parse yt-dlp JSON output: %s", exc)
        raise
    return data


def download_playlist_item_with_retries(
    playlist_url: str,
    index: int,
    out_dir: str,
    cookies: str | None,
    cookies_from_browser: str | None,
    quiet: bool,
) -> List[Path]:
    """Download a single playlist item (by index) and retry until success.

    Returns the list of downloaded file Paths for that item.
    This will loop indefinitely until the item is successfully downloaded or
    the user interrupts the program (KeyboardInterrupt).
    """
    exe = shutil.which("yt-dlp") or sys.executable
    base_cmd = [exe if exe.endswith("yt-dlp") else sys.executable]
    if not exe.endswith("yt-dlp"):
        base_cmd += ["-m", "yt_dlp"]

    out_template = os.path.join(out_dir, "%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s")

    while True:
        cmd = list(base_cmd)
        cmd += [
            "--yes-playlist",
            "--no-part",
            "--merge-output-format",
            "mp4",
            "-f",
            "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
            "-o",
            out_template,
            "--playlist-items",
            str(index),
        ]
        if quiet:
            cmd += ["--no-warnings"]
        if cookies:
            cmd += ["--cookies", cookies]
        if cookies_from_browser:
            cmd += ["--cookies-from-browser", cookies_from_browser]

        cmd += [playlist_url]

        LOG.info("Downloading playlist item %d (will retry until success)", index)
        rc = _run_yt_dlp_cmd(cmd)

        # Find files created for this index (support .webm and .mp4)
        matches: List[Path] = []
        # Playlist title folder may not exist if download failed
        for dp, _, fns in os.walk(out_dir):
            for fn in fns:
                # match the naming prefix 'NNN - '
                if fn.startswith(f"{index:03d} - ") and not fn.endswith(".part"):
                    p = Path(dp) / fn
                    if p.suffix.lower() in (".webm", ".mp4"):
                        matches.append(p)

        if rc == 0 and matches:
            LOG.info("Downloaded %d file(s) for item %d", len(matches), index)
            return sorted(matches)

        LOG.warning("Download of item %d failed (rc=%s, matches=%d). Refreshing cookies and retrying...", index, rc, len(matches))
        # loop and retry; yt-dlp will re-extract cookies if --cookies-from-browser is used
        try:
            # small backoff to avoid tight busy loop
            import time

            time.sleep(2)
        except KeyboardInterrupt:
            LOG.info("Interrupted during retry backoff")
            raise


def collect_files(root: str) -> List[Path]:
    files: List[Path] = []
    for dp, _, fns in os.walk(root):
        for fn in fns:
            if fn.endswith(".part"):
                continue
            if fn.lower().endswith((".info.json", ".jpg", ".png", ".webp")):
                continue
            p = Path(dp) / fn
            # Accept both webm and mp4 outputs (yt-dlp may remux HLS to MP4).
            if p.suffix.lower() in (".webm", ".mp4"):
                files.append(p)
    return sorted(files)


def upload_file(s3, bucket: str, key: str, path: Path) -> bool:
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
    ap.add_argument("storage_path")
    ap.add_argument("url")
    ap.add_argument("--env-file", default=".env.local")
    ap.add_argument("--tmp-dir")
    ap.add_argument("--keep-local", action="store_true")
    ap.add_argument("--cookies")
    ap.add_argument("--cookies-from-browser", help="e.g. brave:Default")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--max-upload-retries", type=int, default=3, help="Number of times to retry an upload before failing")
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

    tmpdir = args.tmp_dir or tempfile.mkdtemp(prefix="ytarchive-")
    os.makedirs(tmpdir, exist_ok=True)

    # download_to_dir (full-playlist run) replaced by per-item download loop below

    # Enumerate playlist entries and download/upload items one-by-one.
    try:
        playlist_meta = list_playlist_entries(args.url, args.cookies, args.cookies_from_browser, args.quiet)
    except Exception:
        LOG.error("Could not list playlist entries; aborting and preserving staging dir %s", tmpdir)
        sys.exit(1)

    entries = playlist_meta.get("entries", []) or []
    playlist_title = playlist_meta.get("title", "playlist")
    if not entries:
        LOG.error("No entries found in playlist")
        sys.exit(1)

    total = len(entries)
    LOG.info("Playlist %s: %d items", playlist_title, total)

    try:
        for idx in range(1, total + 1):
            LOG.info("Processing item %d/%d", idx, total)
            try:
                downloaded_files = download_playlist_item_with_retries(
                    args.url,
                    idx,
                    tmpdir,
                    args.cookies,
                    args.cookies_from_browser,
                    args.quiet,
                )
            except KeyboardInterrupt:
                LOG.info("Interrupted by user; keeping staging dir %s", tmpdir)
                sys.exit(130)

            if not downloaded_files:
                LOG.error("No files produced for item %d; aborting", idx)
                sys.exit(1)

            for fp in downloaded_files:
                # Determine relative path under the playlist folder if present
                playlist_dir = Path(tmpdir) / playlist_title
                try:
                    if playlist_dir in fp.parents:
                        rel = fp.relative_to(playlist_dir).as_posix()
                    else:
                        rel = fp.relative_to(tmpdir).as_posix()
                except Exception:
                    rel = fp.name

                # Sanitize the path for URL-friendliness
                rel = sanitize_path(rel)

                key = f"{s3_prefix}/{rel}" if s3_prefix else rel

                uploaded = False
                for attempt in range(1, args.max_upload_retries + 1):
                    if upload_file(s3, bucket, key, fp):
                        uploaded = True
                        break
                    LOG.warning("Upload attempt %d/%d failed for %s", attempt, args.max_upload_retries, fp.name)
                    time.sleep(2)

                if not uploaded:
                    LOG.error("Failed to upload %s after %d attempts; keeping staging dir %s", fp.name, args.max_upload_retries, tmpdir)
                    sys.exit(1)

    finally:
        # cleanup
        if args.keep_local:
            LOG.info("Keeping staging directory %s", tmpdir)
        else:
            try:
                shutil.rmtree(tmpdir, ignore_errors=True)
                LOG.info("Removed staging directory %s", tmpdir)
            except Exception as e:
                LOG.warning("Could not remove staging dir %s: %s", tmpdir, e)


if __name__ == "__main__":
    main()
