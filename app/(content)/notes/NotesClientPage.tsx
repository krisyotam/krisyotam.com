"use client";

import { useState, useEffect } from "react";
import { NotesTable } from "@/components/notes-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/notes/categories.json";

/* default page-level metadata for the header */
const defaultNotesPageData = {
  title: "Notes",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "Misc thoughts, proto-essays, analysis, musings, etc.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

/* ---------- updated type ---------- */
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

interface NotesClientPageProps {
  notes: Note[];
  initialCategory?: string;
}

export default function NotesClientPage({ notes, initialCategory = "all" }: NotesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(notes.map(n => n.category)))];
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));
  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultNotesPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultNotesPageData;
  };
  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);
  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/notes");
    } else {
      router.push(`/notes/${slugifyCategory(selectedValue)}`);
    }
  }

  // Filter notes based on search query and category
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      note.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || note.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Helper to build the correct route for a note
  function getNoteUrl(note: Note) {
    return `/notes/${note.category}/${note.slug}`;
  }

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredNotes.map((note) => (
        <div
          key={note.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getNoteUrl(note))}
        >
          {/* Cover Image Area - Using 16:9 aspect ratio from sequences */}
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
          
          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{note.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{formatCategoryDisplayName(note.category)}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(note.end_date || note.start_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <NotesTable
      notes={filteredNotes}
      searchQuery=""
      activeCategory="all"
    />
  );

  return (
    <>
      <style jsx global>{`
        .notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

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

        {/* Filter and view toggle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-border rounded-none overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs transition-colors ${
                viewMode === "grid" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-foreground hover:bg-secondary/50"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-xs transition-colors ${
                viewMode === "list" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-foreground hover:bg-secondary/50"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredNotes.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No notes found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Notes"
          description="This is my notes section where I jot down quick thoughts, ideas, and observations. Use the search bar to find specific notes by title, tag, or category. You can also filter notes by category using the dropdown above. Full text now lives in each .mdx file — titles, tags, and categories are searchable here."
        />
      </div>
    </>
  );
}
