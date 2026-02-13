/**
 * ============================================================================
 * Media Database Library
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: media-db.ts
 * Description: Server-side library for querying media.db. Provides functions
 *              for accessing film data, favorites, music playlists, and games.
 * ============================================================================
 */

import Database from "better-sqlite3";
import path from "path";

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

const DB_PATH = path.join(process.cwd(), "public", "data", "media.db");

function getDb() {
  return new Database(DB_PATH, { readonly: true });
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FavActor {
  id: number;
  name: string;
  image: string;
  sort_order: number;
}

export interface FavDirector {
  id: number;
  name: string;
  image: string;
  sort_order: number;
}

export interface FavFilmCharacter {
  id: number;
  name: string;
  image: string;
  actor: string;
  sort_order: number;
}

export interface FavFilmCompany {
  id: number;
  name: string;
  image: string;
  description: string;
  sort_order: number;
}

export interface FavProducer {
  id: number;
  name: string;
  description: string;
  works: string[];
  sort_order: number;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  poster_url: string;
  genres: string[];
  runtime: number;
  director: string;
  last_watched_at: string;
  rating: number;
  overview: string;
  times_watched: number;
}

export interface WatchedFilm {
  id: number;
  tmdb_id: number;
  letterboxd_url: string;
  watched_date: string;
  name: string;
  year: string;
  synopsis: string;
  poster: string;
  rating: string;
  director: string[];
  cast: string[];
  studios: string[];
  countries: string[];
  languages: string[];
  genres: string[];
  runtime: string;
  release_date: string;
  budget: number;
  revenue: number;
}

export interface Favorite {
  id: number;
  type: string;
  position: number;
  cover: string;
  title: string;
  link: string;
}

export interface MusicPlaylist {
  id: number;
  playlist_name: string;
  slug: string;
  cover_url: string;
  amount_of_songs: number;
  last_updated: string;
  category: string;
  tidal: string;
  qobuz: string;
  apple_music: string;
  spotify: string;
  status: string;
}

// ============================================================================
// FILM QUERIES
// ============================================================================

export function getFavActors(): FavActor[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_actors ORDER BY sort_order, id").all() as FavActor[];
  } finally {
    db.close();
  }
}

export function getFavDirectors(): FavDirector[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_directors ORDER BY sort_order, id").all() as FavDirector[];
  } finally {
    db.close();
  }
}

export function getFavFilmCharacters(): FavFilmCharacter[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_film_characters ORDER BY sort_order, id").all() as FavFilmCharacter[];
  } finally {
    db.close();
  }
}

export function getFavFilmCompanies(): FavFilmCompany[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_film_companies ORDER BY sort_order, id").all() as FavFilmCompany[];
  } finally {
    db.close();
  }
}

export function getFavProducers(): FavProducer[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM fav_producers ORDER BY sort_order, id").all() as any[];
    return rows.map((row) => ({
      ...row,
      works: JSON.parse(row.works || "[]"),
    }));
  } finally {
    db.close();
  }
}

export function getMovies(): Movie[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM movies ORDER BY last_watched_at DESC").all() as any[];
    return rows.map((row) => ({
      ...row,
      genres: JSON.parse(row.genres || "[]"),
    }));
  } finally {
    db.close();
  }
}

export function getMovieById(id: number): Movie | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM movies WHERE id = ?").get(id) as any;
    if (!row) return null;
    return {
      ...row,
      genres: JSON.parse(row.genres || "[]"),
    };
  } finally {
    db.close();
  }
}

export function getWatchedFilms(): WatchedFilm[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM watched ORDER BY watched_date DESC").all() as any[];
    return rows.map((row) => ({
      ...row,
      director: JSON.parse(row.director || "[]"),
      cast: JSON.parse(row.cast || "[]"),
      studios: JSON.parse(row.studios || "[]"),
      countries: JSON.parse(row.countries || "[]"),
      languages: JSON.parse(row.languages || "[]"),
      genres: JSON.parse(row.genres || "[]"),
    }));
  } finally {
    db.close();
  }
}

export function getWatchedFilmById(id: number): WatchedFilm | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM watched WHERE id = ?").get(id) as any;
    if (!row) return null;
    return {
      ...row,
      director: JSON.parse(row.director || "[]"),
      cast: JSON.parse(row.cast || "[]"),
      studios: JSON.parse(row.studios || "[]"),
      countries: JSON.parse(row.countries || "[]"),
      languages: JSON.parse(row.languages || "[]"),
      genres: JSON.parse(row.genres || "[]"),
    };
  } finally {
    db.close();
  }
}

// ============================================================================
// FAVORITES QUERIES
// ============================================================================

export function getAllFavorites(): Favorite[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM favorites ORDER BY type, position").all() as Favorite[];
  } finally {
    db.close();
  }
}

export function getFavoritesByType(type: string): Favorite[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM favorites WHERE type = ? ORDER BY position").all(type) as Favorite[];
  } finally {
    db.close();
  }
}

export function getFavoriteTypes(): string[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT DISTINCT type FROM favorites ORDER BY type").all() as { type: string }[];
    return rows.map((r) => r.type);
  } finally {
    db.close();
  }
}

// ============================================================================
// MUSIC QUERIES
// ============================================================================

export function getMusicPlaylists(): MusicPlaylist[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM music ORDER BY playlist_name").all() as MusicPlaylist[];
  } finally {
    db.close();
  }
}

export function getMusicPlaylistBySlug(slug: string): MusicPlaylist | null {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM music WHERE slug = ?").get(slug) as MusicPlaylist | null;
  } finally {
    db.close();
  }
}

export function getMusicPlaylistsByCategory(category: string): MusicPlaylist[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM music WHERE category = ? ORDER BY playlist_name").all(category) as MusicPlaylist[];
  } finally {
    db.close();
  }
}

export function getMusicCategories(): string[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT DISTINCT category FROM music WHERE category IS NOT NULL AND category != '' ORDER BY category").all() as { category: string }[];
    return rows.map((r) => r.category);
  } finally {
    db.close();
  }
}

// ============================================================================
// GAMES TYPE DEFINITIONS
// ============================================================================

export interface GameCharacter {
  id: number;
  name: string;
  game: string;
  role: string;
  avatar_image: string;
  description: string;
}

export interface GameConsole {
  id: number;
  name: string;
  manufacturer: string;
  release_date: string;
  cover_image: string;
}

export interface Game {
  id: number;
  name: string;
  version: string;
  release_date: string;
  console: string;
  hours_played: number;
  genres: string[];
  cover_image: string;
  developer: string;
  publisher: string;
  rating: number;
  favorite: boolean;
  favorite_weight: number;
  date_last_played: string;
}

export interface GamePlatform {
  id: number;
  name: string;
  company: string;
  release_date: string;
  cover_image: string;
  description: string;
}

// ============================================================================
// GAMES QUERIES
// ============================================================================

export function getGameCharacters(): GameCharacter[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM game_characters ORDER BY id").all() as GameCharacter[];
  } finally {
    db.close();
  }
}

export function getGameConsoles(): GameConsole[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM game_consoles ORDER BY release_date DESC").all() as GameConsole[];
  } finally {
    db.close();
  }
}

export function getGames(): Game[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM games ORDER BY date_last_played DESC").all() as any[];
    return rows.map((row) => ({
      ...row,
      genres: JSON.parse(row.genres || "[]"),
      favorite: row.favorite === 1,
    }));
  } finally {
    db.close();
  }
}

export function getGameById(id: number): Game | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM games WHERE id = ?").get(id) as any;
    if (!row) return null;
    return {
      ...row,
      genres: JSON.parse(row.genres || "[]"),
      favorite: row.favorite === 1,
    };
  } finally {
    db.close();
  }
}

export function getFavoriteGames(): Game[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM games WHERE favorite = 1 ORDER BY favorite_weight DESC").all() as any[];
    return rows.map((row) => ({
      ...row,
      genres: JSON.parse(row.genres || "[]"),
      favorite: true,
    }));
  } finally {
    db.close();
  }
}

export function getGamePlatforms(): GamePlatform[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM game_platforms ORDER BY name").all() as GamePlatform[];
  } finally {
    db.close();
  }
}

export function getGameConsolesByManufacturer(manufacturer: string): GameConsole[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM game_consoles WHERE manufacturer = ? ORDER BY release_date DESC").all(manufacturer) as GameConsole[];
  } finally {
    db.close();
  }
}

// ============================================================================
// PLAYLIST TYPE DEFINITIONS
// ============================================================================

export interface Playlist {
  id: number;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  link: string;
}

// ============================================================================
// PLAYLIST QUERIES
// ============================================================================

export function getPlaylists(): Playlist[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM playlist ORDER BY title").all() as Playlist[];
  } finally {
    db.close();
  }
}

export function getPlaylistBySlug(slug: string): Playlist | null {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM playlist WHERE slug = ?").get(slug) as Playlist | null;
  } finally {
    db.close();
  }
}

export function getPlaylistsBySlugs(slugs: string[]): Playlist[] {
  const db = getDb();
  try {
    const placeholders = slugs.map(() => "?").join(", ");
    return db.prepare(`SELECT * FROM playlist WHERE slug IN (${placeholders}) ORDER BY title`).all(...slugs) as Playlist[];
  } finally {
    db.close();
  }
}

// ============================================================================
// FILMS (PHYSICAL COLLECTION) TYPE DEFINITIONS
// ============================================================================

export interface Film {
  id: number;
  slug: string;
  title: string;
  director: string | null;
  original_title: string | null;
  year: number | null;
  country: string | null;
  runtime: number | null;
  genre: string[];
  poster_url: string | null;
  production: string | null;
  collection: string | null;
  language: string | null;
  classification: string | null;
  sub_classification: string | null;
}

// ============================================================================
// FILMS QUERIES
// ============================================================================

export function getFilms(): any[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM films ORDER BY title").all() as any[];
    return rows.map((row) => ({
      id: row.id?.toString() || row.slug,
      slug: row.slug,
      title: row.title,
      director: row.director,
      originalTitle: row.original_title,
      original_title: row.original_title,
      year: row.year,
      country: row.country,
      runtime: row.runtime,
      genre: JSON.parse(row.genre || "[]"),
      posterUrl: row.poster_url,
      poster_url: row.poster_url,
      production: row.production,
      collection: row.collection,
      language: row.language,
      classification: row.classification,
      subClassification: row.sub_classification,
      sub_classification: row.sub_classification,
    }));
  } finally {
    db.close();
  }
}

export function getFilmBySlug(slug: string): any | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM films WHERE slug = ?").get(slug) as any;
    if (!row) return null;
    return {
      id: row.id?.toString() || row.slug,
      slug: row.slug,
      title: row.title,
      director: row.director,
      originalTitle: row.original_title,
      original_title: row.original_title,
      year: row.year,
      country: row.country,
      runtime: row.runtime,
      genre: JSON.parse(row.genre || "[]"),
      posterUrl: row.poster_url,
      poster_url: row.poster_url,
      production: row.production,
      collection: row.collection,
      language: row.language,
      classification: row.classification,
      subClassification: row.sub_classification,
      sub_classification: row.sub_classification,
    };
  } finally {
    db.close();
  }
}

export function getFilmsByClassification(classification: string): any[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM films WHERE classification = ? ORDER BY title").all(classification) as any[];
    return rows.map((row) => ({
      id: row.id?.toString() || row.slug,
      slug: row.slug,
      title: row.title,
      director: row.director,
      originalTitle: row.original_title,
      original_title: row.original_title,
      year: row.year,
      country: row.country,
      runtime: row.runtime,
      genre: JSON.parse(row.genre || "[]"),
      posterUrl: row.poster_url,
      poster_url: row.poster_url,
      production: row.production,
      collection: row.collection,
      language: row.language,
      classification: row.classification,
      subClassification: row.sub_classification,
      sub_classification: row.sub_classification,
    }));
  } finally {
    db.close();
  }
}

// ============================================================================
// LIBRARY NOTES TYPE DEFINITIONS
// ============================================================================

export interface LibraryNote {
  id: number;
  date: string | null;
  title: string;
  content: string | null;
}

// ============================================================================
// LIBRARY NOTES QUERIES
// ============================================================================

export function getLibraryNotes(): LibraryNote[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM library_notes ORDER BY date DESC").all() as LibraryNote[];
  } finally {
    db.close();
  }
}

export function getLibraryNoteById(id: number): LibraryNote | null {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM library_notes WHERE id = ?").get(id) as LibraryNote | null;
  } finally {
    db.close();
  }
}

// ============================================================================
// LIBRARY (BOOKS) TYPE DEFINITIONS
// ============================================================================

export interface LibraryBook {
  id: number;
  slug: string;
  title: string;
  author: string | null;
  authors: string[] | null;
  editors: string | null;
  series: string | null;
  edition: string | null;
  publisher: string | null;
  year_published: string | null;
  copyright: string | null;
  isbn: string | null;
  cover_url: string | null;
  classification: string | null;
  sub_classification: string | null;
}

// ============================================================================
// LIBRARY (BOOKS) QUERIES
// ============================================================================

export function getLibraryBooks(): any[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM library ORDER BY title").all() as any[];
    return rows.map((row) => {
      // Convert slug-style author to display name
      const authorDisplay = row.author
        ? row.author.split('-').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        : null;

      const authorsArray = row.authors ? JSON.parse(row.authors) : null;
      const authorsDisplay = authorsArray
        ? authorsArray.map((a: string) =>
            a.split('-').map((word: string) =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
          )
        : null;

      return {
        id: row.id?.toString() || row.slug,
        slug: row.slug,
        title: row.title,
        author: row.author,
        authorName: authorDisplay,
        authors: authorsArray,
        authorNames: authorsDisplay,
        editors: row.editors,
        series: row.series,
        edition: row.edition,
        publisher: row.publisher,
        yearPublished: row.year_published,
        copyright: row.copyright,
        isbn: row.isbn,
        coverUrl: row.cover_url,
        cover_url: row.cover_url,
        classification: row.classification,
        subClassification: row.sub_classification,
        sub_classification: row.sub_classification,
      };
    });
  } finally {
    db.close();
  }
}

export function getLibraryBookBySlug(slug: string): any | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM library WHERE slug = ?").get(slug) as any;
    if (!row) return null;

    // Convert slug-style author to display name
    const authorDisplay = row.author
      ? row.author.split('-').map((word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      : null;

    const authorsArray = row.authors ? JSON.parse(row.authors) : null;
    const authorsDisplay = authorsArray
      ? authorsArray.map((a: string) =>
          a.split('-').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        )
      : null;

    return {
      id: row.id?.toString() || row.slug,
      slug: row.slug,
      title: row.title,
      author: row.author,
      authorName: authorDisplay,
      authors: authorsArray,
      authorNames: authorsDisplay,
      editors: row.editors,
      series: row.series,
      edition: row.edition,
      publisher: row.publisher,
      yearPublished: row.year_published,
      copyright: row.copyright,
      isbn: row.isbn,
      coverUrl: row.cover_url,
      cover_url: row.cover_url,
      classification: row.classification,
      subClassification: row.sub_classification,
      sub_classification: row.sub_classification,
    };
  } finally {
    db.close();
  }
}

export function getLibraryBooksByClassification(classification: string): any[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM library WHERE classification = ? ORDER BY title").all(classification) as any[];
    return rows.map((row) => {
      // Convert slug-style author to display name
      const authorDisplay = row.author
        ? row.author.split('-').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        : null;

      const authorsArray = row.authors ? JSON.parse(row.authors) : null;
      const authorsDisplay = authorsArray
        ? authorsArray.map((a: string) =>
            a.split('-').map((word: string) =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
          )
        : null;

      return {
        id: row.id?.toString() || row.slug,
        slug: row.slug,
        title: row.title,
        author: row.author,
        authorName: authorDisplay,
        authors: authorsArray,
        authorNames: authorsDisplay,
        editors: row.editors,
        series: row.series,
        edition: row.edition,
        publisher: row.publisher,
        yearPublished: row.year_published,
        copyright: row.copyright,
        isbn: row.isbn,
        coverUrl: row.cover_url,
        cover_url: row.cover_url,
        classification: row.classification,
        subClassification: row.sub_classification,
        sub_classification: row.sub_classification,
      };
    });
  } finally {
    db.close();
  }
}

// ============================================================================
// READING AUDIOBOOKS TYPE DEFINITIONS
// ============================================================================

export interface ReadingAudiobook {
  id: number;
  title: string;
  subtitle: string | null;
  author: string | null;
  cover: string | null;
  link: string | null;
}

// ============================================================================
// READING AUDIOBOOKS QUERIES
// ============================================================================

export function getReadingAudiobooks(): ReadingAudiobook[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_audiobooks ORDER BY title").all() as ReadingAudiobook[];
  } finally {
    db.close();
  }
}

// ============================================================================
// READING BLOGS TYPE DEFINITIONS
// ============================================================================

export interface ReadingBlog {
  id: number;
  title: string;
  author: string | null;
  source_link: string | null;
  archive_link: string | null;
  publication_year: number | null;
}

// ============================================================================
// READING BLOGS QUERIES
// ============================================================================

export function getReadingBlogs(): ReadingBlog[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_blogs ORDER BY publication_year DESC").all() as ReadingBlog[];
  } finally {
    db.close();
  }
}

// ============================================================================
// READING BOOKS TYPE DEFINITIONS
// ============================================================================

export interface ReadingBook {
  id: number;
  title: string;
  subtitle: string | null;
  author: string | null;
  cover: string | null;
  link: string | null;
}

// ============================================================================
// READING BOOKS QUERIES
// ============================================================================

export function getReadingBooks(): ReadingBook[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_books ORDER BY title").all() as ReadingBook[];
  } finally {
    db.close();
  }
}

// ============================================================================
// READING ESSAYS TYPE DEFINITIONS
// ============================================================================

export interface ReadingEssay {
  id: number;
  title: string;
  author: string | null;
  source_link: string | null;
  archive_link: string | null;
  publication_year: number | null;
}

// ============================================================================
// READING ESSAYS QUERIES
// ============================================================================

export function getReadingEssays(): ReadingEssay[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_essays ORDER BY publication_year DESC").all() as ReadingEssay[];
  } finally {
    db.close();
  }
}

// ============================================================================
// READING PAPERS TYPE DEFINITIONS
// ============================================================================

export interface ReadingPaper {
  id: number;
  title: string;
  author: string[];
  source_link: string | null;
  archive_link: string | null;
  publication_year: number | null;
}

// ============================================================================
// READING PAPERS QUERIES
// ============================================================================

export function getReadingPapers(): ReadingPaper[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM reading_papers ORDER BY publication_year DESC").all() as any[];
    return rows.map((row) => ({
      ...row,
      author: JSON.parse(row.author || "[]"),
    }));
  } finally {
    db.close();
  }
}

// ============================================================================
// READING LISTS TYPE DEFINITIONS
// ============================================================================

export interface ReadingListBook {
  title: string;
  isbn13: string;
}

export interface ReadingList {
  id: number;
  list_id: string;
  title: string;
  description: string | null;
  author: string | null;
  books: ReadingListBook[];
}

// ============================================================================
// READING LISTS QUERIES
// ============================================================================

export function getReadingLists(): ReadingList[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM reading_lists ORDER BY title").all() as any[];
    return rows.map((row) => ({
      ...row,
      books: JSON.parse(row.books || "[]"),
    }));
  } finally {
    db.close();
  }
}

export function getReadingListById(listId: string): ReadingList | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM reading_lists WHERE list_id = ?").get(listId) as any;
    if (!row) return null;
    return {
      ...row,
      books: JSON.parse(row.books || "[]"),
    };
  } finally {
    db.close();
  }
}

// ============================================================================
// READING NOW TYPE DEFINITIONS
// ============================================================================

export interface ReadingNow {
  id: number;
  title: string;
  subtitle: string | null;
  author: string | null;
  cover: string | null;
  link: string | null;
}

// ============================================================================
// READING NOW QUERIES
// ============================================================================

export function getReadingNow(): ReadingNow[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_now ORDER BY id").all() as ReadingNow[];
  } finally {
    db.close();
  }
}

// ============================================================================
// SHORT STORIES TYPE DEFINITIONS
// ============================================================================

export interface ShortStory {
  id: number;
  title: string;
  author: string | null;
  publication_year: number | null;
}

// ============================================================================
// SHORT STORIES QUERIES
// ============================================================================

export function getShortStories(): ShortStory[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM short_stories ORDER BY title").all() as ShortStory[];
  } finally {
    db.close();
  }
}

// ============================================================================
// READING VERSE TYPE DEFINITIONS
// ============================================================================

export interface ReadingVerse {
  id: number;
  title: string;
  author: string | null;
  verse_type: string | null;
  source_link: string | null;
  publication_year: number | null;
}

// ============================================================================
// READING VERSE QUERIES
// ============================================================================

export function getReadingVerse(): ReadingVerse[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_verse ORDER BY title").all() as ReadingVerse[];
  } finally {
    db.close();
  }
}

// ============================================================================
// WANT TO READ TYPE DEFINITIONS
// ============================================================================

export interface WantToRead {
  id: number;
  title: string;
  subtitle: string | null;
  author: string | null;
  cover: string | null;
  link: string | null;
}

// ============================================================================
// WANT TO READ QUERIES
// ============================================================================

export function getWantToRead(): WantToRead[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM want_to_read ORDER BY title").all() as WantToRead[];
  } finally {
    db.close();
  }
}

// ============================================================================
// READING LOG TYPE DEFINITIONS
// ============================================================================

export interface ReadingLogEntry {
  id: number;
  date: string | null;
  title: string;
  author: string | null;
  type: string | null;
  minutes: number | null;
}

// ============================================================================
// READING LOG QUERIES
// ============================================================================

export function getReadingLog(): ReadingLogEntry[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM reading_log ORDER BY date DESC").all() as ReadingLogEntry[];
  } finally {
    db.close();
  }
}

// ============================================================================
// TV TYPE DEFINITIONS
// ============================================================================

export interface TvWatched {
  id: number;
  tmdb_id: number | null;
  name: string;
  year: string | null;
  synopsis: string | null;
  poster: string | null;
  rating: string | null;
  watched_date: string | null;
  creator: string | null;
  cast: string | null;
  networks: string | null;
  countries: string | null;
  languages: string | null;
  genres: string | null;
  runtime: string | null;
  seasons: number | null;
  episodes: number | null;
  status: string | null;
  sort_order: number;
}

export interface FavTvActor {
  id: number;
  name: string;
  image: string | null;
  sort_order: number;
}

export interface FavTvCharacter {
  id: number;
  name: string;
  image: string | null;
  actor: string | null;
  show: string | null;
  sort_order: number;
}

export interface FavTvNetwork {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  sort_order: number;
}

export interface FavShowrunner {
  id: number;
  name: string;
  image: string | null;
  sort_order: number;
}

export interface FavTvShow {
  id: number;
  name: string;
  year: string | null;
  poster: string | null;
  sort_order: number;
}

// ============================================================================
// TV QUERIES
// ============================================================================

export function getTvWatched(): TvWatched[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM tv_watched ORDER BY sort_order, id").all() as TvWatched[];
  } finally {
    db.close();
  }
}

export function getFavTvActors(): FavTvActor[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_tv_actors ORDER BY sort_order, id").all() as FavTvActor[];
  } finally {
    db.close();
  }
}

export function getFavTvCharacters(): FavTvCharacter[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_tv_characters ORDER BY sort_order, id").all() as FavTvCharacter[];
  } finally {
    db.close();
  }
}

export function getFavTvNetworks(): FavTvNetwork[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_tv_networks ORDER BY sort_order, id").all() as FavTvNetwork[];
  } finally {
    db.close();
  }
}

export function getFavShowrunners(): FavShowrunner[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_showrunners ORDER BY sort_order, id").all() as FavShowrunner[];
  } finally {
    db.close();
  }
}

export function getFavTvShows(): FavTvShow[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM fav_tv_shows ORDER BY sort_order, id").all() as FavTvShow[];
  } finally {
    db.close();
  }
}

// ============================================================================
// VIDEOS TYPE DEFINITIONS
// ============================================================================

export interface Video {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  preview: string | null;
  image: string | null;
  video: string | null;
  category: string | null;
  tags: string[];
  date: string | null;
  status: string;
  confidence: string;
  importance: number;
  state: string;
}

// ============================================================================
// VIDEOS QUERIES
// ============================================================================

export function getVideos(): Video[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM videos WHERE state = 'active' ORDER BY date DESC").all() as any[];
    return rows.map((row) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
    }));
  } finally {
    db.close();
  }
}

export function getVideoBySlug(slug: string): Video | null {
  const db = getDb();
  try {
    const row = db.prepare("SELECT * FROM videos WHERE slug = ?").get(slug) as any;
    if (!row) return null;
    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
    };
  } finally {
    db.close();
  }
}

export function getVideosByCategory(category: string): Video[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT * FROM videos WHERE category = ? AND state = 'active' ORDER BY date DESC").all(category) as any[];
    return rows.map((row) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
    }));
  } finally {
    db.close();
  }
}

// ============================================================================
// 404 BLOCKS
// ============================================================================

export interface Block404 {
  id: number;
  img: string;
  msg: string;
  status: "common" | "uncommon" | "rare" | "legendary" | "mythic";
  invert: "y" | "n";
  audio: string | null;
  video: string | null;
}

export function getAll404Blocks(): Block404[] {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM blocks_404").all() as Block404[];
  } finally {
    db.close();
  }
}

export function get404BlocksByStatus(status: string): Block404[] {
  const db = getDb();
  try {
    return db
      .prepare("SELECT * FROM blocks_404 WHERE status = ?")
      .all(status) as Block404[];
  } finally {
    db.close();
  }
}

export function get404BlockCount(): Record<string, number> {
  const db = getDb();
  try {
    const rows = db
      .prepare("SELECT status, COUNT(*) as count FROM blocks_404 GROUP BY status")
      .all() as { status: string; count: number }[];
    const counts: Record<string, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      legendary: 0,
      mythic: 0,
    };
    for (const row of rows) {
      counts[row.status] = row.count;
    }
    return counts;
  } finally {
    db.close();
  }
}
