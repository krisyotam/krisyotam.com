const fs = require('fs');
const path = require('path');

// Paths
const categoriesPath = path.join(__dirname, 'data', 'notes', 'categories.json');
const quickNotesPath = path.join(__dirname, 'data', 'notes', 'quick-notes.json');
const notesContentPath = path.join(__dirname, 'app', 'notes', 'content');

// Read the categories
const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
const categories = categoriesData.categories;

// Read the quick notes
const quickNotes = JSON.parse(fs.readFileSync(quickNotesPath, 'utf8'));

// Extract category slugs (excluding manuals-of-style which already exists)
const categoryMappings = {};
categories.forEach(cat => {
  if (cat.slug !== 'manuals-of-style') {
    categoryMappings[cat.title] = cat.slug;
  }
});

console.log('Creating subdirectories for categories...');

// Create subdirectories for each category
Object.values(categoryMappings).forEach(slug => {
  const categoryDir = path.join(notesContentPath, slug);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`✓ Created directory: ${slug}`);
  } else {
    console.log(`- Directory already exists: ${slug}`);
  }
});

console.log('\nProcessing files from quick-notes.json...');

// Process each entry in quick-notes.json
const missingFiles = [];
const movedFiles = [];
const skippedFiles = [];

quickNotes.forEach(note => {
  const fileName = `${note.slug}.mdx`;
  const sourcePath = path.join(notesContentPath, fileName);
  
  // Check if file exists
  if (!fs.existsSync(sourcePath)) {
    missingFiles.push({
      file: fileName,
      category: note.category,
      title: note.title
    });
    return;
  }
  
  // Skip if category is "Manuals of Style" (already handled)
  if (note.category === 'Manuals of Style') {
    skippedFiles.push({
      file: fileName,
      reason: 'Already in manuals-of-style directory'
    });
    return;
  }
  
  // Find the category slug
  const categorySlug = categoryMappings[note.category];
  if (!categorySlug) {
    console.log(`⚠️  Warning: No category slug found for "${note.category}" (file: ${fileName})`);
    return;
  }
  
  // Move the file
  const targetDir = path.join(notesContentPath, categorySlug);
  const targetPath = path.join(targetDir, fileName);
  
  try {
    fs.renameSync(sourcePath, targetPath);
    movedFiles.push({
      file: fileName,
      from: 'notes/content/',
      to: `notes/content/${categorySlug}/`,
      category: note.category
    });
    console.log(`✓ Moved ${fileName} to ${categorySlug}/`);
  } catch (error) {
    console.log(`❌ Error moving ${fileName}: ${error.message}`);
  }
});

// Summary report
console.log('\n' + '='.repeat(60));
console.log('MIGRATION SUMMARY');
console.log('='.repeat(60));

console.log(`\n📁 DIRECTORIES CREATED:`);
Object.values(categoryMappings).forEach(slug => {
  console.log(`   - ${slug}`);
});

console.log(`\n✅ FILES MOVED (${movedFiles.length}):`);
movedFiles.forEach(file => {
  console.log(`   - ${file.file} → ${file.to} (${file.category})`);
});

console.log(`\n⚠️  FILES MISSING (${missingFiles.length}):`);
if (missingFiles.length > 0) {
  console.log('   The following files are referenced in quick-notes.json but do not exist:');
  missingFiles.forEach(file => {
    console.log(`   - ${file.file} (${file.category}) - "${file.title}"`);
  });
} else {
  console.log('   No missing files found!');
}

console.log(`\n⏭️  FILES SKIPPED (${skippedFiles.length}):`);
skippedFiles.forEach(file => {
  console.log(`   - ${file.file} (${file.reason})`);
});

// Check for any remaining files in the root that might not be in quick-notes.json
console.log(`\n🔍 CHECKING FOR ORPHANED FILES...`);
const rootFiles = fs.readdirSync(notesContentPath).filter(file => 
  file.endsWith('.mdx') && fs.statSync(path.join(notesContentPath, file)).isFile()
);

const notesInJson = quickNotes.map(note => `${note.slug}.mdx`);
const orphanedFiles = rootFiles.filter(file => !notesInJson.includes(file));

if (orphanedFiles.length > 0) {
  console.log(`   Found ${orphanedFiles.length} files in notes/content/ that are not in quick-notes.json:`);
  orphanedFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
} else {
  console.log('   No orphaned files found!');
}

console.log('\n' + '='.repeat(60));
console.log('Migration complete!');
console.log('='.repeat(60));
