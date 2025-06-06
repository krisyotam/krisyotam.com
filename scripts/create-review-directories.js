const fs = require('fs');
const path = require('path');

// Read the categories file
const categoriesPath = path.join(__dirname, '..', 'data', 'reviews', 'categories.json');
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// Base directory for review content
const baseDir = path.join(__dirname, '..', 'app', 'review', 'content');

// Create the base directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Create a directory for each category
categories.types.forEach(category => {
  const categoryDir = path.join(baseDir, category.slug);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir);
    console.log(`Created directory for ${category.title}: ${categoryDir}`);
  } else {
    console.log(`Directory already exists for ${category.title}: ${categoryDir}`);
  }
});
