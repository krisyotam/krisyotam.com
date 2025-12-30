"use client";

import { useState, useEffect } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { useRouter } from "next/navigation";
import type { Essay } from "@/types/essay";

interface CategoryHeaderData {
  title: string;
  subtitle: string;
  start_date?: string;
  end_date?: string;
  preview: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Active";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
  backText: string;
  backHref: string;
}

interface EssaysCategoryPageProps {
  essays: Essay[];
  categoryData: CategoryHeaderData;
}

export default function EssaysCategoryPage({ essays, categoryData }: EssaysCategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter essays based on search query only (since they're already filtered by category)
  const filteredEssays = essays.filter((essay) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      essay.title.toLowerCase().includes(q) ||
      essay.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (essay.abstract && essay.abstract.toLowerCase().includes(q));

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
              placeholder="Search essays..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Essays count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredEssays.length} {filteredEssays.length === 1 ? 'essay' : 'essays'} in "{categoryData.title}" category
        </div>

        {/* Essays table */}
        <ContentTable
          items={filteredEssays.map(essay => ({
            title: essay.title,
            start_date: essay.postedOn || new Date().toISOString(),
            end_date: "",
            tags: essay.tags,
            category: essay.category,
            slug: essay.id
          }))}
          basePath="/essays"
          showCategoryLinks={false}
          formatCategoryNames={false}
          emptyMessage="No essays found matching your criteria."
        />

        {filteredEssays.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No essays found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={`About "${categoryData.title}" Category`}
          description={`This page shows all essays in the "${categoryData.title}" category. Use the search bar above to further filter these essays by title, content, or tags. Each essay may have multiple tags that help categorize its content.`}
        />
      </div>
    </>
  );
}
