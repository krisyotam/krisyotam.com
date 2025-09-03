"use client";

import { useState } from "react";
import { LecturesCategoriesTable } from "@/components/lectures-categories-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";

/* default page-level metadata for the header */
const defaultCategoriesPageData = {
  title: "\"Lectures\" Categories",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Browse all lecture categories and explore different topics and themes.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface LectureCategory {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface LecturesCategoriesClientPageProps {
  categories: LectureCategory[];
}

export default function LecturesCategoriesClientPage({ categories }: LecturesCategoriesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <style jsx global>{`
        .lectures-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="lectures-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...defaultCategoriesPageData} backText="Lectures" backHref="/lectures" />

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
        <LecturesCategoriesTable
          categories={categories}
          searchQuery={searchQuery}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Categories"
          description="This is an overview of all lecture categories. Each category represents a different theme or topic area. Click on any category to explore the lectures within that category. Use the search bar to find specific categories by title or description."
        />
      </div>
    </>
  );
}
