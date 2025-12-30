"use client";

import { useState } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";

/* default page-level metadata for the header */
const defaultTagsPageData = {
  title: "\"Papers\" Tags",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Browse all paper tags and explore different topics and themes.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface PaperTag {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface PapersTagsClientPageProps {
  tags: PaperTag[];
}

export default function PapersTagsClientPage({ tags }: PapersTagsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <style jsx global>{`
        .papers-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="papers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...defaultTagsPageData} backText="Papers" backHref="/papers" />

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

        {/* Tags table */}
        <ContentTable
          items={tags.filter((tag) => {
            const q = searchQuery.toLowerCase();
            return !q || tag.title.toLowerCase().includes(q) || tag.preview.toLowerCase().includes(q) || tag.status.toLowerCase().includes(q);
          }).sort((a, b) => b.importance - a.importance).map(tag => ({
            title: tag.title,
            start_date: tag.date,
            slug: tag.slug,
            tags: [],
            category: tag.preview
          }))}
          basePath="/papers/tag"
          showCategoryLinks={false}
          formatCategoryNames={false}
          emptyMessage="No tags found matching your criteria."
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Tags"
          description="This is an overview of all paper tags. Each tag represents a specific topic, theme, or keyword that appears across multiple papers. Click on any tag to explore all papers containing that tag. Use the search bar to find specific tags by title or description."
        />
      </div>
    </>
  );
}
