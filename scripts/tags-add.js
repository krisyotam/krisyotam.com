#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const feedPath = path.join(process.cwd(), "data", "essays", "feed.json");
const tagsPath = path.join(__dirname, '..', 'data', 'blog', 'tags.json');

// Default values for new tags
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

function addTags() {
  try {
    console.log('🏷️  Adding tags from feed.json to tags.json...\n');

    // Read feed.json
    const feedData = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
    const posts = feedData.posts || [];

    // Read existing tags.json
    const tagsData = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
    const existingTags = tagsData.tags || [];
    
    // Create a Set of existing tag slugs for quick lookup
    const existingSlugs = new Set(existingTags.map(tag => tag.slug));

    // Extract all unique tags from feed.json posts
    const allTags = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allTags.add(tag.trim());
          }
        });
      }
    });

    // Find new tags that don't exist in tags.json
    const newTags = [];
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    allTags.forEach(tagName => {
      const slug = slugify(tagName);
      if (!existingSlugs.has(slug)) {
        newTags.push({
          slug: slug,
          title: tagName,
          preview: DEFAULT_VALUES.preview,
          date: currentDate,
          "show-status": DEFAULT_VALUES["show-status"],
          status: DEFAULT_VALUES.status,
          confidence: DEFAULT_VALUES.confidence,
          importance: DEFAULT_VALUES.importance
        });
      }
    });

    if (newTags.length === 0) {
      console.log('✅ No new tags to add. All tags from feed.json already exist in tags.json.');
      return;
    }

    // Add new tags to existing tags
    const updatedTags = [...existingTags, ...newTags];
    
    // Sort tags by title alphabetically
    updatedTags.sort((a, b) => a.title.localeCompare(b.title));

    // Write back to tags.json
    const updatedTagsData = { tags: updatedTags };
    fs.writeFileSync(tagsPath, JSON.stringify(updatedTagsData, null, 2), 'utf8');

    console.log(`✅ Successfully added ${newTags.length} new tag(s):`);
    newTags.forEach(tag => {
      console.log(`   • ${tag.title} (${tag.slug})`);
    });
    console.log(`\n📊 Total tags in tags.json: ${updatedTags.length}`);

  } catch (error) {
    console.error('❌ Error adding tags:', error.message);
    process.exit(1);
  }
}

// Run the script
addTags();
