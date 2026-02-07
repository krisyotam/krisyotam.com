#!/usr/bin/env node
/**
 * ============================================================================
 * Blog Update - Are.na Collection Importer
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-02-06
 *
 * This script imports blogs from Are.na collections into the blogroll:
 * 1. Fetches blocks from an Are.na channel via API
 * 2. Deduplicates against existing URLs in the database
 * 3. Calls Claude CLI to fix bad titles and generate tags
 * 4. Inserts new entries into blogroll and blogroll_tags tables
 *
 * Collections (presets):
 *   blogs      - General blogs (blogroll-aw3ezr1hagw)
 *   substack   - Substack newsletters (substack-bmx6bd3sawi)
 *   lesswrong  - LessWrong authors (lesswrong-apjvyb-zyqu)
 *
 * Usage:
 *   node public/scripts/keep/blogUpdate.js <collection> [options]
 *
 * Examples:
 *   node public/scripts/keep/blogUpdate.js blogs
 *   node public/scripts/keep/blogUpdate.js substack
 *   node public/scripts/keep/blogUpdate.js lesswrong
 *   node public/scripts/keep/blogUpdate.js --all
 *   node public/scripts/keep/blogUpdate.js blogs --dry-run --verbose
 *
 * Options:
 *   --all          Process all three collections (blogs, substack, lesswrong)
 *   --verbose      Show detailed output
 *   --dry-run      Don't update database, just show what would be added
 *   --platform P   Force platform for all entries (lesswrong, substack)
 *   --limit N      Only process first N new entries per collection
 *   --skip-claude  Skip Claude processing (use raw Are.na titles)
 *
 * @type script
 * @path public/scripts/keep/blogUpdate.js
 * ============================================================================
 */

const Database = require("better-sqlite3");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

// ============================================================================
// Configuration
// ============================================================================

const DB_PATH = path.join(process.cwd(), "public", "data", "system.db");
const ARENA_API_BASE = "https://api.are.na/v2";
const REQUEST_TIMEOUT = 30000;
const CLAUDE_TIMEOUT = 120000; // 2 minutes per batch

// Are.na collection presets
const COLLECTIONS = {
  blogs: {
    slug: "blogroll-aw3ezr1hagw",
    platform: null,
    description: "General blogs",
  },
  substack: {
    slug: "substack-bmx6bd3sawi",
    platform: "substack",
    description: "Substack newsletters",
  },
  lesswrong: {
    slug: "lesswrong-apjvyb-zyqu",
    platform: "lesswrong",
    description: "LessWrong authors",
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
const channelArg = args.find(a => !a.startsWith("--"));
const VERBOSE = args.includes("--verbose");
const DRY_RUN = args.includes("--dry-run");
const SKIP_CLAUDE = args.includes("--skip-claude");
const ALL_MODE = args.includes("--all");
const platformIndex = args.indexOf("--platform");
const FORCED_PLATFORM = platformIndex !== -1 ? args[platformIndex + 1] : null;
const limitIndex = args.indexOf("--limit");
const LIMIT = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : null;

// Resolve channel argument to slug and platform
let channelSlug = null;
let channelPlatform = FORCED_PLATFORM;

if (channelArg && COLLECTIONS[channelArg]) {
  // Using a preset name
  const preset = COLLECTIONS[channelArg];
  channelSlug = preset.slug;
  channelPlatform = FORCED_PLATFORM || preset.platform;
  console.log(`Using preset: ${channelArg} (${preset.description})`);
} else if (channelArg) {
  // Using a raw slug
  channelSlug = channelArg;
}

if (!channelSlug && !ALL_MODE) {
  console.error("Usage: node blogUpdate.js <collection> [options]");
  console.error("\nCollections (presets):");
  console.error("  blogs          General blogs (blogroll-aw3ezr1hagw)");
  console.error("  substack       Substack newsletters (substack-bmx6bd3sawi)");
  console.error("  lesswrong      LessWrong authors (lesswrong-apjvyb-zyqu)");
  console.error("\nOr provide a raw Are.na channel slug.");
  console.error("\nOptions:");
  console.error("  --all          Process all three collections");
  console.error("  --verbose      Show detailed output");
  console.error("  --dry-run      Don't update database");
  console.error("  --platform P   Force platform (lesswrong, substack)");
  console.error("  --limit N      Only process first N new entries");
  console.error("  --skip-claude  Skip Claude processing");
  console.error("\nExamples:");
  console.error("  node blogUpdate.js blogs");
  console.error("  node blogUpdate.js substack --dry-run");
  console.error("  node blogUpdate.js --all");
  process.exit(1);
}

// ============================================================================
// Utilities
// ============================================================================

function log(...args) {
  if (VERBOSE) console.log(...args);
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: REQUEST_TIMEOUT }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Invalid JSON response"));
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Generate a slug from a title
 */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

/**
 * Detect platform from URL
 */
function detectPlatform(url, forcedPlatform = null) {
  if (forcedPlatform) return forcedPlatform;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // LessWrong
    if (hostname === "www.lesswrong.com" || hostname === "lesswrong.com") {
      return "lesswrong";
    }

    // Substack - check for substack.com domain or common pattern
    if (hostname.endsWith(".substack.com") || hostname === "substack.com") {
      return "substack";
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract username from Substack URL
 * Handles: substack.com/@username, substack.com/@username/posts, username.substack.com
 */
function extractSubstackUsername(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Profile URL: substack.com/@username or substack.com/@username/posts
    if (hostname === "substack.com" || hostname === "www.substack.com") {
      const match = urlObj.pathname.match(/^\/@([^\/\?]+)/);
      if (match) return match[1].toLowerCase();
    }

    // Publication URL: username.substack.com
    if (hostname.endsWith(".substack.com")) {
      const subdomain = hostname.replace(".substack.com", "");
      if (subdomain && subdomain !== "www") return subdomain.toLowerCase();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract username from LessWrong URL
 * Handles: lesswrong.com/users/username
 */
function extractLessWrongUsername(url) {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/users\/([^\/\?]+)/);
    if (match) return match[1];
    return null;
  } catch {
    return null;
  }
}

/**
 * Derive Substack publication URL from username
 * Returns: https://username.substack.com
 */
function deriveSubstackPublicationUrl(username) {
  if (!username) return null;
  return `https://${username}.substack.com`;
}

/**
 * Normalize Substack URL to profile format
 * Converts username.substack.com to substack.com/@username
 */
function normalizeSubstackUrl(url) {
  const username = extractSubstackUsername(url);
  if (!username) return url;
  return `https://substack.com/@${username}`;
}

/**
 * Normalize LessWrong URL to standard format
 */
function normalizeLessWrongUrl(url) {
  const username = extractLessWrongUsername(url);
  if (!username) return url;
  return `https://www.lesswrong.com/users/${username}`;
}

/**
 * Check if a title looks like a bare URL/domain
 */
function isBadTitle(title) {
  if (!title) return true;

  const trimmed = title.trim().toLowerCase();

  // Looks like a domain
  if (/^[a-z0-9-]+\.(com|net|org|io|me|co|dev|blog|xyz|info|tech|world|page|site)$/i.test(trimmed)) {
    return true;
  }

  // Looks like a URL
  if (/^https?:\/\//i.test(trimmed)) {
    return true;
  }

  // Just "www.something"
  if (/^www\./i.test(trimmed)) {
    return true;
  }

  return false;
}

// ============================================================================
// Are.na API
// ============================================================================

/**
 * Fetch all blocks from an Are.na channel (handles pagination)
 */
async function fetchArenaChannel(slug) {
  const blocks = [];
  let page = 1;
  const perPage = 100;

  console.log(`Fetching Are.na channel: ${slug}`);

  while (true) {
    const url = `${ARENA_API_BASE}/channels/${slug}/contents?page=${page}&per=${perPage}`;
    log(`  Fetching page ${page}...`);

    const data = await fetchJson(url);

    if (!data.contents || data.contents.length === 0) {
      break;
    }

    // Filter to only link blocks with URLs
    const linkBlocks = data.contents.filter(block =>
      block.class === "Link" && block.source && block.source.url
    );

    blocks.push(...linkBlocks);

    if (data.contents.length < perPage) {
      break;
    }

    page++;
  }

  console.log(`  Found ${blocks.length} link blocks`);
  return blocks;
}

// ============================================================================
// Claude Integration
// ============================================================================

/**
 * Build the prompt for Claude to process blogs
 */
function buildClaudePrompt(entries) {
  const entriesJson = JSON.stringify(entries, null, 2);

  return `You are processing a list of blogs for a blogroll database. For each entry, you need to:

1. **Fix the title** based on platform:

   **For Substack (platform: "substack"):**
   - Title MUST be the author's real name (not the publication name)
   - Example: "Matt Lakeman" not "Matt Lakeman's Blog" or "mattlakeman"
   - Look up the author name if the title is bad

   **For LessWrong (platform: "lesswrong"):**
   - Title should be the author's display name
   - Example: "Eliezer Yudkowsky" not "eliezer_yudkowsky"

   **For regular blogs (platform: null):**
   - BAD: "telemachus.me" → Find the actual blog name or author name
   - BAD: "zanneth.com" → Find the author's real name
   - BAD: "danluu.com" → Should be "Dan Luu"
   - GOOD: "Something Something Programming" → Keep as-is
   - GOOD: "Denny's Blog" → Keep as-is
   - GOOD: "Ralph Ammer" → Keep as-is
   - GOOD: "Shtetl-Optimized" → Keep as-is

2. **Generate exactly 3 tags** that describe the blog's primary topics:
   - Use lowercase, hyphenated tags (e.g., "computer-science", "web-development")
   - Be specific but not too niche (prefer "mathematics" over "algebraic-topology")
   - Common tags: programming, mathematics, philosophy, ai-ml, security, economics, writing, science, engineering, rationality, personal, culture, politics, finance, startups, design, literature

3. **Keep the platform** as provided (already detected).

Here are the entries to process:

${entriesJson}

Respond with ONLY a JSON array (no markdown, no explanation) in this exact format:
[
  {
    "url": "original url unchanged",
    "title": "fixed or original title",
    "tags": ["tag1", "tag2", "tag3"],
    "platform": "keep as provided"
  }
]`;
}

/**
 * Call Claude CLI to process entries
 */
function callClaude(entries) {
  const prompt = buildClaudePrompt(entries);

  log("Calling Claude CLI...");

  try {
    // Use claude CLI in print mode with JSON output, passing prompt via stdin
    const result = execSync(
      `claude -p --output-format json`,
      {
        input: prompt,
        encoding: "utf-8",
        timeout: CLAUDE_TIMEOUT,
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    // Parse the JSON output - Claude returns { result: "..." }
    const claudeResponse = JSON.parse(result);
    const content = claudeResponse.result || claudeResponse;

    // Extract JSON array from response (in case there's any wrapper text)
    const jsonMatch = typeof content === "string"
      ? content.match(/\[[\s\S]*\]/)
      : null;

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else if (Array.isArray(content)) {
      return content;
    }

    throw new Error("Could not parse Claude response as JSON array");
  } catch (error) {
    console.error("Claude CLI error:", error.message);
    return null;
  }
}

/**
 * Process entries with Claude (or skip if --skip-claude)
 */
function processWithClaude(entries) {
  if (SKIP_CLAUDE) {
    // Return entries with default processing, preserving all fields
    return entries.map(e => ({
      url: e.url,
      title: e.title,
      tags: ["blog", "personal", "writing"], // Default tags
      platform: e.platform,
      username: e.username,
      publication_url: e.publication_url,
    }));
  }

  // Process in batches of 10 to avoid timeout
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)} with Claude...`);

    const batchResults = callClaude(batch);

    if (batchResults) {
      // Merge Claude results with original entry data (username, publication_url, etc.)
      batchResults.forEach((result, idx) => {
        const original = batch[idx];
        // Preserve platform from collection if Claude didn't detect it
        if (!result.platform && original.platform) {
          result.platform = original.platform;
        }
        // Always preserve username and publication_url from original extraction
        result.username = original.username;
        result.publication_url = original.publication_url;
      });
      results.push(...batchResults);
    } else {
      // Fallback: use original entries with default tags
      console.warn("  Claude failed, using defaults for this batch");
      batch.forEach(e => {
        results.push({
          url: e.url,
          title: e.title,
          tags: ["blog", "personal", "writing"],
          platform: e.platform,
          username: e.username,
          publication_url: e.publication_url,
        });
      });
    }
  }

  return results;
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Get existing URLs from blogroll
 */
function getExistingUrls(db) {
  const rows = db.prepare("SELECT url FROM blogroll").all();
  return new Set(rows.map(r => r.url.toLowerCase().replace(/\/+$/, "")));
}

/**
 * Normalize URL for comparison
 */
function normalizeUrl(url) {
  return url.toLowerCase().replace(/\/+$/, "");
}

/**
 * Generate unique slug
 */
function generateUniqueSlug(db, baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (db.prepare("SELECT 1 FROM blogroll WHERE slug = ?").get(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Insert a blog entry and its tags
 */
function insertBlog(db, entry) {
  const slug = generateUniqueSlug(db, slugify(entry.title));
  const now = new Date().toISOString().split("T")[0];

  const insertBlogStmt = db.prepare(`
    INSERT INTO blogroll (title, url, slug, platform, username, publication_url, status, publish_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'published', ?, CURRENT_TIMESTAMP)
  `);

  const result = insertBlogStmt.run(
    entry.title,
    entry.url,
    slug,
    entry.platform,
    entry.username || null,
    entry.publication_url || null,
    now
  );

  const blogId = result.lastInsertRowid;

  // Insert tags
  const insertTagStmt = db.prepare(`
    INSERT OR IGNORE INTO blogroll_tags (blogroll_id, tag)
    VALUES (?, ?)
  `);

  for (const tag of entry.tags) {
    insertTagStmt.run(blogId, tag.toLowerCase());
  }

  return { id: blogId, slug };
}

// ============================================================================
// Main
// ============================================================================

/**
 * Process a single collection
 */
async function processCollection(db, slug, platform, existingUrls) {
  console.log("\n" + "-".repeat(60));
  console.log(`Processing: ${slug}`);
  if (platform) console.log(`Platform: ${platform}`);
  console.log("-".repeat(60));

  // Fetch Are.na channel
  let blocks;
  try {
    blocks = await fetchArenaChannel(slug);
  } catch (error) {
    console.error(`Failed to fetch Are.na channel: ${error.message}`);
    return { fetched: 0, duplicates: 0, processed: 0, inserted: 0, errors: 0 };
  }

  if (blocks.length === 0) {
    console.log("No link blocks found in channel");
    return { fetched: 0, duplicates: 0, processed: 0, inserted: 0, errors: 0 };
  }

  // Filter out duplicates
  const newBlocks = blocks.filter(block => {
    const normalized = normalizeUrl(block.source.url);
    return !existingUrls.has(normalized);
  });

  const duplicates = blocks.length - newBlocks.length;
  console.log(`Found ${blocks.length} blocks, ${duplicates} already in database`);
  console.log(`New blogs to process: ${newBlocks.length}`);

  if (newBlocks.length === 0) {
    return { fetched: blocks.length, duplicates, processed: 0, inserted: 0, errors: 0 };
  }

  // Apply limit if specified
  const toProcess = LIMIT ? newBlocks.slice(0, LIMIT) : newBlocks;

  if (LIMIT && newBlocks.length > LIMIT) {
    console.log(`Limited to first ${LIMIT} entries`);
  }

  // Prepare entries for Claude with platform-specific data extraction
  const entries = toProcess.map(block => {
    const rawUrl = block.source.url;
    const detectedPlatform = detectPlatform(rawUrl, platform);

    let url = rawUrl;
    let username = null;
    let publication_url = null;

    if (detectedPlatform === "substack") {
      username = extractSubstackUsername(rawUrl);
      url = normalizeSubstackUrl(rawUrl); // Normalize to substack.com/@username
      publication_url = deriveSubstackPublicationUrl(username);
      log(`  Substack: @${username} → ${publication_url}`);
    } else if (detectedPlatform === "lesswrong") {
      username = extractLessWrongUsername(rawUrl);
      url = normalizeLessWrongUrl(rawUrl);
      log(`  LessWrong: ${username}`);
    }

    return {
      url,
      title: block.title || block.source.title || "",
      platform: detectedPlatform,
      username,
      publication_url,
    };
  });

  // Identify entries that need title fixing
  const needsFixing = entries.filter(e => isBadTitle(e.title));
  if (needsFixing.length > 0) {
    console.log(`${needsFixing.length} entries have bad titles that need fixing`);
  }

  // Process with Claude
  const processed = processWithClaude(entries);

  // Insert into database
  let inserted = 0;
  let errors = 0;

  for (const entry of processed) {
    // Add to existingUrls to prevent duplicates across collections in --all mode
    existingUrls.add(normalizeUrl(entry.url));

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would insert: ${entry.title}`);
      console.log(`  URL: ${entry.url}`);
      console.log(`  Tags: ${entry.tags.join(", ")}`);
      console.log(`  Platform: ${entry.platform || "none"}`);
      if (entry.username) console.log(`  Username: ${entry.username}`);
      if (entry.publication_url) console.log(`  Publication URL: ${entry.publication_url}`);
      inserted++;
      continue;
    }

    try {
      const result = insertBlog(db, entry);
      console.log(`Inserted: ${entry.title} (${result.slug})`);
      log(`  Tags: ${entry.tags.join(", ")}`);
      inserted++;
    } catch (error) {
      console.error(`Failed to insert ${entry.title}: ${error.message}`);
      errors++;
    }
  }

  return { fetched: blocks.length, duplicates, processed: processed.length, inserted, errors };
}

async function main() {
  console.log("=".repeat(60));
  console.log("Blog Update - Are.na Importer");
  console.log("=".repeat(60));

  if (DRY_RUN) {
    console.log("DRY RUN MODE - No database changes will be made");
  }

  // Open database
  const db = new Database(DB_PATH);

  try {
    // Get existing URLs for deduplication
    const existingUrls = getExistingUrls(db);
    console.log(`Found ${existingUrls.size} existing blogs in database`);

    // Determine which collections to process
    const collectionsToProcess = ALL_MODE
      ? Object.entries(COLLECTIONS).map(([name, config]) => ({
          name,
          slug: config.slug,
          platform: config.platform,
        }))
      : [{ name: channelArg || channelSlug, slug: channelSlug, platform: channelPlatform }];

    // Process each collection
    const totals = { fetched: 0, duplicates: 0, processed: 0, inserted: 0, errors: 0 };

    for (const collection of collectionsToProcess) {
      const result = await processCollection(db, collection.slug, collection.platform, existingUrls);
      totals.fetched += result.fetched;
      totals.duplicates += result.duplicates;
      totals.processed += result.processed;
      totals.inserted += result.inserted;
      totals.errors += result.errors;
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("Summary");
    console.log("=".repeat(60));
    if (ALL_MODE) {
      console.log(`Collections processed: ${collectionsToProcess.length}`);
    }
    console.log(`Total Are.na blocks fetched: ${totals.fetched}`);
    console.log(`Already in database: ${totals.duplicates}`);
    console.log(`New entries processed: ${totals.processed}`);
    console.log(`Successfully inserted: ${totals.inserted}`);
    if (totals.errors > 0) {
      console.log(`Errors: ${totals.errors}`);
    }

  } finally {
    db.close();
  }

  console.log("\nDone!");
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
