// Reading data types and utilities
import booksData from '@/data/books.json';
import readingLogData from '@/data/reading/readinglog.json';

export interface Book {
  isbn13: string;
  title: string;
  category: string;
  tags: string[];
  authors: string[];
  'cover-url'?: string;
  type?: string;
  slug?: string;
}

export interface Author {
  name: string;
  books: string[];
  slug?: string;
}

export interface Genre {
  name: string;
  count: number;
  slug: string;
  sub_genres?: string[];
}

export interface ReadingEntry {
  id: number;
  title: string;
  author: string;
  type: string;
  genre: string;
  pages_read: number;
  time_spent_minutes: number;
  source: string;
  notes: string;
  date: string;
  book_slug?: string;
  author_slug?: string;
  reading_number?: number;
  reading_sessions?: any[];
}

// Get book by slug (title)
export function getBookBySlug(slug: string): Book | undefined {
  return booksData.books.find(book => 
    book.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );
}

// Get author by slug (name)
export function getAuthorBySlug(slug: string): Author | undefined {
  const authorName = slug.replace(/-/g, ' ');
  const books = booksData.books.filter(book => 
    book.authors.some(author => 
      author.toLowerCase() === authorName.toLowerCase()
    )
  );
  
  if (books.length > 0) {
    return {
      name: authorName,
      books: books.map(book => book.title),
      slug: slug
    };
  }
  
  return undefined;
}

// Check if a book has reading sessions
export function hasReadSessions(entry: ReadingEntry): boolean {
  return entry.reading_sessions ? entry.reading_sessions.length > 0 : false;
}

// Get last read date for a book
export function getLastReadDate(entry: ReadingEntry): string | null {
  return entry.date || null;
}

// Get total pages read for a book
export function getTotalPagesRead(entry: ReadingEntry): number {
  return entry.pages_read || 0;
}

// Get all reading entries
export function getReadingEntries(): ReadingEntry[] {
  return readingLogData.map((entry: any, index: number) => ({
    ...entry,
    book_slug: entry.title?.toLowerCase().replace(/\s+/g, '-'),
    author_slug: entry.author?.toLowerCase().replace(/\s+/g, '-'),
    reading_number: index + 1,
    reading_sessions: [] // Empty array for now
  }));
}

// Get all books
export function getBooks(): Book[] {
  return booksData.books;
}

// Get all genres
export function getGenres(): Genre[] {
  const genreCounts: { [key: string]: number } = {};
  
  readingLogData.forEach((entry: ReadingEntry) => {
    genreCounts[entry.genre] = (genreCounts[entry.genre] || 0) + 1;
  });
  
  return Object.entries(genreCounts).map(([name, count]) => ({
    name,
    count,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    sub_genres: []
  }));
}

// Get all authors
export function getAuthors(): Author[] {
  const authorMap: { [key: string]: string[] } = {};
  
  booksData.books.forEach(book => {
    book.authors.forEach(author => {
      if (!authorMap[author]) {
        authorMap[author] = [];
      }
      authorMap[author].push(book.title);
    });
  });
  
  return Object.entries(authorMap).map(([name, books]) => ({
    name,
    books,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  }));
}
