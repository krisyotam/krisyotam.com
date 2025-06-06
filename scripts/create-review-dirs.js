const fs = require('fs');
const path = require('path');

// Read categories.json
const categoriesPath = path.join(__dirname, '..', 'data', 'reviews', 'categories.json');
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// Base directory for review content
const contentDir = path.join(__dirname, '..', 'app', 'review', 'content');

// Create base content directory if it doesn't exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Create a directory for each review type
categories.types.forEach(type => {
  const typeDir = path.join(contentDir, type.slug);
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir, { recursive: true });
    console.log(`Created directory: ${type.slug}`);
  } else {
    console.log(`Directory already exists: ${type.slug}`);
  }
});

console.log('All review content directories have been created!');
