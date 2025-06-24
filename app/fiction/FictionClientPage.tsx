"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { FictionTable } from "./FictionTable";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SelectOption } from "@/components/ui/custom-select";
import categoriesData from "@/data/fiction/categories.json";

/* ---------- updated type ---------- */
interface Story {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
}

interface FictionClientPageProps {
  stories: Story[];
  initialCategory?: string;
}

// Default page data
const defaultFictionPageData = {
  title: "Fiction",
  subtitle: "Short Stories, Flash Fiction, and More",
  date: new Date().toISOString(),
  preview: "A collection of my fiction writing, from flash fiction to novel excerpts",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

export default function FictionClientPage({ stories, initialCategory = "all" }: FictionClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(stories.map(n => n.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultFictionPageData;
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
    return defaultFictionPageData;
  };
  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/fiction");
    } else {
      router.push(`/fiction/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={headerData.title}
          subtitle={headerData.subtitle}
          date={headerData.date}
          preview={headerData.preview}
          status={headerData.status}
          confidence={headerData.confidence}
          importance={headerData.importance}
        />

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Category Select */}
          <div className="w-full sm:w-48">
            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
            />
          </div>
          
          {/* Search Input */}
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search stories..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>        {/* Stories table */}
        <FictionTable
          stories={stories}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Fiction"
          description="This is my fiction section where I share short stories, flash fiction pieces, poetry, and excerpts from longer works. Use the search bar to find specific stories by title, tag, or category. You can also filter stories by category using the dropdown above."
        />
      </div>
    </>
  );
}