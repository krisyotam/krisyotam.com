/**
 * =============================================================================
 * Progymnasmata Client Component
 * =============================================================================
 *
 * Client-side component for Progymnasmata listing with search and filtering.
 * Receives data as props from server components.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client"

import { useState } from "react"
import { PageHeader } from "@/components/core"
import { useRouter } from "next/navigation"
import { PageDescription } from "@/components/core"
import { Navigation, ContentTable } from "@/components/content"
import { SelectOption } from "@/components/ui/custom-select"

// =============================================================================
// Types
// =============================================================================

interface ProgymnasmataPost {
  title: string;
  preview: string;
  start_date: string;
  end_date?: string;
  tags: string[];
  category: string;
  slug: string;
  cover_image?: string;
  status?: string;
  confidence?: string;
  importance?: number;
  state: string;
}

interface ProgymnasmataCategory {
  slug: string;
  title: string;
  preview?: string;
  date: string;
  'show-status': 'active' | 'hidden';
  status: string;
  confidence: string;
  importance: number;
}

interface ProgymnasmataClientProps {
  posts: ProgymnasmataPost[];
  categories: ProgymnasmataCategory[];
  initialCategory?: string;
}

// =============================================================================
// Page Component
// =============================================================================

export function ProgymnasmataClient({
  posts,
  categories,
  initialCategory = "all",
}: ProgymnasmataClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");
  const router = useRouter();

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safePosts = Array.isArray(posts) ? posts : [];

  const categoryOptions: SelectOption[] = [
    { value: "all", label: "All" },
    ...safeCategories.map((c) => ({ value: c.slug, label: c.title })),
  ];

  // =============================================================================
  // Helpers
  // =============================================================================

  // Filter posts
  const filteredPosts = safePosts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      (post.tags &&
        post.tags.some((tag: string) => tag.toLowerCase().includes(q))) ||
      post.category.toLowerCase().includes(q);

    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  function handleCategoryChange(selectedValue: string) {
    setActiveCategory(selectedValue);
    if (selectedValue === "all") {
      router.push("/progymnasmata");
    } else {
      router.push(`/progymnasmata/${selectedValue.toLowerCase()}`);
    }
  }

  function getPostUrl(post: ProgymnasmataPost) {
    return `/${post.slug}`;
  }

  // Find the active category object from categories
  const activeCategoryObj =
    activeCategory === "all"
      ? null
      : safeCategories.find((cat) => cat.slug === activeCategory);

  // Fallbacks for header info
  const headerTitle = activeCategoryObj?.title || "Progymnasmata";
  const headerSubtitle = activeCategoryObj?.preview || "Classical Rhetorical Exercises";
  const headerStartDate = activeCategoryObj?.date || "2025-01-01";
  const headerEndDate = new Date().toISOString().split("T")[0];
  const headerPreview = activeCategoryObj?.preview || "classical rhetorical exercises inspired by Aelius Theon";
  const headerStatus = activeCategoryObj?.status || "In Progress";
  const headerConfidence = activeCategoryObj?.confidence || "likely";
  const headerImportance = typeof activeCategoryObj?.importance === "number" ? activeCategoryObj.importance : 7;
  const isCategory = initialCategory !== "all" && !!initialCategory;

  return (
    <>
      <style jsx global>{`
        .progymnasmata-container {
          font-family: "Geist", sans-serif;
        }
      `}</style>
      <div className="progymnasmata-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          start_date={headerStartDate}
          end_date={headerEndDate}
          preview={headerPreview}
          status={headerStatus as ("Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active")}
          confidence={headerConfidence as ("impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "speculative")}
          importance={headerImportance}
          {...(isCategory ? { backText: "Progymnasmata", backHref: "/progymnasmata" } : {})}
        />

        {/* Navigation with search, filter, and view toggle */}
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search exercises..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={false}
        />

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => router.push(getPostUrl(post))}
              >
                {/* Cover Image Area */}
                <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground text-xs text-center p-4">
                      {post.title}
                    </div>
                  )}
                </div>
                {/* Content Area */}
                <div className="p-3">
                  <h3 className="font-medium text-xs mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {post.category}
                  </p>
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(post.end_date || post.start_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ContentTable
            items={filteredPosts}
            basePath="/progymnasmata"
            showCategoryLinks={false}
            formatCategoryNames={false}
            emptyMessage="No exercises found matching your criteria."
          />
        )}


        <PageDescription
          title="About Progymnasmata"
          description="Progymnasmata are preliminary rhetorical exercises originated in ancient Greece. These exercises were designed to prepare students for more advanced rhetorical training by teaching them basic composition skills. The exercises include fable, narrative, chreia, maxim, refutation, confirmation, commonplace, encomium, vituperation, comparison, impersonation, description, thesis, and introduction of law. Each type follows specific rhetorical patterns and serves different purposes in developing argumentative and literary skills."
        />
      </div>
    </>
  );
}
