const fs = require('fs');
const path = require('path');

// Read the symbols.json file
const symbolsPath = path.join(__dirname, 'data', 'symbols.json');
const symbolsData = JSON.parse(fs.readFileSync(symbolsPath, 'utf8'));

// Write back with compact array formatting
const formattedJson = JSON.stringify(symbolsData, null, 2)
  .replace(/\[\s*\n\s*"([^"]*)"(?:,\s*\n\s*"([^"]*)")*\s*\n\s*\]/g, (match) => {
    // Extract all the quoted strings from the multi-line array
    const items = match.match(/"[^"]*"/g);
    if (items && items.length > 1) {
      return '[' + items.join(', ') + ']';
    }
    return match;
  });

// Write the formatted JSON back to the file
fs.writeFileSync(symbolsPath, formattedJson, 'utf8');

console.log('✅ Fixed symbols.json formatting - arrays are now on single lines');
