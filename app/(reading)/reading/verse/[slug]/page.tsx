import { notFound } from "next/navigation"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.reading

export default function ReadingVerseSlugPage({ params }: { params: { slug: string } }) {
  // This is a placeholder page for verse entries in the reading section
  // You can implement the specific verse reading entry logic here
  
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <h1>Reading Verse Entry: {params.slug}</h1>
      <p>This page would show details about the verse entry with slug: {params.slug}</p>
    </main>
  )
}
