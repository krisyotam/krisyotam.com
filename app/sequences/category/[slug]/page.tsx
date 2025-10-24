import SequencesClientPage from "../../SequencesClientPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import sequencesData from "@/data/sequences/sequences.json";
import categoriesData from "@/data/sequences/categories.json";
import { SequencesData } from "@/types/sequences";

interface CategoryPageProps {
  params: { slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// Get categories from categories.json
const getCategories = () => {
  return categoriesData.categories.map(cat => cat.title);
};

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map(category => ({ slug: slugifyCategory(category) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = params;
  
  // Find the category in the categories data
  const category = categoriesData.categories.find(cat => cat.slug === slug);
  
  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.title} Sequences | Kris Yotam`,
    description: category.preview || `Sequences in the ${category.title} category`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  // Find the category in the categories data
  const category = categoriesData.categories.find(cat => cat.slug === slug);
  
  if (!category) {
    notFound();
  }

  // Find sequences for this category
  const data = sequencesData as SequencesData;
  const categorySequences = data.sequences.filter(seq => 
    seq.category && slugifyCategory(seq.category) === slug
  );
  
  if (categorySequences.length === 0) {
    console.warn(`No sequences found for category: ${category.title} (slug: ${slug})`);
  }

  return <SequencesClientPage initialCategory={category.title} categoryName={category.title} />;
}
