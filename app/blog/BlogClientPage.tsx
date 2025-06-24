"use client";

import { useState, useEffect } from "react";
import { BlogTable } from "@/components/blog-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import type { BlogMeta } from "@/types/blog";
import categoriesData from "@/data/blog/categories.json";

/* default page-level metadata for the header */
const defaultBlogPageData = {
  title: "Blog Posts",
  date: new Date().toISOString(),
  preview: "Short-form thoughts, essays, and reflections",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

interface BlogClientPageProps {
  initialCategory?: string;
  notes: BlogMeta[];
}

export default function BlogClientPage({ initialCategory = "all", notes }: BlogClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  // Get unique categories and convert to SelectOption format
  const categories: SelectOption[] = ["all", ...new Set(notes.map(note => note.category))]
    .sort()
    .map(category => ({
      value: category,
      label: category === "all" ? "All Categories" : category
    }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultBlogPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        date: categoryData.date,
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultBlogPageData;
  };
  const headerData = getHeaderData();

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog/${slugifyCategory(category)}`);
    }
  };

  return (
    <>
      <style jsx global>{`
        .blog-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="blog-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />
        
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              value={activeCategory}
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
          notes={notes}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        <PageDescription
          title="About Blog Posts"
          description="This is my blog section where I share short-form thoughts and reflections. Use the search bar to find specific posts by title or category. You can also filter posts by category using the dropdown above."
        />
      </div>
    </>
  );
}
