/* =============================================================================
 * READING COMPONENTS
 * Unified component file for all reading-related UI
 *
 * Sections:
 *   1. IMPORTS
 *   2. TYPES & INTERFACES
 *   3. CONFIGURATION
 *   4. HELPER FUNCTIONS
 *   5. UI COMPONENTS
 *      - ReadingNavigation (main page tabs)
 *      - ReadingBookCard (book display card)
 *      - ReadingDataLoader (loading/error wrapper)
 *   6. TABLE COMPONENTS
 *      - ReadTable (unified table for blogs, stories, verse, essays, papers)
 *   7. CONTENT SECTIONS
 *      - ReadingSubTabs (sub-navigation for /read page)
 *      - ReadingLists (curated reading lists)
 *      - CurrentlyReading (homepage widget)
 *   8. PAGE CONTENT
 *      - ReadingPageContent (main page router)
 *   9. EXPORTS
 * ============================================================================= */

"use client"

/* =============================================================================
 * 1. IMPORTS
 * ============================================================================= */

import React, { useState, useEffect, useMemo, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Star, BookOpen, PenLine, CheckCircle2, BookMarked, FileText, Quote as QuoteIcon } from "lucide-react"
import { Navigation } from "@/components/content/navigation"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CustomSelect } from "@/components/ui/custom-select"
import { useReadingData } from "@/app/(reading)/reading-data-context"

/* =============================================================================
 * 2. TYPES & INTERFACES
 * ============================================================================= */

// Page type for routing
export type ReadingPageType =
  | "reading"
  | "read"
  | "want-to-read"
  | "reading-lists"
  | "reading-log"
  | "reading-stats"

// Content type for tables
type ContentType = 'blogs' | 'short-stories' | 'verse' | 'essays' | 'papers'

// Sub-tab type for /read page
type ReadingSubTabType = "books" | "audiobooks" | "blog-posts" | "short-stories" | "verse" | "essays" | "papers"

// Book interfaces
interface Book {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface JsonBook {
  title: string
  subtitle: string
  author: string
  cover: string
  link: string
}

interface Audiobook {
  title: string
  subtitle?: string
  author: string
  cover?: string
  link?: string
}

// Table item interface
interface ReadTableItem {
  title: string
  author: string | string[]
  publication_year: number
  source_link?: string
  archive_link?: string
  verse_type?: string
}

// Reading log interfaces
interface ReadingLogEntry {
  date: string
  title: string
  author: string
  type: string
  minutes: number
}

interface ReadingLogData {
  log: ReadingLogEntry[]
}

// Journal entry from Hardcover API (faux data for now)
interface JournalEntry {
  id: string
  event: 'note' | 'quote' | 'progress_updated' | 'status_read' | 'status_currently_reading' | 'rated' | 'reviewed'
  entry: string | null
  action_at: string
  book: {
    title: string
    author: string
    cover: string | null
    pages: number
  }
  progress: number | null
  progress_pages: number | null
  rating: number | null
  minutes: number | null
}

// Reading lists interfaces
interface LocalBook {
  title: string
  isbn13: string
}

interface ReadingList {
  id: string
  title: string
  description: string
  author: string
  books: LocalBook[]
}

interface ReadingListsData {
  lists: ReadingList[]
}

/* =============================================================================
 * 3. CONFIGURATION
 * ============================================================================= */

// Table content type configuration
const contentConfig: Record<ContentType, {
  label: string
  labelPlural: string
  apiType: string
  responseKey: string
}> = {
  'blogs': { label: 'blog post', labelPlural: 'blog posts', apiType: 'blogs', responseKey: 'blogs' },
  'short-stories': { label: 'short story', labelPlural: 'short stories', apiType: 'short-stories', responseKey: 'stories' },
  'verse': { label: 'verse', labelPlural: 'verses', apiType: 'verse', responseKey: 'verse' },
  'essays': { label: 'essay', labelPlural: 'essays', apiType: 'essays', responseKey: 'essays' },
  'papers': { label: 'paper', labelPlural: 'papers', apiType: 'papers', responseKey: 'papers' }
}

// Sub-tab labels for /read page
const subTabLabels: Record<ReadingSubTabType, string> = {
  "books": "Books",
  "audiobooks": "Audiobooks",
  "blog-posts": "Blog Posts",
  "short-stories": "Short Stories",
  "verse": "Verse",
  "essays": "Essays",
  "papers": "Papers",
}

// Currently reading static data (update when changing books)
const CURRENT_BOOK = {
  title: "My Year of Rest and Relaxation",
  author: "Ottessa Moshfegh",
  coverImage: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
}

// Faux currently-reading data (will be replaced by Hardcover API data)
interface CurrentlyReadingBook {
  id: number
  title: string
  subtitle: string | null
  author: string
  cover: string | null
  pages: number
  progress: number          // 0-1
  progress_pages: number
  started_at: string
  edition_format: string    // hardcover, paperback, ebook, audiobook
  rating_community: number  // community avg rating
}

const FAUX_CURRENTLY_READING: CurrentlyReadingBook[] = [
  {
    id: 1,
    title: "My Year of Rest and Relaxation",
    subtitle: null,
    author: "Ottessa Moshfegh",
    cover: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
    pages: 304,
    progress: 0.28,
    progress_pages: 85,
    started_at: "2026-02-14",
    edition_format: "paperback",
    rating_community: 3.8,
  },
  {
    id: 2,
    title: "The Bell Jar",
    subtitle: null,
    author: "Sylvia Plath",
    cover: null,
    pages: 244,
    progress: 0.12,
    progress_pages: 29,
    started_at: "2026-02-12",
    edition_format: "hardcover",
    rating_community: 4.1,
  },
  {
    id: 3,
    title: "Meditations",
    subtitle: "A New Translation",
    author: "Marcus Aurelius",
    cover: null,
    pages: 256,
    progress: 0.65,
    progress_pages: 166,
    started_at: "2026-01-28",
    edition_format: "ebook",
    rating_community: 4.3,
  },
]

// Faux want-to-read data (will be replaced by Hardcover API data)
interface WantToReadBook {
  id: number
  title: string
  author: string
  cover: string | null
  pages: number
  release_year: number | null
  rating_community: number
  edition_format: string
  date_added: string
}

const IMG = 'https://krisyotam.com/doc/media/images/literature'

const FAUX_WANT_TO_READ: WantToReadBook[] = [
  { id: 1, title: 'Blood Meridian', author: 'Cormac McCarthy', cover: `${IMG}/1985-blood-meridian-cormac-mccarthy.jpg`, pages: 337, release_year: 1985, rating_community: 4.2, edition_format: 'paperback', date_added: '2026-02-10' },
  { id: 2, title: 'Infinite Jest', author: 'David Foster Wallace', cover: `${IMG}/1996-infinite-jest-david-foster-wallace.jpg`, pages: 1079, release_year: 1996, rating_community: 3.9, edition_format: 'paperback', date_added: '2026-02-08' },
  { id: 3, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', cover: `${IMG}/1866-crime-and-punishment-fyodor-dostoevsky.jpg`, pages: 671, release_year: 1866, rating_community: 4.3, edition_format: 'paperback', date_added: '2026-02-05' },
  { id: 4, title: 'Anna Karenina', author: 'Leo Tolstoy', cover: `${IMG}/1877-anna-karenina-leo-tolstoy.jpg`, pages: 864, release_year: 1877, rating_community: 4.2, edition_format: 'hardcover', date_added: '2026-01-28' },
  { id: 5, title: 'The Trial', author: 'Franz Kafka', cover: `${IMG}/1925-the-trial-franz-kafka.jpg`, pages: 255, release_year: 1925, rating_community: 4.1, edition_format: 'paperback', date_added: '2026-01-25' },
  { id: 6, title: 'A Room of One\'s Own', author: 'Virginia Woolf', cover: `${IMG}/1929-a-room-of-ones-own-virginia-woolf.jpg`, pages: 172, release_year: 1929, rating_community: 4.1, edition_format: 'paperback', date_added: '2026-01-20' },
  { id: 7, title: 'Girl, Interrupted', author: 'Susanna Kaysen', cover: `${IMG}/1993-girl-interrupted-susanna-kaysen.jpg`, pages: 169, release_year: 1993, rating_community: 3.8, edition_format: 'paperback', date_added: '2026-01-18' },
  { id: 8, title: 'Never Let Me Go', author: 'Kazuo Ishiguro', cover: `${IMG}/2005-never-let-me-go-kazuo-ishiguro.jpg`, pages: 288, release_year: 2005, rating_community: 4.0, edition_format: 'paperback', date_added: '2026-01-15' },
  { id: 9, title: 'The Metamorphosis', author: 'Franz Kafka', cover: `${IMG}/1915-the-metamorphosis-franz-kafka.jpg`, pages: 201, release_year: 1915, rating_community: 4.0, edition_format: 'hardcover', date_added: '2026-01-10' },
  { id: 10, title: 'Pride and Prejudice', author: 'Jane Austen', cover: `${IMG}/1813-pride-and-prejudice-jane-austen.jpg`, pages: 432, release_year: 1813, rating_community: 4.3, edition_format: 'paperback', date_added: '2026-01-08' },
  { id: 11, title: 'Emma', author: 'Jane Austen', cover: `${IMG}/1815-emma-jane-austen.webp`, pages: 474, release_year: 1815, rating_community: 4.0, edition_format: 'paperback', date_added: '2026-01-05' },
  { id: 12, title: 'Scythe', author: 'Neal Shusterman', cover: `${IMG}/2016-scythe-neal-shusterman.jpg`, pages: 435, release_year: 2016, rating_community: 4.2, edition_format: 'hardcover', date_added: '2025-12-28' },
  { id: 13, title: 'The Complete Essays', author: 'Michel de Montaigne', cover: `${IMG}/1580-the-complete-essays-michel-de-montaigne.jpg`, pages: 1344, release_year: 1580, rating_community: 4.2, edition_format: 'paperback', date_added: '2025-12-20' },
  { id: 14, title: 'Atomic Habits', author: 'James Clear', cover: `${IMG}/2018-atomic-habits-james-clear.jpg`, pages: 320, release_year: 2018, rating_community: 4.1, edition_format: 'hardcover', date_added: '2025-12-15' },
  { id: 15, title: 'Ikigai', author: 'Hector Garcia', cover: `${IMG}/2016-ikigai-hector-garcia.jpg`, pages: 208, release_year: 2016, rating_community: 3.7, edition_format: 'paperback', date_added: '2025-12-10' },
  { id: 16, title: 'Myths from Mesopotamia', author: 'Oxford World Classics', cover: `${IMG}/1989-myths-from-mesopotamia-oxford-world-classics.jpg`, pages: 256, release_year: 1989, rating_community: 3.9, edition_format: 'paperback', date_added: '2025-12-05' },
]

// Faux Hardcover lists data (will be replaced by API data)
interface HcList {
  id: number
  title: string
  description: string
  slug: string
  books_count: number
  created_at: string
  books: WantToReadBook[]
}

const FAUX_LISTS: HcList[] = [
  {
    id: 1,
    title: "Canon of Western Literature",
    description: "The essential works of the Western literary tradition. Books that shaped the way we think, write, and argue.",
    slug: "canon-western-literature",
    books_count: 8,
    created_at: "2026-01-05",
    books: [
      { id: 101, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', cover: `${IMG}/1866-crime-and-punishment-fyodor-dostoevsky.jpg`, pages: 671, release_year: 1866, rating_community: 4.3, edition_format: 'paperback', date_added: '2026-01-05' },
      { id: 102, title: 'Anna Karenina', author: 'Leo Tolstoy', cover: `${IMG}/1877-anna-karenina-leo-tolstoy.jpg`, pages: 864, release_year: 1877, rating_community: 4.2, edition_format: 'paperback', date_added: '2026-01-05' },
      { id: 103, title: 'Pride and Prejudice', author: 'Jane Austen', cover: `${IMG}/1813-pride-and-prejudice-jane-austen.jpg`, pages: 432, release_year: 1813, rating_community: 4.3, edition_format: 'paperback', date_added: '2026-01-06' },
      { id: 104, title: 'Emma', author: 'Jane Austen', cover: `${IMG}/1815-emma-jane-austen.webp`, pages: 474, release_year: 1815, rating_community: 4.0, edition_format: 'paperback', date_added: '2026-01-06' },
      { id: 105, title: 'The Metamorphosis', author: 'Franz Kafka', cover: `${IMG}/1915-the-metamorphosis-franz-kafka.jpg`, pages: 201, release_year: 1915, rating_community: 4.0, edition_format: 'paperback', date_added: '2026-01-07' },
      { id: 106, title: 'The Trial', author: 'Franz Kafka', cover: `${IMG}/1925-the-trial-franz-kafka.jpg`, pages: 255, release_year: 1925, rating_community: 4.1, edition_format: 'hardcover', date_added: '2026-01-07' },
      { id: 107, title: 'A Room of One\'s Own', author: 'Virginia Woolf', cover: `${IMG}/1929-a-room-of-ones-own-virginia-woolf.jpg`, pages: 172, release_year: 1929, rating_community: 4.1, edition_format: 'paperback', date_added: '2026-01-08' },
      { id: 108, title: 'The Complete Essays', author: 'Michel de Montaigne', cover: `${IMG}/1580-the-complete-essays-michel-de-montaigne.jpg`, pages: 1344, release_year: 1580, rating_community: 4.2, edition_format: 'hardcover', date_added: '2026-01-08' },
    ],
  },
  {
    id: 2,
    title: "Modern Novels",
    description: "Landmark novels of the 20th and 21st century — from maximalist epics to quiet devastation.",
    slug: "modern-novels",
    books_count: 6,
    created_at: "2026-01-12",
    books: [
      { id: 201, title: 'Infinite Jest', author: 'David Foster Wallace', cover: `${IMG}/1996-infinite-jest-david-foster-wallace.jpg`, pages: 1079, release_year: 1996, rating_community: 3.9, edition_format: 'paperback', date_added: '2026-01-12' },
      { id: 202, title: 'Never Let Me Go', author: 'Kazuo Ishiguro', cover: `${IMG}/2005-never-let-me-go-kazuo-ishiguro.jpg`, pages: 288, release_year: 2005, rating_community: 4.0, edition_format: 'paperback', date_added: '2026-01-12' },
      { id: 203, title: 'Blood Meridian', author: 'Cormac McCarthy', cover: `${IMG}/1985-blood-meridian-cormac-mccarthy.jpg`, pages: 337, release_year: 1985, rating_community: 4.2, edition_format: 'paperback', date_added: '2026-01-13' },
      { id: 204, title: 'My Year of Rest and Relaxation', author: 'Ottessa Moshfegh', cover: `${IMG}/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg`, pages: 304, release_year: 2018, rating_community: 3.8, edition_format: 'paperback', date_added: '2026-01-13' },
      { id: 205, title: 'Girl, Interrupted', author: 'Susanna Kaysen', cover: `${IMG}/1993-girl-interrupted-susanna-kaysen.jpg`, pages: 169, release_year: 1993, rating_community: 3.8, edition_format: 'paperback', date_added: '2026-01-14' },
      { id: 206, title: 'Scythe', author: 'Neal Shusterman', cover: `${IMG}/2016-scythe-neal-shusterman.jpg`, pages: 435, release_year: 2016, rating_community: 4.2, edition_format: 'hardcover', date_added: '2026-01-14' },
    ],
  },
  {
    id: 3,
    title: "Ancient & Classical",
    description: "The oldest surviving texts — philosophy, myth, and geometry from the foundations of civilization.",
    slug: "ancient-classical",
    books_count: 4,
    created_at: "2026-01-20",
    books: [
      { id: 301, title: 'Euclid\'s Elements', author: 'Euclid', cover: `${IMG}/0300bc-euclids-elements-euclid.jpg`, pages: 527, release_year: -300, rating_community: 4.4, edition_format: 'hardcover', date_added: '2026-01-20' },
      { id: 302, title: 'Myths from Mesopotamia', author: 'Oxford World Classics', cover: `${IMG}/1989-myths-from-mesopotamia-oxford-world-classics.jpg`, pages: 256, release_year: 1989, rating_community: 3.9, edition_format: 'paperback', date_added: '2026-01-20' },
      { id: 303, title: 'The First Philosophers', author: 'Oxford Classics', cover: `${IMG}/2000-the-first-philosophers-oxford-classics.jpg`, pages: 320, release_year: 2000, rating_community: 4.0, edition_format: 'paperback', date_added: '2026-01-21' },
      { id: 304, title: 'Grimm\'s Fairy Tales', author: 'Brothers Grimm', cover: `${IMG}/1812-grimms-fairy-tales-brothers-grimm.jpeg`, pages: 656, release_year: 1812, rating_community: 4.1, edition_format: 'hardcover', date_added: '2026-01-21' },
    ],
  },
  {
    id: 4,
    title: "Self-Improvement & Habits",
    description: "Practical frameworks for building better systems, finding purpose, and optimizing daily life.",
    slug: "self-improvement-habits",
    books_count: 4,
    created_at: "2026-02-01",
    books: [
      { id: 401, title: 'Atomic Habits', author: 'James Clear', cover: `${IMG}/2018-atomic-habits-james-clear.jpg`, pages: 320, release_year: 2018, rating_community: 4.1, edition_format: 'hardcover', date_added: '2026-02-01' },
      { id: 402, title: 'Ikigai', author: 'Hector Garcia', cover: `${IMG}/2016-ikigai-hector-garcia.jpg`, pages: 208, release_year: 2016, rating_community: 3.7, edition_format: 'paperback', date_added: '2026-02-01' },
      { id: 403, title: 'Ultralearning', author: 'Scott Young', cover: `${IMG}/2019-ultralearning-scott-young.jpg`, pages: 304, release_year: 2019, rating_community: 3.8, edition_format: 'paperback', date_added: '2026-02-02' },
      { id: 404, title: 'A Mathematician\'s Lament', author: 'Paul Lockhart', cover: `${IMG}/2009-a-mathematicians-lament-paul-lockhart.jpg`, pages: 140, release_year: 2009, rating_community: 4.1, edition_format: 'paperback', date_added: '2026-02-02' },
    ],
  },
]

// Journal event type configuration
const journalEventConfig: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  'progress_updated': { label: 'Progress', Icon: BookOpen },
  'note': { label: 'Note', Icon: PenLine },
  'quote': { label: 'Quote', Icon: QuoteIcon },
  'status_currently_reading': { label: 'Started', Icon: BookMarked },
  'status_read': { label: 'Finished', Icon: CheckCircle2 },
  'rated': { label: 'Rated', Icon: Star },
  'reviewed': { label: 'Review', Icon: FileText },
}

// Event filter options for Navigation dropdown
const journalEventFilterOptions = [
  { value: 'all', label: 'All Events' },
  { value: 'note', label: 'Notes' },
  { value: 'quote', label: 'Quotes' },
  { value: 'progress_updated', label: 'Progress' },
  { value: 'status_currently_reading', label: 'Started' },
  { value: 'status_read', label: 'Finished' },
  { value: 'rated', label: 'Ratings' },
  { value: 'reviewed', label: 'Reviews' },
]

// Faux journal entries (will be replaced by Hardcover API data)
const FAUX_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    event: "status_currently_reading",
    entry: null,
    action_at: "2026-02-18T10:30:00Z",
    book: {
      title: "My Year of Rest and Relaxation",
      author: "Ottessa Moshfegh",
      cover: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
      pages: 304,
    },
    progress: 0,
    progress_pages: 0,
    rating: null,
    minutes: null,
  },
  {
    id: "2",
    event: "progress_updated",
    entry: null,
    action_at: "2026-02-18T22:15:00Z",
    book: {
      title: "My Year of Rest and Relaxation",
      author: "Ottessa Moshfegh",
      cover: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
      pages: 304,
    },
    progress: 0.15,
    progress_pages: 45,
    rating: null,
    minutes: 40,
  },
  {
    id: "3",
    event: "note",
    entry: "The narrator's detachment from reality is immediately striking. Moshfegh writes sleep not as escape but as a kind of violence against the self \u2014 a refusal to participate that reads as both privilege and protest.",
    action_at: "2026-02-17T23:45:00Z",
    book: {
      title: "My Year of Rest and Relaxation",
      author: "Ottessa Moshfegh",
      cover: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
      pages: 304,
    },
    progress: 0.28,
    progress_pages: 85,
    rating: null,
    minutes: 55,
  },
  {
    id: "4",
    event: "quote",
    entry: "\u201CI wasn't going to get anywhere by caring about what happened to me. That was the whole problem.\u201D",
    action_at: "2026-02-16T20:00:00Z",
    book: {
      title: "My Year of Rest and Relaxation",
      author: "Ottessa Moshfegh",
      cover: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
      pages: 304,
    },
    progress: 0.22,
    progress_pages: 67,
    rating: null,
    minutes: null,
  },
  {
    id: "5",
    event: "status_read",
    entry: null,
    action_at: "2026-02-15T16:30:00Z",
    book: {
      title: "Stoner",
      author: "John Williams",
      cover: null,
      pages: 278,
    },
    progress: 1.0,
    progress_pages: 278,
    rating: null,
    minutes: null,
  },
  {
    id: "6",
    event: "rated",
    entry: null,
    action_at: "2026-02-15T16:35:00Z",
    book: {
      title: "Stoner",
      author: "John Williams",
      cover: null,
      pages: 278,
    },
    progress: 1.0,
    progress_pages: 278,
    rating: 5,
    minutes: null,
  },
  {
    id: "7",
    event: "reviewed",
    entry: "Williams writes with the quiet precision of someone who understands that most lives are not dramatic but are nonetheless profound. Stoner is a novel about the dignity of an ordinary life lived with integrity. The prose is so clean it becomes invisible \u2014 you're simply inside this man's existence. The academic politics, the failed marriage, the brief affair \u2014 none of it is sensationalized. It's devastating in its restraint.",
    action_at: "2026-02-15T17:00:00Z",
    book: {
      title: "Stoner",
      author: "John Williams",
      cover: null,
      pages: 278,
    },
    progress: 1.0,
    progress_pages: 278,
    rating: 5,
    minutes: null,
  },
  {
    id: "8",
    event: "progress_updated",
    entry: null,
    action_at: "2026-02-14T21:00:00Z",
    book: {
      title: "Stoner",
      author: "John Williams",
      cover: null,
      pages: 278,
    },
    progress: 0.85,
    progress_pages: 236,
    rating: null,
    minutes: 65,
  },
  {
    id: "9",
    event: "note",
    entry: "Chapter where Stoner discovers literature for the first time is one of the most beautiful depictions of intellectual awakening I've read. The Shakespeare sonnet scene \u2014 Williams makes you feel the exact moment a mind opens.",
    action_at: "2026-02-13T22:30:00Z",
    book: {
      title: "Stoner",
      author: "John Williams",
      cover: null,
      pages: 278,
    },
    progress: 0.45,
    progress_pages: 125,
    rating: null,
    minutes: 50,
  },
  {
    id: "10",
    event: "status_currently_reading",
    entry: null,
    action_at: "2026-02-12T09:00:00Z",
    book: {
      title: "The Bell Jar",
      author: "Sylvia Plath",
      cover: null,
      pages: 244,
    },
    progress: 0,
    progress_pages: 0,
    rating: null,
    minutes: null,
  },
]

/* =============================================================================
 * 4. HELPER FUNCTIONS
 * ============================================================================= */

// Format authors for display (handles string or array)
function formatAuthors(author: string | string[]): ReactNode {
  if (!author) return 'Unknown Author'
  if (typeof author === 'string') return author
  if (author.length === 0) return 'Unknown Author'
  if (author.length === 1) return author[0]
  return (
    <span className="flex items-center gap-1">
      {author[0]} et al.
      <span className="inline-flex items-center justify-center w-3 h-3 text-xs rounded-full bg-muted text-muted-foreground cursor-help border" title={author.join(', ')}>i</span>
    </span>
  )
}

// Get searchable author string
function getAuthorSearchString(author: string | string[]): string {
  if (typeof author === 'string') return author.toLowerCase()
  return author.join(' ').toLowerCase()
}

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

// Format minutes to hours/minutes
function formatTime(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

// Open URL in new tab
function openUrl(url: string) {
  const finalUrl = url.startsWith('http') ? url : `https://${url}`
  window.open(finalUrl, '_blank', 'noopener,noreferrer')
}

// Format journal entry timestamp with time
function formatJournalDate(dateString: string) {
  const date = new Date(dateString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  let hours = date.getHours()
  const mins = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${y}.${m}.${d} at ${hours}:${mins} ${ampm}`
}

// Get brief description for normal journal entries
function getEventDescription(entry: JournalEntry): string {
  switch (entry.event) {
    case 'progress_updated':
      if (entry.progress_pages) return `Read to page ${entry.progress_pages} of ${entry.book.pages}`
      if (entry.progress) return `${Math.round(entry.progress * 100)}% complete`
      return 'Updated progress'
    case 'status_currently_reading':
      return 'Started reading'
    case 'status_read':
      return `Finished reading (${entry.book.pages} pages)`
    case 'rated':
      return `Rated ${entry.rating}/5`
    default:
      return entry.entry || ''
  }
}

// Determine if a journal entry should render as a rich card
function isRichEntry(entry: JournalEntry): boolean {
  return !!entry.entry && ['note', 'quote', 'reviewed'].includes(entry.event)
}

/* =============================================================================
 * 5. UI COMPONENTS
 * ============================================================================= */

// ------------- ReadingNavigation -------------
// Main page-level tab navigation
export function ReadingNavigation() {
  const pathname = usePathname()
  const tabs = [
    { href: "/reading", label: "Reading", isActive: pathname === "/reading" },
    { href: "/read", label: "Read", isActive: pathname === "/read" || pathname.startsWith("/read#") },
    { href: "/want-to-read", label: "Want to Read", isActive: pathname === "/want-to-read" },
    { href: "/reading-lists", label: "Lists", isActive: pathname === "/reading-lists" },
    { href: "/reading-log", label: "Log", isActive: pathname === "/reading-log" },
    { href: "/reading-stats", label: "Stats", isActive: pathname === "/reading-stats" },
  ]

  return (
    <div className="relative mb-4">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href}
            className={`px-4 py-2 text-sm font-medium relative transition-colors ${tab.isActive ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ------------- ReadingBookCard -------------
// Book display card with cover, title, author, rating
interface ReadingBookCardProps {
  coverUrl: string
  title: string
  subtitle?: string
  author: string
  rating: number
  onClick?: () => void
}

export function ReadingBookCard({ coverUrl, title, subtitle, author, rating, onClick }: ReadingBookCardProps) {
  return (
    <Card className="flex overflow-hidden transition-colors hover:bg-accent/50 group h-[140px] cursor-pointer" onClick={onClick}>
      <div className="w-[100px] bg-muted p-4">
        <div className="relative h-[100px] w-full">
          <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover"
            unoptimized={coverUrl?.startsWith("http")}
            onError={(e) => { e.currentTarget.src = "/placeholder.svg?height=100&width=100" }} />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight line-clamp-2">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>}
          <p className="text-sm text-muted-foreground truncate">by {author}</p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm text-muted-foreground">{rating}/5</span>
          </div>
        )}
      </div>
    </Card>
  )
}

// ------------- ReadingDataLoader -------------
// Wrapper that shows loading/error states
interface ReadingDataLoaderProps {
  children: React.ReactNode
}

export function ReadingDataLoader({ children }: ReadingDataLoaderProps) {
  const { loading, error } = useReadingData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
          <p className="text-muted-foreground text-sm">Loading reading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-red-600 text-sm">Error loading reading data</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/* =============================================================================
 * 6. TABLE COMPONENTS
 * ============================================================================= */

// ------------- ReadTable -------------
// Unified table for blogs, short-stories, verse, essays, papers
interface ReadTableProps {
  data?: ReadTableItem[]
  contentType: ContentType
}

export function ReadTable({ data, contentType }: ReadTableProps) {
  const config = contentConfig[contentType]
  const [items, setItems] = useState<ReadTableItem[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!data) {
      const loadItems = async () => {
        try {
          const response = await fetch(`/api/media?source=reading&type=${config.apiType}`)
          const responseData = await response.json()
          setItems(responseData[config.responseKey] || [])
        } catch (error) {
          console.error(`Error loading ${config.labelPlural}:`, error)
          setItems([])
        } finally {
          setLoading(false)
        }
      }
      loadItems()
    } else {
      setItems(data)
      setLoading(false)
    }
  }, [data, config.apiType, config.responseKey, config.labelPlural])

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase()
    if (!q) return true
    return item.title.toLowerCase().includes(q) || getAuthorSearchString(item.author).includes(q) || (item.verse_type && item.verse_type.toLowerCase().includes(q))
  })

  if (loading) return null

  return (
    <div className="space-y-4">
      <div className="relative">
        <input type="text" placeholder={`Search ${config.labelPlural}...`}
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? `No ${config.labelPlural} found matching your search.` : `No ${config.labelPlural} found.`}
        </p>
      ) : (
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Author</th>
              <th className="py-2 text-left font-medium px-3">Publication Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.slice().reverse().map((item, index) => (
              <tr key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${item.source_link ? 'cursor-pointer' : ''} ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                onClick={() => item.source_link && openUrl(item.source_link)}>
                <td className="py-2 px-3">{item.title}</td>
                <td className="py-2 px-3">{formatAuthors(item.author)}</td>
                <td className="py-2 px-3">{item.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Legacy exports for backwards compatibility
export const BlogPostsTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="blogs" />
export const ShortStoriesTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="short-stories" />
export const VerseTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="verse" />
export const ReadingEssaysTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="essays" />
export const ReadingPapersTable = ({ data }: { data?: ReadTableItem[] }) => <ReadTable data={data} contentType="papers" />

/* =============================================================================
 * 7. CONTENT SECTIONS
 * ============================================================================= */

// ------------- ReadingSubTabs -------------
// Sub-navigation for /read page (books, audiobooks, blogs, etc.)
interface ReadingSubTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  showBooks?: boolean
}

export function ReadingSubTabs({ activeTab, onTabChange, showBooks = false }: ReadingSubTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState<ReadingSubTabType>((activeTab as ReadingSubTabType) || "books")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: readingData, loading: readingLoading } = useReadingData()

  useEffect(() => {
    if (activeTab) setActiveSubTab(activeTab as ReadingSubTabType)
  }, [activeTab])

  const handleTabClick = (subTab: ReadingSubTabType) => {
    setActiveSubTab(subTab)
    onTabChange?.(subTab)
  }

  const handleBookClick = (book: JsonBook) => {
    if (book.link) openUrl(book.link)
  }

  const filteredBooks = readingData.books.filter((book) => {
    const q = searchQuery.toLowerCase()
    return !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
  })

  const audiobooks: Audiobook[] = readingData.audiobooks || []
  const filteredAudiobooks = audiobooks.filter((ab) => {
    const q = searchQuery.toLowerCase()
    return !q || ab.title.toLowerCase().includes(q) || ab.author.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="relative">
        <div className="flex border-b border-border">
          {Object.entries(subTabLabels).map(([subTab, label]) => (
            <button key={subTab} onClick={() => handleTabClick(subTab as ReadingSubTabType)}
              className={`px-3 py-1.5 text-xs font-medium relative transition-colors ${activeSubTab === subTab ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {label}
              {activeSubTab === subTab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Books tab */}
        {activeSubTab === "books" && (
          readingLoading ? (
            <div className="text-center py-8"><p className="text-muted-foreground">Loading books...</p></div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="Search books..."
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
              {filteredBooks.length > 0 ? (
                <div className="space-y-6">
                  {filteredBooks.slice().reverse().map((book, index) => (
                    <ReadingBookCard key={index} coverUrl={book.cover} title={book.title} subtitle={book.subtitle || ""} author={book.author} rating={0} onClick={() => handleBookClick(book)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-muted-foreground">{searchQuery ? 'No books found matching your search.' : 'No books found.'}</p></div>
              )}
            </div>
          )
        )}

        {/* Audiobooks tab */}
        {activeSubTab === "audiobooks" && (
          readingLoading ? (
            <div className="text-center py-8"><p className="text-muted-foreground">Loading audiobooks...</p></div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="Search audiobooks..."
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
              {filteredAudiobooks.length > 0 ? (
                <div className="space-y-6">
                  {filteredAudiobooks.slice().reverse().map((ab, index) => (
                    <ReadingBookCard key={index} coverUrl={ab.cover || ""} title={ab.title} subtitle={ab.subtitle || ""} author={ab.author} rating={0} onClick={() => handleBookClick(ab as JsonBook)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-muted-foreground">{searchQuery ? 'No audiobooks found matching your search.' : 'No audiobooks found.'}</p></div>
              )}
            </div>
          )
        )}

        {/* Table tabs */}
        {activeSubTab === "blog-posts" && <ReadTable data={readingData.blogPosts} contentType="blogs" />}
        {activeSubTab === "short-stories" && <ReadTable data={readingData.shortStories} contentType="short-stories" />}
        {activeSubTab === "verse" && <ReadTable data={readingData.verse} contentType="verse" />}
        {activeSubTab === "essays" && <ReadTable data={readingData.essays} contentType="essays" />}
        {activeSubTab === "papers" && <ReadTable data={readingData.papers} contentType="papers" />}
      </div>
    </div>
  )
}

// ------------- ReadingListsContent -------------
// Hardcover-modeled reading lists with book grid (faux data for now)
function ReadingListsContent() {
  const [selectedListId, setSelectedListId] = useState<number>(FAUX_LISTS[0]?.id ?? 0)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const selectedList = useMemo(() => FAUX_LISTS.find(l => l.id === selectedListId), [selectedListId])

  const filteredBooks = useMemo(() => {
    if (!selectedList) return []
    if (!searchQuery) return selectedList.books
    const q = searchQuery.toLowerCase()
    return selectedList.books.filter(book =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    )
  }, [selectedList, searchQuery])

  const listOptions = FAUX_LISTS.map(l => ({
    value: String(l.id),
    label: `${l.title} (${l.books_count})`,
  }))

  return (
    <div className="mt-4">
      {/* List cards — clickable overview of all lists */}
      <div className="space-y-3 mb-6">
        {FAUX_LISTS.map(list => (
          <article
            key={list.id}
            className={`border transition-colors cursor-pointer ${
              list.id === selectedListId
                ? 'border-foreground bg-secondary/30'
                : 'border-border hover:bg-secondary/20'
            }`}
            onClick={() => { setSelectedListId(list.id); setSearchQuery("") }}
          >
            <div className="flex items-stretch">
              {/* Book count badge */}
              <div className="flex items-center justify-center w-16 border-r border-border bg-muted/30 flex-shrink-0">
                <div className="text-center">
                  <div className="text-lg font-bold">{list.books_count}</div>
                  <div className="text-[10px] text-muted-foreground">books</div>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 px-4 py-3 min-w-0">
                <div className="text-sm font-medium">{list.title}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{list.description}</div>
              </div>
              {/* Date */}
              <div className="hidden sm:flex items-center px-4 py-3 border-l border-border">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(list.created_at)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Selected list detail */}
      {selectedList && (
        <>
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="text-base font-semibold">{selectedList.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{selectedList.description}</p>
          </div>

          <Navigation
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={`Search ${selectedList.title}...`}
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
            showGridOption={true}
          />

          {filteredBooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {searchQuery ? 'No books found matching your search.' : 'No books in this list.'}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <BookCardGrid books={filteredBooks} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-foreground">
                    <th className="text-left py-3 px-4 font-medium">#</th>
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">Author</th>
                    <th className="text-left py-3 px-4 font-medium">Pages</th>
                    <th className="text-left py-3 px-4 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 font-medium">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book, i) => (
                    <tr key={book.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground font-mono">{i + 1}</td>
                      <td className="py-3 px-4 font-medium">{book.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-3 px-4 font-mono">{book.pages}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          {book.rating_community}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {book.release_year && book.release_year > 0 ? book.release_year : 'Ancient'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ------------- CurrentlyReading -------------
// Homepage widget showing current book
export function CurrentlyReading() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="flex overflow-hidden h-[100px] dark:bg-[#121212] dark:border-[#232323]">
        <div className="w-[100px] h-[100px] bg-muted dark:bg-[#1a1a1a] p-2 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}>
          <div className="relative w-[60px] h-[90px] flex items-center justify-center">
            {CURRENT_BOOK.coverImage ? (
              <img src={CURRENT_BOOK.coverImage} alt="Book cover" className="max-w-full max-h-full object-contain rounded-sm transition-transform duration-300 hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-muted-foreground/20 rounded-sm flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No cover</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
          <div className="font-normal text-sm truncate dark:text-[#fafafa]">{CURRENT_BOOK.title}</div>
          <div className="text-gray-600 dark:text-[#a1a1a1] text-sm truncate">{CURRENT_BOOK.author}</div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-fit [&>button]:hidden">
          {CURRENT_BOOK.coverImage && <img src={CURRENT_BOOK.coverImage} alt="Book cover" className="max-w-[300px] max-h-[450px] object-contain" />}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* =============================================================================
 * 8. PAGE CONTENT
 * ============================================================================= */

// ------------- BookCardsContent -------------
// Book cards for /want-to-read page
function BookCardsContent({ apiType, responseKey, emptyMessage }: { apiType: string; responseKey: string; emptyMessage: string }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch(`/api/media?source=reading&type=${apiType}`)
        const data = await response.json()
        setBooks(data[responseKey] || [])
      } catch (error) {
        console.error('Error loading books:', error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [apiType, responseKey])

  if (loading) return null
  if (books.length === 0) return <div className="text-center py-10"><p className="text-muted-foreground">{emptyMessage}</p></div>

  return (
    <div className="mt-8">
      <div className="space-y-6">
        {books.map((book, index) => (
          <ReadingBookCard key={index} coverUrl={book.cover} title={book.title} subtitle={book.subtitle || ""} author={book.author} rating={0}
            onClick={() => book.link && window.open(book.link, '_blank')} />
        ))}
      </div>
    </div>
  )
}

// ------------- CurrentlyReadingContent -------------
// Rich currently-reading cards with progress, metadata (faux data for now)
function CurrentlyReadingContent() {
  const books = FAUX_CURRENTLY_READING

  if (books.length === 0) {
    return <div className="text-center py-10"><p className="text-muted-foreground">Not currently reading anything.</p></div>
  }

  return (
    <div className="mt-4 space-y-4">
      {books.map((book) => (
        <article key={book.id} className="border border-border">
          <div className="flex">
            {/* Cover */}
            <div className="w-[100px] border-r border-border bg-muted flex-shrink-0 flex items-center justify-center">
              {book.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-muted/50">
                  <BookOpen className="w-6 h-6 text-muted-foreground/40" />
                </div>
              )}
            </div>
            {/* Right side */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-stretch border-b border-border">
                <div className="flex-1 px-3 py-2 min-w-0">
                  <div className="text-sm font-medium truncate">{book.title}</div>
                  {book.subtitle && <div className="text-xs text-muted-foreground truncate">{book.subtitle}</div>}
                  <div className="text-xs text-muted-foreground mt-0.5">{book.author}</div>
                </div>
                <div className="flex items-center px-3 py-2 border-l border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-xs text-muted-foreground">{book.rating_community}</span>
                  </div>
                </div>
              </div>
              {/* Progress */}
              <div className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted overflow-hidden">
                    <div className="h-2 bg-primary transition-all" style={{ width: `${book.progress * 100}%` }} />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                    {Math.round(book.progress * 100)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">
                  p. {book.progress_pages} of {book.pages}
                </div>
              </div>
              {/* Footer metadata */}
              <div className="flex items-stretch border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center px-3 py-1.5 border-r border-border">
                  Started {formatDate(book.started_at)}
                </div>
                <div className="flex items-center px-3 py-1.5 border-r border-border capitalize">
                  {book.edition_format}
                </div>
                <div className="flex items-center px-3 py-1.5">
                  {book.pages} pages
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

// ------------- ReadContent -------------
// Content for /read page with hash-based sub-tabs
function ReadContent() {
  const [activeSubTab, setActiveSubTab] = useState<string>("books")
  const router = useRouter()

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && ['books', 'audiobooks', 'blog-posts', 'short-stories', 'verse', 'essays', 'papers'].includes(hash)) {
        setActiveSubTab(hash)
      } else {
        setActiveSubTab('books')
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab)
    router.push(`/read#${subTab}`, { scroll: false })
  }

  return (
    <ReadingDataLoader>
      <ReadingSubTabs activeTab={activeSubTab} onTabChange={handleSubTabChange} showBooks={true} />
    </ReadingDataLoader>
  )
}

// ------------- NormalJournalCard -------------
// Compact card for progress/status/rating events
function NormalJournalCard({ entry }: { entry: JournalEntry }) {
  const config = journalEventConfig[entry.event]
  const Icon = config?.Icon || BookOpen

  return (
    <article className="border border-border">
      {/* Header */}
      <div className="flex items-stretch border-b border-border">
        <div className="flex items-center justify-center w-10 border-r border-border bg-muted/30">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center px-3 py-2 border-r border-border min-w-0">
          <span className="text-sm font-medium truncate">{entry.book.title}</span>
        </div>
        <div className="hidden sm:flex items-center px-3 py-2 border-r border-border">
          <span className="text-sm text-muted-foreground">{entry.book.author}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center px-3 py-2 border-l border-border">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{formatJournalDate(entry.action_at)}</span>
        </div>
      </div>
      {/* Content */}
      <div className="px-3 py-2.5 text-sm">
        {getEventDescription(entry)}
      </div>
      {/* Footer */}
      <div className="flex items-stretch border-t border-border text-xs text-muted-foreground">
        {entry.progress != null && (
          <div className="flex items-center gap-2 px-3 py-2 border-r border-border flex-1 max-w-[300px]">
            <div className="flex-1 h-1.5 bg-muted overflow-hidden">
              <div className="h-1.5 bg-primary transition-all" style={{ width: `${entry.progress * 100}%` }} />
            </div>
            <span>{Math.round(entry.progress * 100)}%</span>
          </div>
        )}
        {entry.minutes != null && entry.minutes > 0 && (
          <div className="flex items-center px-3 py-2 border-r border-border">
            {formatTime(entry.minutes)}
          </div>
        )}
        {entry.rating != null && (
          <div className="flex items-center gap-1 px-3 py-2 border-r border-border">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span>{entry.rating}/5</span>
          </div>
        )}
        <div className="flex items-center px-3 py-2">
          {config?.label || entry.event}
        </div>
      </div>
    </article>
  )
}

// ------------- RichJournalCard -------------
// Expanded card with optional cover + text content for notes/quotes/reviews
function RichJournalCard({ entry }: { entry: JournalEntry }) {
  const config = journalEventConfig[entry.event]
  const Icon = config?.Icon || PenLine
  const hasCover = !!entry.book.cover

  return (
    <article className="border border-border">
      <div className="flex">
        {/* Cover image */}
        {hasCover && (
          <div className="w-[100px] border-r border-border bg-muted flex-shrink-0">
            <img
              src={entry.book.cover!}
              alt={entry.book.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Right side */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-stretch border-b border-border">
            <div className="flex items-center justify-center w-10 border-r border-border bg-muted/30">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center px-3 py-2 border-r border-border min-w-0">
              <span className="text-sm font-medium truncate">{entry.book.title}</span>
            </div>
            {!hasCover && (
              <div className="hidden sm:flex items-center px-3 py-2 border-r border-border">
                <span className="text-sm text-muted-foreground">{entry.book.author}</span>
              </div>
            )}
            <div className="flex-1" />
            <div className="flex items-center px-3 py-2 border-l border-border">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatJournalDate(entry.action_at)}</span>
            </div>
          </div>
          {/* Content */}
          <div className="p-3">
            {entry.event === 'quote' ? (
              <blockquote className="border-l-2 border-muted-foreground/30 pl-3 text-sm italic text-muted-foreground">
                {entry.entry}
              </blockquote>
            ) : (
              <p className="text-sm leading-relaxed">{entry.entry}</p>
            )}
          </div>
          {/* Footer */}
          <div className="flex items-stretch border-t border-border text-xs text-muted-foreground">
            {entry.progress != null && (
              <div className="flex items-center gap-2 px-3 py-2 border-r border-border flex-1 max-w-[300px]">
                <div className="flex-1 h-1.5 bg-muted overflow-hidden">
                  <div className="h-1.5 bg-primary transition-all" style={{ width: `${entry.progress * 100}%` }} />
                </div>
                <span>{Math.round(entry.progress * 100)}%</span>
              </div>
            )}
            {entry.progress_pages != null && entry.progress_pages > 0 && (
              <div className="flex items-center px-3 py-2 border-r border-border">
                p. {entry.progress_pages}
              </div>
            )}
            {entry.minutes != null && entry.minutes > 0 && (
              <div className="flex items-center px-3 py-2 border-r border-border">
                {formatTime(entry.minutes)}
              </div>
            )}
            {entry.rating != null && (
              <div className="flex items-center gap-1 px-3 py-2 border-r border-border">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span>{entry.rating}/5</span>
              </div>
            )}
            <div className="flex items-center px-3 py-2">
              {config?.label || entry.event}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// ------------- ReadingLogContent -------------
// Content for /reading-log page — journal feed with grid/list view
function ReadingLogContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredEntries = useMemo(() => {
    return FAUX_JOURNAL_ENTRIES
      .filter(entry => {
        if (selectedCategory !== 'all' && entry.event !== selectedCategory) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          return (
            entry.book.title.toLowerCase().includes(q) ||
            entry.book.author.toLowerCase().includes(q) ||
            (entry.entry && entry.entry.toLowerCase().includes(q))
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.action_at).getTime() - new Date(a.action_at).getTime())
  }, [searchQuery, selectedCategory])

  return (
    <div className="mt-4">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search journal entries..."
        showCategoryFilter={true}
        categoryOptions={journalEventFilterOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryPlaceholder="All Events"
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
        showGridOption={true}
      />

      {filteredEntries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'No entries found matching your filters.'
              : 'No journal entries yet.'}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            isRichEntry(entry)
              ? <RichJournalCard key={entry.id} entry={entry} />
              : <NormalJournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-foreground">
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Title</th>
                <th className="text-left py-3 px-4 font-medium">Author</th>
                <th className="text-left py-3 px-4 font-medium">Event</th>
                <th className="text-left py-3 px-4 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{formatDate(entry.action_at)}</td>
                  <td className="py-3 px-4">{entry.book.title}</td>
                  <td className="py-3 px-4">{entry.book.author}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 bg-muted">
                      {journalEventConfig[entry.event]?.label || entry.event}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {entry.progress != null ? `${Math.round(entry.progress * 100)}%` : '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ------------- ReadingStatsContent -------------
// Content for /reading-stats — static design based on Hardcover API data model
// Faux data representing what Hardcover can provide via user_books, user_book_reads, goals, cached_tags

const FAUX_STATS = {
  // Overview
  booksRead: 47,
  booksReadThisYear: 12,
  pagesRead: 14832,
  pagesThisMonth: 1247,
  avgRating: 3.8,
  avgPagesPerDay: 42,
  currentlyReading: 3,
  wantToRead: 28,
  longestStreak: 23, // days
  // Books per month (2026)
  booksPerMonth: [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 7 },
  ],
  // Pages per month (last 6)
  pagesPerMonth: [
    { month: 'Sep', pages: 2103 },
    { month: 'Oct', pages: 1876 },
    { month: 'Nov', pages: 2450 },
    { month: 'Dec', pages: 1920 },
    { month: 'Jan', pages: 2890 },
    { month: 'Feb', pages: 1247 },
  ],
  // Rating distribution
  ratingDistribution: [
    { stars: 1, count: 2 },
    { stars: 1.5, count: 1 },
    { stars: 2, count: 3 },
    { stars: 2.5, count: 4 },
    { stars: 3, count: 7 },
    { stars: 3.5, count: 8 },
    { stars: 4, count: 12 },
    { stars: 4.5, count: 6 },
    { stars: 5, count: 4 },
  ],
  // Genre breakdown (from cached_tags)
  genreBreakdown: [
    { genre: 'Literary Fiction', count: 14 },
    { genre: 'Philosophy', count: 8 },
    { genre: 'Poetry', count: 6 },
    { genre: 'Science Fiction', count: 5 },
    { genre: 'History', count: 4 },
    { genre: 'Psychology', count: 3 },
    { genre: 'Theology', count: 3 },
    { genre: 'Mathematics', count: 2 },
    { genre: 'Art', count: 2 },
  ],
  // Format breakdown (from edition_format)
  formatBreakdown: [
    { format: 'Paperback', count: 22 },
    { format: 'Hardcover', count: 11 },
    { format: 'Ebook', count: 9 },
    { format: 'Audiobook', count: 5 },
  ],
  // Top authors by books read
  topAuthors: [
    { author: 'Fyodor Dostoevsky', books: 4, pages: 2840 },
    { author: 'Ottessa Moshfegh', books: 3, pages: 912 },
    { author: 'Sylvia Plath', books: 2, pages: 488 },
    { author: 'Marcus Aurelius', books: 2, pages: 512 },
    { author: 'Cormac McCarthy', books: 2, pages: 598 },
  ],
  // Reading goal
  goal: { target: 52, progress: 12, year: 2026 },
  // Longest / shortest books
  longestBook: { title: 'The Brothers Karamazov', pages: 796, author: 'Fyodor Dostoevsky' },
  shortestBook: { title: 'The Old Man and the Sea', pages: 127, author: 'Ernest Hemingway' },
}

function ReadingStatsContent() {
  const stats = FAUX_STATS
  const maxPagesMonth = Math.max(...stats.pagesPerMonth.map(m => m.pages))
  const maxRating = Math.max(...stats.ratingDistribution.map(r => r.count))
  const maxGenre = Math.max(...stats.genreBreakdown.map(g => g.count))
  const goalPercent = Math.round((stats.goal.progress / stats.goal.target) * 100)

  return (
    <div className="mt-4 space-y-8">
      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border p-4">
          <div className="text-2xl font-bold">{stats.booksRead}</div>
          <div className="text-xs text-muted-foreground mt-1">Books Read</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-2xl font-bold">{stats.pagesRead.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Pages Read</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-2xl font-bold">{stats.avgRating}</div>
          <div className="text-xs text-muted-foreground mt-1">Avg Rating</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-2xl font-bold">{stats.avgPagesPerDay}</div>
          <div className="text-xs text-muted-foreground mt-1">Pages / Day</div>
        </div>
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border p-4">
          <div className="text-lg font-bold">{stats.booksReadThisYear}</div>
          <div className="text-xs text-muted-foreground mt-1">Books in 2026</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-lg font-bold">{stats.pagesThisMonth.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Pages This Month</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-lg font-bold">{stats.longestStreak}d</div>
          <div className="text-xs text-muted-foreground mt-1">Longest Streak</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-lg font-bold">{stats.currentlyReading}</div>
          <div className="text-xs text-muted-foreground mt-1">Currently Reading</div>
        </div>
      </div>

      {/* Reading Goal */}
      <div className="border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{stats.goal.year} Reading Goal</h3>
          <span className="text-sm text-muted-foreground">{stats.goal.progress} / {stats.goal.target} books</span>
        </div>
        <div className="h-3 bg-muted overflow-hidden">
          <div className="h-3 bg-primary transition-all" style={{ width: `${goalPercent}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-2">{goalPercent}% complete — {stats.goal.target - stats.goal.progress} books remaining</div>
      </div>

      {/* Pages per month chart */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Pages Per Month</h3>
        <div className="border border-border p-4">
          <div className="flex items-end gap-2" style={{ height: '160px' }}>
            {stats.pagesPerMonth.map((m, i) => {
              const h = maxPagesMonth > 0 ? (m.pages / maxPagesMonth) * 130 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{m.pages.toLocaleString()}</span>
                  <div className="w-full bg-primary" style={{ height: `${h}px`, minHeight: '2px' }} />
                  <span className="text-xs text-muted-foreground">{m.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Rating distribution + Genre breakdown side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating distribution */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Rating Distribution</h3>
          <div className="border border-border p-4">
            <div className="flex items-end gap-1" style={{ height: '120px' }}>
              {stats.ratingDistribution.map((r, i) => {
                const h = maxRating > 0 ? (r.count / maxRating) * 90 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{r.count}</span>
                    <div className="w-full bg-primary" style={{ height: `${h}px`, minHeight: r.count > 0 ? '2px' : '0px' }} />
                    <span className="text-[10px] text-muted-foreground">{r.stars}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Genre breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Genre Breakdown</h3>
          <div className="border border-border p-4 space-y-2">
            {stats.genreBreakdown.map((g, i) => {
              const pct = maxGenre > 0 ? (g.count / maxGenre) * 100 : 0
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{g.genre}</span>
                    <span className="text-muted-foreground">{g.count}</span>
                  </div>
                  <div className="h-1.5 bg-muted overflow-hidden">
                    <div className="h-1.5 bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Format breakdown + Top Authors side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Format breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Reading Format</h3>
          <div className="border border-border p-4 space-y-2">
            {stats.formatBreakdown.map((f, i) => {
              const total = stats.formatBreakdown.reduce((s, x) => s + x.count, 0)
              const pct = total > 0 ? (f.count / total) * 100 : 0
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-20">{f.format}</span>
                  <div className="flex-1 h-1.5 bg-muted overflow-hidden">
                    <div className="h-1.5 bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">{Math.round(pct)}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top authors */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Top Authors</h3>
          <div className="border border-border">
            {stats.topAuthors.map((a, i) => (
              <div key={i} className={`flex items-stretch text-xs ${i < stats.topAuthors.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-8 flex items-center justify-center border-r border-border text-muted-foreground bg-muted/30">
                  {i + 1}
                </div>
                <div className="flex-1 px-3 py-2 truncate">{a.author}</div>
                <div className="px-3 py-2 border-l border-border text-muted-foreground">{a.books} books</div>
                <div className="px-3 py-2 border-l border-border text-muted-foreground">{a.pages.toLocaleString()} pp</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-border p-4">
          <div className="text-xs text-muted-foreground mb-1">Longest Book</div>
          <div className="text-sm font-medium">{stats.longestBook.title}</div>
          <div className="text-xs text-muted-foreground">{stats.longestBook.author} — {stats.longestBook.pages} pages</div>
        </div>
        <div className="border border-border p-4">
          <div className="text-xs text-muted-foreground mb-1">Shortest Book</div>
          <div className="text-sm font-medium">{stats.shortestBook.title}</div>
          <div className="text-xs text-muted-foreground">{stats.shortestBook.author} — {stats.shortestBook.pages} pages</div>
        </div>
      </div>
    </div>
  )
}

// ------------- BookCardGrid -------------
// Shared connected grid of book cards — cells share borders, no gaps
function BookCardGrid({ books }: { books: WantToReadBook[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-l border-t border-border">
      {books.map(book => (
        <div key={book.id} className="border-r border-b border-border overflow-hidden group hover:bg-secondary/30 transition-colors flex flex-col">
          {/* Cover */}
          <div className="aspect-[2/3] bg-muted overflow-hidden border-b border-border">
            {book.cover ? (
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/50">
                <BookOpen className="w-8 h-8 text-muted-foreground/25" />
              </div>
            )}
          </div>
          {/* Title + Author — grows to fill remaining space */}
          <div className="px-3 py-2 border-b border-border flex-1">
            <div className="text-sm font-medium leading-tight line-clamp-2">{book.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{book.author}</div>
          </div>
          {/* Metadata row — pinned to bottom */}
          <div className="flex items-stretch text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5 px-2.5 py-1.5 border-r border-border">
              <Star className="w-3 h-3 fill-primary text-primary" />
              {book.rating_community}
            </div>
            <div className="flex items-center px-2.5 py-1.5 border-r border-border">
              {book.pages}pp
            </div>
            <div className="flex items-center px-2.5 py-1.5 flex-1 justify-end">
              {book.release_year && book.release_year > 0 ? book.release_year : 'Ancient'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ------------- WantToReadContent -------------
// Grid/list view for want-to-read books with search (faux data for now)
function WantToReadContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredBooks = useMemo(() => {
    return FAUX_WANT_TO_READ.filter(book => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.edition_format && book.edition_format.toLowerCase().includes(q))
      )
    })
  }, [searchQuery])

  return (
    <div className="mt-4">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search want-to-read..."
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
        showGridOption={true}
      />

      {filteredBooks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchQuery ? 'No books found matching your search.' : 'No books on the want-to-read list.'}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <BookCardGrid books={filteredBooks} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-foreground">
                <th className="text-left py-3 px-4 font-medium">Title</th>
                <th className="text-left py-3 px-4 font-medium">Author</th>
                <th className="text-left py-3 px-4 font-medium">Pages</th>
                <th className="text-left py-3 px-4 font-medium">Rating</th>
                <th className="text-left py-3 px-4 font-medium">Format</th>
                <th className="text-left py-3 px-4 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{book.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                  <td className="py-3 px-4 font-mono">{book.pages}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      {book.rating_community}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize text-muted-foreground">{book.edition_format}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{formatDate(book.date_added)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ------------- ReadingPageContent -------------
// Main page router - renders appropriate content based on page prop
export function ReadingPageContent({ page }: { page: ReadingPageType }) {
  return (
    <div>
      <ReadingNavigation />
      {page === "reading" && <CurrentlyReadingContent />}
      {page === "read" && <ReadContent />}
      {page === "want-to-read" && <WantToReadContent />}
      {page === "reading-lists" && <ReadingListsContent />}
      {page === "reading-log" && <ReadingLogContent />}
      {page === "reading-stats" && <ReadingStatsContent />}
    </div>
  )
}

/* =============================================================================
 * 9. EXPORTS
 * ============================================================================= */

// All exports are inline above with their component definitions
