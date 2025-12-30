"use client";

import { useState, useEffect } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/prompts/categories.json";

/* default page-level metadata for the header */
const defaultPromptsPageData = {
  title: "Prompts",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "A collection of useful prompts for various AI models and use cases.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
};

/* ---------- updated type ---------- */
interface Prompt {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  model?: string;
  author?: string;
  license?: string;
  filename?: string;
}

interface PromptsClientPageProps {
  prompts: Prompt[];
  initialCategory?: string;
}

export default function PromptsClientPage({ prompts, initialCategory = "all" }: PromptsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(prompts.map(p => p.category)))];
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultPromptsPageData;
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
    return defaultPromptsPageData;
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
      router.push("/prompts");
    } else {
      router.push(`/prompts/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .prompts-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="prompts-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />
        
        {/* Search and filter on same row */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search prompts..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Prompts table */}
        <ContentTable
          items={prompts.filter((prompt) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
              !q ||
              prompt.title.toLowerCase().includes(q) ||
              prompt.tags.some((t) => t.toLowerCase().includes(q)) ||
              prompt.category.toLowerCase().includes(q) ||
              (prompt.model && prompt.model.toLowerCase().includes(q)) ||
              (prompt.author && prompt.author.toLowerCase().includes(q));
            const matchesCategory = activeCategory === "all" || prompt.category === activeCategory;
            return matchesSearch && matchesCategory;
          }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(prompt => ({
            title: prompt.title,
            start_date: prompt.date,
            slug: prompt.slug,
            tags: prompt.tags,
            category: prompt.category
          }))}
          basePath="/prompts"
          showCategoryLinks={false}
          formatCategoryNames={true}
          emptyMessage="No prompts found matching your criteria."
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Prompts"
          description="This is my prompts collection where I store carefully crafted prompts for various AI models. Use the search bar to find specific prompts by title, model, tag, author, or category. You can also filter prompts by category using the dropdown above. Each prompt includes metadata about its target model, author, license, and purpose."
        />
      </div>
    </>
  );
}
