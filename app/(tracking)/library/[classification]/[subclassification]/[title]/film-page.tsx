import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FilmDetailClient } from './film-detail-client'
import filmsData from '@/data/library/films.json'

type Props = {
  params: { 
    classification: string
    subclassification: string
    title: string 
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const film = filmsData.films.find(f => f.slug === params.title)
  
  if (!film) {
    return {
      title: 'Film Not Found',
      description: 'The requested film could not be found.',
    }
  }

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

export async function generateStaticParams() {
  const params: { classification: string; subclassification: string; title: string }[] = []
  
  filmsData.films.forEach((film) => {
    params.push({
      classification: film.classification,
      subclassification: film.subClassification,
      title: film.slug,
    })
  })
  
  return params
}

export default function FilmPage({ params }: Props) {
  const film = filmsData.films.find(f => f.slug === params.title)
  
  if (!film) {
    notFound()
  }

  return <FilmDetailClient film={film} />
}
