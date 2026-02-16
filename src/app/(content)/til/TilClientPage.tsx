"use client";

import { useState, useEffect, ReactNode } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, TilFeed } from "@/components/content";
import { SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";

/* default page-level metadata for the header */
const defaultTilPageData = {
  title: "Today I Learned",
  subtitle: "Daily Learning Summaries",
  start_date: "2024-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "A collection of short notes from my cross-disciplinary studies, shared as I learn in public.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
};

interface TilEntry {
  title: string;
  preview: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  cover_image?: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
}

interface TilEntryWithContent {
  entry: TilEntry;
  content: ReactNode;
}

interface TilClientPageProps {
  entriesWithContent: TilEntryWithContent[];
  initialCategory?: string;
}

export default function TilClientPage({ entriesWithContent, initialCategory = "all" }: TilClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");
  const router = useRouter();

  // Extract entries from the content wrapper
  const tilEntries = entriesWithContent.map(e => e.entry);

  const categories = ["all", ...Array.from(new Set(tilEntries.map(n => n.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  const headerData = defaultTilPageData;

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
      router.push("/til");
    } else {
      router.push(`/til?category=${slugifyCategory(selectedValue)}`);
    }
    setActiveCategory(selectedValue);
  }

  // Filter entries based on search query and category
  const filteredEntriesWithContent = entriesWithContent.filter(({ entry }) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      entry.title.toLowerCase().includes(q) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      entry.category.toLowerCase().includes(q);

    const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    return new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime();
  });

  // For empty state check
  const filteredEntries = filteredEntriesWithContent.map(e => e.entry);

  return (
    <>
      <style jsx global>{`
        .til-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="til-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search TIL entries..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showGridOption={false}
        />

        {/* List view only */}
        <TilFeed entries={filteredEntriesWithContent} />

        {filteredEntries.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No TIL entries found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About TIL"
          description={`As I am sure you can tell by now, I spend my days learning, thinking, and writing. Identifying and consuming high quality literature, anime, manga, manhua, manhwa, light novels, film, television, and dozens of other mediums. Consider this the central place where I track the things I do on a daily basis, and the things I learn. Some days that are heavy on certain topics may be classified as "Mathematics", "Physics", "Writing", "Holy Days", "Writing Retreats" etc. Currently ${tilEntries.length} TIL entries and counting.`}
        />
      </div>
    </>
  );
}
