/**
 * =============================================================================
 * OCS Client Page
 * =============================================================================
 *
 * Client-side component for OCS listing with search, filtering, and view modes.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/core";
import type { PageHeaderProps } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, ContentTable } from "@/components/content";
import { SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import type { OCSMeta } from "@/types/content";
import type { CategoryData } from "@/lib/types/content";

// =============================================================================
// Types
// =============================================================================

interface OCSClientPageProps {
  ocs: OCSMeta[];
  initialCategory?: string;
  categories?: CategoryData[];
}

// =============================================================================
// Constants
// =============================================================================

/* default page-level metadata for the header */
const defaultOCSPageData = {
  title: "Original Characters",
  start_date: "2025-06-01",
  end_date: "",
  preview: "Character profiles and artwork from my original fiction stories",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 7,
} satisfies PageHeaderProps;

// =============================================================================
// Page Component
// =============================================================================

export default function OCSClientPage({ ocs, initialCategory = "all", categories: categoriesFromDb = [] }: OCSClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");
  const router = useRouter();

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  const categoryNames = ["all", ...Array.from(new Set(ocs.map(r => r.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categoryNames.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultOCSPageData;
    }

    // Find category data from database categories
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesFromDb.find(cat => cat.slug === categorySlug);

    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        date: categoryData.date,
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance,
        backText: "OCS",
        backHref: "/ocs",
      };
    }

    // Fallback to default if category not found
    return defaultOCSPageData;
  };
  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/ocs");
    } else {
      router.push(`/ocs/${slugifyCategory(selectedValue)}`);
    }
  }

  // Filter OCS based on search query and category
  const filteredOCS = ocs.filter((character) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      character.title.toLowerCase().includes(q) ||
      character.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      character.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || character.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Helper to build the correct route for an OC
  function getOCUrl(character: OCSMeta) {
    return `/${character.slug}`;
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
      {filteredOCS.map((character) => (
        <div
          key={character.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getOCUrl(character))}
        >
          {/* Cover Image Area - Book aspect ratio (3:4) */}
          <div className="aspect-[3/4] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {character.cover_image ? (
              <img 
                src={character.cover_image} 
                alt={character.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {character.title}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{character.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{character.category}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(character.end_date || character.start_date).getFullYear()}</span>
              <span>{(character.views ?? 0).toLocaleString()} views</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <ContentTable
      items={filteredOCS}
      basePath="/ocs"
      showCategoryLinks={false}
      formatCategoryNames={false}
      emptyMessage="No characters found matching your criteria."
    />
  );

  return (
    <>
      <style jsx global>{`
        .ocs-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="ocs-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Navigation with search, filter, and view toggle */}
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search characters..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={true}
        />

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredOCS.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No characters found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Original Characters"
          description="This section contains character profiles and artwork from my original fiction stories. Each character includes their book/world, character tags, and cover art. Use the search bar to find specific characters by name, tag, or book. You can also filter characters by book using the dropdown above."
        />
      </div>
    </>
  );
}
