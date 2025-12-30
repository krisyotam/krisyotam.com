"use client";

import { useState, useEffect } from "react";
import { ContentTable } from "@/components/content";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/scripts/categories.json";

/* default page-level metadata for the header */
const defaultScriptsPageData = {
  title: "Scripts",
  subtitle: "",
  date: new Date().toISOString(),
  preview: "useful scripts created to manage krisyotam.com and krisyotam.net.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
};

/* ---------- updated type ---------- */
interface Script {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  language?: string;
  author?: string;
  license?: string;
  filename?: string;
}

interface ScriptsClientPageProps {
  scripts: Script[];
  initialCategory?: string;
}

export default function ScriptsClientPage({ scripts, initialCategory = "all" }: ScriptsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(scripts.map(s => s.category)))];
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultScriptsPageData;
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
    return defaultScriptsPageData;
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
      router.push("/scripts");
    } else {
      router.push(`/scripts/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .scripts-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="scripts-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search scripts..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Scripts table */}
        <ContentTable
          items={scripts.filter((script) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
              !q ||
              script.title.toLowerCase().includes(q) ||
              script.tags.some((t) => t.toLowerCase().includes(q)) ||
              script.category.toLowerCase().includes(q) ||
              (script.language && script.language.toLowerCase().includes(q)) ||
              (script.author && script.author.toLowerCase().includes(q));
            const matchesCategory = activeCategory === "all" || script.category === activeCategory;
            return matchesSearch && matchesCategory;
          }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(script => ({
            title: script.title,
            start_date: script.date,
            slug: script.slug,
            tags: script.tags,
            category: script.category
          }))}
          basePath="/scripts"
          showCategoryLinks={false}
          formatCategoryNames={true}
          emptyMessage="No scripts found matching your criteria."
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Scripts"
          description="This is my scripts collection where I store utility scripts and automation tools. Use the search bar to find specific scripts by title, language, tag, author, or category. You can also filter scripts by category using the dropdown above. Each script includes metadata about its language, author, license, and purpose."
        />
      </div>
    </>
  );
}
