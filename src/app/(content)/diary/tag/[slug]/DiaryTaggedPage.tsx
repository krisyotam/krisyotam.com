"use client";

/**
 * =============================================================================
 * DiaryTaggedPage.tsx
 * =============================================================================
 *
 * Client component for displaying diary entries filtered by tag.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { ContentTable } from "@/components/content";
import type { DiaryMeta } from "@/types/content";

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
  tag: TagData;
  entries: any[];
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Component
// =============================================================================

export default function DiaryTaggedPage({ tag, entries }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Transform entries
  const transformedEntries: DiaryMeta[] = entries.map(e => ({
    title: e.title,
    preview: e.preview,
    start_date: e.start_date,
    end_date: e.end_date,
    slug: e.slug,
    tags: e.tags || [],
    category: e.category,
    cover_image: e.cover_image,
    state: e.state,
  }));

  const filteredEntries = transformedEntries
    .filter((entry) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = a.end_date || a.start_date;
      const dateB = b.end_date || b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <Link
        href="/diary/tags"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to Tags
      </Link>

      <PageHeader
        title={tag.title}
        preview={tag.preview || `Diary entries tagged with "${tag.title}"`}
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
      />

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search entries..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      <ContentTable
        items={filteredEntries}
        basePath="/diary"
        showCategoryLinks={true}
        formatCategoryNames={true}
        emptyMessage="No entries found with this tag."
      />

      <PageDescription
        title={`About "${tag.title}"`}
        description={tag.preview || `All diary entries tagged with "${tag.title}".`}
      />
    </div>
  );
}
