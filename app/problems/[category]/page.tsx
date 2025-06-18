import ProblemClientPage from "../ProblemClientPage";
import problemsData from "@/data/problems/problems.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from problems data
  const categories = Array.from(new Set(problemsData.problems.map(problem => problem.category)));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = problemsData.problems.find(problem => 
    problem.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Problems",
    };
  }

  return {
    title: `${originalCategory} Problems | Kris Yotam`,
    description: `Problems in the ${originalCategory} category`,
  };
}

export default function ProblemCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = problemsData.problems.find(problem => 
    problem.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort problems by date (newest first)
  const problems = [...problemsData.problems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="problems-container">
      <ProblemClientPage problems={problems} initialCategory={originalCategory} />
    </div>
  );
}
