import researchDataRaw from "@/data/research/research.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ResearchDetail } from "./research-detail";
import type { Research } from '@/types/content'

function slugifyTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  const research = (researchDataRaw as any).research as Research[];
  return research.map((item) => ({
    category: slugifyCategory(item.status || 'all'),
    year: new Date(item.start_date).getFullYear().toString(),
    slug: slugifyTitle(item.name),
  }));
}

// Generate metadata for each research page
export async function generateMetadata(
  { params }: { params: { category: string; year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the research item by category, year, and slug
  const y = parseInt(params.year, 10);
  const research = (researchDataRaw as any).research as Research[];
  const item = research.find((r) => {
    const categorySlug = slugifyCategory(r.status || 'all');
    const itemYear = new Date(r.start_date).getFullYear();
    const titleSlug = slugifyTitle(r.name);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

    // If research item not found, return default metadata
    if (!item) {
      return {
        title: "Research Not Found",
      };
    }

    // Build simple metadata from new research fields
    const image = item.imgs && item.imgs.length > 0 ? item.imgs[0].img_url : "https://i.postimg.cc/jSDMT1Sn/research.png";

    return {
      title: `${item.name} | ${item.status || "Research"} | Kris Yotam`,
      description: item.description,
      openGraph: {
        title: item.name,
        description: item.description,
        type: "article",
        images: [
          {
            url: image,
            alt: `${item.name} | Research`,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: item.name,
        description: item.description,
        images: [image],
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
  const research = (researchDataRaw as any).research as Research[];
  const item = research.find((r) => {
    const categorySlug = slugifyCategory(r.status || 'all');
    const itemYear = new Date(r.start_date).getFullYear();
    const titleSlug = slugifyTitle(r.name);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();

  return <ResearchDetail research={item} />;
} 