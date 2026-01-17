/**
 * =============================================================================
 * News Client Page
 * =============================================================================
 *
 * Client-side component for displaying and filtering news articles.
 * Receives data from content.db via server component props.
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
import type { CategoryData } from "@/lib/types/content";

// =============================================================================
// Types
// =============================================================================

import type { NewsMeta, NewsStatus } from "@/types/content";

interface NewsClientPageProps {
  news: NewsMeta[];
  initialCategory?: string;
  categories: CategoryData[];
}

// =============================================================================
// Helpers
// =============================================================================

/* default page-level metadata for the header */
const defaultNewsPageData = {
  title: "News",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Latest news and developments in AI, technology, and innovation",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 8,
} satisfies PageHeaderProps;

// Function to map news status to PageHeader compatible status
const mapNewsStatusToPageHeaderStatus = (newsStatus: NewsStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
  const statusMap: Record<NewsStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
    Draft: "Draft",
    Published: "Finished",
    Archived: "Abandoned",
    Breaking: "In Progress",
    Developing: "In Progress"
  };
  return statusMap[newsStatus] || "Draft";
};

// Helper function to create category slug
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Page Component
// =============================================================================

export default function NewsClientPage({ news, initialCategory = "all", categories }: NewsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categoryNames = ["all", ...Array.from(new Set(news.map(n => n.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categoryNames.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultNewsPageData;
    }

    // Find category data from categories prop
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categories.find(cat => cat.slug === categorySlug);

    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        date: categoryData.date,
        preview: categoryData.preview || "",
        status: mapNewsStatusToPageHeaderStatus(categoryData.status as NewsStatus),
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance || 5
      };
    }

    // Fallback to default if category not found
    return defaultNewsPageData;
  };

  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/news");
    } else {
      router.push(`/news/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .news-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="news-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Navigation with search, filter, and view toggle */}
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search news..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={false}
        />

        {/* News table */}
        <ContentTable
          items={news.filter((n) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
              !q ||
              n.title.toLowerCase().includes(q) ||
              n.tags.some((t) => t.toLowerCase().includes(q)) ||
              n.category.toLowerCase().includes(q);
            const matchesCategory = activeCategory === "all" || n.category === activeCategory;
            return matchesSearch && matchesCategory;
          }).sort((a, b) => {
            const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
            const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })}
          basePath="/news"
          showCategoryLinks={false}
          formatCategoryNames={false}
          emptyMessage="No news found matching your criteria."
        />

        {/* PageDescription component */}
        <PageDescription
          title="About News"
          description="This section contains the latest news and developments in AI, technology, and innovation. Each article includes status (draft/published), confidence in the information, and importance. Use the search bar to find specific articles by title, tag, or category. You can also filter news by category using the dropdown above."
        />
      </div>
    </>
  );
}
