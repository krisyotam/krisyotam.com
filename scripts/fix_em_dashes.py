#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Base directory
base_dir = Path("c:/Users/Kris Yotam/Music/name1")
docs_dir = base_dir / "app" / "legal" / "documents"

def fix_em_dashes(file_path):
    """Fix em-dashes in LaTeX files that can cause compilation issues"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace ALL em-dashes with regular hyphens, not just in comments
        if '—' in content:
            fixed_content = content.replace('—', '-')
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(fixed_content)
            print(f"✓ Fixed em-dashes in {os.path.basename(file_path)}")
            return True
        return False
    except Exception as e:
        print(f"✗ Error fixing {os.path.basename(file_path)}: {e}")
        return False

def main():
    print("Fixing em-dashes in LaTeX files...")
    
    # Get all .tex files
    tex_files = list(docs_dir.glob("*.tex"))
    
    fixed_count = 0
    for tex_file in tex_files:
        if fix_em_dashes(tex_file):
            fixed_count += 1
    
    print(f"Fixed {fixed_count} out of {len(tex_files)} files")

if __name__ == "__main__":
    main()
