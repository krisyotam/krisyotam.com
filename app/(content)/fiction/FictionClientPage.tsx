"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, ContentTable } from "@/components/content";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SelectOption } from "@/components/ui/custom-select";
import categoriesData from "@/data/fiction/categories.json";

/* ---------- updated type ---------- */
interface Story {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  cover_image?: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  state: "active" | "hidden";
}

interface FictionClientPageProps {
  stories: Story[];
  initialCategory?: string;
}

// Default page data
const defaultFictionPageData = {
  title: "Fiction",
  subtitle: "Short Stories, Flash Fiction, and More",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "A collection of my fiction writing, from flash fiction to novel excerpts",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

export default function FictionClientPage({ stories, initialCategory = "all" }: FictionClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(stories.map(n => n.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultFictionPageData;
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
    return defaultFictionPageData;
  };
  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Filter stories based on search query and category
  const filteredStories = stories.filter((story) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      story.title.toLowerCase().includes(q) ||
      story.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      story.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || story.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Helper to build the correct route for a story
  function getStoryUrl(story: Story) {
    const categorySlug = story.category.toLowerCase().replace(/\s+/g, "-");
    return `/fiction/${categorySlug}/${encodeURIComponent(story.slug)}`;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStories.map((story) => (
        <div
          key={story.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getStoryUrl(story))}
        >
          {/* Cover Image Area - Book aspect ratio (3:4) */}
          <div className="aspect-[3/4] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {story.cover_image ? (
              <img 
                src={story.cover_image} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {story.title}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{story.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{story.category}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(story.end_date || story.start_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <ContentTable
      items={filteredStories}
      basePath="/fiction"
      showCategoryLinks={false}
      formatCategoryNames={false}
      emptyMessage="No stories found matching your criteria."
    />
  );

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/fiction");
    } else {
      router.push(`/fiction/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={headerData.title}
          subtitle={headerData.subtitle}
          start_date={headerData.start_date}
          end_date={headerData.end_date}
          preview={headerData.preview}
          status={headerData.status}
          confidence={headerData.confidence}
          importance={headerData.importance}
        />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search stories..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredStories.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No stories found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Fiction"
          description="This is my fiction section where I share short stories, flash fiction pieces, poetry, and excerpts from longer works. Use the search bar to find specific stories by title, tag, or category. You can also filter stories by category using the dropdown above."
        />
      </div>
    </>
  );
}