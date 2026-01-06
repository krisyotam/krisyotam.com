/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                         M A G I C   U R L S                               ║
 * ║                                                                           ║
 * ║        Transmuting Slugs into Sovereign Paths Since Anno Domini           ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Author:      Kris Yotam                                                  ║
 * ║  License:     CC-0                                                        ║
 * ║  Created:     2026-01-06                                                  ║
 * ║                                                                           ║
 * ║  Description:                                                             ║
 * ║  This module performs a most elegant transmutation: it reads the sacred   ║
 * ║  content.db and provides a comprehensive mapping of bare slugs to their   ║
 * ║  full canonical paths. The discerning author, having memorized their      ║
 * ║  slugs, may thus navigate directly to krisyotam.com/{slug} and be         ║
 * ║  gracefully redirected to the proper /{type}/{category}/{slug} path.      ║
 * ║                                                                           ║
 * ║  Usage:                                                                   ║
 * ║  Import and call getMagicUrls() to retrieve the slug mappings object.     ║
 * ║  Or call lookupSlug(slug) to get the full path for a specific slug.       ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

/* ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Path to the sacred content database */
const DB_PATH = path.join(__dirname, '..', 'data', 'content.db')

/** Content types and their corresponding tables in the database */
const CONTENT_TYPES = [
  'blog',
  'essays',
  'fiction',
  'news',
  'notes',
  'ocs',
  'papers',
  'progymnasmata',
  'reviews',
  'verse',
]

/* ═══════════════════════════════════════════════════════════════════════════
 * CACHE
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Cached mappings to avoid repeated database reads */
let cachedMappings = null
let cacheTimestamp = 0
const CACHE_TTL = 60000 // 1 minute TTL

/* ═══════════════════════════════════════════════════════════════════════════
 * DATABASE OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Opens the content database in read-only mode
 * @returns {Database.Database} The database connection
 */
function openDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Database not found at: ${DB_PATH}`)
  }
  return new Database(DB_PATH, { readonly: true })
}

/**
 * Extracts all slug-to-path mappings from a content type table
 * @param {Database.Database} db The database connection
 * @param {string} type The content type table name
 * @returns {Map<string, {type: string, category: string, path: string}>} Mappings for this type
 */
function extractMappingsForType(db, type) {
  const mappings = new Map()

  try {
    // Verse uses verse_type for URL path, other types use category_slug
    const query = type === 'verse'
      ? `SELECT slug, category_slug, verse_type FROM ${type} WHERE slug IS NOT NULL AND slug != ''`
      : `SELECT slug, category_slug FROM ${type} WHERE slug IS NOT NULL AND slug != ''`

    const rows = db.prepare(query).all()

    for (const row of rows) {
      const slug = row.slug
      // For verse, use verse_type; for others, use category_slug
      const category = type === 'verse'
        ? (row.verse_type || 'uncategorized')
        : (row.category_slug || 'uncategorized')
      const fullPath = `/${type}/${category}/${slug}`

      mappings.set(slug, {
        type,
        category,
        path: fullPath,
      })
    }
  } catch (err) {
    // Table might not exist, skip silently
  }

  return mappings
}

/* ═══════════════════════════════════════════════════════════════════════════
 * COLLISION DETECTION
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Detects and resolves slug collisions across content types
 * In the event of collision, the first encountered mapping wins
 * @param {Map<string, Array>} allMappings All mappings grouped by slug
 * @returns {{resolved: Map, collisions: string[]}} Resolved mappings and collision list
 */
function detectCollisions(allMappings) {
  const resolved = new Map()
  const collisions = []

  for (const [slug, mappings] of allMappings) {
    if (mappings.length > 1) {
      collisions.push(slug)
    }
    // First mapping wins (deterministic ordering by CONTENT_TYPES)
    resolved.set(slug, mappings[0])
  }

  return { resolved, collisions }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * PUBLIC API
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Retrieves all magic URL mappings from the content database
 * Results are cached for performance
 * @returns {{mappings: Object, reverse: Object, meta: Object}} The complete mappings object
 */
function getMagicUrls() {
  const now = Date.now()

  // Return cached result if still valid
  if (cachedMappings && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedMappings
  }

  let db
  try {
    db = openDatabase()
  } catch (err) {
    console.error('Magic URLs: Failed to open database:', err.message)
    return { mappings: {}, reverse: {}, meta: { error: err.message } }
  }

  const allMappings = new Map()

  // Extract mappings from all content types
  for (const type of CONTENT_TYPES) {
    const typeMappings = extractMappingsForType(db, type)

    for (const [slug, mapping] of typeMappings) {
      if (!allMappings.has(slug)) {
        allMappings.set(slug, [])
      }
      allMappings.get(slug).push(mapping)
    }
  }

  db.close()

  // Resolve collisions
  const { resolved, collisions } = detectCollisions(allMappings)

  // Build output objects
  const mappingsObject = {}
  const reverseObject = {}

  for (const [slug, mapping] of resolved) {
    mappingsObject[slug] = mapping
    reverseObject[mapping.path] = slug
  }

  const result = {
    meta: {
      totalMappings: resolved.size,
      collisions: collisions.length,
      cachedAt: new Date().toISOString(),
    },
    mappings: mappingsObject,
    reverse: reverseObject,
  }

  // Update cache
  cachedMappings = result
  cacheTimestamp = now

  return result
}

/**
 * Looks up the full canonical path for a given slug
 * @param {string} slug The bare slug to look up
 * @returns {string|null} The full path, or null if not found
 */
function lookupSlug(slug) {
  const { mappings } = getMagicUrls()
  const mapping = mappings[slug]
  return mapping ? mapping.path : null
}

/**
 * Looks up the slug for a given full path
 * @param {string} fullPath The full canonical path
 * @returns {string|null} The slug, or null if not found
 */
function lookupPath(fullPath) {
  const { reverse } = getMagicUrls()
  return reverse[fullPath] || null
}

/**
 * Clears the cache, forcing a fresh database read on next call
 */
function clearCache() {
  cachedMappings = null
  cacheTimestamp = 0
}

/* ═══════════════════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════════════════ */

module.exports = {
  getMagicUrls,
  lookupSlug,
  lookupPath,
  clearCache,
}
