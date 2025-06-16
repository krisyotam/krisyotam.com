// Reading data types and utilities

// API fetch functions
async function fetchBooksData() {
  try {
    const response = await fetch('/api/data/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books data:', error);
    return { books: [] };
  }
}

async function fetchReadingLogData() {
  try {
    const response = await fetch('/api/data/reading/readinglog');
    if (!response.ok) {
      throw new Error('Failed to fetch reading log data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reading log data:', error);
    return [];
  }
}

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
export async function getBookBySlug(slug: string): Promise<Book | undefined> {
  const booksData = await fetchBooksData();
  return booksData.books.find((book: any) => 
    book.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );
}

// Get author by slug (name)
export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const booksData = await fetchBooksData();
  const authorName = slug.replace(/-/g, ' ');
  const books = booksData.books.filter((book: any) => 
    book.authors.some((author: string) => 
      author.toLowerCase() === authorName.toLowerCase()
    )
  );
  
  if (books.length > 0) {
    return {      name: authorName,
      books: books.map((book: any) => book.title),
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
export async function getReadingEntries(): Promise<ReadingEntry[]> {
  const readingLogData = await fetchReadingLogData();
  return readingLogData.map((entry: any, index: number) => ({
    ...entry,
    book_slug: entry.title?.toLowerCase().replace(/\s+/g, '-'),
    author_slug: entry.author?.toLowerCase().replace(/\s+/g, '-'),
    reading_number: index + 1,
    reading_sessions: [] // Empty array for now
  }));
}

// Get all books
export async function getBooks(): Promise<Book[]> {
  const booksData = await fetchBooksData();
  return booksData.books;
}

// Get all genres
export async function getGenres(): Promise<Genre[]> {
  const readingLogData = await fetchReadingLogData();
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
export async function getAuthors(): Promise<Author[]> {
  const booksData = await fetchBooksData();
  const authorMap: { [key: string]: string[] } = {};
  
  booksData.books.forEach((book: any) => {
    book.authors.forEach((author: string) => {
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
