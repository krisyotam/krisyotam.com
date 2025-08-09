import NotesClientPage from "./NotesClientPage";
import notesData from "@/data/notes/notes.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.notes;

export default function NotesPage() {
  // Filter notes to only show active ones and sort by date (newest first)
  const activeNotes = notesData.filter(note => note.state === "active");
  const notes = [...activeNotes].sort((a, b) => new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime());

  return (
    <div className="notes-container">
      <NotesClientPage notes={notes} initialCategory="all" />
    </div>
  );
}