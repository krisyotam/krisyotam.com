"use client";

/**
 * =============================================================================
 * DiaryCategoriesClientPage.tsx
 * =============================================================================
 *
 * Client component for displaying diary categories.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { useState } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { ContentTable } from "@/components/content";

// =============================================================================
// Types
// =============================================================================

interface CategoryData {
  slug: string;
  title: string;
  preview?: string | null;
  importance?: number;
}

interface Props {
  categories: CategoryData[];
}

// =============================================================================
// Component
// =============================================================================

export default function DiaryCategoriesClientPage({ categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      cat.title.toLowerCase().includes(q) ||
      (cat.preview && cat.preview.toLowerCase().includes(q))
    );
  });

  // Transform categories to match ContentTable format
  const items = filteredCategories.map((cat) => ({
    title: cat.title,
    slug: cat.slug,
    preview: cat.preview || "",
    start_date: "",
    end_date: "",
    category: "category",
    tags: [],
  }));

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title="Diary Categories"
        preview="Browse diary entries by category."
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        backText="Diary"
        backHref="/diary"
      />

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      <ContentTable
        items={items}
        basePath="/diary"
        showCategoryLinks={false}
        emptyMessage="No categories found."
      />

      <PageDescription
        title="About Categories"
        description="Categories provide high-level organization for diary entries. Click on a category to see all entries in that category."
      />
    </div>
  );
}
