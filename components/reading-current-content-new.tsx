'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Book, Genre, ReadingEntry, Author } from '@/utils/reading-data';
import { getBookBySlug, getAuthorBySlug, hasReadSessions, getLastReadDate, getTotalPagesRead } from '@/utils/reading-data';

interface ReadingCurrentContentProps {
  readingData: ReadingEntry[];
  books: Book[];
  genres: Genre[];
  authors: Author[];
}

export default function ReadingCurrentContent({ readingData, books, genres, authors }: ReadingCurrentContentProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedSubGenre, setSelectedSubGenre] = useState<string>('');

  // For current reading, we'll consider books that have reading sessions but might not be complete
  const currentlyReading = readingData.filter(entry => hasReadSessions(entry));

  const filteredEntries = currentlyReading
    .filter(entry => {
      if (!selectedGenre) return true;
      const book = getBookBySlug(books, entry.book_slug);
      if (!book) return false;
      
      // We don't have genre data in the Book interface, so we'll skip genre filtering for now
      // In a real implementation, you'd need to add genre data to books or have a mapping
      return true;
    })
    .filter(entry => {
      if (!selectedSubGenre) return true;
      const book = getBookBySlug(books, entry.book_slug);
      if (!book) return false;
      
      // Same issue with sub-genre
      return true;
    });

  const selectedGenreData = genres.find(g => g.slug === selectedGenre);
  const subGenres = selectedGenreData?.sub_genres || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre.slug} value={genre.slug}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedGenre && subGenres.length > 0 && (
          <Select value={selectedSubGenre} onValueChange={setSelectedSubGenre}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by sub-genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sub-genres</SelectItem>
              {subGenres.map(subGenre => (
                <SelectItem key={subGenre.slug} value={subGenre.slug}>
                  {subGenre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {(selectedGenre || selectedSubGenre) && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedGenre('');
              setSelectedSubGenre('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Currently Reading List */}
      <div className="grid gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => {
            const book = getBookBySlug(books, entry.book_slug);
            const author = getAuthorBySlug(authors, entry.author_slug);
            const lastReadDate = getLastReadDate(entry);
            const totalPages = getTotalPagesRead(entry);

            if (!book) return null;

            return (
              <Card key={`${entry.book_slug}-${entry.reading_number}`} className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={book["cover-url"] || "https://i.postimg.cc/Jh2wT6TZ/default-book-cover.png"}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-gray-600">{author?.name || 'Unknown Author'}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                      {lastReadDate && (
                        <span>Last read: {new Date(lastReadDate).toLocaleDateString()}</span>
                      )}
                      {totalPages > 0 && (
                        <span>Pages read: {totalPages}</span>
                      )}
                      {entry.reading_sessions.length > 0 && (
                        <span>Sessions: {entry.reading_sessions.length}</span>
                      )}
                    </div>
                    {book.type && (
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {book.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No books currently being read</p>
            <p className="text-sm text-gray-400 mt-2">
              Books with reading sessions will appear here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
