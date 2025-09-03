"use client";

import { useState, useEffect } from "react";
import { LibersTable } from "@/components/libers-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import { LibersContentWarning } from "@/components/libers-content-warning";
import categoriesData from "@/data/libers/categories.json";

/* default page-level metadata for the header */
const defaultLibersPageData = {
  title: "Libers",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "Dark historical studies, taboo subjects, and forbidden knowledge across cultures and time periods.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
};

/* ---------- updated type ---------- */
interface Liber {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
}

interface LibersClientPageProps {
  libers: Liber[];
  initialCategory?: string;
}

export default function LibersClientPage({ libers, initialCategory = "all" }: LibersClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  // Check if user has accepted terms on component mount
  useEffect(() => {
    const hasAccepted = localStorage.getItem("libers-terms-accepted");
    if (!hasAccepted) {
      setShowWarning(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    setShowWarning(false);
  };

  const categories = ["all", ...Array.from(new Set(libers.map(l => l.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));
  
  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultLibersPageData;
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
    return defaultLibersPageData;
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
      router.push("/libers");
    } else {
      router.push(`/libers/${slugifyCategory(selectedValue)}`);
    }
  }
  return (
    <>
      {showWarning && (
        <LibersContentWarning onAccept={handleAcceptTerms} />
      )}
      
      <style jsx global>{`
        .libers-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="libers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search libers..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Libers table */}
        <LibersTable
          libers={libers}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Libers"
          description="This is my libers section containing dark historical studies, taboo subjects, and forbidden knowledge across cultures and time periods. Use the search bar to find specific libers by title, tag, or category. You can also filter libers by category using the dropdown above. Each liber contains detailed research and analysis on subjects often considered forbidden or controversial."
        />
      </div>
    </>
  );
}
