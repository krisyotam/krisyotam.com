import { notFound } from "next/navigation";
import notesData from "@/data/quick-notes.json";
import NotePageClient from "./NotePageClient";

interface Params {
  year: string;
  slug: string;
}

export default async function NotePage({ params }: { params: Params }) {
  const note = notesData.find(
    (n) => n.slug === params.slug && n.date.startsWith(params.year)
  );
  if (!note) notFound();

  // ⬇️ Dynamically import the MDX file based on year/slug
  const Note = (await import(`@/app/notes/content/${params.year}/${params.slug}.mdx`)).default;

  return (
    <NotePageClient note={note} allNotes={notesData}>
      <div className="note-content">
        {/* ⬇︎ MDX is now a real React component */}
        <Note />
      </div>
    </NotePageClient>
  );
}
