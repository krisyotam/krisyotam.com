import fs from 'fs';
import path from 'path';
import categoriesData from '../data/lectures/categories.json' with { type: 'json' };
import lecturesData from '../data/lectures/lectures.json' with { type: 'json' };

const contentDir = path.join(process.cwd(), 'app', 'lectures', 'content');

// Create subdirectories for each category
categoriesData.categories.forEach(category => {
  const categoryDir = path.join(contentDir, category.slug);
  
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Created directory: ${categoryDir}`);
  }
});

// Create MDX files for each lecture
lecturesData.forEach(lecture => {
  const lectureFile = path.join(contentDir, lecture.category, `${lecture.slug}.mdx`);
  
  if (!fs.existsSync(lectureFile)) {
    const mdxContent = `# ${lecture.title}

${lecture.preview || 'This lecture content is being prepared.'}

## Introduction

This is a placeholder for the lecture content. The actual content will be added here.

## Main Content

- Key point 1
- Key point 2
- Key point 3

## Conclusion

Summary and closing thoughts.
`;
    
    fs.writeFileSync(lectureFile, mdxContent, 'utf8');
    console.log(`Created MDX file: ${lectureFile}`);
  }
});

console.log('Lectures content structure created successfully!');
