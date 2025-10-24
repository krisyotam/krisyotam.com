"use client";

import { useState, useEffect } from "react";
import { NewsTable } from "@/components/news-table";
import { PageHeader } from "@/components/page-header";
import type { PageHeaderProps } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/news/categories.json";

/* default page-level metadata for the header */
const defaultNewsPageData = {
  title: "News",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Latest news and developments in AI, technology, and innovation",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 8,
} satisfies PageHeaderProps;

import type { NewsMeta, NewsStatus } from "@/types/news";

interface NewsClientPageProps {
  news: NewsMeta[];
  initialCategory?: string;
}

export default function NewsClientPage({ news, initialCategory = "all" }: NewsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(news.map(n => n.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));
  // Function to map news status to PageHeader compatible status
  const mapNewsStatusToPageHeaderStatus = (newsStatus: NewsStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<NewsStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned", 
      Breaking: "In Progress",
      Developing: "In Progress"
    };
    return statusMap[newsStatus] || "Draft";
  };

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultNewsPageData;
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
        status: mapNewsStatusToPageHeaderStatus(categoryData.status as NewsStatus),
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultNewsPageData;
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
      router.push("/news");
    } else {
      router.push(`/news/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .news-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="news-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search news..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* News table */}
        <NewsTable
          news={news}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About News"
          description="This section contains the latest news and developments in AI, technology, and innovation. Each article includes status (draft/published), confidence in the information, and importance. Use the search bar to find specific articles by title, tag, or category. You can also filter news by category using the dropdown above."
        />
      </div>
    </>
  );
}