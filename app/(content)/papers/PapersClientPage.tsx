"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/core";
import type { PageHeaderProps } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, ContentTable } from "@/components/content";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/papers/categories.json";

/* default page-level metadata for the header */
const defaultPapersPageData = {
  title: "Papers",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "stable long-form papers, studies, and self-experiments across various disciplines",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 9,
} satisfies PageHeaderProps;

import type { PaperMeta, PaperStatus } from "@/types/papers";

interface PapersClientPageProps {
  papers: PaperMeta[];
  initialCategory?: string;
}

export default function PapersClientPage({ papers, initialCategory = "all" }: PapersClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();
  const categories = ["all", ...Array.from(new Set(papers.map(p => p.category)))];  // Helper to get category title from slug
  function getCategoryTitle(categorySlug: string): string {
    const category = categoriesData.categories.find(cat => cat.slug === categorySlug);
    return category ? category.title : categorySlug;
  }
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));
    // Function to map paper status to PageHeader compatible status
  const mapPaperStatusToPageHeaderStatus = (paperStatus: PaperStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<PaperStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned",
      Active: "In Progress",
      Notes: "Notes"
    };
    return statusMap[paperStatus] || "Draft";
  };  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultPapersPageData;
    }
    
    // Find category data from categories.json
    const categoryData = categoriesData.categories.find(cat => cat.slug === initialCategory);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview,
        status: mapPaperStatusToPageHeaderStatus(categoryData.status as PaperStatus),
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultPapersPageData;
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
      router.push("/papers");
    } else {
      router.push(`/papers/${slugifyCategory(selectedValue)}`);
    }
  }

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

        {/* Papers table */}
        <ContentTable
          items={papers.filter((paper) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
              !q ||
              paper.title.toLowerCase().includes(q) ||
              paper.tags.some((t) => t.toLowerCase().includes(q)) ||
              paper.category.toLowerCase().includes(q);
            const matchesCategory = activeCategory === "all" || paper.category === activeCategory;
            return matchesSearch && matchesCategory;
          }).sort((a, b) => {
            const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
            const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })}
          basePath="/papers"
          showCategoryLinks={true}
          formatCategoryNames={false}
          emptyMessage="No papers found matching your criteria."
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Papers"
          description="This section contains research papers and academic inquiries across multiple disciplines. Each paper includes status (draft/active/notes), confidence in the research, and importance. Use the search bar to find specific papers by title, tag, or category. You can also filter papers by category using the dropdown above."
        />
      </div>
    </>
  );
}