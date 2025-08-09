"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LabMeta } from "@/types/lab";

interface LabTableProps {
  labs: LabMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function LabTable({ labs, searchQuery, activeCategory }: LabTableProps) {
  const [filteredLabs, setFilteredLabs] = useState<LabMeta[]>(labs);
  const router = useRouter();

  useEffect(() => {
    const filtered = labs.filter((lab) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        lab.title.toLowerCase().includes(q) ||
        lab.tags.some((t) => t.toLowerCase().includes(q)) ||
        lab.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || lab.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    setFilteredLabs(filtered);
  }, [labs, searchQuery, activeCategory]);

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
  function getDisplayDate(lab: LabMeta): string {
    const dateToUse = (lab.end_date && lab.end_date.trim()) || lab.start_date;
    return formatDate(dateToUse);
  }

  // Helper to build the correct route for a lab entry
  function getLabUrl(lab: LabMeta) {
    const categorySlug = lab.category.toLowerCase().replace(/\s+/g, "-");
    return `/lab/${categorySlug}/${encodeURIComponent(lab.slug)}`;
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!filteredLabs.length) {
    return <p className="text-center py-10 text-muted-foreground">No lab entries found.</p>;
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
          {filteredLabs.map((lab, index) => (
            <tr
              key={lab.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getLabUrl(lab))}
            >
              <td className="py-2 px-3 font-medium">{lab.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/lab/${lab.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(lab.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{getDisplayDate(lab)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredLabs.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No lab entries found matching your criteria.</div>
      )}
    </div>
  );
}
