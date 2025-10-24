"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DossierMeta } from "@/types/dossiers";

interface DossiersTableProps {
  dossiers: DossierMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function DossiersTable({ dossiers, searchQuery, activeCategory }: DossiersTableProps) {
  const [filteredDossiers, setFilteredDossiers] = useState<DossierMeta[]>(dossiers);
  const router = useRouter();

  useEffect(() => {
    const filtered = dossiers.filter((dossier) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        dossier.title.toLowerCase().includes(q) ||
        dossier.tags.some((t) => t.toLowerCase().includes(q)) ||
        dossier.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || dossier.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    setFilteredDossiers(filtered);
  }, [dossiers, searchQuery, activeCategory]);

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
  function getDisplayDate(dossier: DossierMeta): string {
    const dateToUse = (dossier.end_date && dossier.end_date.trim()) || dossier.start_date;
    return formatDate(dateToUse);
  }

  // Helper to build the correct route for a dossier
  function getDossierUrl(dossier: DossierMeta) {
    return `/dossiers/${encodeURIComponent(dossier.category)}/${encodeURIComponent(dossier.slug)}`;
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
          {filteredDossiers.map((dossier, index) => (
            <tr
              key={dossier.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getDossierUrl(dossier))}
            >
              <td className="py-2 px-3 font-medium">{dossier.title}</td>
              <td className="py-2 px-3">
                <Link 
                  href={`/dossiers/${dossier.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(dossier.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{getDisplayDate(dossier)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredDossiers.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No dossiers found matching your criteria.</div>
      )}
    </div>
  );
}
