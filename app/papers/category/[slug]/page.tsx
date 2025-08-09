import PapersCategoryPage from "./PapersCategoryPage";
import papersData from "@/data/papers/papers.json";
import categoriesData from "@/data/papers/categories.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PaperMeta } from "@/types/papers";

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
    start_date: (customCategory as any).start_date || customCategory.date || new Date().toISOString().split('T')[0],
    end_date: (customCategory as any).end_date,
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
    date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    preview: `Papers in the ${originalCategory} category.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Categories",
    backHref: "/papers/categories"
  };

  // Sort papers by date (newest first) and transform to PaperMeta
  const papers = [...papersInCategory].sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  })
    .map(paper => ({
      title: paper.title,
      subtitle: paper.preview,
      preview: paper.preview,
      start_date: paper.start_date,
      end_date: paper.end_date,
      slug: paper.slug,
      tags: paper.tags,
      category: paper.category,
      status: paper.status as PaperMeta['status'],
      confidence: paper.confidence as PaperMeta['confidence'],
      importance: paper.importance,
      state: paper.state,
      cover_image: paper.cover_image
    }));

  return (
    <div className="papers-container">
      <PapersCategoryPage papers={papers} categoryData={categoryHeaderData} />
    </div>
  );
}
