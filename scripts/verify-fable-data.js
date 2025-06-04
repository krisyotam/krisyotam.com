// scripts/verify-fable-data.js
const fs = require('fs');
const path = require('path');

// Read the fable.json file
const filePath = path.join(process.cwd(), 'data', 'progymnasmata', 'fable.json');
const data = fs.readFileSync(filePath, 'utf8');
const entries = JSON.parse(data);

// Find the specific entry
const antAndGrasshopper = entries.find(e => e.slug === 'ant-and-grasshopper');

console.log('Ant and Grasshopper Entry Data:');
console.log({
  title: antAndGrasshopper.title,
  status: antAndGrasshopper.status,
  certainty: antAndGrasshopper.certainty,
  importance: antAndGrasshopper.importance
});
