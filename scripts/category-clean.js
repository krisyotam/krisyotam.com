#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const feedPath = path.join(__dirname, '..', 'data', 'blog', 'feed.json');
const categoriesPath = path.join(__dirname, '..', 'data', 'blog', 'category-data.json');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

function cleanCategories() {
  try {
    console.log('🧹 Cleaning unused categories from category-data.json...\n');

    // Read feed.json
    const feedData = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
    const posts = feedData.posts || [];

    // Read existing category-data.json
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const existingCategories = categoriesData.categories || [];

    // Extract all categories currently used in feed.json
    const usedCategories = new Set();
    posts.forEach(post => {
      if (post.category && typeof post.category === 'string') {
        usedCategories.add(slugify(post.category.trim()));
      }
    });

    // Find categories in category-data.json that are NOT used in feed.json
    const unusedCategories = existingCategories.filter(cat => !usedCategories.has(cat.slug));

    if (unusedCategories.length === 0) {
      console.log('✅ No unused categories found. All categories in category-data.json are being used in feed.json.');
      return;
    }

    console.log(`Found ${unusedCategories.length} unused categor${unusedCategories.length === 1 ? 'y' : 'ies'}:\n`);
    unusedCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.title} (${cat.slug})`);
    });

    console.log('\nWhich categories would you like to delete?');
    console.log('Enter numbers separated by commas (e.g., "1,3,5") or "all" to delete all:');

    // Read user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Your choice: ', (answer) => {
      try {
        let categoriesToDelete = [];

        if (answer.toLowerCase().trim() === 'all') {
          categoriesToDelete = unusedCategories;
        } else if (answer.trim() === '') {
          console.log('❌ No selection made. Exiting without changes.');
          rl.close();
          return;
        } else {
          // Parse comma-separated numbers
          const indices = answer.split(',')
            .map(s => parseInt(s.trim()) - 1)
            .filter(i => i >= 0 && i < unusedCategories.length);
          
          if (indices.length === 0) {
            console.log('❌ Invalid selection. Exiting without changes.');
            rl.close();
            return;
          }

          categoriesToDelete = indices.map(i => unusedCategories[i]);
        }

        // Remove selected categories
        const categoriesToDeleteSlugs = new Set(categoriesToDelete.map(cat => cat.slug));
        const updatedCategories = existingCategories.filter(cat => !categoriesToDeleteSlugs.has(cat.slug));

        // Write back to category-data.json
        const updatedCategoriesData = { categories: updatedCategories };
        fs.writeFileSync(categoriesPath, JSON.stringify(updatedCategoriesData, null, 2), 'utf8');

        console.log(`\n✅ Successfully deleted ${categoriesToDelete.length} categor${categoriesToDelete.length === 1 ? 'y' : 'ies'}:`);
        categoriesToDelete.forEach(cat => {
          console.log(`   • ${cat.title} (${cat.slug})`);
        });
        console.log(`\n📊 Remaining categories in category-data.json: ${updatedCategories.length}`);

      } catch (error) {
        console.error('❌ Error processing selection:', error.message);
      } finally {
        rl.close();
      }
    });

  } catch (error) {
    console.error('❌ Error cleaning categories:', error.message);
    process.exit(1);
  }
}

// Run the script
cleanCategories();
