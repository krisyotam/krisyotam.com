import { QuestionsClientPage } from "../QuestionsClientPage";
import questionsData from "@/data/questions/questions.json";
import categoriesData from "@/data/questions/categories.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from questions data
  const categories = Array.from(new Set(questionsData.questions.map(question => question.category)));
  
  return categories.map(category => ({
    category: category // category is already a slug in our data
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryData = categoriesData.types.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    return {
      title: "Category Not Found | Questions",
    };
  }

  return {
    title: `${categoryData.title} | Questions | Kris Yotam`,
    description: categoryData.preview,
  };
}

export default function QuestionsCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the category data
  const categoryData = categoriesData.types.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    notFound();
  }

  // Filter questions for this category and only active ones
  const categoryQuestions = questionsData.questions.filter(
    question => question.category === categorySlug && question.state === "active"
  );

  if (categoryQuestions.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <QuestionsClientPage 
          initialCategory={categorySlug}
          showPageHeader={false}
        />
      </div>
    </div>
  );
}
