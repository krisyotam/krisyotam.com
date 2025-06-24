"use client";

import { useState, useEffect } from "react";
import { LecturesTable } from "./LecturesTable";
import { PageHeader } from "@/components/page-header";
import type { PageHeaderProps } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/lectures/categories.json";

/* default page-level metadata for the header */
const defaultLecturesPageData = {
  title: "Lectures",
  date: new Date().toISOString(),
  preview: "Educational lectures across multiple disciplines and academic fields",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 9,
} satisfies PageHeaderProps;

import type { LectureMeta, LectureStatus } from "@/types/lectures";

interface LecturesClientPageProps {
  lectures: LectureMeta[];
  initialCategory?: string;
}

export default function LecturesClientPage({ lectures, initialCategory = "all" }: LecturesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();
  const categories = ["all", ...Array.from(new Set(lectures.map(l => l.category)))];  // Helper to get category title from slug
  function getCategoryTitle(categorySlug: string): string {
    const category = categoriesData.categories.find(cat => cat.slug === categorySlug);
    return category ? category.title : categorySlug;
  }
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));
    // Function to map lecture status to PageHeader compatible status
  const mapLectureStatusToPageHeaderStatus = (lectureStatus: LectureStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<LectureStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned",
      Active: "In Progress",
      Notes: "Notes"
    };
    return statusMap[lectureStatus] || "Draft";
  };  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultLecturesPageData;
    }
    
    // Find category data from categories.json
    const categoryData = categoriesData.categories.find(cat => cat.slug === initialCategory);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        date: categoryData.date,
        preview: categoryData.preview,
        status: mapLectureStatusToPageHeaderStatus(categoryData.status as LectureStatus),
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultLecturesPageData;
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
      router.push("/lectures");
    } else {
      router.push(`/lectures/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .lectures-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="lectures-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search lectures..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Lectures table */}
        <LecturesTable
          lectures={lectures}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Lectures"
          description="This section contains educational lectures across multiple disciplines and academic fields. Each lecture includes status (draft/active/notes), confidence in the content, and importance. Use the search bar to find specific lectures by title, tag, or category. You can also filter lectures by category using the dropdown above."
        />
      </div>
    </>
  );
}
