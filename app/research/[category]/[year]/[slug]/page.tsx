import researchData from "@/data/research.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ResearchDetail } from "./research-detail";

interface Research {
  id: string;
  title: string;
  abstract: string;
  importance: string | number;
  authors: string[];
  subject: string;
  keywords: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  status: string;
  bibliography: string[];
  img: string;
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
  const research = researchData as Research[];
  return research.map((item) => ({
    category: slugifyCategory(item.category),
    year: new Date(item.dateStarted).getFullYear().toString(),
    slug: slugifyTitle(item.title),
  }));
}

// Generate metadata for each research page
export async function generateMetadata(
  { params }: { params: { category: string; year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the research item by category, year, and slug
  const y = parseInt(params.year, 10);
  const research = researchData as Research[];
  const item = research.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  // If research item not found, return default metadata
  if (!item) {
    return {
      title: "Research Not Found",
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
          alt: `${item.title} | Research`,
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

export default function ResearchPage({
  params,
}: {
  params: { category: string; year: string; slug: string };
}) {
  const y = parseInt(params.year, 10);
  if (isNaN(y)) notFound();

  // Find the research item
  const research = researchData as Research[];
  const item = research.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();

  return <ResearchDetail research={item} />;
} 