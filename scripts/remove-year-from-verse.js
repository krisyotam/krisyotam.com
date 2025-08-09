#!/usr/bin/env node

/**
 * Script to remove the "year" field from all entries in verse.json
 */

const fs = require('fs');
const path = require('path');

const versePath = path.join(__dirname, '..', 'data', 'verse', 'verse.json');

console.log('Reading verse.json...');
console.log('File path:', versePath);

// Read the current verse.json file
const rawData = fs.readFileSync(versePath, 'utf8');
const verseData = JSON.parse(rawData);

console.log(`Found ${verseData.length} verse entries`);

// Remove the "year" field from each entry
let removedCount = 0;
const cleanedData = verseData.map(entry => {
  console.log(`Processing entry: ${entry.title}, has year: ${entry.hasOwnProperty('year')}`);
  if (entry.hasOwnProperty('year')) {
    const { year, ...entryWithoutYear } = entry;
    removedCount++;
    console.log(`Removed year ${year} from "${entry.title}"`);
    return entryWithoutYear;
  }
  return entry;
});

console.log(`Removed "year" field from ${removedCount} entries`);

// Write the cleaned data back to the file
const cleanedJson = JSON.stringify(cleanedData, null, 2);
fs.writeFileSync(versePath, cleanedJson, 'utf8');

console.log('Successfully updated verse.json');
console.log('✅ Year field removed from all verse entries');
