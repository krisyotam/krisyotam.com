"use client";

import { useState, useEffect } from "react";
import { EssaysTable } from "@/components/essays-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { useRouter } from "next/navigation";
import type { Essay } from "@/types/essay";

interface TagHeaderData {
  title: string;
  subtitle: string;
  date: string;
  start_date?: string;
  end_date?: string;
  preview: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Active";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
  backText: string;
  backHref: string;
}

interface EssaysTaggedPageProps {
  essays: Essay[];
  tagData: TagHeaderData;
}

export default function EssaysTaggedPage({ essays, tagData }: EssaysTaggedPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter essays based on search query only (since they're already filtered by tag)
  const filteredEssays = essays.filter((essay) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      essay.title.toLowerCase().includes(q) ||
      essay.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      essay.category.toLowerCase().includes(q);

    return matchesSearch;
  }).sort((a, b) => new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime());

  // Helper to build the correct route for an essay
  function getEssayUrl(essay: Essay) {
    return `/essays/${essay.category}/${essay.id}`;
  }

  return (
    <>
      <style jsx global>{`
        .essays-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="essays-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={tagData.title}
          subtitle={tagData.subtitle}
          start_date={tagData.start_date}
          end_date={tagData.end_date}
          preview={tagData.preview}
          status={tagData.status}
          confidence={tagData.confidence}
          importance={tagData.importance}
          backText={tagData.backText}
          backHref={tagData.backHref}
        />

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search essays..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Essays count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'} tagged with "{tagData.title}"
        </div>

        {/* Essays table */}
        <EssaysTable
          notes={filteredEssays.map(essay => ({
            title: essay.title,
            subtitle: essay.abstract,
            preview: essay.abstract || '',
            start_date: essay.dateStarted,
            end_date: essay.postedOn !== essay.dateStarted ? essay.postedOn : undefined,
            tags: essay.tags,
            category: essay.category,
            slug: essay.id,
            cover_image: essay.img || '',
            status: essay.status,
            confidence: essay.confidence,
            importance: typeof essay.importance === 'string' ? parseInt(essay.importance) || 1 : essay.importance,
            customPath: essay.customPath
          }))}
          searchQuery=""
          activeCategory="all"
        />

        {filteredEssays.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No essays found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={`About "${tagData.title}" Tag`}
          description={`This page shows all essays tagged with "${tagData.title}". Use the search bar above to further filter these essays by title, content, or other tags. Each essay belongs to a category and may have multiple tags.`}
        />
      </div>
    </>
  );
}
