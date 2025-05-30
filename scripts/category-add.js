#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const feedPath = path.join(__dirname, '..', 'data', 'blog', 'feed.json');
const categoriesPath = path.join(__dirname, '..', 'data', 'blog', 'category-data.json');

// Default values for new categories
const DEFAULT_VALUES = {
  preview: "no preview currently",
  "show-status": "active",
  status: "In Progress",
  confidence: "medium",
  importance: 1
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

function addCategories() {
  try {
    console.log('📂 Adding categories from feed.json to category-data.json...\n');

    // Read feed.json
    const feedData = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
    const posts = feedData.posts || [];

    // Read existing category-data.json
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const existingCategories = categoriesData.categories || [];
    
    // Create a Set of existing category slugs for quick lookup
    const existingSlugs = new Set(existingCategories.map(cat => cat.slug));

    // Extract all unique categories from feed.json posts
    const allCategories = new Set();
    posts.forEach(post => {
      if (post.category && typeof post.category === 'string') {
        allCategories.add(post.category.trim());
      }
    });

    // Find new categories that don't exist in category-data.json
    const newCategories = [];
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    allCategories.forEach(categoryName => {
      const slug = slugify(categoryName);
      if (!existingSlugs.has(slug)) {
        newCategories.push({
          slug: slug,
          title: categoryName,
          preview: DEFAULT_VALUES.preview,
          date: currentDate,
          "show-status": DEFAULT_VALUES["show-status"],
          status: DEFAULT_VALUES.status,
          confidence: DEFAULT_VALUES.confidence,
          importance: DEFAULT_VALUES.importance
        });
      }
    });

    if (newCategories.length === 0) {
      console.log('✅ No new categories to add. All categories from feed.json already exist in category-data.json.');
      return;
    }

    // Add new categories to existing categories
    const updatedCategories = [...existingCategories, ...newCategories];
    
    // Sort categories by title alphabetically
    updatedCategories.sort((a, b) => a.title.localeCompare(b.title));

    // Write back to category-data.json
    const updatedCategoriesData = { categories: updatedCategories };
    fs.writeFileSync(categoriesPath, JSON.stringify(updatedCategoriesData, null, 2), 'utf8');

    console.log(`✅ Successfully added ${newCategories.length} new categor${newCategories.length === 1 ? 'y' : 'ies'}:`);
    newCategories.forEach(cat => {
      console.log(`   • ${cat.title} (${cat.slug})`);
    });
    console.log(`\n📊 Total categories in category-data.json: ${updatedCategories.length}`);

  } catch (error) {
    console.error('❌ Error adding categories:', error.message);
    process.exit(1);
  }
}

// Run the script
addCategories();
