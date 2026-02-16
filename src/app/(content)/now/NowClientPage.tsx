"use client";

import { useState, useEffect, ReactNode } from "react";
import { PageHeader } from "@/components/core";
import { PageDescription } from "@/components/core";
import { Navigation, NowFeed } from "@/components/content";
import { SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";

/* default page-level metadata for the header */
const defaultNowPageData = {
  title: "Now",
  subtitle: "What I'm Focused On Right Now",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "A real-time snapshot of what I'm currently focused on, inspired by Derek Sivers' /now page movement.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

interface NowEntry {
  title: string;
  preview: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  cover_image: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
}

interface NowEntryWithContent {
  entry: NowEntry;
  content: ReactNode;
}

interface NowClientPageProps {
  entriesWithContent: NowEntryWithContent[];
  initialCategory?: string;
}

export default function NowClientPage({ entriesWithContent, initialCategory = "all" }: NowClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">("list");
  const router = useRouter();

  // Extract entries from the content wrapper
  const nowEntries = entriesWithContent.map(e => e.entry);

  const categories = ["all", ...Array.from(new Set(nowEntries.map(n => n.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  const headerData = defaultNowPageData;

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
      router.push("/now");
    } else {
      router.push(`/now?category=${slugifyCategory(selectedValue)}`);
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
        .now-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="now-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search Now entries..."
          showCategoryFilter={true}
          categoryOptions={categoryOptions}
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showGridOption={false}
        />

        {/* List view only */}
        <NowFeed entries={filteredEntriesWithContent} />

        {filteredEntries.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No Now entries found matching your criteria.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title="About Now"
          description={`This is a /now page, inspired by Derek Sivers. It's a regularly updated snapshot of what I'm currently focused on in my life and work. If we haven't talked in a while, this page should give you a good sense of what I'm up to these days. The entries here represent monthly updates on my primary focus areas, current projects, and what's capturing my attention. Each entry provides a window into my evolving priorities and interests. Currently ${nowEntries.length} Now entries and counting.`}
        />
      </div>
    </>
  );
}
