import OCSClientPage from "../OCSClientPage";
import ocsData from "@/data/ocs/ocs.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/content";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories and generate their slugs
  const categories = new Set(ocsData.map(character => 
    character.category.toLowerCase().replace(/\s+/g, "-")
  ));
  
  return Array.from(categories).map(category => ({
    category: category
  }));
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryData = (await import('@/data/ocs/categories.json')).default.types.find(
    cat => cat.slug === categorySlug
  );

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const url = `https://krisyotam.com/ocs/${categorySlug}`;
    // Use Kris Yotam's logo for category pages
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 630,
      alt: `${categoryData.title} | Kris Yotam`
    }
  ];

  return {
    title: `${categoryData.title} | OCs | Kris Yotam`,
    description: categoryData.preview,
    openGraph: {
      title: categoryData.title,
      description: categoryData.preview,
      url,
      type: "website",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: categoryData.title,
      description: categoryData.preview,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default function OCSCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = ocsData.find(character => 
    character.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }
  // Map and sort characters by date (newest first)
  const ocs: OCSMeta[] = ocsData
    .map(character => ({
      ...character,
      status: character.status as OCSStatus,
      confidence: character.confidence as OCSConfidence,
      state: (character.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
    }))
    // Filter to only show characters with state "active" or undefined state
    .filter(character => character.state === "active" || character.state === undefined)
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="ocs-container">
      <OCSClientPage ocs={ocs} initialCategory={originalCategory} />
    </div>
  );
}
