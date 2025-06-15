#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the data files
const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/news/categories.json'), 'utf8'));
const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/news/news.json'), 'utf8'));

const contentDir = path.join(__dirname, '../app/news/content');

// Create content directory if it doesn't exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Create subdirectories for each category
categoriesData.categories.forEach(category => {
  const categoryDir = path.join(contentDir, category.slug);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Created directory: ${categoryDir}`);
  }
});

// Create MDX files for each news article
newsData.forEach(article => {
  const categoryDir = path.join(contentDir, article.category);
  const filePath = path.join(categoryDir, `${article.slug}.mdx`);
  
  // Don't overwrite existing files
  if (fs.existsSync(filePath)) {
    console.log(`File already exists: ${filePath}`);
    return;
  }

  const mdxContent = `# ${article.title}

## Overview

${article.preview}

## Background

*This section provides context and background information about ${article.title}.*

## Key Details

*Important details and specifics about this development.*

## Significance

*Why this development is important in the broader context of AI and technology.*

## Timeline

**Date:** ${new Date(article.date).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

## Related

*Links to related articles, papers, or announcements.*

## Tags

${article.tags.map(tag => `- ${tag}`).join('\n')}
`;

  fs.writeFileSync(filePath, mdxContent);
  console.log(`Created file: ${filePath}`);
});

console.log('\n✅ News content structure populated successfully!');
console.log(`\nCreated ${categoriesData.categories.length} category directories:`);
categoriesData.categories.forEach(cat => console.log(`  - ${cat.slug} (${cat.title})`));

console.log(`\nCreated ${newsData.length} news article files:`);
newsData.forEach(article => console.log(`  - ${article.category}/${article.slug}.mdx`));
