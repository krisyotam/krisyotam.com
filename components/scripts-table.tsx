"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Script {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  language?: string;
  author?: string;
  license?: string;
  filename?: string;
}

interface ScriptsTableProps {
  scripts: Script[];
  searchQuery: string;
  activeCategory: string;
}

export function ScriptsTable({ scripts, searchQuery, activeCategory }: ScriptsTableProps) {
  const [filteredScripts, setFilteredScripts] = useState<Script[]>(scripts);
  const router = useRouter();

  useEffect(() => {
    const filtered = scripts.filter((script) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        script.title.toLowerCase().includes(q) ||
        script.tags.some((t) => t.toLowerCase().includes(q)) ||
        script.category.toLowerCase().includes(q) ||
        (script.language && script.language.toLowerCase().includes(q)) ||
        (script.author && script.author.toLowerCase().includes(q));

      const matchesCategory = activeCategory === "all" || script.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredScripts(filtered);
  }, [scripts, searchQuery, activeCategory]);
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
  // Helper to build the correct route for a script
  function getScriptUrl(script: Script) {
    const categorySlug = script.category.toLowerCase().replace(/\s+/g, "-");
    return `/scripts/${categorySlug}/${encodeURIComponent(script.slug)}`;
  }

  if (!filteredScripts.length) {
    return <p className="text-center py-10 text-muted-foreground">No scripts found.</p>;
  }

  return (
    <div className="mt-8">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Language</th>
            <th className="py-2 text-left font-medium px-3">Category</th>
            <th className="py-2 text-left font-medium px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredScripts.map((script, index) => (
            <tr
              key={script.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getScriptUrl(script))}
            >              <td className="py-2 px-3 font-medium">{script.title}</td>
              <td className="py-2 px-3">{script.language || 'N/A'}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(script.category)}</td>
              <td className="py-2 px-3">{formatDate(script.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredScripts.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No scripts found matching your criteria.</div>
      )}
    </div>
  );
}
