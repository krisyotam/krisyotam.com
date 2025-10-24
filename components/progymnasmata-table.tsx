"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProgymnasmataEntry {
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

interface ProgymnasmataTableProps {
  entries: ProgymnasmataEntry[];
}

export function ProgymnasmataTable({ entries }: ProgymnasmataTableProps) {
  const router = useRouter();

  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function getDisplayDate(entry: ProgymnasmataEntry): string {
    const dateToUse = (entry.end_date && entry.end_date.trim()) || entry.start_date;
    const date = new Date(dateToUse);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function getEntryUrl(entry: ProgymnasmataEntry) {
    const categorySlug = entry.category.toLowerCase().replace(/\s+/g, "-");
    return `/progymnasmata/${categorySlug}/${encodeURIComponent(entry.slug)}`;
  }

  if (!entries.length) {
    return <p className="text-center py-10 text-muted-foreground">No exercises found.</p>;
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
          {entries.map((entry, index) => (
            <tr
              key={entry.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
              onClick={() => router.push(getEntryUrl(entry))}
            >
              <td className="py-2 px-3 font-medium">{entry.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(entry.category)}</td>
              <td className="py-2 px-3">{getDisplayDate(entry)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
