import { notFound } from "next/navigation";
import notesData from "@/data/quick-notes.json";
import NotePageClient from "./NotePageClient";
import type { NoteMeta } from "@/types/note"

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"

interface NoteData {
  title: string
  date: string
  slug: string
  tags: string[]
  category: string
  status: string
  confidence: string
  importance: number
}

interface Params {
  year: string;
  slug: string;
}

export default async function NotePage({ params }: { params: Params }) {
  const noteData = notesData.find(
    (n) => n.slug === params.slug && n.date.startsWith(params.year)
  );
  if (!noteData) notFound();

  const note: NoteMeta = {
    ...noteData,
    status: noteData.status as Status,
    confidence: noteData.confidence as Confidence
  }

  const notes: NoteMeta[] = notesData.map((note: NoteData) => ({
    ...note,
    status: note.status as Status,
    confidence: note.confidence as Confidence
  }))

  // ⬇️ Dynamically import the MDX file based on year/slug
  const Note = (await import(`@/app/notes/content/${params.year}/${params.slug}.mdx`)).default;

  return (
    <NotePageClient note={note} allNotes={notes}>
      <div className="note-content">
        {/* ⬇︎ MDX is now a real React component */}
        <Note />
      </div>
    </NotePageClient>
  );
}
