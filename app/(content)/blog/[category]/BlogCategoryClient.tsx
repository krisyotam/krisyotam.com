/**
 * =============================================================================
 * Blog Category Client Page
 * =============================================================================
 *
 * Client-side component for displaying blog posts in a specific category.
 * Receives data as props from server component.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import type { BlogMeta } from "@/types/content";
import type { CategoryData } from "@/lib/types/content";

// =============================================================================
// Types
// =============================================================================

interface BlogCategoryClientProps {
  posts: BlogMeta[];
  allPosts: BlogMeta[];
  category: string;
  categories?: CategoryData[];
}

// =============================================================================
// Page Component
// =============================================================================

export default function BlogCategoryClient({ posts, allPosts, category, categories: categoriesFromDb = [] }: BlogCategoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Get unique categories and convert to SelectOption format
  const categoryOptions: SelectOption[] = ["all", ...new Set(allPosts.map(post => post.category))]
    .sort()
    .map(cat => ({
      value: cat,
      label: cat === "all" ? "All Categories" : cat
    }));

  // Helper function to create category slug
  function slugifyCategory(cat: string) {
    return cat.toLowerCase().replace(/\s+/g, "-");
  }

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog/${slugifyCategory(newCategory)}`);
    }
  };

  // Get category data from props (passed from server component)
  const getCategoryData = () => {
    const categorySlug = slugifyCategory(category);
    const categoryData = categoriesFromDb.find(cat => cat.slug === categorySlug);

    return categoryData ? {
      title: categoryData.title,
      preview: categoryData.preview,
      status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
      confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
      importance: categoryData.importance,
      start_date: categoryData.date || "Undefined",
      end_date: new Date().toISOString().split('T')[0]
    } : {
      title: category,
      preview: `Posts in the ${category} category`,
      status: "Finished" as const,
      confidence: "certain" as const,
      importance: 8,
      start_date: "Undefined",
      end_date: new Date().toISOString().split('T')[0]
    };
  };

  const categoryData = getCategoryData();

  return (
    <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={categoryData.title}
        subtitle="Blog Posts"
        start_date={categoryData.start_date}
        end_date={categoryData.end_date}
        preview={categoryData.preview}
        status={categoryData.status}
        confidence={categoryData.confidence}
        importance={categoryData.importance}
      />
      
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <CustomSelect
            value={category}
            onValueChange={handleCategoryChange}
            options={categoryOptions}
            className="text-sm min-w-[140px]"
          />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ContentTable
        items={posts.filter((post) => {
          const q = searchQuery.toLowerCase();
          const matchesSearch =
            !q ||
            post.title.toLowerCase().includes(q) ||
            post.tags.some((t) => t.toLowerCase().includes(q)) ||
            post.category.toLowerCase().includes(q);
          const isActive = post.state !== "hidden";
          return matchesSearch && isActive;
        }).sort((a, b) => {
          const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
          const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
          return dateB.localeCompare(dateA);
        })}
        basePath="/blog"
        showCategoryLinks={true}
        formatCategoryNames={true}
        emptyMessage="No posts found."
      />

      <PageDescription
        title={`About ${category}`}
        description={`This section contains blog posts in the ${category} category. Use the search bar to find specific posts by title or content.`}
      />
    </div>
  );
} 