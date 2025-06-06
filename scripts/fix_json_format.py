import json
import re
from pathlib import Path

def format_tags_inline(content):
    # Find all tag arrays with their indentation
    pattern = re.compile(r'(\s+)"tags":\s*\[([\s\S]*?)\]', re.MULTILINE)
      def replace_tag_array(match):
        indent = match.group(1)
        tags = re.findall(r'"([^"]+)"', match.group(2))
        return f'{indent}"tags": [{", ".join(f\'"{t}"\' for t in tags)}]'
    
    return pattern.sub(replace_tag_array, content)

# Read the original file
input_path = Path("data/verse/poems.json")
with open(input_path, "r", encoding="utf-8") as f:
    content = f.read()

# Format tags inline while preserving everything else
fixed_content = format_tags_inline(content)

# Write back to the file
with open(input_path, "w", encoding="utf-8") as f:
    f.write(fixed_content)
