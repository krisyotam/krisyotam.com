import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookDetailClient } from './book-detail-client'
import { FilmDetailClient } from './film-detail-client'
import libraryData from '@/data/library/library.json'
import filmsData from '@/data/library/films.json'
import authorsData from '@/data/library/authors.json'

type Props = {
  params: { 
    classification: string
    subclassification: string
    title: string 
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = libraryData.books.find(b => b.slug === params.title)
  const film = filmsData.films.find(f => f.slug === params.title)
  
  if (book) {
    // Get author name - handle both single author and multiple authors
    let authorName = 'Unknown'
    if (book.author) {
      const author = authorsData.authors.find(a => a.slug === book.author)
      authorName = author?.name || book.author
    } else if ('authors' in book && book.authors && book.authors.length > 0) {
      const authorNames = book.authors.map(authorSlug => {
        const author = authorsData.authors.find(a => a.slug === authorSlug)
        return author?.name || authorSlug
      })
      authorName = authorNames.join(', ')
    }

    return {
      title: `${book.title} | Library`,
      description: `${book.title} ${authorName ? `by ${authorName}` : ''}. Published by ${book.publisher} in ${book.yearPublished}. ${book.series ? `Part of ${book.series} series.` : ''}`,
      keywords: `${book.title}, ${authorName || ''}, ${book.publisher}, ${book.series || ''}, ${book.classification}, mathematics, textbook`,
      openGraph: {
        title: `${book.title} | Library`,
        description: `${book.title} ${authorName ? `by ${authorName}` : ''}`,
        type: 'article',
        images: book.coverUrl ? [{ url: book.coverUrl }] : [],
      },
    }
  }
  
  if (film) {
    return {
      title: `${film.title} | Library`,
      description: `${film.title} (${film.year}) directed by ${film.director}. ${film.originalTitle ? `Originally titled "${film.originalTitle}".` : ''} ${film.collection ? `Part of ${film.collection}.` : ''}`,
      keywords: `${film.title}, ${film.director}, ${film.year}, ${film.genre.join(', ')}, ${film.collection}, ${film.classification}, film, cinema`,
      openGraph: {
        title: `${film.title} | Library`,
        description: `${film.title} (${film.year}) directed by ${film.director}`,
        type: 'article',
        images: film.posterUrl ? [{ url: film.posterUrl }] : [],
      },
    }
  }
  
  return {
    title: 'Item Not Found',
    description: 'The requested item could not be found.',
  }
}

export async function generateStaticParams() {
  const bookParams = libraryData.books.map((book) => ({
    classification: book.classification,
    subclassification: book.subClassification,
    title: book.slug,
  }))
  
  const filmParams = filmsData.films.map((film) => ({
    classification: film.classification,
    subclassification: film.subClassification,
    title: film.slug,
  }))
  
  return [...bookParams, ...filmParams]
}

export default function LibraryItemPage({ params }: Props) {
  const book = libraryData.books.find(b => b.slug === params.title)
  const film = filmsData.films.find(f => f.slug === params.title)
  
  if (book) {
    // Process book data similar to the API route
    const processedBook = {
      ...book,
      // Add required fields that aren't in the JSON
      language: 'English',
      description: `${book.title} is a comprehensive textbook in ${book.classification} published by ${book.publisher}.`,
      
      // Handle author information
      authorName: (() => {
        if (book.author) {
          const author = authorsData.authors.find(a => a.slug === book.author)
          return author?.name || book.author
        } else if ('authors' in book && book.authors && book.authors.length > 0) {
          const authorNames = book.authors.map(authorSlug => {
            const author = authorsData.authors.find(a => a.slug === authorSlug)
            return author?.name || authorSlug
          })
          return authorNames.join(', ')
        }
        return 'Unknown'
      })(),
      
      // Add author details for the authors tab
      authors: (() => {
        if (book.author) {
          const author = authorsData.authors.find(a => a.slug === book.author)
          return author ? [{
            id: author.slug,
            name: author.name,
            bio: author.bio,
            affiliations: [author.currentAffiliation, ...author.previousAffiliations].filter(Boolean),
            specializations: author.fieldOfExpertise,
            // Remove non-existent properties
          }] : []
        } else if ('authors' in book && book.authors && book.authors.length > 0) {
          return book.authors.map(authorSlug => {
            const author = authorsData.authors.find(a => a.slug === authorSlug)
            return author ? {
              id: author.slug,
              name: author.name,
              bio: author.bio,
              affiliations: [author.currentAffiliation, ...author.previousAffiliations].filter(Boolean),
              specializations: author.fieldOfExpertise,
            } : {
              id: authorSlug,
              name: authorSlug,
            }
          })
        }
        return []
      })(),
      
      // Generate citation
      citation: (() => {
        let authorText = ''
        if (book.author) {
          const author = authorsData.authors.find(a => a.slug === book.author)
          authorText = author?.name || book.author
        } else if ('authors' in book && book.authors && book.authors.length > 0) {
          const authorNames = book.authors.map(authorSlug => {
            const author = authorsData.authors.find(a => a.slug === authorSlug)
            return author?.name || authorSlug
          })
          authorText = authorNames.join(', ')
        }

        const year = book.yearPublished.match(/\d{4}/)?.[0] || book.yearPublished
        const isbn = book.isbn || book.isbn13 || book.isbn10 || ''
        
        let citation = `${authorText}. (${year}). *${book.title}*`
        if (book.edition && book.edition !== '1st') {
          citation += ` (${book.edition} ed.)`
        }
        citation += `. ${book.publisher}`
        if (isbn) {
          citation += `. ISBN: ${isbn}`
        }
        citation += '.'
        
        return citation
      })(),
    }

    return <BookDetailClient book={processedBook} />
  }
  
  if (film) {
    return <FilmDetailClient film={film} />
  }
  
  notFound()
}