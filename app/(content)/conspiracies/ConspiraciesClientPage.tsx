"use client";

import { useState, useEffect } from "react";
import { ConspiraciesTable } from "@/components/conspiracies-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/conspiracies/categories.json";
import type { ConspiracyMeta } from "@/types/conspiracies";

/* default page-level metadata for the header */
const defaultConspiraciesPageData = {
  title: "Conspiracies",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "Misc thoughts, proto-essays, reviews, musings, etc.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

interface ConspiraciesClientPageProps {
  conspiracies: ConspiracyMeta[];
  initialCategory?: string;
}

export default function ConspiraciesClientPage({ conspiracies, initialCategory = "all" }: ConspiraciesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(conspiracies.map(n => n.category)))];
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));
  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultConspiraciesPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultConspiraciesPageData;
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

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/conspiracies");
    } else {
      router.push(`/conspiracies/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .conspiracies-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>
      <div className="conspiracies-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />{/* Search and filter on same row */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search conspiracies..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>        {/* Conspiracies table instead of grouped list */}
        <ConspiraciesTable
          conspiracies={conspiracies}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Conspiracies"
          description="This is my conspiracies section where I jot down quick thoughts, ideas, and observations. Use the search bar to find specific conspiracies by title, tag, or category. You can also filter conspiracies by category using the dropdown above. Full text now lives in each .mdx file — titles, tags, and categories are searchable here."
        />
      </div>
    </>
  );
}