import LabClientPage from "../LabClientPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { LabMeta } from "@/types/lab";

interface LabCategoryPageProps {
  params: { category: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Fetch lab data with fallback
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`);
    labData = await response.json();
  } catch (error) {
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }
  
  // Get unique categories from lab data
  const categories = Array.from(new Set(labData.map((lab: any) => lab.category)));
  
  // Generate params for each category
  return categories.map(category => ({
    category: slugifyCategory(category as string)
  }));
}

export async function generateMetadata({ params }: LabCategoryPageProps): Promise<Metadata> {
  // Fetch lab data with fallback
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`);
    labData = await response.json();
  } catch (error) {
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }
  
  // Find the first lab in this category to get category name
  const categoryLab = labData.find((lab: any) => 
    slugifyCategory(lab.category as string) === params.category
  );

  if (!categoryLab) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryLab.category} | Lab | Kris Yotam`,
    description: `Lab entries in the ${categoryLab.category} category`,
  };
}

export default async function LabCategoryPage({ params }: LabCategoryPageProps) {
  // Fetch lab data with fallback
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`);
    labData = await response.json();
  } catch (error) {
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }
  
  // Find the original category name
  const originalCategory = labData.find((lab: any) => 
    slugifyCategory(lab.category as string) === params.category
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Convert lab data to LabMeta format and sort by date (newest first)
  const labs: LabMeta[] = [...labData]
    .map((lab: any) => ({
      ...lab,
      status: lab.status as LabMeta['status'],
      confidence: lab.confidence as LabMeta['confidence']
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="lab-container">
      <LabClientPage labs={labs} initialCategory={originalCategory} />
    </div>
  );
}
