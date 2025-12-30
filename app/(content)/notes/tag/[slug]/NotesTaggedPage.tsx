"use client";

import { useState, useEffect } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
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

interface TagHeaderData {
  title: string;
  subtitle: string;
  start_date: string;
  end_date: string;
  preview: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Active";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
  backText: string;
  backHref: string;
}

interface NotesTaggedPageProps {
  notes: Note[];
  tagData: TagHeaderData;
}

export default function NotesTaggedPage({ notes, tagData }: NotesTaggedPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter notes based on search query only (since they're already filtered by tag)
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      note.category.toLowerCase().includes(q);

    return matchesSearch;
  }).sort((a, b) => new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime());

  // Helper to build the correct route for a note
  function getNoteUrl(note: Note) {
    return `/notes/${note.category}/${note.slug}`;
  }

  return (
    <>
      <style jsx global>{`
        .notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={tagData.title}
          subtitle={tagData.subtitle}
          start_date={tagData.start_date}
          end_date={tagData.end_date}
          preview={tagData.preview}
          status={tagData.status}
          confidence={tagData.confidence}
          importance={tagData.importance}
          backText={tagData.backText}
          backHref={tagData.backHref}
        />

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Notes count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} tagged with "{tagData.title}"
        </div>

        {/* Notes table */}
        <ContentTable
          items={filteredNotes}
          basePath="/notes"
          showCategoryLinks={false}
          formatCategoryNames={true}
          emptyMessage="No notes found matching your criteria."
        />

        {filteredNotes.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No notes found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={`About "${tagData.title}" Tag`}
          description={`This page shows all notes tagged with "${tagData.title}". Use the search bar above to further filter these notes by title, content, or other tags. Each note belongs to a category and may have multiple tags.`}
        />
      </div>
    </>
  );
}
