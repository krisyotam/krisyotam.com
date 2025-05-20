const fs = require('fs');
const path = require('path');

// Function to recursively find MDX files in a directory
function findMdxFiles(directory) {
  const results = [];
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories, but skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        results.push(...findMdxFiles(filePath));
      }
    } else if (file.endsWith('.mdx') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to check if a file contains OpenGraph metadata
function checkForOpenGraph(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return {
    hasMetadata: content.includes('export const metadata') || content.includes('openGraph'),
    filePath
  };
}

// Find all MDX files in app/blog directory
const blogDir = path.join(__dirname, 'app', 'blog');
console.log(`Searching for MDX files in ${blogDir}...`);

const mdxFiles = findMdxFiles(blogDir);
console.log(`Found ${mdxFiles.length} MDX/TSX files.`);

// Check each file for OpenGraph metadata
const filesWithMetadata = mdxFiles
  .map(checkForOpenGraph)
  .filter(result => result.hasMetadata);

console.log('\nFiles with metadata that need to be updated:');
filesWithMetadata.forEach(file => console.log(file.filePath));

if (filesWithMetadata.length === 0) {
  console.log('No files found with OpenGraph metadata!');
} 