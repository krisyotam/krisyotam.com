"use client";

import { useState } from "react";
import { ReportsTable } from "@/components/reports-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";

/* default page-level metadata for the header */
const defaultReportsPageData = {
  title: "Reports",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Formal reports and detailed analyses",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

/* ---------- updated type ---------- */
interface Report {
  title: string;
  preview: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  state: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface ReportsClientPageProps {
  reports: Report[];
}

export default function ReportsClientPage({ reports }: ReportsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const headerData = defaultReportsPageData;
  return (
    <>
      <style jsx global>{`
        .reports-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>
      
      <div className="reports-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />
        
        {/* Search bar only - no category filter */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
        
        {/* Reports table */}
        <ReportsTable
          notes={reports}
          searchQuery={searchQuery}
          activeCategory="all"
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Reports"
          description="This is my reports section where I publish formal reports and detailed analyses. Use the search bar to find specific reports by title, tag, or category. Full content lives in each .mdx file — titles, tags, and categories are searchable here."
        />
      </div>
    </>
  );
}
