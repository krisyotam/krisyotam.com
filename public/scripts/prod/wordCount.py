#!/usr/bin/env python3
"""
wordCount.py — count words in Markdown/MDX files, excluding non-prose elements.

Strips before counting:
  - YAML frontmatter (--- ... ---)
  - Fenced code blocks (``` or ~~~)
  - import/export statements
  - JSX/MDX components (<Component /> and <Component>...</Component>)
  - HTML tags

Usage:
  ./wordCount.py file.mdx
  ./wordCount.py file.mdx --json
  ./wordCount.py *.mdx --json
  cat file.mdx | ./wordCount.py -

@type utils
@path public/scripts/prod/wordCount.py
"""

from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

FRONTMATTER_RE = re.compile(r"^---[\s\S]*?---\n?")
IMPORT_EXPORT_RE = re.compile(r"^\s*(import|export)\s+.*$", re.MULTILINE)
SELF_CLOSING_JSX_RE = re.compile(r"<[A-Z][A-Za-z0-9]*\b[^>]*/>")
JSX_TAG_RE = re.compile(r"</?[A-Z][A-Za-z0-9]*\b[^>]*>")
HTML_TAG_RE = re.compile(r"</?[a-z][a-zA-Z]*[^>]*>")
WORD_RE = re.compile(r"[A-Za-z0-9]+(?:['\-][A-Za-z0-9]+)*")


def read_text(path: str) -> str:
    if path == "-":
        return sys.stdin.read()
    return Path(path).read_text(encoding="utf-8", errors="replace")


def strip_fenced_blocks(text: str) -> str:
    lines = text.splitlines()
    output: list[str] = []
    in_block = False
    fence: str | None = None

    for line in lines:
        match = re.match(r"^\s*(`{3,}|~{3,})", line)
        if match:
            if not in_block:
                in_block = True
                fence = match.group(1)[0]
            elif fence and line.strip().startswith(fence * 3):
                in_block = False
                fence = None
            continue
        if not in_block:
            output.append(line)

    return "\n".join(output)


def clean(text: str) -> str:
    text = FRONTMATTER_RE.sub("", text)
    text = strip_fenced_blocks(text)
    text = IMPORT_EXPORT_RE.sub("", text)
    text = SELF_CLOSING_JSX_RE.sub("", text)
    text = JSX_TAG_RE.sub("", text)
    text = HTML_TAG_RE.sub("", text)
    return text


def count_words(text: str) -> int:
    return len(WORD_RE.findall(text))


def reading_time(words: int) -> str:
    if words == 0:
        return "—"
    total_seconds = round((words / 200) * 60)
    if total_seconds < 60:
        return f"~{total_seconds}s"
    minutes = max(1, round(words / 200))
    return f"~{minutes} min"


def process_file(path: str) -> dict:
    raw = read_text(path)
    cleaned = clean(raw)
    words = count_words(cleaned)
    return {
        "file": path,
        "words": words,
        "reading_time": reading_time(words),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Count words in MDX files (prose only).")
    parser.add_argument("files", nargs="+", help="Path(s) to .md/.mdx file(s) or '-' for stdin")
    parser.add_argument("--json", action="store_true", help="Output JSON")
    args = parser.parse_args()

    results = [process_file(f) for f in args.files]

    if args.json:
        print(json.dumps(results if len(results) > 1 else results[0], indent=2))
    else:
        for r in results:
            if len(results) > 1:
                print(f"\n{r['file']}:")
            print(f"  words: {r['words']}")
            print(f"  reading_time: {r['reading_time']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
