#!/usr/bin/env node
/**
 * find-duplicates.js
 *
 * Scans content JSON files for duplicates and inconsistencies.
 *
 * SCOPE: Only these content routes:
 *   blog, essays, fiction, news, newsletter, notes, ocs, papers, progymnasmata, reviews, verse
 *
 * BEHAVIOR:
 * 1. Within-file duplicates: Automatically FIXED by removing the later occurrence
 * 2. Cross-file duplicates: Reported in complications.md
 *
 * Output: .claude/projects/complications.md
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', '.claude', 'projects', 'complications.md');

// Only these content routes matter for content.db
const CONTENT_ROUTES = [
  'blog',
  'essays',
  'fiction',
  'news',
  'newsletter',
  'notes',
  'ocs',
  'papers',
  'progymnasmata',
  'reviews',
  'verse'
];

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

/**
 * Dedupe an array by slug, keeping the FIRST occurrence.
 * Returns { deduped: array, removed: array of removed items }
 */
function dedupeBySlug(items) {
  const seen = new Set();
  const deduped = [];
  const removed = [];

  for (const item of items) {
    if (!item.slug) {
      deduped.push(item);
      continue;
    }
    if (seen.has(item.slug)) {
      removed.push(item);
    } else {
      seen.add(item.slug);
      deduped.push(item);
    }
  }

  return { deduped, removed };
}

/**
 * Fix within-file duplicates for categories.json files
 */
function fixCategoriesFile(filePath) {
  const data = readJsonFile(filePath);
  if (!data || !data.categories) return { fixed: 0, removed: [] };

  const { deduped, removed } = dedupeBySlug(data.categories);

  if (removed.length > 0) {
    data.categories = deduped;
    writeJsonFile(filePath, data);
  }

  return { fixed: removed.length, removed };
}

/**
 * Fix within-file duplicates for tags.json files
 */
function fixTagsFile(filePath) {
  const data = readJsonFile(filePath);
  if (!data || !data.tags) return { fixed: 0, removed: [] };

  const { deduped, removed } = dedupeBySlug(data.tags);

  if (removed.length > 0) {
    data.tags = deduped;
    writeJsonFile(filePath, data);
  }

  return { fixed: removed.length, removed };
}

/**
 * Fix within-file duplicates for content type files (e.g., essays.json)
 */
function fixContentFile(filePath) {
  const data = readJsonFile(filePath);
  if (!data) return { fixed: 0, removed: [] };

  // Find the array key (essays, blog, notes, etc.)
  const key = Object.keys(data).find(k => Array.isArray(data[k]));
  if (!key) return { fixed: 0, removed: [] };

  const { deduped, removed } = dedupeBySlug(data[key]);

  if (removed.length > 0) {
    data[key] = deduped;
    writeJsonFile(filePath, data);
  }

  return { fixed: removed.length, removed };
}

/**
 * Find cross-file duplicate categories
 */
function findCrossFileCategoryDuplicates() {
  const slugToFiles = new Map(); // slug -> [{file, category}]

  for (const route of CONTENT_ROUTES) {
    const filePath = path.join(DATA_DIR, route, 'categories.json');
    if (!fs.existsSync(filePath)) continue;

    const data = readJsonFile(filePath);
    if (!data || !data.categories) continue;

    for (const cat of data.categories) {
      if (!cat.slug) continue;
      if (!slugToFiles.has(cat.slug)) {
        slugToFiles.set(cat.slug, []);
      }
      slugToFiles.get(cat.slug).push({
        file: `${route}/categories.json`,
        title: cat.title,
        preview: cat.preview?.substring(0, 80)
      });
    }
  }

  // Filter to only cross-file duplicates
  const duplicates = new Map();
  for (const [slug, locations] of slugToFiles) {
    if (locations.length > 1) {
      duplicates.set(slug, locations);
    }
  }

  return { duplicates, total: slugToFiles.size, fileCount: CONTENT_ROUTES.length };
}

/**
 * Find cross-file duplicate tags
 */
function findCrossFileTagDuplicates() {
  const slugToFiles = new Map();

  for (const route of CONTENT_ROUTES) {
    const filePath = path.join(DATA_DIR, route, 'tags.json');
    if (!fs.existsSync(filePath)) continue;

    const data = readJsonFile(filePath);
    if (!data || !data.tags) continue;

    for (const tag of data.tags) {
      if (!tag.slug) continue;
      if (!slugToFiles.has(tag.slug)) {
        slugToFiles.set(tag.slug, []);
      }
      slugToFiles.get(tag.slug).push({
        file: `${route}/tags.json`,
        title: tag.title,
        preview: tag.preview?.substring(0, 80)
      });
    }
  }

  // Filter to only cross-file duplicates
  const duplicates = new Map();
  for (const [slug, locations] of slugToFiles) {
    if (locations.length > 1) {
      duplicates.set(slug, locations);
    }
  }

  return { duplicates, total: slugToFiles.size, fileCount: CONTENT_ROUTES.length };
}

/**
 * Find cross-file duplicate content slugs
 */
function findCrossFileContentDuplicates() {
  const slugToFiles = new Map();

  for (const route of CONTENT_ROUTES) {
    const filePath = path.join(DATA_DIR, route, `${route}.json`);
    if (!fs.existsSync(filePath)) continue;

    const data = readJsonFile(filePath);
    if (!data) continue;

    const key = Object.keys(data).find(k => Array.isArray(data[k]));
    if (!key) continue;

    for (const item of data[key]) {
      if (!item.slug) continue;
      if (!slugToFiles.has(item.slug)) {
        slugToFiles.set(item.slug, []);
      }
      slugToFiles.get(item.slug).push({
        file: `${route}/${route}.json`,
        title: item.title,
        type: route
      });
    }
  }

  // Filter to only cross-file duplicates
  const duplicates = new Map();
  for (const [slug, locations] of slugToFiles) {
    if (locations.length > 1) {
      duplicates.set(slug, locations);
    }
  }

  return { duplicates, total: slugToFiles.size, fileCount: CONTENT_ROUTES.length };
}

/**
 * Find all inline tags used in content
 */
function findAllInlineTags() {
  const tagUsage = new Map();

  for (const route of CONTENT_ROUTES) {
    const filePath = path.join(DATA_DIR, route, `${route}.json`);
    if (!fs.existsSync(filePath)) continue;

    const data = readJsonFile(filePath);
    if (!data) continue;

    const key = Object.keys(data).find(k => Array.isArray(data[k]));
    if (!key) continue;

    for (const item of data[key]) {
      if (!item.tags || !Array.isArray(item.tags)) continue;

      for (const tag of item.tags) {
        const tagSlug = typeof tag === 'string'
          ? tag.toLowerCase().replace(/\s+/g, '-')
          : tag;
        if (!tagUsage.has(tagSlug)) {
          tagUsage.set(tagSlug, []);
        }
        tagUsage.get(tagSlug).push({
          file: `${route}/${route}.json`,
          contentSlug: item.slug,
          originalTag: tag
        });
      }
    }
  }

  return tagUsage;
}

/**
 * Find all inline categories used in content
 */
function findAllInlineCategories() {
  const categoryUsage = new Map();

  for (const route of CONTENT_ROUTES) {
    const filePath = path.join(DATA_DIR, route, `${route}.json`);
    if (!fs.existsSync(filePath)) continue;

    const data = readJsonFile(filePath);
    if (!data) continue;

    const key = Object.keys(data).find(k => Array.isArray(data[k]));
    if (!key) continue;

    for (const item of data[key]) {
      if (!item.category) continue;

      const catSlug = item.category.toLowerCase().replace(/\s+/g, '-');
      if (!categoryUsage.has(catSlug)) {
        categoryUsage.set(catSlug, []);
      }
      categoryUsage.get(catSlug).push({
        file: `${route}/${route}.json`,
        contentSlug: item.slug,
        originalCategory: item.category
      });
    }
  }

  return categoryUsage;
}

/**
 * Find undefined tags/categories
 */
function findMismatches() {
  const definedTags = new Set();
  const definedCategories = new Set();

  for (const route of CONTENT_ROUTES) {
    const tagsPath = path.join(DATA_DIR, route, 'tags.json');
    const catsPath = path.join(DATA_DIR, route, 'categories.json');

    const tagsData = readJsonFile(tagsPath);
    if (tagsData?.tags) {
      tagsData.tags.forEach(t => definedTags.add(t.slug));
    }

    const catsData = readJsonFile(catsPath);
    if (catsData?.categories) {
      catsData.categories.forEach(c => definedCategories.add(c.slug));
    }
  }

  const inlineTags = findAllInlineTags();
  const inlineCategories = findAllInlineCategories();

  // Find tags used but not defined
  const undefinedTags = [];
  for (const [tag, usages] of inlineTags) {
    if (!definedTags.has(tag)) {
      undefinedTags.push({ tag, usageCount: usages.length, examples: usages.slice(0, 3) });
    }
  }

  // Find categories used but not defined
  const undefinedCategories = [];
  for (const [cat, usages] of inlineCategories) {
    if (!definedCategories.has(cat)) {
      undefinedCategories.push({ category: cat, usageCount: usages.length, examples: usages.slice(0, 3) });
    }
  }

  return { undefinedTags, undefinedCategories, definedTags: definedTags.size, definedCategories: definedCategories.size };
}

/**
 * Fix all within-file duplicates
 */
function fixWithinFileDuplicates() {
  const fixes = {
    categories: [],
    tags: [],
    content: []
  };

  for (const route of CONTENT_ROUTES) {
    // Fix categories
    const catsPath = path.join(DATA_DIR, route, 'categories.json');
    if (fs.existsSync(catsPath)) {
      const result = fixCategoriesFile(catsPath);
      if (result.fixed > 0) {
        fixes.categories.push({
          file: `${route}/categories.json`,
          removed: result.removed.map(r => r.slug)
        });
      }
    }

    // Fix tags
    const tagsPath = path.join(DATA_DIR, route, 'tags.json');
    if (fs.existsSync(tagsPath)) {
      const result = fixTagsFile(tagsPath);
      if (result.fixed > 0) {
        fixes.tags.push({
          file: `${route}/tags.json`,
          removed: result.removed.map(r => r.slug)
        });
      }
    }

    // Fix content
    const contentPath = path.join(DATA_DIR, route, `${route}.json`);
    if (fs.existsSync(contentPath)) {
      const result = fixContentFile(contentPath);
      if (result.fixed > 0) {
        fixes.content.push({
          file: `${route}/${route}.json`,
          removed: result.removed.map(r => r.slug)
        });
      }
    }
  }

  return fixes;
}

/**
 * Generate markdown report
 */
function generateReport() {
  // First, fix within-file duplicates
  const fixes = fixWithinFileDuplicates();

  // Then find cross-file duplicates
  const catDups = findCrossFileCategoryDuplicates();
  const tagDups = findCrossFileTagDuplicates();
  const contentDups = findCrossFileContentDuplicates();
  const mismatches = findMismatches();

  let md = `# Data Consolidation Complications Report

Generated: ${new Date().toISOString()}

## Scope

Only these content routes are analyzed:
\`\`\`
${CONTENT_ROUTES.join(', ')}
\`\`\`

---

## Within-File Duplicates (Auto-Fixed)

`;

  const totalFixes = fixes.categories.length + fixes.tags.length + fixes.content.length;

  if (totalFixes === 0) {
    md += `*No within-file duplicates found.*\n\n`;
  } else {
    md += `The following duplicates were automatically removed (kept first occurrence):\n\n`;

    if (fixes.categories.length > 0) {
      md += `### Categories Fixed\n\n`;
      for (const fix of fixes.categories) {
        md += `- **${fix.file}**: removed \`${fix.removed.join('`, `')}\`\n`;
      }
      md += `\n`;
    }

    if (fixes.tags.length > 0) {
      md += `### Tags Fixed\n\n`;
      for (const fix of fixes.tags) {
        md += `- **${fix.file}**: removed \`${fix.removed.join('`, `')}\`\n`;
      }
      md += `\n`;
    }

    if (fixes.content.length > 0) {
      md += `### Content Fixed\n\n`;
      for (const fix of fixes.content) {
        md += `- **${fix.file}**: removed \`${fix.removed.join('`, `')}\`\n`;
      }
      md += `\n`;
    }
  }

  md += `---

## Summary (Cross-File Issues)

| Metric | Count |
|--------|-------|
| Content routes analyzed | ${CONTENT_ROUTES.length} |
| Unique category slugs | ${catDups.total} |
| **Cross-file duplicate categories** | ${catDups.duplicates.size} |
| Unique tag slugs | ${tagDups.total} |
| **Cross-file duplicate tags** | ${tagDups.duplicates.size} |
| Unique content slugs | ${contentDups.total} |
| **Cross-file duplicate content** | ${contentDups.duplicates.size} |
| Defined tag slugs | ${mismatches.definedTags} |
| Defined category slugs | ${mismatches.definedCategories} |
| Tags used but not defined | ${mismatches.undefinedTags.length} |
| Categories used but not defined | ${mismatches.undefinedCategories.length} |

---

## 1. Cross-File Duplicate Category Slugs

These category slugs appear in multiple categories.json files:

`;

  if (catDups.duplicates.size === 0) {
    md += `*No cross-file duplicate category slugs found.*\n\n`;
  } else {
    for (const [slug, locations] of catDups.duplicates) {
      md += `### \`${slug}\`\n\n`;
      md += `| File | Title | Preview |\n`;
      md += `|------|-------|--------|\n`;
      for (const loc of locations) {
        md += `| ${loc.file} | ${loc.title || '-'} | ${loc.preview || '-'} |\n`;
      }
      md += `\n`;
    }
  }

  md += `---

## 2. Cross-File Duplicate Tag Slugs

These tag slugs appear in multiple tags.json files:

`;

  if (tagDups.duplicates.size === 0) {
    md += `*No cross-file duplicate tag slugs found.*\n\n`;
  } else {
    for (const [slug, locations] of tagDups.duplicates) {
      md += `### \`${slug}\`\n\n`;
      md += `| File | Title | Preview |\n`;
      md += `|------|-------|--------|\n`;
      for (const loc of locations) {
        md += `| ${loc.file} | ${loc.title || '-'} | ${loc.preview || '-'} |\n`;
      }
      md += `\n`;
    }
  }

  md += `---

## 3. Cross-File Duplicate Content Slugs

These content slugs appear in multiple content type files:

`;

  if (contentDups.duplicates.size === 0) {
    md += `*No cross-file duplicate content slugs found.*\n\n`;
  } else {
    for (const [slug, locations] of contentDups.duplicates) {
      md += `### \`${slug}\`\n\n`;
      md += `| File | Type | Title |\n`;
      md += `|------|------|-------|\n`;
      for (const loc of locations) {
        md += `| ${loc.file} | ${loc.type} | ${loc.title || '-'} |\n`;
      }
      md += `\n`;
    }
  }

  md += `---

## 4. Undefined Tags (Used in Content but Not in tags.json)

`;

  if (mismatches.undefinedTags.length === 0) {
    md += `*All tags are properly defined.*\n\n`;
  } else {
    md += `| Tag | Usage Count | Example Files |\n`;
    md += `|-----|-------------|---------------|\n`;
    for (const item of mismatches.undefinedTags.sort((a, b) => b.usageCount - a.usageCount)) {
      const examples = item.examples.map(e => e.file).join(', ');
      md += `| ${item.tag} | ${item.usageCount} | ${examples} |\n`;
    }
    md += `\n`;
  }

  md += `---

## 5. Undefined Categories (Used in Content but Not in categories.json)

`;

  if (mismatches.undefinedCategories.length === 0) {
    md += `*All categories are properly defined.*\n\n`;
  } else {
    md += `| Category | Usage Count | Example Files |\n`;
    md += `|----------|-------------|---------------|\n`;
    for (const item of mismatches.undefinedCategories.sort((a, b) => b.usageCount - a.usageCount)) {
      const examples = item.examples.map(e => e.file).join(', ');
      md += `| ${item.category} | ${item.usageCount} | ${examples} |\n`;
    }
    md += `\n`;
  }

  md += `---

## Resolution Required

### For Cross-File Duplicate Categories
Choose one canonical definition per slug. Options:
1. Keep the most complete definition (longest preview, has importance)
2. Merge into a new universal categories table

### For Cross-File Duplicate Tags
Choose one canonical definition per slug.

### For Duplicate Content Slugs
**MUST be resolved before consolidation.**
Options: prefix with type (e.g., \`essay-slug\`), or rename one.

### For Undefined Tags/Categories
Create definitions in the universal tables, or correct typos in content files.
`;

  return md;
}

// Main
console.log('Scanning content routes:', CONTENT_ROUTES.join(', '));
console.log('');

const report = generateReport();
fs.writeFileSync(OUTPUT_FILE, report);

console.log(`Report written to: ${OUTPUT_FILE}`);
console.log('');
console.log(report);
