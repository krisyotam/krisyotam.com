import essaysData from "@/data/essays.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { EssaysDetail } from "./essays-detail";

interface Essay {
  id: string;
  title: string;
  importance: string | number;
  authors: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  status: string;
  pdfLink: string;
  sourceLink: string;
  category: string;
  tags: string[];
}

function slugifyTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  const essays = essaysData as Essay[];
  return essays.map((item) => ({
    category: slugifyCategory(item.category),
    year: new Date(item.dateStarted).getFullYear().toString(),
    slug: slugifyTitle(item.title),
  }));
}

// Generate metadata for each essay page
export async function generateMetadata(
  { params }: { params: { category: string; year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the essay item by category, year, and slug
  const y = parseInt(params.year, 10);
  const essays = essaysData as Essay[];
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
    description: item.abstract,
    openGraph: {
      title: item.title,
      description: item.abstract,
      type: "article",
      publishedTime: item.postedOn,
      authors: item.authors,
      tags: item.tags || [],
      images: [
        {
          url: "https://i.postimg.cc/jSDMT1Sn/research.png",
          alt: `${item.title} | Essay`,
          width: 1200,
          height: 630
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.abstract,
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
  const essays = essaysData as Essay[];
  const item = essays.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();

  return <EssaysDetail essay={item} />;
} 