import json
from pathlib import Path
import re

def read_json_preserve_format(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    first_line = None
    lines = content.splitlines()
    if lines[0].startswith('//'):
        first_line = lines[0]
        content = '\n'.join(lines[1:])
    return content, first_line

def fix_tags_in_json(content):
    # Use regex to find and fix tag arrays
    pattern = r'(\s+)"tags": \[\s*(?:"[^"]+"\s*,?\s*)*\s*\]'
      def replace_tags(match):
        # Extract indentation and tags
        indent = match.group(1)
        tags = re.findall(r'"([^"]+)"', match.group(0))
        formatted_tags = ", ".join('"{}"'.format(tag) for tag in tags)
        return f'{indent}"tags": [{formatted_tags}]'
    
    return re.sub(pattern, replace_tags, content)

# Process the file
input_path = Path("data/verse/poems.json")

# Read content and preserve comment
content, first_line = read_json_preserve_format(input_path)

# Fix the tags formatting
fixed_content = fix_tags_in_json(content)

# Add back the comment if it existed
if first_line:
    fixed_content = first_line + '\n' + fixed_content

# Write back to file
with open(input_path, 'w', encoding='utf-8') as f:
    f.write(fixed_content)
