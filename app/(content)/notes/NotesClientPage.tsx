/**
 * =============================================================================
 * NotesClientPage.tsx
 * =============================================================================
 *
 * Client component for the notes listing page.
 * Displays notes with filtering, search, and view mode options.
 *
 * Data is passed via props from server component (fetched from content.db).
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, ContentTable } from "@/components/content";
import { SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

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

interface CategoryData {
  slug: string;
  title: string;
  preview?: string | null;
  date?: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface NotesClientPageProps {
  notes: Note[];
  categories?: CategoryData[];
  initialCategory?: string;
}

// =============================================================================
// Constants
// =============================================================================

const defaultNotesPageData = {
  title: "Notes",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Misc thoughts, proto-essays, analysis, musings, etc.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function formatCategoryDisplayName(category: string) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// =============================================================================
// Component
// =============================================================================

export default function NotesClientPage({
  notes,
  categories = [],
  initialCategory = "all"
}: NotesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  // Build category list
  const categoryList = ["all", ...Array.from(new Set(notes.map(n => n.category)))];

  // Convert to SelectOption format
  const categoryOptions: SelectOption[] = categoryList.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // ---------------------------------------------------------------------------
  // Header Data
  // ---------------------------------------------------------------------------

  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultNotesPageData;
    }

    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categories.find(cat => cat.slug === categorySlug);

    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview || "",
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }

    return defaultNotesPageData;
  };

  const headerData = getHeaderData();

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/notes");
    } else {
      router.push(`/notes/${slugifyCategory(selectedValue)}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredNotes = notes
    .filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        note.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || note.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
      const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getNoteUrl(note: Note) {
    return `/notes/${note.category}/${note.slug}`;
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredNotes.map((note) => (
        <div
          key={note.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getNoteUrl(note))}
        >
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {note.cover_image ? (
              <img
                src={note.cover_image}
                alt={note.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {note.title}
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{note.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {formatCategoryDisplayName(note.category)}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(note.end_date || note.start_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <ContentTable
      items={filteredNotes}
      basePath="/notes"
      showCategoryLinks={false}
      formatCategoryNames={true}
      emptyMessage="No notes found matching your criteria."
    />
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <style jsx global>{`
        .notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search notes..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredNotes.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">
            No notes found matching your criteria.
          </div>
        )}

        <PageDescription
          title="About Notes"
          description="This is my notes section where I jot down quick thoughts, ideas, and observations. Use the search bar to find specific notes by title, tag, or category."
        />
      </div>
    </>
  );
}
