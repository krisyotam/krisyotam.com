"use client";

import { useState } from "react";
import { BlogTagsTable } from "@/components/blog-tags-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";

/* default page-level metadata for the header */
const defaultTagsPageData = {
  title: "\"Blog\" Tags",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "Browse all blog tags and explore different topics and themes.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface BlogTag {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface BlogTagsClientPageProps {
  tags: BlogTag[];
}

export default function BlogTagsClientPage({ tags }: BlogTagsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <style jsx global>{`
        .blog-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...defaultTagsPageData} backText="Blog Posts" backHref="/blog" />

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
        <BlogTagsTable
          tags={tags}
          searchQuery={searchQuery}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Tags"
          description="This is an overview of all blog tags. Each tag represents a specific topic, theme, or keyword that appears across multiple blog posts. Click on any tag to explore all blog posts containing that tag. Use the search bar to find specific tags by title or description."
        />
      </div>
    </>
  );
}
