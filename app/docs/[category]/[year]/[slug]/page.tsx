import docsData from "@/data/docs.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { DocDetail } from "./doc-detail";

interface DocItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  const docs = docsData as DocItem[];
  return docs.map((item) => ({
    category: slugifyCategory(item.category),
    year: new Date(item.date).getFullYear().toString(),
    slug: item.slug,
  }));
}

// Generate metadata for each document page
export async function generateMetadata(
  { params }: { params: { category: string; year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the document item by category, year, and slug
  const y = parseInt(params.year, 10);
  const docs = docsData as DocItem[];
  const item = docs.find((d) => {
    const categorySlug = slugifyCategory(d.category);
    const itemYear = new Date(d.date).getFullYear();
    const titleSlug = d.slug;
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  // If document not found, return default metadata
  if (!item) {
    return {
      title: "Document Not Found",
    };
  }

  // Get base URL from parent metadata for absolute URLs
  const previousImages = (await parent).openGraph?.images || [];

  // Construct metadata with OpenGraph properties
  return {
    title: `${item.title} | ${item.category} | Kris Yotam`,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      type: "article",
      publishedTime: item.date,
      tags: item.tags || [],
      images: [
        {
          url: "https://i.postimg.cc/yYQLwKsz/docs.png",
          alt: `${item.title} | AI Documents`,
          width: 1200,
          height: 630
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: ["https://i.postimg.cc/yYQLwKsz/docs.png"],
    },
  };
}

export default function DocPage({
  params,
}: {
  params: { category: string; year: string; slug: string };
}) {
  const y = parseInt(params.year, 10);
  if (isNaN(y)) notFound();

  // Find the document item
  const docs = docsData as DocItem[];
  const item = docs.find((d) => {
    const categorySlug = slugifyCategory(d.category);
    const itemYear = new Date(d.date).getFullYear();
    const titleSlug = d.slug;
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();

  return <DocDetail doc={item} />;
} 