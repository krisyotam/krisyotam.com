const fs = require('fs');
const path = require('path');

// Read the quick-notes.json file
const quickNotesPath = path.join(__dirname, 'data', 'notes', 'quick-notes.json');
const quickNotes = JSON.parse(fs.readFileSync(quickNotesPath, 'utf8'));

const notesContentDir = path.join(__dirname, 'app', 'notes', 'content');

let movedCount = 0;
let notFoundCount = 0;
const notFoundFiles = [];

console.log('Moving notes files to their category subdirectories...\n');

// Process each file in quick-notes.json
for (const [filename, metadata] of Object.entries(quickNotes)) {
  const category = metadata.category;
  const sourceFile = path.join(notesContentDir, filename);
  const targetDir = path.join(notesContentDir, category);
  const targetFile = path.join(targetDir, filename);
  
  // Check if source file exists in root
  if (fs.existsSync(sourceFile)) {
    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`Created directory: ${category}/`);
    }
    
    // Move the file
    try {
      fs.renameSync(sourceFile, targetFile);
      console.log(`Moved: ${filename} → ${category}/${filename}`);
      movedCount++;
    } catch (error) {
      console.error(`Error moving ${filename}: ${error.message}`);
    }
  } else {
    // Check if file already exists in target directory
    if (fs.existsSync(targetFile)) {
      console.log(`Already in correct location: ${category}/${filename}`);
    } else {
      console.log(`File not found: ${filename}`);
      notFoundFiles.push(filename);
      notFoundCount++;
    }
  }
}

console.log(`\n=== Summary ===`);
console.log(`Files moved: ${movedCount}`);
console.log(`Files not found: ${notFoundCount}`);

if (notFoundFiles.length > 0) {
  console.log('\nFiles that were not found:');
  notFoundFiles.forEach(file => console.log(`  - ${file}`));
}

console.log('\nReorganization complete!');
