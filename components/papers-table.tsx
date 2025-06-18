"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PaperMeta } from "@/types/papers";
import categoriesData from "@/data/papers/categories.json";

interface PapersTableProps {
  papers: PaperMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function PapersTable({ papers, searchQuery, activeCategory }: PapersTableProps) {
  const [filteredPapers, setFilteredPapers] = useState<PaperMeta[]>(papers);
  const router = useRouter();

  useEffect(() => {
    const filtered = papers.filter((paper) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        paper.title.toLowerCase().includes(q) ||
        paper.tags.some((t) => t.toLowerCase().includes(q)) ||
        paper.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || paper.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredPapers(filtered);
  }, [papers, searchQuery, activeCategory]);
  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // Helper to build the correct route for a paper
  function getPaperUrl(paper: PaperMeta) {
    return `/papers/${encodeURIComponent(paper.category)}/${encodeURIComponent(paper.slug)}`;
  }  // Helper to get category title from slug
  function getCategoryTitle(categorySlug: string): string {
    const category = categoriesData.categories.find(cat => cat.slug === categorySlug);
    return category ? category.title : categorySlug;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPapers.map((paper, index) => (
            <tr
              key={paper.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getPaperUrl(paper))}
            >
              <td className="py-2 px-3 font-medium">{paper.title}</td>              <td className="py-2 px-3">
                <Link 
                  href={`/papers/${paper.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(paper.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{formatDate(paper.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredPapers.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No papers found matching your criteria.</div>
      )}
    </div>
  );
}
