"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CaseMeta } from "@/types/cases";

interface CasesTableProps {
  cases: CaseMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function CasesTable({ cases, searchQuery, activeCategory }: CasesTableProps) {
  const [filteredCases, setFilteredCases] = useState<CaseMeta[]>(cases);
  const router = useRouter();

  useEffect(() => {
    const filtered = cases.filter((caseItem) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        caseItem.title.toLowerCase().includes(q) ||
        caseItem.tags.some((t) => t.toLowerCase().includes(q)) ||
        caseItem.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || caseItem.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      // Compare dates directly as strings in YYYY-MM-DD format (which sorts correctly)
      return b.date.localeCompare(a.date);
    });
    setFilteredCases(filtered);
  }, [cases, searchQuery, activeCategory]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    // Parse the date parts from the string to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      timeZone: 'UTC' // Use UTC to preserve the exact date
    });
  }

  // Helper to build the correct route for a case
  function getCaseUrl(caseItem: CaseMeta) {
    return `/cases/${encodeURIComponent(caseItem.category)}/${encodeURIComponent(caseItem.slug)}`;
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
          {filteredCases.map((caseItem, index) => (
            <tr
              key={caseItem.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getCaseUrl(caseItem))}
            >
              <td className="py-2 px-3 font-medium">{caseItem.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/cases/${caseItem.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(caseItem.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{formatDate(caseItem.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredCases.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No cases found matching your criteria.</div>
      )}
    </div>
  );
}
