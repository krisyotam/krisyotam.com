#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const feedPath = path.join(__dirname, '..', 'data', 'blog', 'feed.json');
const tagsPath = path.join(__dirname, '..', 'data', 'blog', 'tags.json');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

function cleanTags() {
  try {
    console.log('🧹 Cleaning unused tags from tags.json...\n');

    // Read feed.json
    const feedData = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
    const posts = feedData.posts || [];

    // Read existing tags.json
    const tagsData = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
    const existingTags = tagsData.tags || [];

    // Extract all tags currently used in feed.json
    const usedTags = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            usedTags.add(slugify(tag.trim()));
          }
        });
      }
    });

    // Find tags in tags.json that are NOT used in feed.json
    const unusedTags = existingTags.filter(tag => !usedTags.has(tag.slug));

    if (unusedTags.length === 0) {
      console.log('✅ No unused tags found. All tags in tags.json are being used in feed.json.');
      return;
    }

    console.log(`Found ${unusedTags.length} unused tag(s):\n`);
    unusedTags.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag.title} (${tag.slug})`);
    });

    console.log('\nWhich tags would you like to delete?');
    console.log('Enter numbers separated by commas (e.g., "1,3,5") or "all" to delete all:');

    // Read user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Your choice: ', (answer) => {
      try {
        let tagsToDelete = [];

        if (answer.toLowerCase().trim() === 'all') {
          tagsToDelete = unusedTags;
        } else if (answer.trim() === '') {
          console.log('❌ No selection made. Exiting without changes.');
          rl.close();
          return;
        } else {
          // Parse comma-separated numbers
          const indices = answer.split(',')
            .map(s => parseInt(s.trim()) - 1)
            .filter(i => i >= 0 && i < unusedTags.length);
          
          if (indices.length === 0) {
            console.log('❌ Invalid selection. Exiting without changes.');
            rl.close();
            return;
          }

          tagsToDelete = indices.map(i => unusedTags[i]);
        }

        // Remove selected tags
        const tagsToDeleteSlugs = new Set(tagsToDelete.map(tag => tag.slug));
        const updatedTags = existingTags.filter(tag => !tagsToDeleteSlugs.has(tag.slug));

        // Write back to tags.json
        const updatedTagsData = { tags: updatedTags };
        fs.writeFileSync(tagsPath, JSON.stringify(updatedTagsData, null, 2), 'utf8');

        console.log(`\n✅ Successfully deleted ${tagsToDelete.length} tag(s):`);
        tagsToDelete.forEach(tag => {
          console.log(`   • ${tag.title} (${tag.slug})`);
        });
        console.log(`\n📊 Remaining tags in tags.json: ${updatedTags.length}`);

      } catch (error) {
        console.error('❌ Error processing selection:', error.message);
      } finally {
        rl.close();
      }
    });

  } catch (error) {
    console.error('❌ Error cleaning tags:', error.message);
    process.exit(1);
  }
}

// Run the script
cleanTags();
