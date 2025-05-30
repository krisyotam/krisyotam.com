import essaysData from "@/data/essays.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { EssaysDetail } from "./essays-detail";
import type { Essay } from "@/types/essay"

interface EssayData {
  id: string;
  title: string;
  abstract?: string;
  importance: number | string;
  confidence?: string;
  authors: string[];
  subject?: string;
  keywords?: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  tags: string[];
  img?: string;
  status: string;
  pdfLink?: string;
  sourceLink?: string;
  category: string;
}

function slugifyTitle(title: string) {
  return (title || "").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function slugifyCategory(category: string) {
  return (category || "").toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  const essays = essaysData as EssayData[];
  return essays
    .filter(item => {
      const categorySlug = slugifyCategory(item.category);
      const titleSlug = slugifyTitle(item.title);
      // Ensure all parts of the slug are non-empty and date is valid
      return categorySlug && titleSlug && item.dateStarted && !isNaN(new Date(item.dateStarted).getFullYear());
    })
    .map((item) => ({
      category: slugifyCategory(item.category),
      year: new Date(item.dateStarted).getFullYear().toString(),
      slug: slugifyTitle(item.title),
    }));
}

// Generate metadata for each essay page
export async function generateMetadata(
  { params }: { params: { category: string; year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {  // Find the essay item by category, year, and slug
  const y = parseInt(params.year, 10);
  const essays = essaysData as EssayData[];
  const item = essays.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  // If essay item not found, return default metadata
  if (!item) {
    return {
      title: "Essay Not Found",
    };
  }
  // Get base URL from parent metadata for absolute URLs
  const previousImages = (await parent).openGraph?.images || [];

  // Construct metadata with OpenGraph properties
  return {
    title: `${item.title} | ${item.category} | Kris Yotam`,
    description: item.abstract || `Essay on ${item.title} by ${item.authors.join(', ')}`,
    openGraph: {
      title: item.title,
      description: item.abstract || `Essay on ${item.title} by ${item.authors.join(', ')}`,
      type: "article",
      publishedTime: item.postedOn,
      authors: item.authors,
      tags: item.keywords || [],
      images: [
        {
          url: "https://i.postimg.cc/jSDMT1Sn/research.png",
          alt: `${item.title} | Essay`,
          width: 1200,
          height: 630
        }
      ],
    },    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.abstract || `Essay on ${item.title} by ${item.authors.join(', ')}`,
      images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
    },
  };
}

export default function EssayPage({
  params,
}: {
  params: { category: string; year: string; slug: string };
}) {
  const y = parseInt(params.year, 10);
  if (isNaN(y)) notFound();
  // Find the essay item
  const essays = essaysData as EssayData[];
  const item = essays.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();
  const essay: Essay = {
    ...item,
    img: item.img || "",
    abstract: item.abstract || "",
    confidence: item.confidence || "likely",
    keywords: item.keywords || item.tags || []
  };

  return <EssaysDetail essay={essay} />;
} 