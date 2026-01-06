import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookDetailClient } from './book-detail-client'
import { FilmDetailClient } from './film-detail-client'
import { getLibraryBooks, getFilms } from '@/lib/media-db'

type Props = {
  params: Promise<{
    classification: string
    subclassification: string
    title: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const books = getLibraryBooks()
  const films = getFilms()

  const book = books.find(b => b.slug === params.title)
  const film = films.find(f => f.slug === params.title)

  if (book) {
    const authorName = book.author || 'Unknown'

    return {
      title: `${book.title} | Library`,
      description: `${book.title} by ${authorName}. Published by ${book.publisher} in ${book.year_published}. ${book.series ? `Part of ${book.series} series.` : ''}`,
      keywords: `${book.title}, ${authorName}, ${book.publisher}, ${book.series || ''}, ${book.classification}, mathematics, textbook`,
      openGraph: {
        title: `${book.title} | Library`,
        description: `${book.title} by ${authorName}`,
        type: 'article',
        images: book.cover_url ? [{ url: book.cover_url }] : [],
      },
    }
  }

  if (film) {
    return {
      title: `${film.title} | Library`,
      description: `${film.title} (${film.year}) directed by ${film.director}. ${film.original_title ? `Originally titled "${film.original_title}".` : ''} ${film.collection ? `Part of ${film.collection}.` : ''}`,
      keywords: `${film.title}, ${film.director}, ${film.year}, ${film.genre.join(', ')}, ${film.collection}, ${film.classification}, film, cinema`,
      openGraph: {
        title: `${film.title} | Library`,
        description: `${film.title} (${film.year}) directed by ${film.director}`,
        type: 'article',
        images: film.poster_url ? [{ url: film.poster_url }] : [],
      },
    }
  }

  return {
    title: 'Item Not Found',
    description: 'The requested item could not be found.',
  }
}

export async function generateStaticParams() {
  const books = getLibraryBooks()
  const films = getFilms()

  const bookParams = books.map((book) => ({
    classification: book.classification || '',
    subclassification: book.sub_classification || '',
    title: book.slug,
  }))

  const filmParams = films.map((film) => ({
    classification: film.classification || '',
    subclassification: film.sub_classification || '',
    title: film.slug,
  }))

  return [...bookParams, ...filmParams]
}

export default async function LibraryItemPage(props: Props) {
  const params = await props.params;
  const books = getLibraryBooks()
  const films = getFilms()

  const book = books.find(b => b.slug === params.title)
  const film = films.find(f => f.slug === params.title)

  if (book) {
    const authorName = book.author || 'Unknown'
    const year = book.year_published?.match(/\d{4}/)?.[0] || book.year_published || ''
    const isbn = book.isbn || ''

    let citation = `${authorName}. (${year}). *${book.title}*`
    if (book.edition && book.edition !== '1st') {
      citation += ` (${book.edition} ed.)`
    }
    citation += `. ${book.publisher}`
    if (isbn) {
      citation += `. ISBN: ${isbn}`
    }
    citation += '.'

    const processedBook = {
      slug: book.slug,
      title: book.title,
      author: book.author,
      authors: book.authors,
      editors: book.editors,
      series: book.series || undefined,
      edition: book.edition || undefined,
      publisher: book.publisher || 'Unknown',
      yearPublished: book.year_published || 'Unknown',
      copyright: book.copyright,
      isbn: book.isbn || undefined,
      coverUrl: book.cover_url || undefined,
      classification: book.classification || 'Uncategorized',
      subClassification: book.sub_classification || 'General',
      language: 'English',
      description: `${book.title} is a comprehensive textbook in ${book.classification || 'various subjects'} published by ${book.publisher || 'an unknown publisher'}.`,
      authorName,
      citation,
    }

    return <BookDetailClient book={processedBook} />
  }

  if (film) {
    const processedFilm = {
      id: String(film.id),
      slug: film.slug,
      title: film.title,
      director: film.director || 'Unknown',
      originalTitle: film.original_title || undefined,
      year: film.year || 0,
      country: film.country || 'Unknown',
      runtime: film.runtime || 0,
      genre: film.genre,
      posterUrl: film.poster_url || '',
      production: film.production || '',
      collection: film.collection || '',
      language: film.language || 'Unknown',
      classification: film.classification || 'Uncategorized',
      subClassification: film.sub_classification || 'General',
    }
    return <FilmDetailClient film={processedFilm} />
  }

  notFound()
}
