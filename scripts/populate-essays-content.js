const fs = require('fs');
const path = require('path');

// Load data files
const essaysData = require('../data/essays/essays.json');
const categoriesData = require('../data/essays/categories.json');

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Create MDX file with placeholder content
function createMdxFile(filePath, title, essayData) {
  const content = `# ${title}

${essayData.subtitle ? `*${essayData.subtitle}*` : ''}

${essayData.preview}

## Overview

This essay is currently being developed. The content will be expanded as research and writing progress.

## Key Points

- **Category**: ${essayData.category}
- **Status**: ${essayData.status}
- **Date**: ${new Date(essayData.date).toLocaleDateString()}
- **Importance**: ${essayData.importance}/10

## Content

*The full essay content will be added here as it develops.*

## Tags

${essayData.tags.map(tag => `- ${tag}`).join('\n')}

---

*This essay is part of my ongoing philosophical and pedagogical writings. Content may be updated as new insights emerge.*
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created MDX file: ${filePath}`);
}

function populateEssaysContent() {
  console.log('=== Populating Essays Content ===');
  
  const essaysContentDir = path.join(__dirname, '..', 'app', 'essays', 'content');
  ensureDirectoryExists(essaysContentDir);

  // Create directories for each category
  categoriesData.categories.forEach(category => {
    const categoryDir = path.join(essaysContentDir, category.slug);
    ensureDirectoryExists(categoryDir);
  });

  console.log(`Created ${categoriesData.categories.length} category directories for essays`);

  // Create MDX files for each essay
  essaysData.essays.forEach(essay => {
    const categoryDir = path.join(essaysContentDir, essay.category);
    const mdxFilePath = path.join(categoryDir, `${essay.slug}.mdx`);
    
    if (!fs.existsSync(mdxFilePath)) {
      createMdxFile(mdxFilePath, essay.title, essay);
    } else {
      console.log(`MDX file already exists: ${mdxFilePath}`);
    }
  });

  console.log(`Processed ${essaysData.essays.length} essays`);
}

// Main execution
function main() {
  console.log('Starting content population for Essays...');
  
  try {
    populateEssaysContent();
    
    console.log('');
    console.log('✅ Essays content population completed successfully!');
    
    // Summary
    console.log('\n=== Summary ===');
    console.log(`Essays: ${categoriesData.categories.length} categories, ${essaysData.essays.length} items`);
    
    // Show directory structure
    console.log('\nDirectory structure created:');
    categoriesData.categories.forEach(category => {
      const categoryEssays = essaysData.essays.filter(essay => essay.category === category.slug);
      console.log(`  ${category.slug}/ (${categoryEssays.length} files)`);
      categoryEssays.forEach(essay => {
        console.log(`    └── ${essay.slug}.mdx`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error during content population:', error);
    process.exit(1);
  }
}

main();
