import ConspiraciesClientPage from "../ConspiraciesClientPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ConspiracyMeta } from "@/types/conspiracies";

async function getConspiraciesData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/data/conspiracies`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch conspiracies data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching conspiracies data:', error);
    return [];
  }
}

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get conspiracies data from API
  const conspiraciesData = await getConspiraciesData();
  
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
  const conspiraciesData = await getConspiraciesData();
  
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
  const conspiraciesData = await getConspiraciesData();
  
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