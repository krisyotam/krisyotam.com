import type { Metadata } from "next"
import notesData from "@/data/quick-notes.json"
import NotePageClient from "./NotePageClient"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const note = notesData.find((n) => n.slug === params.slug)

  if (!note) {
    return {
      title: "Note Not Found",
    }
  }

  return {
    title: note.title,
    description: note.content.substring(0, 160).replace(/<br>/g, " "),
  }
}

export function generateStaticParams() {
  return notesData.map((note) => ({
    slug: note.slug,
  }))
}

export default function NotePage({ params }: PageProps) {
  return <NotePageClient params={params} />
}

