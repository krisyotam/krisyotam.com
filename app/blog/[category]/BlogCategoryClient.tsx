"use client";

import { useState } from "react";
import { BlogTable } from "@/components/blog-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import type { BlogMeta } from "@/types/blog";

interface BlogCategoryClientProps {
  posts: BlogMeta[];
  allPosts: BlogMeta[];
  category: string;
}

export default function BlogCategoryClient({ posts, allPosts, category }: BlogCategoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Get unique categories and convert to SelectOption format
  const categories: SelectOption[] = ["all", ...new Set(allPosts.map(post => post.category))]
    .sort()
    .map(category => ({
      value: category,
      label: category === "all" ? "All Categories" : category
    }));

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog/${slugifyCategory(newCategory)}`);
    }
  };

  return (
    <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={category}
        subtitle="Blog Posts"
        date={new Date().toISOString()}
        preview={`Posts in the ${category} category`}
        status="Finished"
        confidence="certain"
        importance={8}
      />
      
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <CustomSelect
            value={category}
            onValueChange={handleCategoryChange}
            options={categories}
            className="text-sm min-w-[140px]"
          />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <BlogTable
        notes={posts}
        searchQuery={searchQuery}
        activeCategory={category}
      />

      <PageDescription
        title={`About ${category}`}
        description={`This section contains blog posts in the ${category} category. Use the search bar to find specific posts by title or content.`}
      />
    </div>
  );
} 