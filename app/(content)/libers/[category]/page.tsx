import LibersClientPage from "../LibersClientPage";
import libersData from "@/data/libers/libers.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from libers data
  const categories = Array.from(new Set(libersData.map(liber => liber.category)));
  
  console.log('Available categories:', categories);
  console.log('Slugified categories:', categories.map(cat => cat.toLowerCase().replace(/\s+/g, "-")));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = libersData.find(liber => 
    liber.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Libers",
    };
  }

  return {
    title: `${originalCategory} Libers | Kris Yotam`,
    description: `Libers in the ${originalCategory} category`,
  };
}

export default function LibersCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = libersData.find(liber => 
    liber.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort libers by date (newest first)
  const libers = [...libersData].sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="libers-container">
      <LibersClientPage libers={libers} initialCategory={originalCategory} />
    </div>
  );
}
