import EssaysCategoryPage from "./EssaysCategoryPage";
import essaysData from "@/data/essays/essays.json";
import categoriesData from "@/data/essays/categories.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Get all unique categories from active essays data only
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  const allCategoriesSet = new Set<string>();
  
  activeEssays.forEach(essay => {
    if (essay.category) {
      allCategoriesSet.add(essay.category);
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
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  
  // Find the original category name
  let originalCategory: string | undefined;
  for (const essay of activeEssays) {
    if (essay.category && essay.category.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
      originalCategory = essay.category;
      break;
    }
  }

  if (!originalCategory) {
    return {
      title: "Category Not Found | Essays",
    };
  }

  // Check if this category has custom metadata in categories.json
  const customCategory = categoriesData.categories.find(c => c.slug === categorySlug);
  const categoryTitle = customCategory ? customCategory.title : originalCategory;

  return {
    title: `${categoryTitle} Essays | Kris Yotam`,
    description: `Essays in the ${categoryTitle} category`,
  };
}

export default function EssayCategoryPage({ params }: PageProps) {
  const categorySlug = params.slug;
  
  // Filter essays to only show active ones first
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  
  // Find the original category name and filter essays by category
  let originalCategory: string | undefined;
  const essaysInCategory = activeEssays.filter(essay => {
    if (essay.category && essay.category.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
      if (!originalCategory) {
        originalCategory = essay.category;
      }
      return true;
    }
    return false;
  });

  if (!originalCategory || essaysInCategory.length === 0) {
    notFound();
  }

  // Check if this category has custom metadata in categories.json
  const customCategory = categoriesData.categories.find(c => c.slug === categorySlug);
  
  // Create header data for this category
  const categoryHeaderData = customCategory ? {
    title: customCategory.title,
    subtitle: "",
    start_date: customCategory.date || "Undefined",
    end_date: new Date().toISOString().split('T')[0],
    preview: customCategory.preview,
    status: customCategory.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
    confidence: customCategory.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
    importance: customCategory.importance,
    backText: "Categories",
    backHref: "/essays/categories"
  } : {
    title: originalCategory,
    subtitle: "",
    start_date: "Undefined",
    end_date: new Date().toISOString().split('T')[0],
    preview: `Essays in the ${originalCategory} category.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Categories",
    backHref: "/essays/categories"
  };

  // Sort essays by date (newest first) and transform to match Essay interface
  const essays = [...essaysInCategory].sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  })
    .map(essay => ({
      id: essay.slug,
      title: essay.title,
      abstract: essay.preview,
      importance: essay.importance,
      confidence: essay.confidence,
      authors: [], // Default value since not in original data
      subject: essay.category,
      keywords: essay.tags,
      postedBy: "admin", // Default value
      postedOn: (essay.end_date && essay.end_date.trim()) ? essay.end_date : essay.start_date,
      dateStarted: essay.start_date,
      tags: essay.tags,
      img: essay.cover_image,
      status: essay.status,
      pdfLink: undefined,
      sourceLink: undefined,
      category: essay.category,
      customPath: undefined
    }));

  return (
    <div className="essays-container">
      <EssaysCategoryPage essays={essays} categoryData={categoryHeaderData} />
    </div>
  );
}