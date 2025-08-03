"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Problem {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
}

interface ProblemTableProps {
  problems: Problem[];
  searchQuery: string;
  activeCategory: string;
}

export function ProblemTable({ problems, searchQuery, activeCategory }: ProblemTableProps) {
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(problems);
  const router = useRouter();

  useEffect(() => {
    const filtered = problems.filter((problem) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        problem.title.toLowerCase().includes(q) ||
        problem.tags.some((t) => t.toLowerCase().includes(q)) ||
        problem.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || problem.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredProblems(filtered);
  }, [problems, searchQuery, activeCategory]);
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

  // Helper to build the correct route for a problem
  function getProblemUrl(problem: Problem) {
    const categorySlug = problem.category.toLowerCase().replace(/\s+/g, "-");
    return `/problems/${categorySlug}/${encodeURIComponent(problem.slug)}`;
  }

  if (!filteredProblems.length) {
    return <p className="text-center py-10 text-muted-foreground">No problems found.</p>;
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
          {filteredProblems.map((problem, index) => (
            <tr
              key={problem.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getProblemUrl(problem))}
            >
              <td className="py-2 px-3">{problem.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(problem.category)}</td>
              <td className="py-2 px-3">{formatDate(problem.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredProblems.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No problems found matching your criteria.</div>
      )}
    </div>
  );
}
