"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ConspiracyMeta } from "../types/conspiracies";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConspiraciesTableProps {
  conspiracies: ConspiracyMeta[];
  searchQuery: string;
  activeCategory: string;
}

export function ConspiraciesTable({ conspiracies, searchQuery, activeCategory }: ConspiraciesTableProps) {
  const [filteredConspiracies, setFilteredConspiracies] = useState<ConspiracyMeta[]>(conspiracies);
  const router = useRouter();

  useEffect(() => {
    const filtered = conspiracies.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t: string) => t.toLowerCase().includes(q)) || // Added type for 't'
        item.category.toLowerCase().includes(q)
      );
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) || a.start_date || '';
      const dateB = (b.end_date && b.end_date.trim()) || b.start_date || '';
      return dateB.localeCompare(dateA);
    });
    setFilteredConspiracies(filtered);
  }, [conspiracies, searchQuery, activeCategory]);
  // Format date
  function formatDate(dateString: string): string {
    if (!dateString) return '';
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

  // Helper to get the display date (end_date if available, otherwise start_date)
  function getDisplayDate(item: ConspiracyMeta): string {
    const dateToUse = (item.end_date && item.end_date.trim()) || item.start_date;
    return formatDate(dateToUse);
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Route to full conspiracy page
  function getConspiracyUrl(item: ConspiracyMeta) {
    return `/conspiracies/${encodeURIComponent(item.category)}/${encodeURIComponent(item.slug)}`;
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
          {filteredConspiracies.map((item, index) => (
            <tr
              key={item.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
              }`}
              onClick={() => router.push(getConspiracyUrl(item))}
            >
              <td className="py-2 px-3 font-medium">{item.title}</td>              <td className="py-2 px-3">
                <Link
                  href={`/conspiracies/${item.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatCategoryDisplayName(item.category)}
                </Link>
              </td>
              <td className="py-2 px-3">{getDisplayDate(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredConspiracies.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">
          No conspiracies found matching your criteria.
        </div>
      )}
    </div>
  );
}
