"use client";

import { useState, useEffect } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { useRouter } from "next/navigation";
import type { PaperMeta, Paper } from "@/types/content";

interface CategoryHeaderData {
  title: string;
  subtitle: string;
  date: string;
  start_date: string;
  end_date?: string;
  preview: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Active";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
  backText: string;
  backHref: string;
}

interface PapersCategoryPageProps {
  papers: PaperMeta[];
  categoryData: CategoryHeaderData;
}

export default function PapersCategoryPage({ papers, categoryData }: PapersCategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter papers based on search query only (since they're already filtered by category)
  const filteredPapers = papers.filter((paper) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      paper.title.toLowerCase().includes(q) ||
      paper.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (paper.preview && paper.preview.toLowerCase().includes(q));

    return matchesSearch;
  }).sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Helper to build the correct route for a paper
  function getPaperUrl(paper: PaperMeta) {
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
          title={categoryData.title}
          subtitle={categoryData.subtitle}
          start_date={categoryData.start_date}
          end_date={categoryData.end_date}
          preview={categoryData.preview}
          status={categoryData.status}
          confidence={categoryData.confidence}
          importance={categoryData.importance}
          backText={categoryData.backText}
          backHref={categoryData.backHref}
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
          {filteredPapers.length} {filteredPapers.length === 1 ? 'paper' : 'papers'} in "{categoryData.title}" category
        </div>

        {/* Papers table */}
        <ContentTable
          items={filteredPapers}
          basePath="/papers"
          showCategoryLinks={true}
          formatCategoryNames={false}
          emptyMessage="No papers found matching your criteria."
        />

        {filteredPapers.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No papers found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={`About "${categoryData.title}" Category`}
          description={`This page shows all papers in the "${categoryData.title}" category. Use the search bar above to further filter these papers by title, content, or tags. Each paper may have multiple tags that help categorize its content.`}
        />
      </div>
    </>
  );
}
