import json
import os

file_path = os.path.join(os.path.dirname(__file__), '../data/header-quotes.json')

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

changed = False
for quote in data.get('quotes', []):
    if 'source' not in quote:
        quote['source'] = ""
        changed = True

if changed:
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('Added missing "source" fields.')
else:
    print('No changes needed.')
