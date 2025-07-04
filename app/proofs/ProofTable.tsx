"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Proof {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
}

interface ProofTableProps {
  proofs: Proof[];
  searchQuery: string;
  activeCategory: string;
}

export function ProofTable({ proofs, searchQuery, activeCategory }: ProofTableProps) {
  const [filteredProofs, setFilteredProofs] = useState<Proof[]>(proofs);
  const router = useRouter();

  useEffect(() => {
    const filtered = proofs.filter((proof) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        proof.title.toLowerCase().includes(q) ||
        proof.tags.some((t) => t.toLowerCase().includes(q)) ||
        proof.category.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "all" || proof.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredProofs(filtered);
  }, [proofs, searchQuery, activeCategory]);
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

  // Helper to build the correct route for a proof
  function getProofUrl(proof: Proof) {
    const categorySlug = proof.category.toLowerCase().replace(/\s+/g, "-");
    return `/proofs/${categorySlug}/${encodeURIComponent(proof.slug)}`;
  }

  if (!filteredProofs.length) {
    return <p className="text-center py-10 text-muted-foreground">No proofs found.</p>;
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
          {filteredProofs.map((proof, index) => (
            <tr
              key={proof.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
              onClick={() => router.push(getProofUrl(proof))}
            >              <td className="py-2 px-3 font-medium">{proof.title}</td>
              <td className="py-2 px-3">{formatCategoryDisplayName(proof.category)}</td>
              <td className="py-2 px-3">{formatDate(proof.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredProofs.length === 0 && (
        <div className="text-muted-foreground text-sm mt-6">No proofs found matching your criteria.</div>
      )}
    </div>
  );
}
