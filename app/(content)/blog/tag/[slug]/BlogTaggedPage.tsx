"use client";

import { useState, useEffect } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { useRouter } from "next/navigation";
import type { BlogMeta } from "@/types/content";

interface TagHeaderData {
  title: string;
  subtitle: string;
  start_date: string;
  end_date: string;
  preview: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
  backText: string;
  backHref: string;
}

interface BlogTaggedPageProps {
  posts: BlogMeta[];
  tagData: TagHeaderData;
}

export default function BlogTaggedPage({ posts, tagData }: BlogTaggedPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter posts based on search query only (since they're already filtered by tag)
  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      post.category.toLowerCase().includes(q);

    return matchesSearch;
  }).sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <>
      <style jsx global>{`
        .blog-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search posts..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Posts count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} tagged with "{tagData.title}"
        </div>

        {/* Posts table */}
        <ContentTable
          items={filteredPosts}
          basePath="/blog"
          showCategoryLinks={true}
          formatCategoryNames={true}
          emptyMessage="No posts found matching your criteria."
        />

        {filteredPosts.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No posts found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={`About "${tagData.title}" Tag`}
          description={`This page shows all blog posts tagged with "${tagData.title}". Use the search bar above to further filter these posts by title, content, or other tags. Each post belongs to a category and may have multiple tags.`}
        />
      </div>
    </>
  );
}
