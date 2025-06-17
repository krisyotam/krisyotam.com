const fs = require('fs');
const path = require('path');

// Read the data files
const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/papers/categories.json'), 'utf8'));
const papersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/papers/papers.json'), 'utf8'));

const contentDir = path.join(__dirname, '../app/papers/content');

// Create category directories
categoriesData.categories.forEach(category => {
  const categoryDir = path.join(contentDir, category.slug);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Created directory: ${category.slug}`);
  }
});

// Create MDX files for each paper in their respective category directory
papersData.papers.forEach(paper => {
  const categoryDir = path.join(contentDir, paper.category);
  const filePath = path.join(categoryDir, `${paper.slug}.mdx`);
  
  // Create a basic MDX file with metadata
  const mdxContent = `---
title: "${paper.title}"
preview: "${paper.preview}"
date: "${paper.date}"
tags: ${JSON.stringify(paper.tags)}
category: "${paper.category}"
slug: "${paper.slug}"
cover_image: "${paper.cover_image}"
status: "${paper.status}"
confidence: "${paper.confidence}"
importance: ${paper.importance}
state: "${paper.state}"
---

# ${paper.title}

${paper.preview}

*This paper is currently in ${paper.status} status.*

## Introduction

[Content to be written...]

## Main Analysis

[Content to be written...]

## Conclusion

[Content to be written...]

## References

[References to be added...]
`;

  fs.writeFileSync(filePath, mdxContent);
  console.log(`Created: ${paper.category}/${paper.slug}.mdx`);
});

console.log('Papers content structure populated successfully!');
