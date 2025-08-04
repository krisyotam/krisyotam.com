import PapersCategoryPage from "./PapersCategoryPage";
import papersData from "@/data/papers/papers.json";
import categoriesData from "@/data/papers/categories.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Get all unique categories from active papers data only
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  const allCategoriesSet = new Set<string>();
  
  activePapers.forEach(paper => {
    if (paper.category) {
      allCategoriesSet.add(paper.category);
    }
  });
  
  const allCategories = Array.from(allCategoriesSet);
  
  console.log('Available categories:', allCategories);
  console.log('Slugified categories:', allCategories.map(cat => cat.toLowerCase().replace(/\s+/g, "-")));
  
  return allCategories.map(category => ({
    slug: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.slug;
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  
  // Find the original category name
  let originalCategory: string | undefined;
  for (const paper of activePapers) {
    if (paper.category && paper.category.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
      originalCategory = paper.category;
      break;
    }
  }

  if (!originalCategory) {
    return {
      title: "Category Not Found | Papers",
    };
  }

  // Check if this category has custom metadata in categories.json
  const customCategory = categoriesData.categories.find(c => c.slug === categorySlug);
  const categoryTitle = customCategory ? customCategory.title : originalCategory;

  return {
    title: `${categoryTitle} Papers | Kris Yotam`,
    description: `Papers in the ${categoryTitle} category`,
  };
}

export default function PaperCategoryPage({ params }: PageProps) {
  const categorySlug = params.slug;
  
  // Filter papers to only show active ones first
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  
  // Find the original category name and filter papers by category
  let originalCategory: string | undefined;
  const papersInCategory = activePapers.filter(paper => {
    if (paper.category && paper.category.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
      if (!originalCategory) {
        originalCategory = paper.category;
      }
      return true;
    }
    return false;
  });

  if (!originalCategory || papersInCategory.length === 0) {
    notFound();
  }

  // Check if this category has custom metadata in categories.json
  const customCategory = categoriesData.categories.find(c => c.slug === categorySlug);
  
  // Create header data for this category
  const categoryHeaderData = customCategory ? {
    title: customCategory.title,
    subtitle: "",
    date: customCategory.date,
    preview: customCategory.preview,
    status: customCategory.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
    confidence: customCategory.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
    importance: customCategory.importance,
    backText: "Categories",
    backHref: "/papers/categories"
  } : {
    title: originalCategory,
    subtitle: "",
    date: new Date().toISOString(),
    preview: `Papers in the ${originalCategory} category.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Categories",
    backHref: "/papers/categories"
  };

  // Sort papers by date (newest first)
  const papers = [...papersInCategory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="papers-container">
      <PapersCategoryPage papers={papers} categoryData={categoryHeaderData} />
    </div>
  );
}
