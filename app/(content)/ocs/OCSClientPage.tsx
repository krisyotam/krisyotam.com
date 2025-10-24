"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import type { PageHeaderProps } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/ocs/categories.json";

/* default page-level metadata for the header */
const defaultOCSPageData = {
  title: "Original Characters",
  start_date: "2025-06-01",
  end_date: "",
  preview: "Character profiles and artwork from my original fiction stories",
  status: "In Progress" as "In Progress",
  confidence: "likely" as "likely",
  importance: 7,
} satisfies PageHeaderProps;

import type { OCSMeta } from "@/types/ocs";

interface OCSClientPageProps {
  ocs: OCSMeta[];
  initialCategory?: string;
}

export default function OCSClientPage({ ocs, initialCategory = "all" }: OCSClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(ocs.map(r => r.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultOCSPageData;
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
    return defaultOCSPageData;
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
      router.push("/ocs");
    } else {
      router.push(`/ocs/${slugifyCategory(selectedValue)}`);
    }
  }

  // Filter OCS based on search query and category
  const filteredOCS = ocs.filter((character) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      character.title.toLowerCase().includes(q) ||
      character.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      character.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || character.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Helper to build the correct route for an OC
  function getOCUrl(character: OCSMeta) {
    return `/ocs/${slugifyCategory(character.category)}/${encodeURIComponent(character.slug)}`;
  }

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOCS.map((character) => (
        <div
          key={character.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(getOCUrl(character))}
        >
          {/* Cover Image Area - Book aspect ratio (3:4) */}
          <div className="aspect-[3/4] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {character.cover_image ? (
              <img 
                src={character.cover_image} 
                alt={character.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">
                {character.title}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{character.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{character.category}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(character.end_date || character.start_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50 text-foreground">
          <th className="py-2 text-left font-medium px-3">Title</th>
          <th className="py-2 text-left font-medium px-3">Category</th>
          <th className="py-2 text-left font-medium px-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredOCS.map((character, index) => (
          <tr
            key={character.slug}
            className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
              index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
            }`}
            onClick={() => router.push(getOCUrl(character))}
          >
            <td className="py-2 px-3">{character.title}</td>
            <td className="py-2 px-3">{character.category}</td>
            <td className="py-2 px-3">{formatDate(character.end_date || character.start_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <style jsx global>{`
        .ocs-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="ocs-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search characters..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Filter and view toggle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              className="text-sm min-w-[140px]"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-border rounded-none overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs transition-colors ${
                viewMode === "grid" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-foreground hover:bg-secondary/50"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-xs transition-colors ${
                viewMode === "list" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-foreground hover:bg-secondary/50"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filteredOCS.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No characters found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Original Characters"
          description="This section contains character profiles and artwork from my original fiction stories. Each character includes their book/world, character tags, and cover art. Use the search bar to find specific characters by name, tag, or book. You can also filter characters by book using the dropdown above."
        />
      </div>
    </>
  );
}
