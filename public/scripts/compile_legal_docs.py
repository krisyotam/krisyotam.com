#!/usr/bin/env python3
# filepath: c:\Users\Kris Yotam\Music\name1\scripts\compile_legal_docs.py
"""
Compile every .tex file in app/legal/documents into PDFs, drop an internal copy
in app/legal/pdfs, and expose another copy in public/legal/documents so the
Next.js frontend can fetch them.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import List

# ──────────────────────────────────────────────────────────────────────────────
# Path setup
# ──────────────────────────────────────────────────────────────────────────────
script_dir = Path(__file__).resolve().parent           # …/scripts
base_dir   = script_dir.parent                         # project root

tex_dir    = base_dir / "app"    / "legal" / "documents"
pdf_dir    = base_dir / "app"    / "legal" / "pdfs"
public_dir = base_dir / "public" / "legal" / "documents"

print(f"Base directory   : {base_dir}")
print(f"TeX source       : {tex_dir}")
print(f"Internal PDFs    : {pdf_dir}")
print(f"Public PDFs      : {public_dir}")

# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────
def ensure_dir_exists(dir_path: Path) -> None:
    if not dir_path.exists():
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {dir_path}")

def cleanup_directory(dir_path: Path, pattern: str = "*.pdf") -> None:
    removed = 0
    for item in dir_path.glob(pattern):
        item.unlink()
        removed += 1
    if removed:
        print(f"Deleted {removed} ‹{pattern}› file(s) from {dir_path}")

def fix_em_dashes_in_file(tex_file: Path) -> None:
    text = tex_file.read_text(encoding="utf-8")
    fixed = re.sub(r"(%[^\n]*?)—", r"\1-", text)  # em‑dash in a comment
    if text != fixed:
        tex_file.write_text(fixed, encoding="utf-8")
        print(f"Patched em‑dash in comments → {tex_file.name}")

def pdflatex_cmd(source: Path, outdir: Path) -> List[str]:
    """Return a pdflatex command list that’s safe with spaces in paths."""
    return [
        "pdflatex",
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-output-directory", str(outdir),
        str(source)
    ]

def compile_tex_file(tex_file: Path) -> bool:
    basename = tex_file.stem
    print(f"\n↻ Compiling {tex_file.name}")

    fix_em_dashes_in_file(tex_file)
    pdf_built = tex_dir / f"{basename}.pdf"

    for pass_num in (1, 2):
        result = subprocess.run(
            pdflatex_cmd(tex_file, tex_dir),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False
        )
        if result.returncode != 0:
            print(f"  ⚠️  pdflatex pass {pass_num} had issues for {tex_file.name}")
            print(result.stderr[:800] + ("…" if len(result.stderr) > 800 else ""))

    if not pdf_built.exists():
        print(f"  ✗ Failed to generate PDF for {tex_file.name}")
        return False

    # Ensure destinations exist, then copy
    for dest_root in (pdf_dir, public_dir):
        ensure_dir_exists(dest_root)
        shutil.copy2(pdf_built, dest_root / pdf_built.name)

    print(f"  ✓ {basename}.pdf generated and copied")

    # Clean temporary build artefacts
    pdf_built.unlink(missing_ok=True)
    for ext in (".aux", ".log", ".out", ".toc", ".lof", ".lot"):
        aux = tex_dir / f"{basename}{ext}"
        aux.unlink(missing_ok=True)

    return True

# ──────────────────────────────────────────────────────────────────────────────
# Main entry‑point
# ──────────────────────────────────────────────────────────────────────────────
def main() -> int:
    print("\nLegal Documents – PDF compiler\n" + "─" * 34)

    for p in (tex_dir, pdf_dir, public_dir):
        ensure_dir_exists(p)

    # Fresh start
    cleanup_directory(tex_dir, "*.pdf")
    cleanup_directory(pdf_dir, "*.pdf")
    cleanup_directory(public_dir, "*.pdf")

    tex_files = [p for p in tex_dir.glob("*.tex") if p.name != "research.tex"]
    print(f"Found {len(tex_files)} .tex file(s) to compile")

    success, failure = [], []
    for tex in tex_files:
        (success if compile_tex_file(tex) else failure).append(tex.name)

    # Summary
    print("\nCompilation summary")
    print("───────────────────")
    print(f"Processed : {len(tex_files)}")
    print(f"Successes : {len(success)}" + (f" → {', '.join(success)}" if success else ""))
    if failure:
        print(f"Failures  : {len(failure)} → {', '.join(failure)}")
        return 1
    print("All documents compiled ✔")
    return 0

if __name__ == "__main__":
    sys.exit(main())
