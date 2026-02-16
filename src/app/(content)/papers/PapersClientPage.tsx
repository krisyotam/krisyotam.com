/**
 * =============================================================================
 * PapersClientPage.tsx
 * =============================================================================
 * 
 * Client component for the papers listing page.
 * Displays papers with filtering, search, and view mode options.
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
import type { PaperMeta, PaperStatus } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface CategoryData {
  slug: string;
  title: string;
  preview?: string | null;
  date?: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface PapersClientPageProps {
  papers: PaperMeta[];
  categories?: CategoryData[];
  initialCategory?: string;
}

// =============================================================================
// Constants
// =============================================================================

const defaultPapersPageData = {
  title: "Papers",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "stable long-form papers, studies, and self-experiments across various disciplines",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 9,
} satisfies PageHeaderProps;

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

function mapPaperStatusToPageHeaderStatus(
  paperStatus: PaperStatus
): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" {
  const statusMap: Record<PaperStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
    Draft: "Draft",
    Published: "Finished",
    Archived: "Abandoned",
    Active: "In Progress",
    Notes: "Notes"
  };
  return statusMap[paperStatus] || "Draft";
}

// =============================================================================
// Component
// =============================================================================

export default function PapersClientPage({
  papers,
  categories = [],
  initialCategory = "all"
}: PapersClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");
  const router = useRouter();

  // Build category list
  const categoryList = ["all", ...Array.from(new Set(papers.map(p => p.category)))];

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
      return defaultPapersPageData;
    }

    const categoryData = categories.find(cat => cat.slug === initialCategory);

    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview || "",
        status: mapPaperStatusToPageHeaderStatus(categoryData.status as PaperStatus),
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance,
        backText: "Papers",
        backHref: "/papers",
      };
    }

    return defaultPapersPageData;
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
      router.push("/papers");
    } else {
      router.push(`/papers/${slugifyCategory(selectedValue)}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredPapers = papers
    .filter((paper) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        paper.title.toLowerCase().includes(q) ||
        paper.tags.some((t) => t.toLowerCase().includes(q)) ||
        paper.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || paper.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = (a.end_date?.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date?.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <style jsx global>{`
        .papers-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="papers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search papers..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ContentTable
          items={filteredPapers}
          basePath="/papers"
          showCategoryLinks={true}
          formatCategoryNames={false}
          emptyMessage="No papers found matching your criteria."
        />

        <PageDescription
          title="About Papers"
          description="This section contains research papers and academic inquiries across multiple disciplines. Each paper includes status (draft/active/notes), confidence in the research, and importance."
        />
      </div>
    </>
  );
}
