"use client";

import { useState } from "react";
import { EssaysTable } from "@/components/essays-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import type { Post } from "@/utils/posts";

/* default page-level metadata for the header */
const defaultEssaysPageData = {
  title: "Essays",
  subtitle: "Long-form thoughts and reflections",
  date: new Date().toISOString(),
  preview: "stable long-form essays, studies, and self-experiments",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface EssaysClientPageProps {
  notes: Post[];
}

export default function EssaysClientPage({ notes }: EssaysClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="essays-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader {...defaultEssaysPageData} />      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search essays..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>      <EssaysTable
        notes={notes}
        searchQuery={searchQuery}
        activeCategory="all"
      />

      <PageDescription
        title="About Essays"
        description="This section contains my longer-form essays and reflections. Use the search bar to find specific essays by title or content."
      />
    </div>
  );
} 