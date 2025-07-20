import NotesClientPage from "./NotesClientPage";
import notesData from "@/data/notes/quick-notes.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.notes;

export default function NotesPage() {
  // Sort notes by date (newest first)
  const notes = [...notesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="notes-container">
      <NotesClientPage notes={notes} initialCategory="all" />
    </div>
  );
}