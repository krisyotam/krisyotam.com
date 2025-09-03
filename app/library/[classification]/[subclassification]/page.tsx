import { notFound } from 'next/navigation'

interface LibrarySubclassificationPageProps {
  params: {
    classification: string
    subclassification: string
  }
}

export default function LibrarySubclassificationPage({ params }: LibrarySubclassificationPageProps) {
  // This page is not yet implemented
  notFound()
}