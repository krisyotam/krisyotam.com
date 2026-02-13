/**
 * ============================================================================
 * Bible Verse Lookup Library
 * Author: Kris Yotam
 * Date: 2026-01-04
 * Updated: 2026-02-09
 * Filename: getVerseFromBible.ts
 * Description: Provides Bible verse lookup from the KJV 1611 translation
 *              via the reference API (backed by SQLite database).
 *              Designed for client-side use.
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VerseResult {
  reference: string;
  text: string;
}

interface BookEntry {
  file: string;
  aliases: string[];
}

// ============================================================================
// BOOK NAME MAPPING
// ============================================================================

const BOOKS: BookEntry[] = [
  { file: "Genesis", aliases: ["genesis", "gen", "ge"] },
  { file: "Exodus", aliases: ["exodus", "exod", "ex"] },
  { file: "Leviticus", aliases: ["leviticus", "lev", "lv"] },
  { file: "Numbers", aliases: ["numbers", "num", "nu"] },
  { file: "Deuteronomy", aliases: ["deuteronomy", "deut", "deu", "dt"] },
  { file: "Joshua", aliases: ["joshua", "josh", "jos", "js"] },
  { file: "Judges", aliases: ["judges", "judg", "jdg", "jg"] },
  { file: "Ruth", aliases: ["ruth", "ru", "rt"] },
  { file: "1 Samuel", aliases: ["1 samuel", "1 sam", "1sa", "i samuel", "1samuel"] },
  { file: "2 Samuel", aliases: ["2 samuel", "2 sam", "2sa", "ii samuel", "2samuel"] },
  { file: "1 Kings", aliases: ["1 kings", "1 kgs", "1ki", "i kings", "1kings"] },
  { file: "2 Kings", aliases: ["2 kings", "2 kgs", "2ki", "ii kings", "2kings"] },
  { file: "1 Chronicles", aliases: ["1 chronicles", "1 chron", "1ch", "i chronicles", "1chronicles"] },
  { file: "2 Chronicles", aliases: ["2 chronicles", "2 chron", "2ch", "ii chronicles", "2chronicles"] },
  { file: "Ezra", aliases: ["ezra", "ezr"] },
  { file: "Nehemiah", aliases: ["nehemiah", "neh", "ne"] },
  { file: "Esther", aliases: ["esther", "est", "es"] },
  { file: "Job", aliases: ["job", "jb"] },
  { file: "Psalms", aliases: ["psalms", "ps", "psalm"] },
  { file: "Proverbs", aliases: ["proverbs", "prov", "prv"] },
  { file: "Ecclesiastes", aliases: ["ecclesiastes", "eccl", "ecc"] },
  { file: "Song of Solomon", aliases: ["song of solomon", "song", "songs", "canticles", "cant"] },
  { file: "Isaiah", aliases: ["isaiah", "isa", "is"] },
  { file: "Jeremiah", aliases: ["jeremiah", "jer", "jr"] },
  { file: "Lamentations", aliases: ["lamentations", "lam", "lm"] },
  { file: "Ezekiel", aliases: ["ezekiel", "ezek", "ezk"] },
  { file: "Daniel", aliases: ["daniel", "dan", "dn"] },
  { file: "Hosea", aliases: ["hosea", "hos", "ho"] },
  { file: "Joel", aliases: ["joel", "jl"] },
  { file: "Amos", aliases: ["amos", "am"] },
  { file: "Obadiah", aliases: ["obadiah", "obad", "ob"] },
  { file: "Jonah", aliases: ["jonah", "jon", "jnh"] },
  { file: "Micah", aliases: ["micah", "mic", "mc"] },
  { file: "Nahum", aliases: ["nahum", "nah", "na"] },
  { file: "Habakkuk", aliases: ["habakkuk", "hab", "hb"] },
  { file: "Zephaniah", aliases: ["zephaniah", "zeph", "zp"] },
  { file: "Haggai", aliases: ["haggai", "hag", "hg"] },
  { file: "Zechariah", aliases: ["zechariah", "zech", "zc"] },
  { file: "Malachi", aliases: ["malachi", "mal", "ml"] },
  { file: "Matthew", aliases: ["matthew", "matt", "mt"] },
  { file: "Mark", aliases: ["mark", "mr", "mk"] },
  { file: "Luke", aliases: ["luke", "luk", "lk"] },
  { file: "John", aliases: ["john", "jn", "jh"] },
  { file: "Acts", aliases: ["acts", "ac", "act"] },
  { file: "Romans", aliases: ["romans", "rom", "rm"] },
  { file: "1 Corinthians", aliases: ["1 corinthians", "1 cor", "1co", "i corinthians", "1corinthians"] },
  { file: "2 Corinthians", aliases: ["2 corinthians", "2 cor", "2co", "ii corinthians", "2corinthians"] },
  { file: "Galatians", aliases: ["galatians", "gal", "ga"] },
  { file: "Ephesians", aliases: ["ephesians", "eph", "ep"] },
  { file: "Philippians", aliases: ["philippians", "phil", "php"] },
  { file: "Colossians", aliases: ["colossians", "col", "co"] },
  { file: "1 Thessalonians", aliases: ["1 thessalonians", "1 thess", "1thess", "i thessalonians", "1thessalonians"] },
  { file: "2 Thessalonians", aliases: ["2 thessalonians", "2 thess", "2thess", "ii thessalonians", "2thessalonians"] },
  { file: "1 Timothy", aliases: ["1 timothy", "1 tim", "1ti", "i timothy"] },
  { file: "2 Timothy", aliases: ["2 timothy", "2 tim", "2ti", "ii timothy"] },
  { file: "Titus", aliases: ["titus", "tit", "ti"] },
  { file: "Philemon", aliases: ["philemon", "philem", "phm"] },
  { file: "Hebrews", aliases: ["hebrews", "heb", "hb"] },
  { file: "James", aliases: ["james", "jam", "jm"] },
  { file: "1 Peter", aliases: ["1 peter", "1 pet", "1pe", "i peter", "1peter"] },
  { file: "2 Peter", aliases: ["2 peter", "2 pet", "2pe", "ii peter", "2peter"] },
  { file: "1 John", aliases: ["1 john", "1 jn", "1jo", "i john", "1john"] },
  { file: "2 John", aliases: ["2 john", "2 jn", "2jo", "ii john", "2john"] },
  { file: "3 John", aliases: ["3 john", "3 jn", "3jo", "iii john", "3john"] },
  { file: "Jude", aliases: ["jude"] },
  { file: "Revelation", aliases: ["revelation", "rev", "re"] },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Minimal Levenshtein distance for fuzzy matching
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenB; i++) matrix[i] = [i];
  for (let j = 0; j <= lenA; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[lenB][lenA];
}

/**
 * Find the best matching book name using fuzzy matching
 */
function findBookName(rawBook: string): string | null {
  let best: { file: string; distance: number } | null = null;
  for (const book of BOOKS) {
    for (const alias of book.aliases) {
      const dist = levenshtein(rawBook, alias);
      if (!best || dist < best.distance) {
        best = { file: book.file, distance: dist };
      }
    }
  }
  return best ? best.file : null;
}

// ============================================================================
// API-BASED VERSE FETCHING
// ============================================================================

/**
 * Fetch verses for a single reference part (e.g., "John 3:16" or "Genesis 1:1-5")
 */
async function fetchRefPart(refPart: string): Promise<VerseResult[]> {
  console.log("Processing reference part:", refPart);

  // Parse the reference
  const m = refPart.toLowerCase().match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) {
    console.error("Failed to parse reference:", refPart);
    return [];
  }
  let [_, rawBook, chapStr, startStr, endStr] = m;

  // Handle Roman numerals in book names
  const romanMap: Record<string, string> = { i: "1", ii: "2", iii: "3" };
  const romanMatch = rawBook.match(/^(i{1,3})\s+(.*)$/);
  if (romanMatch) rawBook = romanMap[romanMatch[1]] + " " + romanMatch[2];

  const chapterNum = parseInt(chapStr, 10);
  const verseStart = parseInt(startStr, 10);
  const verseEnd = endStr ? parseInt(endStr, 10) : verseStart;

  // Find the best matching book name
  const bookName = findBookName(rawBook);
  if (!bookName) {
    console.error("No matching book found for:", rawBook);
    return [];
  }

  console.log("Best matching book:", bookName);

  try {
    // Build API URL
    const params = new URLSearchParams({
      type: "bible",
      book: bookName,
      chapter: chapterNum.toString(),
      verse: verseStart.toString(),
    });

    if (verseEnd !== verseStart) {
      params.set("endVerse", verseEnd.toString());
    }

    const response = await fetch(`/api/reference?${params.toString()}`);

    if (!response.ok) {
      console.error("API error:", response.status);
      return [];
    }

    const data = await response.json();

    // Handle single verse response
    if (data.verse) {
      return [
        {
          reference: `${chapterNum}:${verseStart}`,
          text: data.verse.text,
        },
      ];
    }

    // Handle verse range response
    if (data.verses) {
      return data.verses.map((v: { verse: number; text: string }) => ({
        reference: `${chapterNum}:${v.verse}`,
        text: v.text,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching verses:", error);
    return [];
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Get verses from the Bible for a reference string.
 * Supports comma-separated multiple references.
 *
 * @param ref - Reference string like "John 3:16" or "Genesis 1:1-5, Exodus 20:1-17"
 * @returns Array of verse results
 */
export async function getVerseFromBible(ref: string): Promise<VerseResult[]> {
  console.log("Getting verses for:", ref);
  const parts = ref
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const all: VerseResult[] = [];
  for (const part of parts) {
    const partVerses = await fetchRefPart(part);
    all.push(...partVerses);
  }
  console.log(`Retrieved ${all.length} verses`);
  return all;
}
