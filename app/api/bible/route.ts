/**
 * ============================================================================
 * KJV 1611 Bible API Route
 * Author: Kris Yotam
 * Description: API endpoint for fetching Bible verses from reference.db.
 *              Provides verse lookup, chapter retrieval, and book listing.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import {
  getBibleVerse,
  getBibleVerseRange,
  getBibleChapter,
  getBibleBooks,
  getBibleBookChapterCount,
} from "@/lib/reference-db";

// ============================================================================
// GET HANDLER
// ============================================================================

/**
 * GET /api/bible
 * Returns Bible verses, chapters, or book information
 *
 * Query Parameters:
 *   - book: Book name (e.g., "Genesis", "John")
 *   - chapter: Chapter number
 *   - verse: Verse number (optional)
 *   - endVerse: End verse for range (optional)
 *   - list: "books" to list all book names
 *   - info: "chapters" to get chapter count for a book
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const book = searchParams.get("book");
    const chapter = searchParams.get("chapter");
    const verse = searchParams.get("verse");
    const endVerse = searchParams.get("endVerse");
    const list = searchParams.get("list");
    const info = searchParams.get("info");

    // List all books
    if (list === "books") {
      const books = getBibleBooks();
      return NextResponse.json({ books });
    }

    // Get chapter count for a book
    if (info === "chapters" && book) {
      const count = getBibleBookChapterCount(book);
      return NextResponse.json({ book, chapterCount: count });
    }

    // Need at least book and chapter for verse lookup
    if (!book || !chapter) {
      return NextResponse.json(
        { error: "Please provide 'book' and 'chapter' parameters" },
        { status: 400 }
      );
    }

    const chapterNum = parseInt(chapter, 10);
    if (isNaN(chapterNum)) {
      return NextResponse.json(
        { error: "Invalid chapter number" },
        { status: 400 }
      );
    }

    // Get specific verse or verse range
    if (verse) {
      const verseNum = parseInt(verse, 10);
      if (isNaN(verseNum)) {
        return NextResponse.json(
          { error: "Invalid verse number" },
          { status: 400 }
        );
      }

      // Range of verses
      if (endVerse) {
        const endVerseNum = parseInt(endVerse, 10);
        if (isNaN(endVerseNum)) {
          return NextResponse.json(
            { error: "Invalid end verse number" },
            { status: 400 }
          );
        }

        const verses = getBibleVerseRange(
          book,
          chapterNum,
          verseNum,
          endVerseNum
        );
        if (verses.length === 0) {
          return NextResponse.json(
            { error: "No verses found for the specified range" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          reference: `${book} ${chapterNum}:${verseNum}-${endVerseNum}`,
          verses,
        });
      }

      // Single verse
      const singleVerse = getBibleVerse(book, chapterNum, verseNum);
      if (!singleVerse) {
        return NextResponse.json(
          { error: "Verse not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        reference: `${book} ${chapterNum}:${verseNum}`,
        verse: singleVerse,
      });
    }

    // Get entire chapter
    const verses = getBibleChapter(book, chapterNum);
    if (verses.length === 0) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      reference: `${book} ${chapterNum}`,
      verses,
    });
  } catch (error: any) {
    console.error("Error fetching Bible data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Bible data", details: error.message },
      { status: 500 }
    );
  }
}
