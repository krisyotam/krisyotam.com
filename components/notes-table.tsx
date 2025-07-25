"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Note {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface NotesTableProps {
  notes: Note[];
  searchQuery: string;
  activeCategory: string;
}

export function NotesTable({ notes, searchQuery, activeCategory }: NotesTableProps) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
  const router = useRouter();

  useEffect(() => {
    const filtered = notes.filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q)) ||
        note.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || note.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredNotes(filtered);
  }, [notes, searchQuery, activeCategory]);
  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
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

  if (!filteredNotes.length) {
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
          {filteredNotes.map((note, index) => (            <tr
              key={note.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getNoteUrl(note))}
            >              <td className="py-2 px-3 font-medium">{note.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(note.category)}</td>
              <td className="py-2 px-3">{formatDate(note.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredNotes.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No notes found matching your criteria.</div>
      )}
    </div>
  );
}
