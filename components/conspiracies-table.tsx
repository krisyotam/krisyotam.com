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
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredConspiracies(filtered);
  }, [conspiracies, searchQuery, activeCategory]);

  // Format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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
              <td className="py-2 px-3 font-medium">{item.title}</td>
              <td className="py-2 px-3">
                <Link
                  href={`/conspiracies/${item.category}`}
                  className="text-foreground hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.category}
                </Link>
              </td>
              <td className="py-2 px-3">{formatDate(item.date)}</td>
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
