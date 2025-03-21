import NotesClientPage from "./NotesClientPage";
import notesData from "@/data/quick-notes.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Quick thoughts and ideas",
};

export default function NotesPage() {
  // Sort notes by date (newest first)
  const notes = [...notesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="notes-container">
      <NotesClientPage notes={notes} />
    </div>
  );
}