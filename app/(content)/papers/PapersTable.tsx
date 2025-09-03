"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PaperMeta } from "@/types/papers";

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
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
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

  // Helper to build the correct route for a paper
  function getPaperUrl(paper: PaperMeta) {
    return `/papers/${encodeURIComponent(paper.category)}/${encodeURIComponent(paper.slug)}`;
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
              <td className="py-2 px-3 font-medium">{paper.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/papers/${paper.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {paper.category}
                </Link>
              </td>
              <td className="py-2 px-3">{formatDate((paper.end_date && paper.end_date.trim()) ? paper.end_date : paper.start_date)}</td>
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