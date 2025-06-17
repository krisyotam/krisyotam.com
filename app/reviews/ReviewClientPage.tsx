"use client";

import { useState, useEffect } from "react";
import { ReviewsTable } from "@/components/reviews-table";
import { PageHeader } from "@/components/page-header";
import type { PageHeaderProps } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/reviews/categories.json";

/* default page-level metadata for the header */
const defaultReviewsPageData = {
  title: "Reviews",
  date: new Date().toISOString(),
  preview: "In-depth reviews of books, media, art, performances, and more",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 7,
} satisfies PageHeaderProps;

import type { ReviewMeta } from "@/types/review";

interface ReviewClientPageProps {
  reviews: ReviewMeta[];
  initialCategory?: string;
}

export default function ReviewClientPage({ reviews, initialCategory = "all" }: ReviewClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(reviews.map(r => r.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultReviewsPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.types.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        date: categoryData.date,        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultReviewsPageData;
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
      router.push("/review");
    } else {
      router.push(`/review/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .reviews-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="reviews-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
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
              placeholder="Search reviews..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Reviews table */}
        <ReviewsTable
          reviews={reviews}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Reviews"
          description="This section contains in-depth reviews of books, media, art, performances and more. Each review includes ratings for status (abandoned/completed), confidence in the rating, and importance. Use the search bar to find specific reviews by title, tag, or category. You can also filter reviews by category using the dropdown above."
        />
      </div>
    </>
  );
}