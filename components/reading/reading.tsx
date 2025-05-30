// Consolidated Reading Component
'use client';

import { useState, useEffect } from 'react';
import { LibraryBookCard } from '@/components/library-book-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllBooks, getAllAuthors, getAllGenres, getAllReadingSessions, getAuthorBySlug, hasReadSessions, getLastReadDate, getTotalPagesRead } from '@/utils/reading-client';
import type { Book, Author, Genre, ReadingEntry } from '@/utils/reading-client';

export default function Reading() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [readingData, setReadingData] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedSubGenre, setSelectedSubGenre] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [booksData, authorsData, genresData, readingSessionsData] = await Promise.all([
          getAllBooks(),
          getAllAuthors(),
          getAllGenres(),
          getAllReadingSessions()
        ]);

        setBooks(booksData);
        setAuthors(authorsData);
        setGenres(genresData);
        setReadingData(readingSessionsData);
      } catch (error) {
        console.error('Error loading reading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const currentlyReadingBooks = books.filter(book => 
    readingData.some(entry => entry.book_slug === book.slug && hasReadSessions(entry))
  );

  const filteredBooks = currentlyReadingBooks.filter(book => {
    if (selectedGenre !== 'all' && book.genre !== selectedGenre) return false;
    if (selectedSubGenre !== 'all' && book.sub_genre !== selectedSubGenre) return false;
    return true;
  });

  const subGenres = selectedGenre === 'all' 
    ? []
    : genres.find(g => g.slug === selectedGenre)?.sub_genres || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.slug} value={genre.slug}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGenre !== 'all' && subGenres.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-genre</label>
                <Select value={selectedSubGenre} onValueChange={setSelectedSubGenre}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select sub-genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub-genres</SelectItem>
                    {subGenres.map((subGenre) => (
                      <SelectItem key={subGenre.slug} value={subGenre.slug}>
                        {subGenre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredBooks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No books currently being read{selectedGenre !== 'all' || selectedSubGenre !== 'all' ? ' matching your filters' : ''}.
            </CardContent>
          </Card>
        ) : (
          filteredBooks.map((book) => {
            const author = getAuthorBySlug(authors, book.authors[0]);
            const readingEntry = readingData.find(entry => entry.book_slug === book.slug);
            const lastRead = readingEntry ? getLastReadDate(readingEntry) : null;
            const totalPages = readingEntry ? getTotalPagesRead(readingEntry) : 0;
            const progress = book.page_count ? Math.round((totalPages / book.page_count) * 100) : 0;

            return (
              <LibraryBookCard
                key={book.slug}
                coverUrl={book["cover-url"] || "/placeholder.svg"}
                title={book.title}
                author={author?.name || "Unknown Author"}
                rating={book.rating || 0}
                subtitle={`${progress}% complete 
                  ${lastRead ? `• Last read: ${new Date(lastRead).toLocaleDateString()}` : ''}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
