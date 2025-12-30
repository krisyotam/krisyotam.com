"use client";

import { useState } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";

/* default page-level metadata for the header */
const defaultCategoriesPageData = {
  title: "\"Essays\" Categories",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Browse all essay categories and explore different topics and themes.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface EssayCategory {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface EssaysCategoriesClientPageProps {
  categories: EssayCategory[];
}

export default function EssaysCategoriesClientPage({ categories }: EssaysCategoriesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <style jsx global>{`
        .essays-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="essays-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...defaultCategoriesPageData} backText="Essays" backHref="/essays" />

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
        <ContentTable
          items={categories.filter((category) => {
            const q = searchQuery.toLowerCase();
            return !q || category.title.toLowerCase().includes(q) || category.preview.toLowerCase().includes(q) || category.status.toLowerCase().includes(q);
          }).sort((a, b) => b.importance - a.importance).map(category => ({
            title: category.title,
            start_date: category.date,
            slug: category.slug,
            tags: [],
            category: category.preview
          }))}
          basePath="/essays/category"
          showCategoryLinks={false}
          formatCategoryNames={false}
          emptyMessage="No categories found matching your criteria."
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Categories"
          description="This is an overview of all essay categories. Each category represents a different theme or topic area. Click on any category to explore the essays within that category. Use the search bar to find specific categories by title or description."
        />
      </div>
    </>
  );
}
