"use client";

import { useState } from "react";
import { BlogTable } from "@/components/blog-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import type { BlogMeta } from "@/types/blog";
import categoriesData from "@/data/blog/categories.json";

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

  // Get category data from categories.json
  const getCategoryData = () => {
    const categorySlug = slugifyCategory(category);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    return categoryData ? {
      title: categoryData.title,
      preview: categoryData.preview,
      status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
      confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
      importance: categoryData.importance,
      start_date: categoryData.date || "Undefined",
      end_date: new Date().toISOString().split('T')[0]
    } : {
      title: category,
      preview: `Posts in the ${category} category`,
      status: "Finished" as const,
      confidence: "certain" as const,
      importance: 8,
      start_date: "Undefined",
      end_date: new Date().toISOString().split('T')[0]
    };
  };

  const categoryData = getCategoryData();

  return (
    <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={categoryData.title}
        subtitle="Blog Posts"
        start_date={categoryData.start_date}
        end_date={categoryData.end_date}
        preview={categoryData.preview}
        status={categoryData.status}
        confidence={categoryData.confidence}
        importance={categoryData.importance}
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