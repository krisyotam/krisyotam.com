/**
 * =============================================================================
 * BlogClientPage.tsx
 * =============================================================================
 *
 * Client component for the blog listing page.
 * Displays blog posts with filtering, search, and view mode options.
 *
 * Data is passed via props from server component (fetched from content.db).
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
import type { BlogMeta } from "@/types/content";
import "./blog-grid.css";

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

interface BlogClientPageProps {
  notes: BlogMeta[];
  categories?: CategoryData[];
  initialCategory?: string;
}

// =============================================================================
// Constants
// =============================================================================

const defaultBlogPageData = {
  title: "Blog Posts",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "informal ramblings, thought experiments, and idea play across topics and characters",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
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

export default function BlogClientPage({
  notes,
  categories = [],
  initialCategory = "all"
}: BlogClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  // Build category options
  const categoryOptions: SelectOption[] = ["all", ...new Set(notes.map(note => note.category))]
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
      return defaultBlogPageData;
    }

    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categories.find(cat => cat.slug === categorySlug);

    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "2025-01-01",
        end_date: categoryData.date || new Date().toISOString().split('T')[0],
        preview: categoryData.preview || "",
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }

    return defaultBlogPageData;
  };

  const headerData = getHeaderData();

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog/${slugifyCategory(category)}`);
    }
  };

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  const filteredNotes = notes
    .filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        note.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || note.category === activeCategory;
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

  function getBlogUrl(note: BlogMeta) {
    const categorySlug = note.category.toLowerCase().replace(/\s+/g, "-");
    return `/blog/${categorySlug}/${encodeURIComponent(note.slug)}`;
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredNotes.map((note) => (
        <div
          key={note.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getBlogUrl(note))}
        >
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

          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{note.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {formatCategoryDisplayName(note.category)}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(note.end_date || note.start_date).getFullYear()}</span>
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
      <style jsx global>{`
        .blog-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search posts..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "list" ? (
          <ContentTable
            items={filteredNotes}
            basePath="/blog"
            showCategoryLinks={true}
            formatCategoryNames={true}
            emptyMessage="No posts found matching your criteria."
          />
        ) : (
          <GridView />
        )}

        <PageDescription
          title="About Blog Posts"
          description="This is my blog section where I share short-form thoughts and reflections. Use the search bar to find specific posts by title or category."
        />
      </div>
    </>
  );
}
