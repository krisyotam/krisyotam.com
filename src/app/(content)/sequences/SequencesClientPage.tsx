/**
 * =============================================================================
 * Sequences Client Page
 * =============================================================================
 *
 * Client-side component for displaying and filtering sequences.
 * Receives data as props from server component.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client";

// =============================================================================
// Imports
// =============================================================================

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Sequence } from "@/lib/data";
import type { CategoryData } from "@/lib/types/content";

// =============================================================================
// Types
// =============================================================================

interface SequencesClientPageProps {
  sequences: Sequence[];
  categories: CategoryData[];
  initialCategory?: string;
  categoryName?: string;
}

// =============================================================================
// Constants
// =============================================================================

const defaultSequencesPageData = {
  title: "Sequences",
  subtitle: "Structured Learning Paths",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split("T")[0],
  preview:
    "Curated collections of posts organized into coherent learning sequences covering philosophy, science, and rationality.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
};

// =============================================================================
// Helpers
// =============================================================================

/**
 * Get total posts count for both sectioned and flat sequences
 */
function getTotalPostsCount(sequence: Sequence): number {
  if (sequence.sections && sequence.sections.length > 0) {
    return sequence.sections.reduce(
      (total, section) => total + section.posts.length,
      0
    );
  }
  return sequence.posts ? sequence.posts.length : 0;
}

/**
 * Convert a category name to URL slug
 */
function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Page Component
// =============================================================================

export default function SequencesClientPage({
  sequences,
  categories,
  initialCategory = "all",
  categoryName,
}: SequencesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    initialCategory
  );
  const [categoryDisplayName, setCategoryDisplayName] = useState<
    string | undefined
  >(categoryName);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  // Update activeCategory when props change
  useEffect(() => {
    setActiveCategory(initialCategory);
    setCategoryDisplayName(categoryName);
  }, [initialCategory, categoryName]);

  // Get header data based on category
  const getHeaderData = () => {
    if (activeCategory !== "all" && categoryDisplayName) {
      const categorySlug = slugifyCategory(categoryDisplayName);
      const categoryData = categories.find(
        (cat) => cat.slug === categorySlug || cat.title === categoryDisplayName
      );

      if (categoryData) {
        return {
          title: categoryData.title,
          subtitle: "Sequence Category",
          start_date: categoryData.date || "2025-01-01",
          end_date: new Date().toISOString().split("T")[0],
          preview: categoryData.preview,
          status: categoryData.status as
            | "Abandoned"
            | "Notes"
            | "Draft"
            | "In Progress"
            | "Finished"
            | "Planned",
          confidence: categoryData.confidence as
            | "impossible"
            | "remote"
            | "highly unlikely"
            | "unlikely"
            | "possible"
            | "likely"
            | "highly likely"
            | "certain",
          importance: categoryData.importance,
        };
      }

      // Fallback if category not found in data
      return {
        title: categoryDisplayName,
        subtitle: "Sequence Category",
        start_date: "2025-01-01",
        end_date: new Date().toISOString().split("T")[0],
        preview: `Sequences in the ${categoryDisplayName} category`,
        status: "In Progress" as const,
        confidence: "certain" as const,
        importance: 8,
      };
    }

    return defaultSequencesPageData;
  };

  const headerData = getHeaderData();

  // Filter sequences based on search query and category
  // Note: sequences are pre-sorted by id from the database
  const filteredSequences = sequences
    .filter((sequence) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        sequence.title.toLowerCase().includes(q) ||
        (sequence.preview && sequence.preview.toLowerCase().includes(q));

      // Check if matches category
      const matchesCategory =
        activeCategory === "all" ||
        (sequence.category && sequence.category === categoryDisplayName);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.id - b.id);

  // =============================================================================
  // View Components
  // =============================================================================

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredSequences.map((sequence) => (
        <article
          key={sequence.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(`/sequences/${sequence.slug}`)}
        >
          {/* Cover Image Area */}
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center">
            {sequence["cover-url"]?.trim() ? (
              <img
                src={sequence["cover-url"].trim()}
                alt={sequence.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-sm text-center p-4 block">
                {sequence.title}
              </span>
            )}
          </div>

          {/* Content Area */}
          <div className="p-4">
            <h3 className="font-medium text-sm mb-2 line-clamp-2">
              {sequence.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
              {sequence.preview}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span>{getTotalPostsCount(sequence)} posts</span>
                {sequence.category && (
                  <>
                    <span className="text-muted-foreground">-</span>
                    <span
                      className="hover:text-foreground cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (sequence.category) {
                          router.push(`/sequences/category/${slugifyCategory(sequence.category)}`);
                        }
                      }}
                    >
                      {sequence.category}
                    </span>
                  </>
                )}
              </span>
              <span>
                {new Date(
                  sequence.end_date && sequence.end_date.trim()
                    ? sequence.end_date
                    : sequence.start_date || ""
                ).getFullYear()}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  const ListView = () => (
    <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50 text-foreground">
          <th className="py-2 text-left font-medium px-3">Title</th>
          <th className="py-2 text-left font-medium px-3">Category</th>
          <th className="py-2 text-left font-medium px-3">Posts</th>
          <th className="py-2 text-left font-medium px-3">Year</th>
        </tr>
      </thead>
      <tbody>
        {filteredSequences.map((sequence, index) => (
          <tr
            key={sequence.slug}
            className={`border-b border-border hover:bg-secondary/50 transition-colors ${
              index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
            }`}
          >
            <td className="py-2 px-3">
              <Link
                href={`/sequences/${sequence.slug}`}
                className="font-medium"
              >
                {sequence.title}
              </Link>
            </td>
            <td className="py-2 px-3">
              {sequence.category && (
                <Link
                  href={`/sequences/category/${slugifyCategory(sequence.category)}`}
                  className=""
                >
                  {sequence.category}
                </Link>
              )}
            </td>
            <td className="py-2 px-3">{getTotalPostsCount(sequence)}</td>
            <td className="py-2 px-3">
              {new Date(
                sequence.end_date && sequence.end_date.trim()
                  ? sequence.end_date
                  : sequence.start_date || ""
              ).getFullYear()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <>
      <style jsx global>{`
        .sequences-container {
          font-family: "Geist", sans-serif;
        }
      `}</style>

      <div className="sequences-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Search, Filters and View Toggle */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          {/* Search bar */}
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search sequences..."
              className="w-full h-9 pl-10 pr-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <CustomSelect
              id="category-filter"
              value={activeCategory || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  router.push("/sequences");
                } else {
                  const categorySlug = slugifyCategory(value);
                  router.push(`/sequences/category/${categorySlug}`);
                }
              }}
              options={[
                { value: "all", label: "All Categories" },
                ...categories
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((category) => ({
                    value: category.title,
                    label: category.title,
                  })),
              ]}
              placeholder="All Categories"
              className="text-sm min-w-[160px]"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-none",
                viewMode === "list" && "bg-secondary/50"
              )}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-none",
                viewMode === "grid" && "bg-secondary/50"
              )}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredSequences.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">
            {activeCategory !== "all"
              ? `No sequences found in the ${categoryDisplayName} category.`
              : "No sequences found matching your criteria."}
          </div>
        )}

        {/* Navigation space preserved for consistency */}
        <div className="mb-6 mt-6"></div>

        {/* PageDescription component */}
        <PageDescription
          title={
            activeCategory !== "all"
              ? `About ${categoryDisplayName} Sequences`
              : "About Sequences"
          }
          description={
            activeCategory !== "all"
              ? `This page shows all sequences in the ${categoryDisplayName} category. Each sequence is a structured collection of posts designed to build understanding progressively.`
              : "Sequences are structured collections of posts designed to build understanding progressively. Each sequence covers a specific topic in depth, with posts ordered to maximize learning. Browse by grid or list view to find sequences that interest you."
          }
        />
      </div>
    </>
  );
}
