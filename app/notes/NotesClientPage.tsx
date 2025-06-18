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
  date: new Date().toISOString(),
  preview: "Misc thoughts, proto-essays, reviews, musings, etc.",
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
  initialCategory?: string;
}

export default function NotesClientPage({ notes, initialCategory = "all" }: NotesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
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
        date: categoryData.date,
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

  return (
    <>
      <style jsx global>{`
        .notes-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="notes-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />{/* Search and filter on same row */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>        {/* Notes table instead of grouped list */}
        <NotesTable
          notes={notes}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Notes"
          description="This is my notes section where I jot down quick thoughts, ideas, and observations. Use the search bar to find specific notes by title, tag, or category. You can also filter notes by category using the dropdown above. Full text now lives in each .mdx file — titles, tags, and categories are searchable here."
        />
      </div>
    </>
  );
}
