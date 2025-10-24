"use client";

import { useState, useEffect } from "react";
import { TilTable } from "@/components/til-table";
import { PageHeader } from "@/components/page-header";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import Collapse from "@/components/posts/typography/collapse";

/* default page-level metadata for the header */
const defaultTilPageData = {
  title: "Today I Learned",
  subtitle: "Daily Learning Summaries",
  start_date: new Date().toISOString(),
  preview: "A collection of short notes from my cross-disciplinary studies, shared as I learn in public.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
};

interface TilEntry {
  title: string;
  preview: string;
  start_date: string;
  end_date?: string;
  tags: string[];
  category: string;
  slug: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

interface TilClientPageProps {
  tilEntries: TilEntry[];
  initialCategory?: string;
}

export default function TilClientPage({ tilEntries, initialCategory = "all" }: TilClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(tilEntries.map(entry => entry.category)))];

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : category
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

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/til");
    } else {
      router.push(`/til?category=${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <style jsx global>{`
        .til-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <PageHeader {...headerData} />

          {/* About TIL section */}
          <div className="mt-8 mb-6">
            <Collapse title="About TIL">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  As I am sure you can tell by now, I spend my days learning, thinking, and writing. Identifying and consuming high quality literature, anime, manga, manhua, manhwa, light novels, film, television, and dozens of other mediums. Consider this the central place where I track the things I do on a daily basis, and the things I learn. I will try my best to organize it into a coherent format. What you find here is more of a daily snapshot, but there are various other places you would want to look for a more clear picture of specific things I do. Read{" "}
                  <a href="/notes/website/about-this-website" className="text-foreground underline hover:text-primary">
                    About This Website
                  </a>
                  .
                </p>
                <p>
                  Some days that are heavy on certain topics may be classified as "Mathematics", "Physics", "Writing", "Holy Days", "Writing Retreats" etc. if that is practically all I did that day or major breakthroughs for me came in those fields on that day.
                </p>
                <p>
                  <strong>{tilEntries.length}</strong> TILs and counting... Feeling lucky?
                </p>
                <p>
                  You can follow along by watching my{" "}
                  <a
                    href="https://github.com/krisyotam/til"
                    className="text-foreground underline hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub repository
                  </a>
                  .
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
                placeholder="Search TIL entries..." 
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>          {/* TIL table */}
          <TilTable
            tilEntries={tilEntries}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </>
  );
}
