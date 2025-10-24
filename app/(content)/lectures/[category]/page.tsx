import { Metadata } from "next";
import { notFound } from "next/navigation";
import LecturesClientPage from "../LecturesClientPage";
import lecturesData from "@/data/lectures/lectures.json";
import categoriesData from "@/data/lectures/categories.json";
import type { LectureMeta } from "@/types/lectures";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  return categoriesData.categories.map((category) => ({
    category: category.slug,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryData = categoriesData.categories.find(cat => cat.slug === params.category);
  
  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryData.title} Lectures`,
    description: categoryData.preview || `Lectures in the ${categoryData.title} category`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const lectures: LectureMeta[] = lecturesData as LectureMeta[];
  
  // Filter lectures for this category
  const categoryData = categoriesData.categories.find(cat => cat.slug === params.category);
  
  if (!categoryData) {
    notFound();
  }

  const filteredLectures = lectures.filter(lecture => lecture.category === params.category);

  return <LecturesClientPage lectures={filteredLectures} initialCategory={params.category} />;
}
