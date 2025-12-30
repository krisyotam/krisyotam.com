"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/core";
import type { PageHeaderProps } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, ContentTable } from "@/components/content";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/essays/categories.json";
import type { Post } from "@/utils/posts";

/* default page-level metadata for the header */
const defaultEssaysPageData = {
  title: "Essays",
  subtitle: "Long-form thoughts and reflections",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "personal reflections, provocations, and open-ended thinking on life and mind",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface EssaysClientPageProps {
  notes: Post[];
  initialCategory?: string;
}

export default function EssaysClientPage({ notes, initialCategory = "all" }: EssaysClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(notes.map(note => note.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultEssaysPageData;
    }
    
    // Find category data from categories.json
    const categoryData = categoriesData.categories.find(cat => cat.slug === initialCategory);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        date: categoryData.date,
        preview: categoryData.preview || "",
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultEssaysPageData;
  };

  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Handle category change directly within the component
  function handleCategoryChange(selectedValue: string) {
    setActiveCategory(selectedValue);
  }

  // Filter essays based on search query and category
  const filteredEssays = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      note.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || note.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Helper to build the correct route for an essay
  function getEssayUrl(note: Post) {
    return `/essays/${note.category}/${note.slug}`;
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
      {filteredEssays.map((note) => (
        <div
          key={note.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getEssayUrl(note))}
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
    <ContentTable
      items={filteredEssays}
      basePath="/essays"
      showCategoryLinks={false}
      formatCategoryNames={true}
      emptyMessage="No essays found matching your criteria."
    />
  );

  return (
    <>
      <style jsx global>{`
        .essays-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="essays-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search essays..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredEssays.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No essays found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Essays"
          description="This section contains my longer-form essays and reflections. Each essay includes ratings for status, confidence in the rating, and importance. Use the search bar to find specific essays by title, tag, or category. You can also filter essays by category using the dropdown above."
        />
      </div>
    </>
  );
}