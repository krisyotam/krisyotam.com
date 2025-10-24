"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { CategoriesTable } from "@/components/categories-table";

interface Category {
  slug: string;
  title: string;
  preview: string;
  count: number;
  importance: number;
}

interface SequencesCategoriesClientPageProps {
  categories: Category[];
}

export default function SequencesCategoriesClientPage({ categories }: SequencesCategoriesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter categories by search term
  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Sequence Categories"
        subtitle="Browse all categories of sequences"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="Find sequences organized by subject matter"
        status="In Progress"
        confidence="certain"
        importance={8}
        backHref="/sequences"
        backText="Sequences"
      />
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <CategoriesTable
        categories={filteredCategories.map(category => ({
          ...category,
          name: category.title, // Add name property that matches the Category interface in categories-table
          href: `/sequences/category/${category.slug}`,
          count: category.count || 0
        }))}
      />
      
      <div className="mt-8">
        <Link 
          href="/sequences"
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to all sequences
        </Link>
      </div>
    </div>
  );
}
