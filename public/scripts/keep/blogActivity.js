#!/usr/bin/env node
/**
 * ============================================================================
 * Blog Activity Checker
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-02-05
 *
 * This script checks the activity of blogs in the blogroll by:
 * 1. Fetching their RSS feeds (if available)
 * 2. Parsing to find the latest post date
 * 3. Falling back to HTML scraping for sites without RSS
 * 4. Updating the database with activity information
 *
 * Usage:
 *   node public/scripts/keep/blogActivity.js [options]
 *
 * Options:
 *   --verbose    Show detailed output
 *   --dry-run    Don't update database, just show what would be updated
 *   --limit N    Only process first N blogs (for testing)
 *
 * @type script
 * @path public/scripts/keep/blogActivity.js
 * ============================================================================
 */

const Database = require("better-sqlite3");
const path = require("path");
const https = require("https");
const http = require("http");

// ============================================================================
// Configuration
// ============================================================================

const DB_PATH = path.join(process.cwd(), "public", "data", "system.db");
const REQUEST_TIMEOUT = 15000; // 15 seconds
const DELAY_BETWEEN_REQUESTS = 500; // 500ms between requests to be polite

// Parse command line arguments
const args = process.argv.slice(2);
const VERBOSE = args.includes("--verbose");
const DRY_RUN = args.includes("--dry-run");
const limitIndex = args.indexOf("--limit");
const LIMIT = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : null;

// ============================================================================
// Utilities
// ============================================================================

function log(...args) {
  if (VERBOSE) console.log(...args);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make an HTTP(S) request with timeout and redirect following
 */
function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) {
      reject(new Error("Too many redirects"));
      return;
    }

    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { timeout: REQUEST_TIMEOUT }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        // Handle relative redirects
        if (!redirectUrl.startsWith("http")) {
          const urlObj = new URL(url);
          redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
        }
        fetchUrl(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}

/**
 * Parse a date string from various formats
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  // Try various date formats
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  return null;
}

/**
 * Extract the latest post date from RSS/Atom XML
 */
function extractLatestFromRss(xml) {
  let latestDate = null;
  let latestTitle = null;

  // Try to find <pubDate> (RSS 2.0)
  const pubDateMatches = xml.match(/<pubDate>([^<]+)<\/pubDate>/gi);
  if (pubDateMatches && pubDateMatches.length > 0) {
    for (const match of pubDateMatches) {
      const dateStr = match.replace(/<\/?pubDate>/gi, "");
      const parsed = parseDate(dateStr);
      if (parsed && (!latestDate || parsed > latestDate)) {
        latestDate = parsed;
      }
    }
  }

  // Try to find <updated> or <published> (Atom)
  const atomDateMatches = xml.match(/<(?:updated|published)>([^<]+)<\/(?:updated|published)>/gi);
  if (atomDateMatches && atomDateMatches.length > 0) {
    for (const match of atomDateMatches) {
      const dateStr = match.replace(/<\/?(?:updated|published)>/gi, "");
      const parsed = parseDate(dateStr);
      if (parsed && (!latestDate || parsed > latestDate)) {
        latestDate = parsed;
      }
    }
  }

  // Try to find <dc:date>
  const dcDateMatches = xml.match(/<dc:date>([^<]+)<\/dc:date>/gi);
  if (dcDateMatches && dcDateMatches.length > 0) {
    for (const match of dcDateMatches) {
      const dateStr = match.replace(/<\/?dc:date>/gi, "");
      const parsed = parseDate(dateStr);
      if (parsed && (!latestDate || parsed > latestDate)) {
        latestDate = parsed;
      }
    }
  }

  // Extract title of the first item
  const titleMatch = xml.match(/<item[^>]*>[\s\S]*?<title>([^<]+)<\/title>/i) ||
                     xml.match(/<entry[^>]*>[\s\S]*?<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    latestTitle = titleMatch[1]
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .trim()
      .substring(0, 255);
  }

  return { date: latestDate, title: latestTitle };
}

// ============================================================================
// Platform Handlers - Auto-derive RSS and fetch activity for known platforms
// ============================================================================

/**
 * Platform-specific handlers for sites like Substack, LessWrong, etc.
 * Each handler can auto-derive RSS URLs and fetch activity data.
 * Returns { date, title, rss } where rss is the derived feed URL.
 */
const PLATFORM_HANDLERS = {
  /*y
  y
  ;
  u
  9*
   * Substack - All substacks use /feed for RSS
   * Works with both substack.com subdomains and custom domains
   */
  substack: async (blog) => {
    try {
      // Derive RSS URL: just append /feed to the base URL
      let baseUrl = blog.url.replace(/\/+$/, ""); // Remove trailing slashes
      const rssUrl = `${baseUrl}/feed`;

      log(`  [Substack] Fetching RSS: ${rssUrl}`);
      const rssContent = await fetchUrl(rssUrl);
      const rssResult = extractLatestFromRss(rssContent);

      return {
        date: rssResult.date,
        title: rssResult.title,
        rss: rssUrl,
      };
    } catch (e) {
      log(`  [Substack] Error: ${e.message}`);
      return null;
    }
  },

  /**
   * LessWrong - User profiles require fetching userId from page
   * RSS format: https://www.lesswrong.com/feed.xml?view=community-rss&userId={userId}
   */
  lesswrong: async (blog) => {
    try {
      // Extract username from URL (e.g., /users/eliezer_yudkowsky)
      const usernameMatch = blog.url.match(/\/users\/([^\/\?]+)/);
      if (!usernameMatch) {
        log(`  [LessWrong] Could not extract username from URL`);
        return null;
      }
      const username = usernameMatch[1];

      // Fetch user page to get userId
      log(`  [LessWrong] Fetching user page for: ${username}`);
      const userPage = await fetchUrl(`https://www.lesswrong.com/users/${username}`);

      // Extract userId from the page's embedded JSON
      // Look for "_id":"..." pattern near the username
      const userIdMatch = userPage.match(/"_id"\s*:\s*"([a-zA-Z0-9]+)"[^}]*"username"\s*:\s*"[^"]*"/i) ||
                          userPage.match(/"userId"\s*:\s*"([a-zA-Z0-9]+)"/i) ||
                          userPage.match(/"_id"\s*:\s*"([a-zA-Z0-9]{17})"/);

      if (!userIdMatch) {
        log(`  [LessWrong] Could not extract userId from page`);
        // Fallback: try the main LessWrong RSS and look for posts by this user
        return null;
      }

      const userId = userIdMatch[1];
      const rssUrl = `https://www.lesswrong.com/feed.xml?view=community-rss&userId=${userId}`;

      log(`  [LessWrong] Fetching RSS: ${rssUrl}`);
      const rssContent = await fetchUrl(rssUrl);
      const rssResult = extractLatestFromRss(rssContent);

      return {
        date: rssResult.date,
        title: rssResult.title,
        rss: rssUrl,
      };
    } catch (e) {
      log(`  [LessWrong] Error: ${e.message}`);
      return null;
    }
  },

  // Add more platform handlers here as needed:
  // medium: async (blog) => { ... },
  // wordpress: async (blog) => { ... },
};

// ============================================================================
// Special Cases - Custom handlers for specific blogs
// ============================================================================

/**
 * Special case handlers for blogs that need custom scraping logic.
 * Each handler returns { date, title } or null if it can't find data.
 */
const SPECIAL_CASES = {
  /**
   * Guzey - Uses archive page with format: "MM-DD Title" under year headers
   * URL: https://guzey.com/archive/
   */
  "guzey.com": async (blog) => {
    try {
      const html = await fetchUrl("https://guzey.com/archive/");

      // Look for pattern: year header followed by MM-DD entries
      // The meta description contains entries like "09-22 Title"
      // Find the most recent year section
      const yearMatch = html.match(/content="(20\d{2})\s*\n\s*(\d{2}-\d{2})\s+([^\n"]+)/);
      if (yearMatch) {
        const year = yearMatch[1];
        const monthDay = yearMatch[2];
        const title = yearMatch[3].replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').trim();
        const date = `${year}-${monthDay.replace("-", "-")}`;
        return { date, title: title.substring(0, 255) };
      }

      // Alternative: look for "modified: YYYY-MM-DD" in the page
      const modifiedMatch = html.match(/modified:\s*(20\d{2}-\d{2}-\d{2})/);
      if (modifiedMatch) {
        return { date: modifiedMatch[1], title: null };
        about}

      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Gwern - Uses dcterms.modified meta tag on changelog page
   * URL: https://gwern.net/changelog
   */
  "gwern.net": async (blog) => {
    try {
      const html = await fetchUrl("https://gwern.net/changelog");

      // Look for dcterms.modified meta tag
      const modifiedMatch = html.match(/<meta\s+name="dcterms\.modified"\s+content="([^"]+)"/i);
      if (modifiedMatch) {
        const date = parseDate(modifiedMatch[1]);
        if (date) {
          return { date, title: "Site updated" };
        }
      }

      // Fallback: look for date range in the changelog
      const dateRangeMatch = html.match(/(\d{4}-\d{2}-\d{2})<\/span><\/span>/);
      if (dateRangeMatch) {
        return { date: dateRangeMatch[1], title: "Site updated" };
      }

      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Uriah Marc Todoroff - Uses changes page with dateModified time element
   * URL: https://umt.world/changes
   */
  "umt.world": async (blog) => {
    try {
      const html = await fetchUrl("https://umt.world/changes");

      // Look for <time class="dt-modified" datetime="..." itemprop="dateModified">
      const timeMatch = html.match(/<time[^>]*class="dt-modified"[^>]*datetime="([^"]+)"/i);
      if (timeMatch) {
        const date = parseDate(timeMatch[1]);
        if (date) {
          return { date, title: "Site updated" };
        }
      }

      // Fallback: look for itemprop="dateModified"
      const modifiedMatch = html.match(/<time[^>]*itemprop="dateModified"[^>]*datetime="([^"]+)"/i);
      if (modifiedMatch) {
        const date = parseDate(modifiedMatch[1]);
        if (date) {
          return { date, title: "Site updated" };
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  },

  // Add more special cases here as needed:
  // "example.com": async (blog) => { ... }
};

/**
 * Get the domain from a URL for special case matching
 */
function getDomain(url) {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Try to extract activity from HTML when RSS is not available
 * Looks for common date patterns in the page
 */
function extractLatestFromHtml(html, url) {
  let latestDate = null;
  let latestTitle = null;

  // First check meta tags (most reliable for personal blogs)
  const metaPatterns = [
    // Dublin Core modified date
    /<meta\s+name="dcterms\.modified"\s+content="([^"]+)"/i,
    /<meta\s+property="dcterms\.modified"\s+content="([^"]+)"/i,
    // Open Graph article dates
    /<meta\s+property="article:modified_time"\s+content="([^"]+)"/i,
    /<meta\s+property="article:published_time"\s+content="([^"]+)"/i,
    /<meta\s+property="og:updated_time"\s+content="([^"]+)"/i,
    // Generic date meta tags
    /<meta\s+name="date"\s+content="([^"]+)"/i,
    /<meta\s+name="last-modified"\s+content="([^"]+)"/i,
    // Schema.org dateModified
    /"dateModified"\s*:\s*"([^"]+)"/i,
    /"datePublished"\s*:\s*"([^"]+)"/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match) {
      const parsed = parseDate(match[1]);
      if (parsed && (!latestDate || parsed > latestDate)) {
        latestDate = parsed;
      }
    }
  }

  // Check <time> elements with datetime attribute
  const timeMatches = html.match(/<time[^>]*datetime="([^"]+)"[^>]*>/gi);
  if (timeMatches) {
    for (const match of timeMatches) {
      const datetimeMatch = match.match(/datetime="([^"]+)"/i);
      if (datetimeMatch) {
        const parsed = parseDate(datetimeMatch[1]);
        if (parsed && (!latestDate || parsed > latestDate)) {
          latestDate = parsed;
        }
      }
    }
  }

  // Common date patterns in HTML content
  const datePatterns = [
    // ISO dates: 2024-01-15
    /\b(20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))\b/g,
    // US dates: January 15, 2024 or Jan 15, 2024
    /\b((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+20\d{2})\b/gi,
    // UK dates: 15 January 2024
    /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+20\d{2})\b/gi,
    // Slash dates: 01/15/2024 or 15/01/2024
    /\b(\d{1,2}\/\d{1,2}\/20\d{2})\b/g,
  ];

  for (const pattern of datePatterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        const parsed = parseDate(match);
        if (parsed && (!latestDate || parsed > latestDate)) {
          latestDate = parsed;
        }
      }
    }
  }

  // Try to find article titles
  const titlePatterns = [
    /<h1[^>]*class="[^"]*(?:post|article|entry|title)[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<a[^>]*class="[^"]*(?:post|article|entry)[^"]*"[^>]*>([^<]+)<\/a>/i,
    /<h2[^>]*class="[^"]*(?:post|article|entry|title)[^"]*"[^>]*>([^<]+)<\/h2>/i,
    /<title>([^<|]+)/i, // Page title before any separator
  ];

  for (const pattern of titlePatterns) {
    const match = html.match(pattern);
    if (match) {
      latestTitle = match[1].trim().substring(0, 255);
      break;
    }
  }

  return { date: latestDate, title: latestTitle };
}

/**
 * Check a single blog for activity
 */
async function checkBlogActivity(blog, db) {
  const result = {
    id: blog.id,
    title: blog.title,
    lastPostDate: null,
    lastPostTitle: null,
    lastChecked: new Date().toISOString(),
    derivedRss: null,
    error: null,
  };

  try {
    // First check for platform-specific handlers (substack, lesswrong, etc.)
    if (blog.platform && PLATFORM_HANDLERS[blog.platform]) {
      log(`  Checking platform handler: ${blog.platform}`);
      try {
        const platformResult = await PLATFORM_HANDLERS[blog.platform](blog);
        if (platformResult && platformResult.date) {
          result.lastPostDate = platformResult.date;
          result.lastPostTitle = platformResult.title;
          result.derivedRss = platformResult.rss;
          log(`  Found via platform (${blog.platform}): ${result.lastPostDate} - ${result.lastPostTitle}`);

          // Update RSS in database if we derived one and it's different
          if (platformResult.rss && platformResult.rss !== blog.rss) {
            log(`  Updating RSS URL: ${platformResult.rss}`);
            db.prepare("UPDATE blogroll SET rss = ? WHERE id = ?").run(platformResult.rss, blog.id);
          }

          return result;
        }
      } catch (platformError) {
        log(`  Platform handler error: ${platformError.message}`);
      }
    }

    // Then check for special case handlers (domain-specific)
    const domain = getDomain(blog.url);
    if (domain && SPECIAL_CASES[domain]) {
      log(`  Checking special case: ${domain}`);
      try {
        const specialResult = await SPECIAL_CASES[domain](blog);
        if (specialResult && specialResult.date) {
          result.lastPostDate = specialResult.date;
          result.lastPostTitle = specialResult.title;
          log(`  Found via special case: ${result.lastPostDate} - ${result.lastPostTitle}`);
          return result;
        }
      } catch (specialError) {
        log(`  Special case error: ${specialError.message}`);
      }
    }

    // Try RSS feed if available
    if (blog.rss) {
      log(`  Checking RSS: ${blog.rss}`);
      try {
        const rssContent = await fetchUrl(blog.rss);
        const rssResult = extractLatestFromRss(rssContent);
        if (rssResult.date) {
          result.lastPostDate = rssResult.date;
          result.lastPostTitle = rssResult.title;
          log(`  Found via RSS: ${result.lastPostDate} - ${result.lastPostTitle}`);
          return result;
        }
      } catch (rssError) {
        log(`  RSS error: ${rssError.message}`);
      }
    }

    // Fallback to HTML scraping
    log(`  Checking HTML: ${blog.url}`);
    try {
      const htmlContent = await fetchUrl(blog.url);
      const htmlResult = extractLatestFromHtml(htmlContent, blog.url);
      if (htmlResult.date) {
        result.lastPostDate = htmlResult.date;
        result.lastPostTitle = htmlResult.title;
        log(`  Found via HTML: ${result.lastPostDate} - ${result.lastPostTitle}`);
      } else {
        log(`  No dates found in HTML`);
      }
    } catch (htmlError) {
      log(`  HTML error: ${htmlError.message}`);
      result.error = htmlError.message;
    }
  } catch (error) {
    result.error = error.message;
    log(`  Error: ${error.message}`);
  }

  return result;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log("=".repeat(60));
  console.log("Blog Activity Checker");
  console.log("=".repeat(60));

  if (DRY_RUN) {
    console.log("DRY RUN MODE - No database changes will be made\n");
  }

  // Open database
  const db = new Database(DB_PATH);

  try {
    // Get all blogs
    let query = "SELECT id, title, url, rss, platform FROM blogroll ORDER BY title";
    if (LIMIT) {
      query += ` LIMIT ${LIMIT}`;
    }
    const blogs = db.prepare(query).all();

    console.log(`Checking ${blogs.length} blogs...\n`);

    const results = [];
    let processed = 0;
    let updated = 0;
    let errors = 0;

    // Prepare update statement
    const updateStmt = db.prepare(`
      UPDATE blogroll
      SET last_post_date = ?, last_post_title = ?, last_checked = ?
      WHERE id = ?
    `);

    for (const blog of blogs) {
      processed++;
      console.log(`[${processed}/${blogs.length}] ${blog.title}${blog.platform ? ` [${blog.platform}]` : ''}`);

      const result = await checkBlogActivity(blog, db);
      results.push(result);

      if (result.lastPostDate) {
        if (!DRY_RUN) {
          updateStmt.run(
            result.lastPostDate,
            result.lastPostTitle,
            result.lastChecked,
            result.id
          );
        }
        updated++;
        console.log(`  → Last post: ${result.lastPostDate}`);
      } else if (result.error) {
        errors++;
        console.log(`  → Error: ${result.error}`);
      } else {
        console.log(`  → No activity data found`);
      }

      // Be polite to servers
      await sleep(DELAY_BETWEEN_REQUESTS);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("Summary");
    console.log("=".repeat(60));
    console.log(`Total blogs checked: ${processed}`);
    console.log(`Updated with activity: ${updated}`);
    console.log(`Errors: ${errors}`);
    console.log(`No data found: ${processed - updated - errors}`);

    // Show most active blogs
    if (!DRY_RUN && updated > 0) {
      console.log("\nMost recently active blogs:");
      const recentBlogs = db.prepare(`
        SELECT title, last_post_date, last_post_title
        FROM blogroll
        WHERE last_post_date IS NOT NULL
        ORDER BY last_post_date DESC
        LIMIT 10
      `).all();

      recentBlogs.forEach((blog, i) => {
        console.log(`  ${i + 1}. ${blog.last_post_date} - ${blog.title}`);
        if (blog.last_post_title) {
          console.log(`     "${blog.last_post_title}"`);
        }
      });
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
