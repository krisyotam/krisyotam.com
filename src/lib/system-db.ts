/**
 * ============================================================================
 * System Database Access Library
 * ============================================================================
 * Author: Kris Yotam
 * Description: TypeScript library for accessing system.db SQLite database
 * Created: 2026-01-04
 *
 * Tables:
 *   - blogroll: Blog recommendations and links
 *   - changelog_content: Content changelog entries
 *   - changelog_infra: Infrastructure changelog entries
 *   - til: Today I Learned entries
 *   - now: Now page entries
 *   - words: Word of the day definitions
 *   - supporters: Supporter acknowledgments
 *   - sources: Source citations and references
 *   - quotes: Quotation collection
 *   - locations: Travel locations and places visited
 *   - shop_items: Shop products and merchandise
 * ============================================================================
 */

import Database from "better-sqlite3";
import path from "path";

// ============================================================================
// Types
// ============================================================================

export interface BlogrollEntry {
  id: number;
  title: string;
  url: string;
  category: string;
  tags: string[];
  rss: string | null;
  lastPostDate: string | null;
  lastPostTitle: string | null;
  lastChecked: string | null;
  activityScore: number;
}

export interface ChangelogEntry {
  id: string;
  date: {
    day: string;
    weekday: string;
    month: string;
    year: string;
  };
  text: string;
  kind: string | null;
}

export interface TilEntry {
  id: number;
  title: string;
  preview: string;
  date: string | null;
  category: string;
  slug: string;
  coverImage: string | null;
  status: string;
  confidence: string | null;
  importance: string | null;
  state: string | null;
  tags: string[];
}

export interface NowEntry {
  id: number;
  title: string;
  preview: string;
  date: string | null;
  category: string;
  slug: string;
  coverImage: string | null;
  status: string;
  confidence: string | null;
  importance: string | null;
  state: string | null;
  tags: string[];
}

export interface WordEntry {
  id: number;
  title: string;
  type: string;
  definition: string;
}

export interface SupporterEntry {
  id: number;
  name: string;
  contribution: string;
}

export interface SourceEntry {
  id: number;
  from: string;
  content: string;
  date: string | null;
  link: string | null;
  type: string | null;
  profileLink: string | null;
}

export interface QuoteEntry {
  id: number;
  text: string;
  author: string;
  source: string | null;
}

export interface ExcerptEntry {
  id: number;
  text: string;
  author: string;
  source: string | null;
}

export interface LocationEntry {
  id: number;
  name: string;
  description: string;
  coordinates: [number, number];
  type: string;
  visitDate: string;
  duration: string;
  highlights: string[];
  rating: number;
}

export interface ShopItem {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string;
  currency: string;
  paymentUrl: string;
  image: string;
  description: string;
  date: string;
  status: string;
  importance: number;
  state: string;
  aspectRatio: string;
}

// ============================================================================
// Database Connection
// ============================================================================

const DB_PATH = path.join(process.cwd(), "public", "data", "system.db");

function getDb(): Database.Database {
  return new Database(DB_PATH, { readonly: true });
}

// ============================================================================
// Blogroll Functions
// ============================================================================

/**
 * Calculate activity score based on recency of last post
 * Higher score = more recent activity
 * Score ranges from 0-100, with decay over time
 */
function calculateActivityScore(lastPostDate: string | null): number {
  if (!lastPostDate) return 0;

  const now = new Date();
  const postDate = new Date(lastPostDate);
  const daysSincePost = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

  // Score calculation:
  // - Posts within last 7 days: 100
  // - Posts within last 30 days: 90-99
  // - Posts within last 90 days: 70-89
  // - Posts within last 180 days: 50-69
  // - Posts within last 365 days: 30-49
  // - Posts within last 2 years: 10-29
  // - Older posts: 1-9
  // - No data: 0

  if (daysSincePost <= 7) return 100;
  if (daysSincePost <= 30) return 90 + Math.floor((30 - daysSincePost) / 3);
  if (daysSincePost <= 90) return 70 + Math.floor((90 - daysSincePost) / 3);
  if (daysSincePost <= 180) return 50 + Math.floor((180 - daysSincePost) / 5);
  if (daysSincePost <= 365) return 30 + Math.floor((365 - daysSincePost) / 10);
  if (daysSincePost <= 730) return 10 + Math.floor((730 - daysSincePost) / 40);
  return Math.max(1, 10 - Math.floor(daysSincePost / 365));
}

export function getAllBlogrollEntries(): BlogrollEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, title, url, category, rss, last_post_date, last_post_title, last_checked
      FROM blogroll
      ORDER BY title ASC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      url: entry.url,
      category: entry.category,
      tags: getBlogrollTags(db, entry.id),
      rss: entry.rss || null,
      lastPostDate: entry.last_post_date || null,
      lastPostTitle: entry.last_post_title || null,
      lastChecked: entry.last_checked || null,
      activityScore: calculateActivityScore(entry.last_post_date),
    }));
  } finally {
    db.close();
  }
}

export function getBlogrollCategories(): string[] {
  const db = getDb();
  try {
    const categories = db
      .prepare(
        `
      SELECT DISTINCT category FROM blogroll WHERE category IS NOT NULL AND category != ''
      ORDER BY category ASC
    `
      )
      .all() as { category: string }[];

    return categories.map((c) => c.category);
  } finally {
    db.close();
  }
}

function getBlogrollTags(db: Database.Database, blogrollId: number): string[] {
  const tags = db
    .prepare(`SELECT tag FROM blogroll_tags WHERE blogroll_id = ?`)
    .all(blogrollId) as { tag: string }[];
  return tags.map((t) => t.tag);
}

// ============================================================================
// Changelog Functions
// ============================================================================

export function getChangelogContent(): ChangelogEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, day, weekday, month, year, text, kind
      FROM changelog_content
      ORDER BY year DESC, month DESC, day DESC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      id: entry.id,
      date: {
        day: entry.day,
        weekday: entry.weekday,
        month: entry.month,
        year: entry.year,
      },
      text: entry.text,
      kind: entry.kind,
    }));
  } finally {
    db.close();
  }
}

export function getChangelogInfra(): ChangelogEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, day, weekday, month, year, text, kind
      FROM changelog_infra
      ORDER BY year DESC, month DESC, day DESC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      id: entry.id,
      date: {
        day: entry.day,
        weekday: entry.weekday,
        month: entry.month,
        year: entry.year,
      },
      text: entry.text,
      kind: entry.kind,
    }));
  } finally {
    db.close();
  }
}

// ============================================================================
// TIL Functions
// ============================================================================

export function getAllTilEntries(): TilEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, title, preview, date, category, slug, cover_image as coverImage,
             status, confidence, importance, state
      FROM til
      ORDER BY date DESC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      ...entry,
      tags: getTilTags(db, entry.id),
    }));
  } finally {
    db.close();
  }
}

export function getTilBySlug(slug: string): TilEntry | null {
  const db = getDb();
  try {
    const entry = db
      .prepare(
        `
      SELECT id, title, preview, date, category, slug, cover_image as coverImage,
             status, confidence, importance, state
      FROM til
      WHERE slug = ?
    `
      )
      .get(slug) as any;

    if (!entry) return null;

    return {
      ...entry,
      tags: getTilTags(db, entry.id),
    };
  } finally {
    db.close();
  }
}

export function getTilCategories(): string[] {
  const db = getDb();
  try {
    const categories = db
      .prepare(
        `
      SELECT DISTINCT category FROM til WHERE category IS NOT NULL AND category != ''
      ORDER BY category ASC
    `
      )
      .all() as { category: string }[];

    return categories.map((c) => c.category);
  } finally {
    db.close();
  }
}

export function getTilTags(db: Database.Database, tilId: number): string[] {
  const tags = db
    .prepare(`SELECT tag FROM til_tags WHERE til_id = ?`)
    .all(tilId) as { tag: string }[];
  return tags.map((t) => t.tag);
}

// ============================================================================
// Now Functions
// ============================================================================

export function getAllNowEntries(): NowEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, title, preview, date, category, slug, cover_image as coverImage,
             status, confidence, importance, state
      FROM now
      ORDER BY date DESC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      ...entry,
      tags: getNowTags(db, entry.id),
    }));
  } finally {
    db.close();
  }
}

export function getNowBySlug(slug: string): NowEntry | null {
  const db = getDb();
  try {
    const entry = db
      .prepare(
        `
      SELECT id, title, preview, date, category, slug, cover_image as coverImage,
             status, confidence, importance, state
      FROM now
      WHERE slug = ?
    `
      )
      .get(slug) as any;

    if (!entry) return null;

    return {
      ...entry,
      tags: getNowTags(db, entry.id),
    };
  } finally {
    db.close();
  }
}

function getNowTags(db: Database.Database, nowId: number): string[] {
  const tags = db
    .prepare(`SELECT tag FROM now_tags WHERE now_id = ?`)
    .all(nowId) as { tag: string }[];
  return tags.map((t) => t.tag);
}

// ============================================================================
// Words Functions
// ============================================================================

export function getAllWords(): WordEntry[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `
      SELECT id, title, type, definition
      FROM words
      ORDER BY title ASC
    `
      )
      .all() as WordEntry[];
  } finally {
    db.close();
  }
}

export function getRandomWord(): WordEntry | null {
  const db = getDb();
  try {
    return (
      (db
        .prepare(
          `
      SELECT id, title, type, definition
      FROM words
      ORDER BY RANDOM()
      LIMIT 1
    `
        )
        .get() as WordEntry) || null
    );
  } finally {
    db.close();
  }
}

export function getWordOfTheDay(): WordEntry | null {
  const db = getDb();
  try {
    // Use date-based seed for consistent daily word
    const today = new Date().toISOString().split("T")[0];
    const seed =
      today.split("-").reduce((acc, part) => acc + parseInt(part), 0) % 365;

    const words = db
      .prepare(
        `
      SELECT id, title, type, definition
      FROM words
      ORDER BY id ASC
    `
      )
      .all() as WordEntry[];

    if (words.length === 0) return null;
    return words[seed % words.length];
  } finally {
    db.close();
  }
}

// ============================================================================
// Supporters Functions
// ============================================================================

export function getAllSupporters(): SupporterEntry[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `
      SELECT id, name, contribution
      FROM supporters
      ORDER BY name ASC
    `
      )
      .all() as SupporterEntry[];
  } finally {
    db.close();
  }
}

// ============================================================================
// Sources Functions
// ============================================================================

export function getAllSources(): SourceEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, from_user, content, date, link, type, profile_link
      FROM sources
      ORDER BY date DESC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      id: entry.id,
      from: entry.from_user,
      content: entry.content,
      date: entry.date,
      link: entry.link,
      type: entry.type,
      profileLink: entry.profile_link,
    }));
  } finally {
    db.close();
  }
}

export function getSourcesByType(type: string): SourceEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, from_user, content, date, link, type, profile_link
      FROM sources
      WHERE type = ?
      ORDER BY date DESC
    `
      )
      .all(type) as any[];

    return entries.map((entry) => ({
      id: entry.id,
      from: entry.from_user,
      content: entry.content,
      date: entry.date,
      link: entry.link,
      type: entry.type,
      profileLink: entry.profile_link,
    }));
  } finally {
    db.close();
  }
}

// ============================================================================
// Quotes Functions
// ============================================================================

export function getAllQuotes(): QuoteEntry[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `
      SELECT id, text, author, source
      FROM quotes
      ORDER BY author ASC
    `
      )
      .all() as QuoteEntry[];
  } finally {
    db.close();
  }
}

export function getRandomQuote(): QuoteEntry | null {
  const db = getDb();
  try {
    return (
      (db
        .prepare(
          `
      SELECT id, text, author, source
      FROM quotes
      ORDER BY RANDOM()
      LIMIT 1
    `
        )
        .get() as QuoteEntry) || null
    );
  } finally {
    db.close();
  }
}

export function getQuoteOfTheDay(): QuoteEntry | null {
  const db = getDb();
  try {
    // Use date-based seed for consistent daily quote
    const today = new Date().toISOString().split("T")[0];
    const seed =
      today.split("-").reduce((acc, part) => acc + parseInt(part), 0) % 365;

    const quotes = db
      .prepare(
        `
      SELECT id, text, author, source
      FROM quotes
      ORDER BY id ASC
    `
      )
      .all() as QuoteEntry[];

    if (quotes.length === 0) return null;
    return quotes[seed % quotes.length];
  } finally {
    db.close();
  }
}

export function getQuotesByAuthor(author: string): QuoteEntry[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `
      SELECT id, text, author, source
      FROM quotes
      WHERE author = ?
      ORDER BY id ASC
    `
      )
      .all(author) as QuoteEntry[];
  } finally {
    db.close();
  }
}

export function getQuoteAuthors(): string[] {
  const db = getDb();
  try {
    const authors = db
      .prepare(
        `
      SELECT DISTINCT author FROM quotes WHERE author IS NOT NULL AND author != ''
      ORDER BY author ASC
    `
      )
      .all() as { author: string }[];

    return authors.map((a) => a.author);
  } finally {
    db.close();
  }
}

// ============================================================================
// Locations Functions
// ============================================================================

export function getAllLocations(): LocationEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, name, description, longitude, latitude, type,
             visit_date, duration, highlights, rating
      FROM locations
      ORDER BY visit_date DESC, name ASC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      description: entry.description || "",
      coordinates: [entry.longitude, entry.latitude] as [number, number],
      type: entry.type,
      visitDate: entry.visit_date || "",
      duration: entry.duration || "",
      highlights: entry.highlights ? JSON.parse(entry.highlights) : [],
      rating: entry.rating || 0,
    }));
  } finally {
    db.close();
  }
}

export function getLocationsByType(type: string): LocationEntry[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, name, description, longitude, latitude, type,
             visit_date, duration, highlights, rating
      FROM locations
      WHERE type = ?
      ORDER BY visit_date DESC, name ASC
    `
      )
      .all(type) as any[];

    return entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      description: entry.description || "",
      coordinates: [entry.longitude, entry.latitude] as [number, number],
      type: entry.type,
      visitDate: entry.visit_date || "",
      duration: entry.duration || "",
      highlights: entry.highlights ? JSON.parse(entry.highlights) : [],
      rating: entry.rating || 0,
    }));
  } finally {
    db.close();
  }
}

export function getLocationTypes(): string[] {
  const db = getDb();
  try {
    const types = db
      .prepare(
        `
      SELECT DISTINCT type FROM locations WHERE type IS NOT NULL AND type != ''
      ORDER BY type ASC
    `
      )
      .all() as { type: string }[];

    return types.map((t) => t.type);
  } finally {
    db.close();
  }
}

// ============================================================================
// Shop Functions
// ============================================================================

export function getAllShopItems(): ShopItem[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, name, slug, category, price, currency, payment_url,
             image, description, date, status, importance, state, aspect_ratio
      FROM shop_items
      WHERE state = 'active'
      ORDER BY importance DESC, date DESC
    `
      )
      .all() as any[];

    return entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      slug: entry.slug,
      category: entry.category,
      price: entry.price,
      currency: entry.currency || "USD",
      paymentUrl: entry.payment_url || "",
      image: entry.image || "",
      description: entry.description || "",
      date: entry.date || "",
      status: entry.status || "Finished",
      importance: entry.importance || 5,
      state: entry.state || "active",
      aspectRatio: entry.aspect_ratio || "rectangle",
    }));
  } finally {
    db.close();
  }
}

export function getShopItemsByCategory(category: string): ShopItem[] {
  const db = getDb();
  try {
    const entries = db
      .prepare(
        `
      SELECT id, name, slug, category, price, currency, payment_url,
             image, description, date, status, importance, state, aspect_ratio
      FROM shop_items
      WHERE category = ? AND state = 'active'
      ORDER BY importance DESC, date DESC
    `
      )
      .all(category) as any[];

    return entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      slug: entry.slug,
      category: entry.category,
      price: entry.price,
      currency: entry.currency || "USD",
      paymentUrl: entry.payment_url || "",
      image: entry.image || "",
      description: entry.description || "",
      date: entry.date || "",
      status: entry.status || "Finished",
      importance: entry.importance || 5,
      state: entry.state || "active",
      aspectRatio: entry.aspect_ratio || "rectangle",
    }));
  } finally {
    db.close();
  }
}

export function getShopItemBySlug(slug: string): ShopItem | null {
  const db = getDb();
  try {
    const entry = db
      .prepare(
        `
      SELECT id, name, slug, category, price, currency, payment_url,
             image, description, date, status, importance, state, aspect_ratio
      FROM shop_items
      WHERE slug = ?
    `
      )
      .get(slug) as any;

    if (!entry) return null;

    return {
      id: entry.id,
      name: entry.name,
      slug: entry.slug,
      category: entry.category,
      price: entry.price,
      currency: entry.currency || "USD",
      paymentUrl: entry.payment_url || "",
      image: entry.image || "",
      description: entry.description || "",
      date: entry.date || "",
      status: entry.status || "Finished",
      importance: entry.importance || 5,
      state: entry.state || "active",
      aspectRatio: entry.aspect_ratio || "rectangle",
    };
  } finally {
    db.close();
  }
}

export function getShopCategories(): string[] {
  const db = getDb();
  try {
    const categories = db
      .prepare(
        `
      SELECT DISTINCT category FROM shop_items
      WHERE category IS NOT NULL AND category != '' AND state = 'active'
      ORDER BY category ASC
    `
      )
      .all() as { category: string }[];

    return categories.map((c) => c.category);
  } finally {
    db.close();
  }
}

// ============================================================================
// Excerpts Functions
// ============================================================================

export function getAllExcerpts(): ExcerptEntry[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `
      SELECT id, text, author, source
      FROM excerpts
      ORDER BY author ASC
    `
      )
      .all() as ExcerptEntry[];
  } finally {
    db.close();
  }
}

export function getRandomExcerpt(): ExcerptEntry | null {
  const db = getDb();
  try {
    return (
      (db
        .prepare(
          `
      SELECT id, text, author, source
      FROM excerpts
      ORDER BY RANDOM()
      LIMIT 1
    `
        )
        .get() as ExcerptEntry) || null
    );
  } finally {
    db.close();
  }
}

export function getExcerptsByAuthor(author: string): ExcerptEntry[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `
      SELECT id, text, author, source
      FROM excerpts
      WHERE author = ?
      ORDER BY id ASC
    `
      )
      .all(author) as ExcerptEntry[];
  } finally {
    db.close();
  }
}

export function getExcerptAuthors(): string[] {
  const db = getDb();
  try {
    const authors = db
      .prepare(
        `
      SELECT DISTINCT author FROM excerpts WHERE author IS NOT NULL AND author != ''
      ORDER BY author ASC
    `
      )
      .all() as { author: string }[];

    return authors.map((a) => a.author);
  } finally {
    db.close();
  }
}
