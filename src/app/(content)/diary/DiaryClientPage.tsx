/**
 * =============================================================================
 * DiaryClientPage.tsx
 * =============================================================================
 *
 * Client component for the diary listing page.
 * Displays diary entries with filtering, search, and view mode options.
 * Simplified version without status, certainty, or importance.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, ContentTable } from "@/components/content";
import { SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import type { DiaryMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface CategoryData {
  slug: string;
  title: string;
  preview?: string | null;
  date?: string;
}

interface DiaryClientPageProps {
  entries: DiaryMeta[];
  categories?: CategoryData[];
  initialCategory?: string;
}

// =============================================================================
// Constants
// =============================================================================

const defaultDiaryPageData = {
  title: "Diary",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Quick, unpolished entries and raw thoughts. No pretense of polish here.",
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

export default function DiaryClientPage({
  entries,
  categories = [],
  initialCategory = "all"
}: DiaryClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");
  const router = useRouter();

  // Build category options
  const categoryOptions: SelectOption[] = ["all", ...new Set(entries.map(entry => entry.category))]
    .sort()
    .map(category => ({
      value: category,
      label: category === "all" ? "All Categories" : category
    }));

  // ---------------------------------------------------------------------------
  // Header Data
  // ---------------------------------------------------------------------------

  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultDiaryPageData;
    }

    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categories.find(cat => cat.slug === categorySlug);

    if (categoryData) {
      return {
        title: categoryData.title,
        start_date: categoryData.date || "2025-01-01",
        end_date: categoryData.date || new Date().toISOString().split('T')[0],
        preview: categoryData.preview || "",
        backText: "Diary",
        backHref: "/diary",
      };
    }

    return defaultDiaryPageData;
  };

  const headerData = getHeaderData();

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      router.push("/diary");
    } else {
      router.push(`/diary/${slugifyCategory(category)}`);
    }
  };

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredEntries = entries
    .filter((entry) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        entry.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = a.end_date || a.start_date;
      const dateB = b.end_date || b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getDiaryUrl(entry: DiaryMeta) {
    return `/${entry.slug}`;
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredEntries.map((entry) => (
        <div
          key={entry.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getDiaryUrl(entry))}
        >
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {entry.cover_image ? (
              <img
                src={entry.cover_image}
                alt={entry.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {entry.title}
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{entry.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {formatCategoryDisplayName(entry.category)}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(entry.end_date || entry.start_date).getFullYear()}</span>
              <span>{(entry.views ?? 0).toLocaleString()} views</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <div className="diary-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search entries..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "list" ? (
          <ContentTable
            items={filteredEntries}
            basePath="/diary"
            showCategoryLinks={true}
            formatCategoryNames={true}
            emptyMessage="No entries found matching your criteria."
          />
        ) : (
          <GridView />
        )}

        <PageDescription
          title="About Diary"
          description="Quick, unpolished entries where I jot down raw thoughts without any pretense of polish. These are informal and meant to capture ideas as they come."
        />
      </div>
    </>
  );
}
