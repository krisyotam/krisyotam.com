"use client";

import { useState, useEffect } from "react";
import { PapersTable } from "../../PapersTable";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { useRouter } from "next/navigation";
import type { PaperMeta } from "@/types/papers";

interface Paper {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  cover_image?: string;
  preview?: string;
  state?: string;
}

interface TagHeaderData {
  title: string;
  subtitle: string;
  date: string;
  preview: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Active";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
  backText: string;
  backHref: string;
}

interface PapersTaggedPageProps {
  papers: Paper[];
  tagData: TagHeaderData;
}

export default function PapersTaggedPage({ papers, tagData }: PapersTaggedPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter papers based on search query only (since they're already filtered by tag)
  const filteredPapers = papers.filter((paper) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      paper.title.toLowerCase().includes(q) ||
      paper.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      paper.category.toLowerCase().includes(q);

    return matchesSearch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Helper to build the correct route for a paper
  function getPaperUrl(paper: Paper) {
    return `/papers/${paper.category}/${paper.slug}`;
  }

  return (
    <>
      <style jsx global>{`
        .papers-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="papers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={tagData.title}
          subtitle={tagData.subtitle}
          date={tagData.date}
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
              placeholder="Search papers..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Papers count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredPapers.length} {filteredPapers.length === 1 ? 'paper' : 'papers'} tagged with "{tagData.title}"
        </div>

        {/* Papers table */}
        <PapersTable
          papers={filteredPapers.map(paper => ({
            ...paper,
            status: paper.status as PaperMeta['status']
          }))}
          searchQuery=""
          activeCategory="all"
        />

        {filteredPapers.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No papers found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={`About "${tagData.title}" Tag`}
          description={`This page shows all papers tagged with "${tagData.title}". Use the search bar above to further filter these papers by title, content, or other tags. Each paper belongs to a category and may have multiple tags.`}
        />
      </div>
    </>
  );
}
