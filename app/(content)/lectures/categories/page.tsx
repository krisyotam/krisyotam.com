import LecturesCategoriesClientPage from "./LecturesCategoriesClientPage";
import categoriesData from "@/data/lectures/categories.json";
import lecturesData from "@/data/lectures/lectures.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lectures Categories",
  description: "Browse all lecture categories and their descriptions",
};

export default function LecturesCategoriesPage() {
  // Get all unique categories that actually exist in lectures (only active lectures)
  const activeLectures = lecturesData.filter(lecture => lecture.state === "active");
  const existingCategories = Array.from(new Set(activeLectures.map(lecture => lecture.category)));
  
  // Filter categories.json to only include categories that exist in lectures
  const categories = categoriesData.categories
    .filter(category => {
      // Check if this category exists in the lectures
      return existingCategories.includes(category.title) || 
             existingCategories.includes(category.slug) ||
             existingCategories.some(cat => cat.toLowerCase().replace(/\s+/g, "-") === category.slug);
    })
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="lectures-container">
      <LecturesCategoriesClientPage categories={categories} />
    </div>
  );
}
