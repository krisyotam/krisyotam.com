// getVerseFromBible.ts
import { decode } from '@msgpack/msgpack';

// Minimal Levenshtein distance for fuzzy matching
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

interface BookEntry {
  file: string;
  aliases: string[];
}

const BOOKS: BookEntry[] = [
  { file: "Genesis", aliases: ["genesis","gen","ge"] },
  { file: "Exodus", aliases: ["exodus","exod","ex"] },
  { file: "Leviticus", aliases: ["leviticus","lev","lv"] },
  { file: "Numbers", aliases: ["numbers","num","nu"] },
  { file: "Deuteronomy", aliases: ["deuteronomy","deut","deu","dt"] },
  { file: "Joshua", aliases: ["joshua","josh","jos","js"] },
  { file: "Judges", aliases: ["judges","judg","jdg","jg"] },
  { file: "Ruth", aliases: ["ruth","ru","rt"] },
  { file: "1 Samuel", aliases: ["1 samuel","1 sam","1sa","i samuel","1samuel"] },
  { file: "2 Samuel", aliases: ["2 samuel","2 sam","2sa","ii samuel","2samuel"] },
  { file: "1 Kings", aliases: ["1 kings","1 kgs","1ki","i kings","1kings"] },
  { file: "2 Kings", aliases: ["2 kings","2 kgs","2ki","ii kings","2kings"] },
  { file: "1 Chronicles", aliases: ["1 chronicles","1 chron","1ch","i chronicles","1chronicles"] },
  { file: "2 Chronicles", aliases: ["2 chronicles","2 chron","2ch","ii chronicles","2chronicles"] },
  { file: "Ezra", aliases: ["ezra","ezr"] },
  { file: "Nehemiah", aliases: ["nehemiah","neh","ne"] },
  { file: "Esther", aliases: ["esther","est","es"] },
  { file: "Job", aliases: ["job","jb"] },
  { file: "Psalms", aliases: ["psalms","ps","psalm"] },
  { file: "Proverbs", aliases: ["proverbs","prov","prv"] },
  { file: "Ecclesiastes", aliases: ["ecclesiastes","eccl","ecc"] },
  { file: "Song of Solomon", aliases: ["song of solomon","song","songs","canticles","cant"] },
  { file: "Isaiah", aliases: ["isaiah","isa","is"] },
  { file: "Jeremiah", aliases: ["jeremiah","jer","jr"] },
  { file: "Lamentations", aliases: ["lamentations","lam","lm"] },
  { file: "Ezekiel", aliases: ["ezekiel","ezek","ezk"] },
  { file: "Daniel", aliases: ["daniel","dan","dn"] },
  { file: "Hosea", aliases: ["hosea","hos","ho"] },
  { file: "Joel", aliases: ["joel","jl"] },
  { file: "Amos", aliases: ["amos","am"] },
  { file: "Obadiah", aliases: ["obadiah","obad","ob"] },
  { file: "Jonah", aliases: ["jonah","jon","jnh"] },
  { file: "Micah", aliases: ["micah","mic","mc"] },
  { file: "Nahum", aliases: ["nahum","nah","na"] },
  { file: "Habakkuk", aliases: ["habakkuk","hab","hb"] },
  { file: "Zephaniah", aliases: ["zephaniah","zeph","zp"] },
  { file: "Haggai", aliases: ["haggai","hag","hg"] },
  { file: "Zechariah", aliases: ["zechariah","zech","zc"] },
  { file: "Malachi", aliases: ["malachi","mal","ml"] },
  { file: "Matthew", aliases: ["matthew","matt","mt"] },
  { file: "Mark", aliases: ["mark","mr","mk"] },
  { file: "Luke", aliases: ["luke","luk","lk"] },
  { file: "John", aliases: ["john","jn","jh"] },
  { file: "Acts", aliases: ["acts","ac","act"] },
  { file: "Romans", aliases: ["romans","rom","rm"] },
  { file: "1 Corinthians", aliases: ["1 corinthians","1 cor","1co","i corinthians","1corinthians"] },
  { file: "2 Corinthians", aliases: ["2 corinthians","2 cor","2co","ii corinthians","2corinthians"] },
  { file: "Galatians", aliases: ["galatians","gal","ga"] },
  { file: "Ephesians", aliases: ["ephesians","eph","ep"] },
  { file: "Philippians", aliases: ["philippians","phil","php"] },
  { file: "Colossians", aliases: ["colossians","col","co"] },
  { file: "1 Thessalonians", aliases: ["1 thessalonians","1 thess","1thess","i thessalonians","1thessalonians"] },
  { file: "2 Thessalonians", aliases: ["2 thessalonians","2 thess","2thess","ii thessalonians","2thessalonians"] },
  { file: "1 Timothy", aliases: ["1 timothy","1 tim","1ti","i timothy"] },
  { file: "2 Timothy", aliases: ["2 timothy","2 tim","2ti","ii timothy"] },
  { file: "Titus", aliases: ["titus","tit","ti"] },
  { file: "Philemon", aliases: ["philemon","philem","phm"] },
  { file: "Hebrews", aliases: ["hebrews","heb","hb"] },
  { file: "James", aliases: ["james","jam","jm"] },
  { file: "1 Peter", aliases: ["1 peter","1 pet","1pe","i peter","1peter"] },
  { file: "2 Peter", aliases: ["2 peter","2 pet","2pe","ii peter","2peter"] },
  { file: "1 John", aliases: ["1 john","1 jn","1jo","i john","1john"] },
  { file: "2 John", aliases: ["2 john","2 jn","2jo","ii john","2john"] },
  { file: "3 John", aliases: ["3 john","3 jn","3jo","iii john","3john"] },
  { file: "Jude", aliases: ["jude"] },
  { file: "Revelation", aliases: ["revelation","rev","re"] }
];

// Global cache for Bible data
let bibleData: any = null;
let loadedStrongsGreek: Record<string, any> | null = null;
let loadedStrongsHebrew: Record<string, any> | null = null;

// Define types for Bible data
interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

interface BibleBook {
  book: string;
  chapters: BibleChapter[];
}

export interface VerseResult {
  reference: string;
  text: string;
}

// Load the Bible data from MessagePack file
async function loadBibleData() {
  if (bibleData) return bibleData;
  
  try {
    console.log("Attempting to load Bible MessagePack data");
    
    // Try to load from the API endpoint first (most reliable)
    try {
      console.log("Loading from API endpoint");
      const response = await fetch('/api/bible');
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      console.log("MessagePack data fetched from API, size:", arrayBuffer.byteLength);
      
      const decoded = decode(new Uint8Array(arrayBuffer));
      console.log("Bible data decoded successfully");
      
      // Examine the structure of the decoded data
      console.log("Bible data type:", typeof decoded);
      console.log("Is array:", Array.isArray(decoded));
      if (decoded && typeof decoded === 'object') {
        console.log("Object keys:", Object.keys(decoded));
        if (Array.isArray(decoded)) {
          console.log("Array length:", decoded.length);
          if (decoded.length > 0) {
            console.log("First item type:", typeof decoded[0]);
            console.log("First item keys:", decoded[0] ? Object.keys(decoded[0]) : "empty");
          }
        }
      }
      
      bibleData = decoded;
      return bibleData;
    } catch (apiError) {
      console.error("API fetch failed:", apiError);
      
      // Try to load from the source data directory
      console.log("Trying to load from source data");
      const jsonResponse = await fetch('/data/reference/source-data/1611kjv.json');
      if (!jsonResponse.ok) {
        throw new Error(`JSON fallback failed: ${jsonResponse.status}`);
      }
      
      const jsonData = await jsonResponse.json();
      
      // Log JSON data structure as well
      console.log("JSON data type:", typeof jsonData);
      console.log("JSON is array:", Array.isArray(jsonData));
      if (jsonData && typeof jsonData === 'object') {
        console.log("JSON object keys:", Object.keys(jsonData));
        if (Array.isArray(jsonData)) {
          console.log("JSON array length:", jsonData.length);
          if (jsonData.length > 0) {
            console.log("JSON first item type:", typeof jsonData[0]);
            console.log("JSON first item keys:", jsonData[0] ? Object.keys(jsonData[0]) : "empty");
          }
        }
      }
      
      bibleData = jsonData;
      console.log('Successfully loaded Bible data from JSON');
      return bibleData;
    }
  } catch (error) {
    console.error('All Bible data loading attempts failed:', error);
    return null;
  }
}

async function fetchStrongsGreek() {
  if (loadedStrongsGreek) return;
  try {
    const res = await fetch('https://raw.githubusercontent.com/krisyotam/strongs/main/strongs-greek.json');
    if (!res.ok) throw new Error(`Failed to fetch Greek Strong's: ${res.status}`);
    loadedStrongsGreek = await res.json();
  } catch (error) {
    console.error('Failed to load strongs-greek.json:', error);
    loadedStrongsGreek = {};
  }
}

async function fetchStrongsHebrew() {
  if (loadedStrongsHebrew) return;
  try {
    const res = await fetch('https://raw.githubusercontent.com/krisyotam/strongs/main/strongs-hebrew.json');
    if (!res.ok) throw new Error(`Failed to fetch Hebrew Strong's: ${res.status}`);
    loadedStrongsHebrew = await res.json();
  } catch (error) {
    console.error('Failed to load strongs-hebrew.json:', error);
    loadedStrongsHebrew = {};
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function annotateWithStrongs(text: string, dict: Record<string, any>, isOT: boolean): string {
  let annotated = text;
  for (const key in dict) {
    const entry = dict[key];
    const word = isOT ? entry.lemma : entry.greek_unicode;
    const strongsId = isOT ? key : "G" + entry.strongs.padStart(3, "0");

    if (word && word.length > 1) {
      const regex = new RegExp(`(${escapeRegExp(word)})`, 'g');
      annotated = annotated.replace(regex, `$1<sup>${strongsId}</sup>`);
    }
  }
  return annotated;
}

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
  const romanMap: Record<string,string> = { i: "1", ii: "2", iii: "3" };
  const romanMatch = rawBook.match(/^(i{1,3})\s+(.*)$/);
  if (romanMatch) rawBook = romanMap[romanMatch[1]] + " " + romanMatch[2];

  const chapterNum = parseInt(chapStr, 10);
  const verseStart = parseInt(startStr, 10);
  const verseEnd = endStr ? parseInt(endStr, 10) : verseStart;

  // Find the best matching book name
  let best: { file: string; distance: number } | null = null;
  for (const book of BOOKS) {
    for (const alias of book.aliases) {
      const dist = levenshtein(rawBook, alias);
      if (!best || dist < best.distance) {
        best = { file: book.file, distance: dist };
      }
    }
  }
  if (!best) {
    console.error("No matching book found for:", rawBook);
    return [];
  }

  console.log("Best matching book:", best.file);
  const bookName = best.file;

  // Load Bible data
  const bible = await loadBibleData();
  if (!bible) {
    console.error("Failed to load Bible data");
    return [];
  }

  // Debug information about the bible data
  console.log("Bible data in fetchRefPart:", typeof bible);
  console.log("Is array:", Array.isArray(bible));

  // Find the book - handle both array and object formats
  let bookData = null;
  if (Array.isArray(bible)) {
    console.log("Searching for book in array format");
    bookData = bible.find((b: any) => b && b.book === bookName);
  } else if (typeof bible === 'object' && bible !== null) {
    console.log("Searching for book in object format");
    // If bible is an object with books as properties
    if (bible.books && Array.isArray(bible.books)) {
      bookData = bible.books.find((b: any) => b && b.book === bookName);
    } else {
      // If bible has book names as direct properties
      bookData = bible[bookName] || null;
    }
  }
  
  if (!bookData) {
    console.error(`Book ${bookName} not found in Bible data`);
    console.log("Available books:", Array.isArray(bible) 
      ? bible.map((b: any) => b && b.book).filter(Boolean)
      : typeof bible === 'object' && bible !== null 
        ? Object.keys(bible)
        : "No books available");
    return [];
  }

  console.log("Book data found:", typeof bookData);
  if (bookData) console.log("Book data keys:", Object.keys(bookData));

  // Determine if Old Testament
  const isOldTestament = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
    "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job",
    "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
    "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi"
  ].includes(bookName);

  // Load Strong's dictionaries
  if (isOldTestament) await fetchStrongsHebrew();
  else await fetchStrongsGreek();

  const dict = isOldTestament ? loadedStrongsHebrew! : loadedStrongsGreek!;

  // Find chapters - handle different data structures
  let chapter = null;
  if (bookData.chapters && Array.isArray(bookData.chapters)) {
    console.log("Finding chapter in array format");
    chapter = bookData.chapters.find((c: any) => c && c.chapter === chapterNum);
  } else if (typeof bookData === 'object' && bookData !== null) {
    console.log("Finding chapter in object format");
    chapter = bookData[`chapter${chapterNum}`] || bookData[chapterNum] || null;
  }

  if (!chapter) {
    console.error(`Chapter ${chapterNum} not found in ${bookName}`);
    console.log("Available chapters:", bookData.chapters && Array.isArray(bookData.chapters)
      ? bookData.chapters.map((c: any) => c && c.chapter).filter(Boolean)
      : typeof bookData === 'object' && bookData !== null
        ? Object.keys(bookData)
        : "No chapters available");
    return [];
  }

  console.log(`Found chapter ${chapterNum}, structure:`, typeof chapter);
  if (chapter) console.log("Chapter keys:", Object.keys(chapter));

  // Find verses - handle different data structures
  const verses: VerseResult[] = [];
  
  // Function to add a verse to our results
  const addVerse = (verseNum: number, text: string) => {
    if (text) {
      console.log(`Found verse ${verseNum}`);
      const annotatedText = annotateWithStrongs(text, dict, isOldTestament);
      verses.push({ reference: `${chapterNum}:${verseNum}`, text: annotatedText });
    }
  };
  
  // Handle different verse structures
  if (chapter.verses && Array.isArray(chapter.verses)) {
    console.log("Finding verses in array format");
    for (let v = verseStart; v <= verseEnd; v++) {
      const vObj = chapter.verses.find((x: any) => x && x.verse === v);
      if (vObj && vObj.text) {
        addVerse(v, vObj.text);
      } else {
        console.log(`Verse ${v} not found in array format`);
      }
    }
  } else if (typeof chapter === 'object' && chapter !== null) {
    console.log("Finding verses in object format");
    for (let v = verseStart; v <= verseEnd; v++) {
      const verseText = chapter[`verse${v}`] || chapter[v];
      if (verseText) {
        addVerse(v, typeof verseText === 'string' ? verseText : verseText.text || "");
      } else {
        console.log(`Verse ${v} not found in object format`);
      }
    }
  }
  
  console.log(`Retrieved ${verses.length} verses for reference part: ${refPart}`);
  return verses;
}

export async function getVerseFromBible(ref: string): Promise<VerseResult[]> {
  console.log("Getting verses for:", ref);
  const parts = ref.split(",").map(p => p.trim()).filter(Boolean);
  const all: VerseResult[] = [];
  for (const part of parts) {
    const partVerses = await fetchRefPart(part);
    all.push(...partVerses);
  }
  console.log(`Retrieved ${all.length} verses`);
  return all;
}
  