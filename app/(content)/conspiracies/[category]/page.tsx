import ConspiraciesClientPage from "../ConspiraciesClientPage";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ConspiracyMeta } from "@/types/conspiracies";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from conspiracies data
  const categories = Array.from(new Set(conspiraciesData.map(conspiracy => conspiracy.category)));
  
  console.log('Available categories:', categories);
  console.log('Slugified categories:', categories.map(cat => cat.toLowerCase().replace(/\s+/g, "-")));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = conspiraciesData.find(conspiracy => 
    conspiracy.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Conspiracies",
    };
  }

  return {
    title: `${originalCategory} Conspiracies | Kris Yotam`,
    description: `Conspiracies in the ${originalCategory} category`,
  };
}

export default function ConspiraciesCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = conspiraciesData.find(conspiracy => 
    conspiracy.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }
  // Sort conspiracies by date (newest first) and ensure proper typing
  const conspiracies: ConspiracyMeta[] = [...conspiraciesData]
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map(conspiracy => ({
      ...conspiracy,
      status: conspiracy.status as any, // Type assertion for status
      confidence: conspiracy.confidence as any, // Type assertion for confidence
    }));

  return (
    <div className="conspiracies-container">
      <ConspiraciesClientPage conspiracies={conspiracies} initialCategory={originalCategory} />
    </div>
  );
}