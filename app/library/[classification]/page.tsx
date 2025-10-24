import { notFound } from 'next/navigation'

interface LibraryClassificationPageProps {
  params: {
    classification: string
  }
}

export default function LibraryClassificationPage({ params }: LibraryClassificationPageProps) {
  // This page is not yet implemented
  notFound()
}