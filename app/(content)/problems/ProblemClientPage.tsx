"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { ProblemTable } from "./ProblemTable";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SelectOption } from "@/components/ui/custom-select";
import categoriesData from "@/data/problems/categories.json";

/* ---------- updated type ---------- */
interface Problem {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
}

interface ProblemClientPageProps {
  problems: Problem[];
  initialCategory?: string;
}

// Default page data
const defaultProblemPageData = {
  title: "Problems",
  subtitle: "Mathematical Problems, Exercises, and Challenges",
  start_date: new Date().toISOString(),
  preview: "A collection of mathematical problems ranging from elementary to advanced topics",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

export default function ProblemClientPage({ problems, initialCategory = "all" }: ProblemClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(problems.map(n => n.category)))];
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultProblemPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date,
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultProblemPageData;
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
      router.push("/problems");
    } else {
      router.push(`/problems/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={headerData.title}
          subtitle={headerData.subtitle}
          start_date={headerData.start_date}
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
              placeholder="Search problems..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>        {/* Problems table */}
        <ProblemTable
          problems={problems}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Problems"
          description="This is my problems section where I share mathematical problems, exercises, and challenging questions across various fields of mathematics. Use the search bar to find specific problems by title, tag, or category. You can also filter problems by category using the dropdown above."
        />
      </div>
    </>
  );
}
