import { notFound } from 'next/navigation'

interface LibraryClassificationPageProps {
  params: Promise<{
    classification: string
  }>
}

export default async function LibraryClassificationPage({ params }: LibraryClassificationPageProps) {
  const { classification } = await params
  // This page is not yet implemented
  notFound()
}
