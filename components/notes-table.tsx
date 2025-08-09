"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Note {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  cover_image?: string;
  preview?: string;
  state?: string;
}

interface NotesTableProps {
  notes: Note[];
  searchQuery: string;
  activeCategory: string;
}

export function NotesTable({ notes, searchQuery, activeCategory }: NotesTableProps) {
  const router = useRouter();

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(note: Note): string {
    const dateToUse = (note.end_date && note.end_date.trim()) || note.start_date;
    return formatDate(dateToUse);
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // Helper to build the correct route for a note
  function getNoteUrl(note: Note) {
    const categorySlug = note.category.toLowerCase().replace(/\s+/g, "-");
    return `/notes/${categorySlug}/${encodeURIComponent(note.slug)}`;
  }

  if (!notes.length) {
    return <p className="text-center py-10 text-muted-foreground">No notes found.</p>;
  }

  return (
    <div className="mt-8">      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, index) => (            <tr
              key={note.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getNoteUrl(note))}
            >              <td className="py-2 px-3 font-medium">{note.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(note.category)}</td>
              <td className="py-2 px-3">{getDisplayDate(note)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
