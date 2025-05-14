"use client";

import { useState } from "react";
import { NotesSearch } from "@/components/notes-search";
import { NotesCategoryFilter } from "@/components/notes-category-filter";
import { NotesList } from "@/components/notes-list";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";

/* page-level metadata for the header */
const notesPageData = {
  title: "Notes",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Misc thoughts, memories, proto-essays, musings, etc.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

/* ---------- updated type ---------- */
interface Note {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
}

interface NotesClientPageProps {
  notes: Note[];
}

export default function NotesClientPage({ notes }: NotesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(notes.map(n => n.category)))];

  return (
    <>
      <style jsx global>{`
        .notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...notesPageData} />

        <NotesSearch onSearch={setSearchQuery} />

        <NotesCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
        />

        {/* Pass metadata-only list */}
        <NotesList
          notes={notes}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Notes"
          description="This is my notes section where I jot down quick thoughts, ideas, and observations. Use the search bar to find specific notes by title, tag, or category. You can also filter notes by category using the buttons below the search bar. Full text now lives in each .mdx file — titles, tags, and categories are searchable here."
        />
      </div>
    </>
  );
}
