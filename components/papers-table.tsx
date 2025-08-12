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
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    setFilteredPapers(filtered);
  }, [papers, searchQuery, activeCategory]);
  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  }

  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(paper: PaperMeta): string {
    const dateToUse = (paper.end_date && paper.end_date.trim()) || paper.start_date;
    return formatDate(dateToUse);
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
            <th className="py-2 text-left font-medium px-3">Author</th>
            <th className="py-2 text-left font-medium px-3">Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredPapers.map((paper, index) => (
            <tr
              key={paper.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
            >
              <td className="py-2 px-3 font-medium">{paper.title}</td>
              <td className="py-2 px-3">{paper.author}</td>
              <td className="py-2 px-3">{paper.publication_year}</td>
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
