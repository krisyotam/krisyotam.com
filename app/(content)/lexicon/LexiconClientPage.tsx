"use client";

import { useState, useEffect } from "react";
import { NotesTable } from "@/components/notes-table";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";
import categoriesData from "@/data/lexicon/categories.json";

/* default page-level metadata for the header */
const defaultPageData = {
  title: "Lexicon",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split("T")[0],
  preview: "A short glossary of terms, words, and phrases I collect.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 6,
};

interface LexiconItem {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  cover_image?: string;
  preview?: string;
  state?: string;
}

interface LexiconClientPageProps {
  items: LexiconItem[];
  initialCategory?: string;
}

export default function LexiconClientPage({ items, initialCategory = "all" }: LexiconClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(items.map(n => n.category)))];
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) return defaultPageData;
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = (categoriesData as any).categories.find((c: any) => c.slug === categorySlug);
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview,
        status: categoryData.status,
        confidence: categoryData.confidence,
        importance: categoryData.importance
      };
    }
    return defaultPageData;
  };

  const headerData = getHeaderData();

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/lexicon");
    } else {
      router.push(`/lexicon/${slugifyCategory(selectedValue)}`);
    }
  }

  const filtered = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      item.title.toLowerCase().includes(q) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.start_date || '1970-01-01').getTime() - new Date(a.start_date || '1970-01-01').getTime());

  function getItemUrl(item: LexiconItem) {
    return `/lexicon/${item.category}/${item.slug}`;
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filtered.map((item) => (
        <div key={item.slug} className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => router.push(getItemUrl(item))}>
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
            {item.cover_image ? (
              <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">{item.title}</div>
            )}
          </div>

          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{item.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{formatCategoryDisplayName(item.category)}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{new Date(item.start_date).getFullYear()}</span></div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <NotesTable notes={filtered} searchQuery="" activeCategory="all" />
  );

  return (
    <>
      <div className="lexicon-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        <div className="mb-4">
          <div className="relative">
            <input type="text" placeholder="Search lexicon..." className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
            <CustomSelect value={activeCategory} onValueChange={handleCategoryChange} options={categoryOptions} className="text-sm min-w-[140px]" />
          </div>

          <div className="flex items-center gap-1 border border-border rounded-none overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`px-3 py-1 text-xs transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-secondary/50"}`}>Grid</button>
            <button onClick={() => setViewMode("list")} className={`px-3 py-1 text-xs transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-secondary/50"}`}>List</button>
          </div>
        </div>

        {viewMode === "grid" ? <GridView /> : <ListView />}

        {filtered.length === 0 && <div className="text-muted-foreground text-sm mt-6 text-center">No entries found matching your criteria.</div>}

        <PageDescription title="About the Lexicon" description="A curated list of words and phrases I find noteworthy. Each entry can be expanded into its own MDX page." />
      </div>
    </>
  );
}
