/**
 * ============================================================================
 * Reference Database Query Library
 * Author: Kris Yotam
 * Description: TypeScript library for querying the reference.db SQLite database.
 *              Provides functions for accessing dictionary definitions, Bible
 *              verses, internet rules, commandments, and CPI data.
 * ============================================================================
 */

import Database from "better-sqlite3";
import path from "path";

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

/** Cached database connection */
let db: Database.Database | null = null;

/**
 * Gets or creates a database connection to reference.db
 * Uses a singleton pattern for efficiency
 */
function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "public", "data", "reference.db");
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Rule of the Internet entry */
export interface InternetRule {
  id: number;
  rule: string;
  text: string;
  explanation: string | null;
}

/** KJV 1611 Bible verse */
export interface BibleVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

/** Dictionary entry (OED or Merriam-Webster) */
export interface DictionaryEntry {
  id: number;
  word: string;
  definition: string;
}

/** Mitzvah (commandment) entry */
export interface MitzvahEntry {
  id: number;
  law: string;
  scripture: string;
}

/** CPI (Consumer Price Index) entry */
export interface CPIEntry {
  year: number;
  value: number;
}

/** Symbol entry */
export interface SymbolEntry {
  id: number;
  slug: string;
  name: string;
  symbol: string;
  url: string | null;
}

// ============================================================================
// RULES OF THE INTERNET QUERIES
// ============================================================================

/**
 * Gets all Rules of the Internet
 */
export function getAllInternetRules(): InternetRule[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, rule, text, explanation
    FROM rules_of_the_internet
    ORDER BY id
  `);
  return stmt.all() as InternetRule[];
}

/**
 * Searches Rules of the Internet by text or explanation
 */
export function searchInternetRules(query: string): InternetRule[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, rule, text, explanation
    FROM rules_of_the_internet
    WHERE rule LIKE ? OR text LIKE ? OR explanation LIKE ?
    ORDER BY id
  `);
  const searchTerm = `%${query}%`;
  return stmt.all(searchTerm, searchTerm, searchTerm) as InternetRule[];
}

/**
 * Gets a specific rule by rule number
 */
export function getInternetRule(ruleNumber: string): InternetRule | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, rule, text, explanation
    FROM rules_of_the_internet
    WHERE rule = ?
  `);
  return (stmt.get(ruleNumber) as InternetRule) || null;
}

// ============================================================================
// KJV 1611 BIBLE QUERIES
// ============================================================================

/**
 * Gets a specific Bible verse
 */
export function getBibleVerse(
  book: string,
  chapter: number,
  verse: number
): BibleVerse | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, book, chapter, verse, text
    FROM kjv_1611
    WHERE book = ? AND chapter = ? AND verse = ?
  `);
  return (stmt.get(book, chapter, verse) as BibleVerse) || null;
}

/**
 * Gets a range of Bible verses
 */
export function getBibleVerseRange(
  book: string,
  chapter: number,
  startVerse: number,
  endVerse: number
): BibleVerse[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, book, chapter, verse, text
    FROM kjv_1611
    WHERE book = ? AND chapter = ? AND verse >= ? AND verse <= ?
    ORDER BY verse
  `);
  return stmt.all(book, chapter, startVerse, endVerse) as BibleVerse[];
}

/**
 * Gets all verses in a chapter
 */
export function getBibleChapter(book: string, chapter: number): BibleVerse[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, book, chapter, verse, text
    FROM kjv_1611
    WHERE book = ? AND chapter = ?
    ORDER BY verse
  `);
  return stmt.all(book, chapter) as BibleVerse[];
}

/**
 * Gets all unique book names
 */
export function getBibleBooks(): string[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT DISTINCT book FROM kjv_1611
  `);
  const rows = stmt.all() as { book: string }[];
  return rows.map((r) => r.book);
}

/**
 * Gets the chapter count for a book
 */
export function getBibleBookChapterCount(book: string): number {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT MAX(chapter) as count FROM kjv_1611 WHERE book = ?
  `);
  const result = stmt.get(book) as { count: number } | undefined;
  return result?.count || 0;
}

// ============================================================================
// DICTIONARY QUERIES (OED & MERRIAM-WEBSTER)
// ============================================================================

/**
 * Looks up a word in the OED
 */
export function getOEDDefinition(word: string): DictionaryEntry | null {
  const database = getDatabase();
  const normalizedWord = word.toUpperCase().trim();
  const stmt = database.prepare(`
    SELECT id, word, definition
    FROM oed
    WHERE word = ?
  `);
  return (stmt.get(normalizedWord) as DictionaryEntry) || null;
}

/**
 * Searches OED for words matching a pattern
 */
export function searchOED(query: string, limit: number = 20): DictionaryEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, word, definition
    FROM oed
    WHERE word LIKE ?
    LIMIT ?
  `);
  return stmt.all(`%${query.toUpperCase()}%`, limit) as DictionaryEntry[];
}

/**
 * Looks up a word in Merriam-Webster
 */
export function getMerriamWebsterDefinition(
  word: string
): DictionaryEntry | null {
  const database = getDatabase();
  const normalizedWord = word.toLowerCase().trim();
  const stmt = database.prepare(`
    SELECT id, word, definition
    FROM merriam_webster
    WHERE word = ?
  `);
  return (stmt.get(normalizedWord) as DictionaryEntry) || null;
}

/**
 * Searches Merriam-Webster for words matching a pattern
 */
export function searchMerriamWebster(
  query: string,
  limit: number = 20
): DictionaryEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, word, definition
    FROM merriam_webster
    WHERE word LIKE ?
    LIMIT ?
  `);
  return stmt.all(`%${query.toLowerCase()}%`, limit) as DictionaryEntry[];
}

/**
 * Gets definition from OED first, falls back to Merriam-Webster
 */
export function getDefinition(word: string): DictionaryEntry | null {
  const oedResult = getOEDDefinition(word);
  if (oedResult) return oedResult;
  return getMerriamWebsterDefinition(word);
}

// ============================================================================
// MITZVOT (613 COMMANDMENTS) QUERIES
// ============================================================================

/**
 * Gets all mitzvot
 */
export function getAllMitzvot(): MitzvahEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, law, scripture
    FROM mitzvot
    ORDER BY id
  `);
  return stmt.all() as MitzvahEntry[];
}

/**
 * Gets a specific mitzvah by ID
 */
export function getMitzvah(id: number): MitzvahEntry | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, law, scripture
    FROM mitzvot
    WHERE id = ?
  `);
  return (stmt.get(id) as MitzvahEntry) || null;
}

/**
 * Searches mitzvot by law text or scripture reference
 */
export function searchMitzvot(query: string): MitzvahEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, law, scripture
    FROM mitzvot
    WHERE law LIKE ? OR scripture LIKE ?
    ORDER BY id
  `);
  const searchTerm = `%${query}%`;
  return stmt.all(searchTerm, searchTerm) as MitzvahEntry[];
}

// ============================================================================
// CPI (CONSUMER PRICE INDEX) QUERIES
// ============================================================================

/**
 * Gets all CPI data
 */
export function getAllCPI(): CPIEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT year, value
    FROM cpi
    ORDER BY year
  `);
  return stmt.all() as CPIEntry[];
}

/**
 * Gets CPI for a specific year
 */
export function getCPI(year: number): CPIEntry | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT year, value
    FROM cpi
    WHERE year = ?
  `);
  return (stmt.get(year) as CPIEntry) || null;
}

/**
 * Gets CPI as a map of year to value
 */
export function getCPIMap(): Record<number, number> {
  const entries = getAllCPI();
  const map: Record<number, number> = {};
  for (const entry of entries) {
    map[entry.year] = entry.value;
  }
  return map;
}

/**
 * Calculates inflation-adjusted value
 */
export function calculateInflationAdjusted(
  amount: number,
  fromYear: number,
  toYear: number = 2025
): number | null {
  const fromCPI = getCPI(fromYear);
  const toCPI = getCPI(toYear);

  if (!fromCPI || !toCPI) return null;

  return amount * (toCPI.value / fromCPI.value);
}

// ============================================================================
// DATABASE UTILITIES
// ============================================================================

/**
 * Closes the database connection (for cleanup)
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Gets table statistics
 */
export function getDatabaseStats(): Record<string, number> {
  const database = getDatabase();
  const tables = [
    "rules_of_the_internet",
    "kjv_1611",
    "oed",
    "merriam_webster",
    "mitzvot",
    "cpi",
    "symbols",
  ];

  const stats: Record<string, number> = {};
  for (const table of tables) {
    const stmt = database.prepare(`SELECT COUNT(*) as count FROM ${table}`);
    const result = stmt.get() as { count: number };
    stats[table] = result.count;
  }

  return stats;
}

// ============================================================================
// SYMBOLS QUERIES
// ============================================================================

/**
 * Gets all symbols
 */
export function getAllSymbols(): SymbolEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, slug, name, symbol, url
    FROM symbols
    ORDER BY name
  `);
  return stmt.all() as SymbolEntry[];
}

/**
 * Gets a symbol by slug
 */
export function getSymbolBySlug(slug: string): SymbolEntry | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, slug, name, symbol, url
    FROM symbols
    WHERE slug = ?
  `);
  return (stmt.get(slug) as SymbolEntry) || null;
}

/**
 * Gets multiple symbols by their slugs
 */
export function getSymbolsBySlugs(slugs: string[]): SymbolEntry[] {
  if (slugs.length === 0) return [];
  const database = getDatabase();
  const placeholders = slugs.map(() => "?").join(", ");
  const stmt = database.prepare(`
    SELECT id, slug, name, symbol, url
    FROM symbols
    WHERE slug IN (${placeholders})
    ORDER BY name
  `);
  return stmt.all(...slugs) as SymbolEntry[];
}

/**
 * Searches symbols by name or symbol character
 */
export function searchSymbols(query: string): SymbolEntry[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT id, slug, name, symbol, url
    FROM symbols
    WHERE name LIKE ? OR symbol LIKE ? OR slug LIKE ?
    ORDER BY name
  `);
  const searchTerm = `%${query}%`;
  return stmt.all(searchTerm, searchTerm, searchTerm) as SymbolEntry[];
}
