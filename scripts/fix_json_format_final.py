import json
from pathlib import Path

def fix_json_formatting(filepath):
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Preserve comment if exists
    lines = content.splitlines()
    first_line = lines[0] if lines[0].startswith('//') else None
    
    # Parse JSON from content without first line if it's a comment
    if first_line:
        content = '\n'.join(lines[1:])
    data = json.loads(content)

    # Process each entry's tags
    for entry in data:
        if 'tags' in entry and isinstance(entry['tags'], list):
            # Keep the tags as a list but they'll be formatted inline
            continue

    # Convert back to JSON string with custom formatting
    output = json.dumps(data, indent=2)
    
    # Replace multiline tag arrays with single line
    import re    def fix_tag_format(match):
        tags = re.findall(r'"([^"]+)"', match.group(0))
        indent = re.match(r'^(\s*)', match.group(0)).group(1)
        tag_list = ['"' + tag + '"' for tag in tags]
        return indent + '"tags": [' + ', '.join(tag_list) + ']'
    
    pattern = r'(\s*)"tags": \[\s*(?:"[^"]+"\s*,?\s*)*\s*\]'
    output = re.sub(pattern, fix_tag_format, output)
    
    # Write back to file
    with open(filepath, 'w', encoding='utf-8') as f:
        if first_line:
            f.write(first_line + '\n')
        f.write(output)

if __name__ == '__main__':
    input_path = Path("data/verse/poems.json")
    fix_json_formatting(input_path)
