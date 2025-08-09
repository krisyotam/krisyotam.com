"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { ProofTable } from "./ProofTable";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SelectOption } from "@/components/ui/custom-select";
import categoriesData from "@/data/proofs/categories.json";

/* ---------- updated type ---------- */
interface Proof {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
}

interface ProofClientPageProps {
  proofs: Proof[];
  initialCategory?: string;
}

// Default page data
const defaultProofPageData = {
  title: "Proofs",
  subtitle: "Mathematical Proofs, Theorems, and Demonstrations",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0], // Current date as YYYY-MM-DD
  preview: "A collection of mathematical proofs ranging from classical to modern results",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
};

export default function ProofClientPage({ proofs, initialCategory = "all" }: ProofClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const router = useRouter();

  const categories = ["all", ...Array.from(new Set(proofs.map(n => n.category)))];
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category,
    label: category === "all" ? "All Categories" : formatCategoryDisplayName(category)
  }));

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "all" || !initialCategory) {
      return defaultProofPageData;
    }
    
    // Find category data from categories.json
    const categorySlug = slugifyCategory(initialCategory);
    const categoryData = categoriesData.categories.find(cat => cat.slug === categorySlug);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: categoryData.date || "Undefined",
        end_date: new Date().toISOString().split('T')[0],
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultProofPageData;
  };
  const headerData = getHeaderData();

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);
  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Helper function to format category display name
  function formatCategoryDisplayName(category: string) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Handle category change with URL routing
  function handleCategoryChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/proofs");
    } else {
      router.push(`/proofs/${slugifyCategory(selectedValue)}`);
    }
  }

  return (
    <>
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader 
          title={headerData.title}
          subtitle={headerData.subtitle}
          start_date={headerData.start_date}
          end_date={headerData.end_date}
          preview={headerData.preview}
          status={headerData.status}
          confidence={headerData.confidence}
          importance={headerData.importance}
        />

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Category Select */}
          <div className="w-full sm:w-48">
            <CustomSelect
              value={activeCategory}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
            />
          </div>
          
          {/* Search Input */}
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search proofs..." 
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>        {/* Proofs table */}
        <ProofTable
          proofs={proofs}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />

        {/* PageDescription component */}
        <PageDescription
          title="About Proofs"
          description="This page serves as a growing archive of mathematical proofs I’ve written, studied, or reconstructed — spanning various branches such as number theory, real analysis, linear algebra, and more. It documents my growing understanding of proof techniques, and logical rigor. My aim is twofold: first, to sharpen my ability to construct clear, correct, and insightful proofs; and second, to reflect on the reasoning strategies behind them — how I approached each problem, where I struggled, what patterns I noticed, and how I learned from errors."
        />
      </div>
    </>
  );
}
