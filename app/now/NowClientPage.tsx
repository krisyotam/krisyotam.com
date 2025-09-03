"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CustomSelect } from "@/components/ui/custom-select";
import { NowTable } from "@/components/now-table";
import Collapse from "@/components/posts/typography/collapse";
import Link from "next/link";

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

interface NowClientPageProps {
  nowEntries: NowEntry[];
}

export default function NowClientPage({ nowEntries }: NowClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Page header data
  const nowPageData = {
    title: "Now",
    subtitle: "What I'm Focused On Right Now",
    date: new Date().toISOString(),
    preview: "A real-time snapshot of what I'm currently focused on, inspired by Derek Sivers' /now page movement.",
    status: "In Progress" as const,
    confidence: "certain" as const,
    importance: 8,
  };

  const headerData = {
    title: nowPageData.title,
    subtitle: nowPageData.subtitle,
    date: nowPageData.date,
    preview: nowPageData.preview,
    status: nowPageData.status,
    confidence: nowPageData.confidence,
    importance: nowPageData.importance,
  };

  // Get URL category parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Extract unique categories from nowEntries
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(nowEntries.map((entry) => entry.category)));
    return uniqueCategories.sort();
  }, [nowEntries]);

  // Set initial category
  const activeCategory = selectedCategory === "all" ? "all" : selectedCategory;

  // Category options for the select
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // Utility function to convert category to URL-friendly slug
  function slugifyCategory(category: string): string {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/now");
    } else {
      router.push(`/now?category=${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .now-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <PageHeader {...headerData} />

          {/* About Now section */}
          <div className="mt-8 mb-6">
            <Collapse title="About Now">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  This is a <Link href="https://nownownow.com/about" className="text-foreground underline hover:text-primary">/now page</Link>, inspired by Derek Sivers. It's a regularly updated snapshot of what I'm currently focused on in my life and work. If we haven't talked in a while, this page should give you a good sense of what I'm up to these days.
                </p>
                <p>
                  The entries here represent monthly updates on my primary focus areas, current projects, and what's capturing my attention. Each entry provides a window into my evolving priorities and interests.
                </p>
                <p>
                  <strong>{nowEntries.length}</strong> Now entries and counting... Want to see what I'm up to?
                </p>
                <p>
                  This page is updated regularly to reflect my current priorities and focus areas.
                </p>
              </div>
            </Collapse>
          </div>

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
                placeholder="Search Now entries..." 
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>

          {/* Now table */}
          <NowTable
            nowEntries={nowEntries}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </>
  );
}
