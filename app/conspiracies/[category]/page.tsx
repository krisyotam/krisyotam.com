import ConspiraciesClientPage from "../ConspiraciesClientPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ConspiracyMeta } from "@/types/conspiracies";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";

function getConspiraciesData() {
  return conspiraciesData;
}

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get conspiracies data from API
  const conspiraciesData = getConspiraciesData();
  
  // Get all unique categories from conspiracies data
  const categories = Array.from(new Set(conspiraciesData.map((conspiracy: any) => conspiracy.category))) as string[];
  
  console.log('Available categories:', categories);
  console.log('Slugified categories:', categories.map((cat: string) => cat.toLowerCase().replace(/\s+/g, "-")));
  
  return categories.map((category: string) => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Get conspiracies data from API
  const conspiraciesData = getConspiraciesData();
  
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = conspiraciesData.find((conspiracy: any) => 
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

export default async function ConspiraciesCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Get conspiracies data from API
  const conspiraciesData = getConspiraciesData();
  
  // Find the original category name
  const originalCategory = conspiraciesData.find((conspiracy: any) => 
    conspiracy.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }
  // Sort conspiracies by date (newest first) and ensure proper typing
  const conspiracies: ConspiracyMeta[] = [...conspiraciesData]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((conspiracy: any) => ({
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