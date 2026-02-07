"use client";

/**
 * =============================================================================
 * DiaryTagsClientPage.tsx
 * =============================================================================
 *
 * Client component for displaying diary tags.
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

interface TagData {
  slug: string;
  title: string;
  preview?: string | null;
  importance?: number;
}

interface Props {
  tags: TagData[];
}

// =============================================================================
// Component
// =============================================================================

export default function DiaryTagsClientPage({ tags }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = tags.filter((tag) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      tag.title.toLowerCase().includes(q) ||
      (tag.preview && tag.preview.toLowerCase().includes(q))
    );
  });

  // Transform tags to match ContentTable format
  const items = filteredTags.map((tag) => ({
    title: tag.title,
    slug: tag.slug,
    preview: tag.preview || "",
    start_date: "",
    end_date: "",
    category: "tag",
    tags: [],
  }));

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title="Diary Tags"
        preview="Browse diary entries by topic tag."
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
            placeholder="Search tags..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      <ContentTable
        items={items}
        basePath="/diary/tag"
        showCategoryLinks={false}
        emptyMessage="No tags found."
      />

      <PageDescription
        title="About Tags"
        description="Tags provide fine-grained topic classification. Click on a tag to see all diary entries with that tag."
      />
    </div>
  );
}
