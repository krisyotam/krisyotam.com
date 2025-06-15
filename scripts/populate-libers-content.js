#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load libers data
const libersData = JSON.parse(fs.readFileSync('./data/libers/libers.json', 'utf8'));
const categoriesData = JSON.parse(fs.readFileSync('./data/libers/categories.json', 'utf8'));

// Define the content directory
const contentDir = './app/libers/content';

// Create content directory if it doesn't exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Create subdirectories for each category
const categories = categoriesData.categories.map(cat => cat.slug);
categories.forEach(category => {
  const categoryDir = path.join(contentDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Created directory: ${categoryDir}`);
  }
});

// Generate sample content based on the title and category
function generateLiberContent(liber) {
  const { title, category, tags, preview } = liber;
  
  // Create more elaborate content based on the subject matter
  const content = generateContentByCategory(category, title, tags, preview);
  
  return content;
}

function generateContentByCategory(category, title, tags, preview) {
  const baseContent = `# ${title.charAt(0).toUpperCase() + title.slice(1)}

## Overview

${preview}

## Historical Context

This study examines ${title} within the broader framework of historical taboo subjects and forbidden knowledge. The research draws from primary sources, archaeological evidence, and comparative cultural analysis.

## Methodology

Our investigation employs a multidisciplinary approach, combining:
- Historical document analysis
- Archaeological evidence examination
- Cross-cultural comparative studies
- Psychological and sociological frameworks

## Primary Sources

### Ancient Texts
- Various historical manuscripts and codices
- Legal documents and court records
- Religious and ritual texts
- Personal correspondence and diary entries

### Archaeological Evidence
- Artifact analysis and interpretation
- Site excavations and findings
- Material culture studies
- Iconographic analysis

## Analysis

### Cultural Significance

The practices and beliefs surrounding ${title} reveal significant insights into the societies that harbored them. These forbidden aspects of human behavior provide a unique window into the psychological and social dynamics of past civilizations.

### Taboo and Transgression

The prohibition of certain behaviors often reveals as much about a society's values as their acceptance. This study examines the boundaries between the sacred and profane, the acceptable and forbidden.

### Modern Implications

Understanding these historical taboos provides context for contemporary discussions about human sexuality, mortality, and the limits of acceptable behavior in modern society.

## Conclusions

This investigation into ${title} contributes to our understanding of the complex relationship between desire, prohibition, and cultural formation throughout human history.

## References

*[This section would contain actual academic references in a real scholarly work]*

## Further Reading

For additional context on related subjects, see other entries in this collection of forbidden knowledge.

---

*This document is part of an academic study of historical taboo subjects and should be approached with appropriate scholarly discretion.*`;

  return baseContent;
}

// Create MDX files for each liber
libersData.forEach(liber => {
  const categoryDir = path.join(contentDir, liber.category);
  const filePath = path.join(categoryDir, `${liber.slug}.mdx`);
  
  const content = generateLiberContent(liber);
  
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
});

console.log('\n✅ Libers content population complete!');
console.log(`📁 Created ${categories.length} category directories`);
console.log(`📄 Created ${libersData.length} MDX files`);
console.log('\nDirectory structure:');
categories.forEach(category => {
  const categoryLibers = libersData.filter(liber => liber.category === category);
  console.log(`  ${category}/ (${categoryLibers.length} files)`);
  categoryLibers.forEach(liber => {
    console.log(`    └── ${liber.slug}.mdx`);
  });
});
