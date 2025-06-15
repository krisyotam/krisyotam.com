#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read conspiracies data
const conspiraciesData = JSON.parse(fs.readFileSync('./data/conspiracies/conspiracies.json', 'utf8'));
const categoriesData = JSON.parse(fs.readFileSync('./data/conspiracies/categories.json', 'utf8'));

// Create content directory structure
const contentDir = './app/conspiracies/content';
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Create category directories
const categories = Array.from(new Set(conspiraciesData.map(conspiracy => conspiracy.category)));
const categoryMap = {};

categories.forEach(category => {
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const categoryDir = path.join(contentDir, categorySlug);
  
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Created directory: ${categoryDir}`);
  }
  
  categoryMap[category] = categorySlug;
});

// Generate MDX files for each conspiracy
conspiraciesData.forEach(conspiracy => {
  const categorySlug = categoryMap[conspiracy.category];
  const filePath = path.join(contentDir, categorySlug, `${conspiracy.slug}.mdx`);
  
  // Find category info
  const categoryInfo = categoriesData.categories.find(cat => 
    cat.slug === categorySlug || cat.title === conspiracy.category
  );
  
  const mdxContent = `# ${conspiracy.title}

${conspiracy.preview}

## Overview

This conspiracy theory explores ${conspiracy.title.toLowerCase()}, examining the claims, evidence, and cultural impact surrounding these allegations.

**Key Information:**
- **Date**: ${conspiracy.date}
- **Category**: ${conspiracy.category}
- **Status**: ${conspiracy.status}
- **Confidence Level**: ${conspiracy.confidence}
- **Importance Rating**: ${conspiracy.importance}/10

## Claims and Allegations

*[This section would detail the specific claims made in this conspiracy theory]*

## Evidence Analysis

*[This section would examine available evidence, both supporting and contradicting the theory]*

## Historical Context

*[This section would provide historical background and context for understanding the conspiracy]*

## Cultural Impact

*[This section would discuss how this conspiracy theory has influenced culture, politics, or society]*

## Debunking and Counter-Arguments

*[This section would present mainstream explanations and counter-evidence]*

## Sources and References

*[This section would list sources, documents, and references related to the conspiracy]*

## Related Conspiracies

*[This section would link to related conspiracy theories or topics]*

---

**Tags**: ${conspiracy.tags.map(tag => `#${tag}`).join(', ')}

**Last Updated**: ${conspiracy.date}
`;

  fs.writeFileSync(filePath, mdxContent);
  console.log(`Created: ${filePath}`);
});

console.log('\\n✅ Conspiracies content structure created successfully!');
console.log(`📁 Created ${categories.length} category directories`);
console.log(`📄 Created ${conspiraciesData.length} MDX files`);
console.log('\\n📂 Directory structure:');
categories.forEach(category => {
  const categorySlug = categoryMap[category];
  const conspiraciesInCategory = conspiraciesData.filter(c => c.category === category);
  console.log(`  ${categorySlug}/ (${conspiraciesInCategory.length} conspiracies)`);
  conspiraciesInCategory.forEach(conspiracy => {
    console.log(`    └── ${conspiracy.slug}.mdx`);
  });
});
