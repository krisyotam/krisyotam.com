#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths to process
const filesToProcess = [
  './data/essays/category-data.json',
  './data/essays/series.json',
  './data/essays/tags.json'
];

function removeSubtitles(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    // Read the JSON file
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Get the main array key (categories, series, or tags)
    const mainKey = Object.keys(data)[0];
    const items = data[mainKey];
    
    if (!Array.isArray(items)) {
      console.log(`⚠️  Warning: ${filePath} doesn't contain an array in ${mainKey}`);
      return;
    }
    
    // Remove subtitle from each item
    let subtitlesRemoved = 0;
    items.forEach(item => {
      if (item.hasOwnProperty('subtitle')) {
        delete item.subtitle;
        subtitlesRemoved++;
      }
    });
    
    // Write back to file with proper formatting
    const updatedContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log(`✅ ${filePath}: Removed ${subtitlesRemoved} subtitle fields`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('🚀 Starting subtitle removal process...\n');

filesToProcess.forEach(removeSubtitles);

console.log('\n✨ Subtitle removal completed!');
