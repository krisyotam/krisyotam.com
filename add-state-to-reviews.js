const fs = require('fs');
const path = require('path');

// Read the reviews.json file as text to preserve formatting
const filePath = path.join(__dirname, 'data', 'reviews', 'reviews.json');
let content = fs.readFileSync(filePath, 'utf8');

// Add state field after the cover_image field in each entry
content = content.replace(/"cover_image": "[^"]+"/g, match => {
  return `${match},\n  "state": "active"`;
});

// Write the modified content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Successfully added state field to all reviews');
