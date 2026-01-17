import { notFound } from 'next/navigation'

interface LibrarySubclassificationPageProps {
  params: Promise<{
    classification: string
    subclassification: string
  }>
}

export default async function LibrarySubclassificationPage({ params }: LibrarySubclassificationPageProps) {
  const { classification, subclassification } = await params
  // This page is not yet implemented
  notFound()
}
