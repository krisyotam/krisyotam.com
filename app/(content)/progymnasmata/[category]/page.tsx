
import ProgymnasmataData from "@/data/progymnasmata/progymnasmata.json";
import CategoriesData from "@/data/progymnasmata/categories.json";
import { ProgymnasmataClient } from "../progymnasmata-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from active exercises only
  const activeExercises = ProgymnasmataData.filter((item: any) => item.state === "active");
  const categories = Array.from(new Set(activeExercises.map((item: any) => item.category)));
  return categories.map((category) => ({ category: category.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categorySlug = params.category;
  const activeExercises = ProgymnasmataData.filter((item: any) => item.state === "active");
  const originalCategory = activeExercises.find((item: any) =>
    item.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;
  if (!originalCategory) {
    return {
      title: "Category Not Found | Progymnasmata",
    };
  }
  return {
    title: `${originalCategory} | Progymnasmata | Kris Yotam`,
    description: `Progymnasmata exercises in the ${originalCategory} category`,
  };
}

export default function ProgymnasmataCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  const activeExercises = ProgymnasmataData.filter((item: any) => item.state === "active");
  const originalCategory = activeExercises.find((item: any) =>
    item.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;
  if (!originalCategory) {
    notFound();
  }
  // Sort by date (newest first)
  const posts = [...activeExercises].filter((item: any) =>
    item.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  ).sort((a: any, b: any) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
  // Parse categories from categories.json
  const categories = Array.isArray(CategoriesData.categories) ? CategoriesData.categories : [];
  return (
    <div className="progymnasmata-container">
      <ProgymnasmataClient posts={posts} categories={categories} initialCategory={originalCategory} />
    </div>
  );
}