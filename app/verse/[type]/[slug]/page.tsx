// app/verse/[type]/[slug]/page.tsx
import poemsData from "@/data/verse/verse.json";
import type { Poem } from "@/utils/poems";
import PoemPageClient from "./PoemPageClient";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
  const poems = poemsData as Poem[];
  return poems.map((poem) => ({
    type: (poem.type ?? "").toLowerCase().replace(/\s+/g, "-"),
    slug: poem.slug ?? "",
  }));
}

// Generate metadata for each poem page
export async function generateMetadata(
  { params }: { params: { type: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the poem by type and slug
  const poem = (poemsData as Poem[]).find((p) => {
    const tSlug = (p.type ?? "").toLowerCase().replace(/\s+/g, "-");
    return tSlug === params.type && (p.slug ?? "") === params.slug;
  });

  // If poem not found, return default metadata
  if (!poem) {
    return {
      title: "Poem Not Found",
    };
  }

  // Get base URL from parent metadata for absolute URLs
  const previousImages = (await parent).openGraph?.images || [];

  // Construct metadata with OpenGraph properties
  return {
    title: `${poem.title} | ${poem.type} | Kris Yotam`,
    description: poem.description || `${poem.title} by Kris Yotam`,
    openGraph: {
      title: poem.title,
      description: poem.description || `${poem.title} by Kris Yotam`,
      type: "article",
      publishedTime: poem.start_date,
      authors: ["Kris Yotam"],
      tags: poem.tags || [],
      images: poem.image 
        ? [
            {
              url: poem.image,
              alt: `Image for ${poem.title}`,
            },
          ]
        : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: poem.title,
      description: poem.description || `${poem.title} by Kris Yotam`,
      images: poem.image ? [poem.image] : [],
    },
  };
}

export default function PoemPage({
  params: { type, slug },
}: {
  params: { type: string; slug: string };
}) {
  return <PoemPageClient params={{ type, slug }} />;
}
