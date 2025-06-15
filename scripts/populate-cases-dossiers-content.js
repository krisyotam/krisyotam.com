const fs = require('fs');
const path = require('path');

// Load data files
const casesData = require('../data/cases/cases.json');
const casesCategories = require('../data/cases/categories.json');
const dossiersData = require('../data/dossiers/dossiers.json');
const dossiersCategories = require('../data/dossiers/categories.json');

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Create MDX file with placeholder content
function createMdxFile(filePath, title, type) {
  const content = `# ${title}

*This ${type} is currently under investigation. Content will be added as information becomes available.*

## Overview

This is a placeholder for the ${title} ${type}. The investigation is ongoing and details will be updated as they become available.

## Key Information

- **Status**: Under Investigation
- **Type**: ${type}
- **Last Updated**: ${new Date().toLocaleDateString()}

## Timeline

*Timeline information will be added as the investigation progresses.*

## Evidence

*Evidence and documentation will be catalogued here.*

## References

*Sources and references will be listed here.*

---

*This ${type} is part of an ongoing investigation. Information may be updated as new evidence emerges.*
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created MDX file: ${filePath}`);
}

function populateCasesContent() {
  console.log('=== Populating Cases Content ===');
  
  const casesContentDir = path.join(__dirname, '..', 'app', 'cases', 'content');
  ensureDirectoryExists(casesContentDir);

  // Create directories for each category
  casesCategories.categories.forEach(category => {
    const categoryDir = path.join(casesContentDir, category.slug);
    ensureDirectoryExists(categoryDir);
  });

  console.log(`Created ${casesCategories.categories.length} category directories for cases`);

  // Create MDX files for each case
  casesData.forEach(caseItem => {
    const categoryDir = path.join(casesContentDir, caseItem.category);
    const mdxFilePath = path.join(categoryDir, `${caseItem.slug}.mdx`);
    
    if (!fs.existsSync(mdxFilePath)) {
      createMdxFile(mdxFilePath, caseItem.title, 'case');
    } else {
      console.log(`MDX file already exists: ${mdxFilePath}`);
    }
  });

  console.log(`Processed ${casesData.length} cases`);
}

function populateDossiersContent() {
  console.log('=== Populating Dossiers Content ===');
  
  const dossiersContentDir = path.join(__dirname, '..', 'app', 'dossiers', 'content');
  ensureDirectoryExists(dossiersContentDir);

  // Create directories for each category
  dossiersCategories.categories.forEach(category => {
    const categoryDir = path.join(dossiersContentDir, category.slug);
    ensureDirectoryExists(categoryDir);
  });

  console.log(`Created ${dossiersCategories.categories.length} category directories for dossiers`);

  // Create MDX files for each dossier
  dossiersData.forEach(dossier => {
    const categoryDir = path.join(dossiersContentDir, dossier.category);
    const mdxFilePath = path.join(categoryDir, `${dossier.slug}.mdx`);
    
    if (!fs.existsSync(mdxFilePath)) {
      createMdxFile(mdxFilePath, dossier.title, 'dossier');
    } else {
      console.log(`MDX file already exists: ${mdxFilePath}`);
    }
  });

  console.log(`Processed ${dossiersData.length} dossiers`);
}

// Main execution
function main() {
  console.log('Starting content population for Cases and Dossiers...');
  
  try {
    populateCasesContent();
    console.log('');
    populateDossiersContent();
    
    console.log('');
    console.log('✅ Content population completed successfully!');
    
    // Summary
    console.log('\n=== Summary ===');
    console.log(`Cases: ${casesCategories.categories.length} categories, ${casesData.length} items`);
    console.log(`Dossiers: ${dossiersCategories.categories.length} categories, ${dossiersData.length} items`);
    
  } catch (error) {
    console.error('❌ Error during content population:', error);
    process.exit(1);
  }
}

main();
