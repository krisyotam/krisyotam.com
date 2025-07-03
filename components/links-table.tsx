"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Link {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  url: string;
}

interface LinksTableProps {
  links: Link[];
  searchQuery: string;
  activeCategory: string;
}

export function LinksTable({ links, searchQuery, activeCategory }: LinksTableProps) {
  const [filteredLinks, setFilteredLinks] = useState<Link[]>(links);
  const router = useRouter();

  useEffect(() => {
    const filtered = links.filter((link) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        link.title.toLowerCase().includes(q) ||
        link.tags.some((t) => t.toLowerCase().includes(q)) ||
        link.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || link.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredLinks(filtered);
  }, [links, searchQuery, activeCategory]);

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

  // Helper to build the correct route for a link
  function getLinkUrl(link: Link) {
    const categorySlug = link.category.toLowerCase().replace(/\s+/g, "-");
    return `/links/${categorySlug}/${encodeURIComponent(link.slug)}`;
  }

  if (!filteredLinks.length) {
    return <p className="text-center py-10 text-muted-foreground">No links found.</p>;
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
          {filteredLinks.map((link, index) => (
            <tr
              key={link.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getLinkUrl(link))}
            >
              <td className="py-2 px-3 font-medium">{link.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(link.category)}</td>
              <td className="py-2 px-3">{formatDate(link.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredLinks.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No links found matching your criteria.</div>
      )}
    </div>
  );
}
