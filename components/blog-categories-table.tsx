"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BlogCategory {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface BlogCategoriesTableProps {
  categories: BlogCategory[];
  searchQuery: string;
}

export function BlogCategoriesTable({ categories, searchQuery }: BlogCategoriesTableProps) {
  const [filteredCategories, setFilteredCategories] = useState<BlogCategory[]>(categories);
  const router = useRouter();

  useEffect(() => {
    const filtered = categories.filter((category) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        category.title.toLowerCase().includes(q) ||
        category.preview.toLowerCase().includes(q) ||
        category.status.toLowerCase().includes(q);

      return matchesSearch;
    });

    // Sort by importance descending (most important first)
    filtered.sort((a, b) => b.importance - a.importance);
    setFilteredCategories(filtered);
  }, [categories, searchQuery]);

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // Helper to build the correct route for a category
  function getCategoryUrl(category: BlogCategory) {
    return `/blog/${category.slug}`;
  }

  if (!filteredCategories.length) {
    return <p className="text-center py-10 text-muted-foreground">No categories found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Description</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr
              key={category.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getCategoryUrl(category))}
            >
              <td className="py-2 px-3 font-medium">{category.title}</td>
              <td className="py-2 px-3">{category.preview}</td>
              <td className="py-2 px-3">{formatDate(category.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredCategories.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No categories found matching your criteria.</div>
      )}
    </div>
  );
}
