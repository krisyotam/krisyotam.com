"use client";

import { useState } from "react";
import { PapersCategoriesTable } from "@/components/papers-categories-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";

/* default page-level metadata for the header */
const defaultCategoriesPageData = {
  title: "\"Papers\" Categories",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Browse all paper categories and explore different topics and themes.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface PaperCategory {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface PapersCategoriesClientPageProps {
  categories: PaperCategory[];
}

export default function PapersCategoriesClientPage({ categories }: PapersCategoriesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <style jsx global>{`
        .papers-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="papers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...defaultCategoriesPageData} backText="Papers" backHref="/papers" />

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

        {/* Categories table */}
        <PapersCategoriesTable
          categories={categories}
          searchQuery={searchQuery}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Categories"
          description="This is an overview of all paper categories. Each category represents a different theme or topic area. Click on any category to explore the papers within that category. Use the search bar to find specific categories by title or description."
        />
      </div>
    </>
  );
}
