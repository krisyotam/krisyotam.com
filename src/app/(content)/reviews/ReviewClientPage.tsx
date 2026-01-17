/**
 * =============================================================================
 * ReviewClientPage.tsx
 * =============================================================================
 *
 * Client component for the reviews listing page.
 * Displays reviews with filtering, search, and view mode options.
 *
 * Data is passed via props from server component (fetched from content.db).
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
import type { ReviewMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface CategoryData {
  slug: string;
  title: string;
  preview?: string;
  date?: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface ReviewClientPageProps {
  reviews: ReviewMeta[];
  categories: CategoryData[];
  initialCategory?: string;
}

// =============================================================================
// Constants
// =============================================================================

const defaultReviewsPageData = {
  title: "Reviews",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "In-depth reviews of literature, film, ballet, plays, art, anime, manga and more since 2023",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 7,
} satisfies PageHeaderProps;

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Component
// =============================================================================

export default function ReviewClientPage({
  reviews,
  categories,
  initialCategory = "all"
}: ReviewClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categoryList = ["all", ...Array.from(new Set(reviews.map(r => r.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categoryList.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // ---------------------------------------------------------------------------
  // Header Data
  // ---------------------------------------------------------------------------

  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultReviewsPageData;
    }

    // Find category data from props
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categories.find(cat => cat.slug === categorySlug);

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

    return defaultReviewsPageData;
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
      router.push("/reviews");
    } else {
      router.push(`/reviews/${slugifyCategory(selectedValue)}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Filtering & Sorting
  // ---------------------------------------------------------------------------

  const filteredReviews = reviews.filter((review) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      review.title.toLowerCase().includes(q) ||
      review.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      review.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || review.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) || a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) || b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getReviewUrl(review: ReviewMeta) {
    return `/reviews/${encodeURIComponent(review.category)}/${encodeURIComponent(review.slug)}`;
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReviews.map((review) => (
        <div
          key={review.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getReviewUrl(review))}
        >
          {/* Cover Image Area - Book aspect ratio (3:4) */}
          <div className="aspect-[3/4] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {review.cover_image ? (
              <img
                src={review.cover_image}
                alt={review.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {review.title}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{review.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{review.category}</p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date((review.end_date && review.end_date.trim()) || review.start_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <ContentTable
      items={filteredReviews}
      basePath="/reviews"
      showCategoryLinks={false}
      formatCategoryNames={false}
      emptyMessage="No reviews found matching your criteria."
    />
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <style jsx global>{`
        .reviews-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="reviews-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Navigation with search, filter, and view toggle */}
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search reviews..."
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

        {filteredReviews.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No reviews found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Reviews"
          description="This section contains in-depth reviews of books, media, art, performances and more. Each review includes ratings for status (abandoned/completed), confidence in the rating, and importance. Use the search bar to find specific reviews by title, tag, or category. You can also filter reviews by category using the dropdown above."
        />
      </div>
    </>
  );
}
