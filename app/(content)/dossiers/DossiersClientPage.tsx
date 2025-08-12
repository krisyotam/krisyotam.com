"use client";

import { useState, useEffect } from "react";
import { DossiersTable } from "@/components/dossiers-table";
import { PageHeader } from "@/components/page-header";
import type { PageHeaderProps } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/dossiers/categories.json";

/* default page-level metadata for the header */
const defaultDossiersPageData = {
  title: "Dossiers",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "Classified investigations and sensitive case files with detailed intelligence reports",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 9,
} satisfies PageHeaderProps;

import type { DossierMeta, DossierStatus } from "@/types/dossiers";

interface DossiersClientPageProps {
  dossiers: DossierMeta[];
  initialCategory?: string;
}

export default function DossiersClientPage({ dossiers, initialCategory = "all" }: DossiersClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(dossiers.map(d => d.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));
    // Function to map dossier status to PageHeader compatible status
  const mapDossierStatusToPageHeaderStatus = (dossierStatus: DossierStatus): "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" => {
    const statusMap: Record<DossierStatus, "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"> = {
      Draft: "Draft",
      Published: "Finished",
      Archived: "Abandoned",
      Active: "In Progress",
      Classified: "Notes"
    };
    return statusMap[dossierStatus] || "Draft";
  };

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultDossiersPageData;
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
        status: mapDossierStatusToPageHeaderStatus(categoryData.status as DossierStatus),
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultDossiersPageData;
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
      router.push("/dossiers");
    } else {
      router.push(`/dossiers/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .dossiers-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="dossiers-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search dossiers..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Dossiers table */}
        <DossiersTable
          dossiers={dossiers}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Dossiers"
          description="This section contains classified investigations and sensitive case files with detailed intelligence reports. Each dossier includes status (draft/active/classified), confidence in the intelligence, and importance. Use the search bar to find specific dossiers by title, tag, or category. You can also filter dossiers by category using the dropdown above."
        />
      </div>
    </>
  );
}
