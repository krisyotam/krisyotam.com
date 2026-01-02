export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ocsData from "@/data/ocs/ocs.json";
import OCSPageClient from "./OCSPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/content";

interface OCSData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  book: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  cover_image?: string;
  subtitle?: string;
  state?: "active" | "hidden";
}

interface OCSPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations, but only for active characters
  return ocsData
    .filter(character => character.state !== "hidden") // Only include active characters
    .map(character => ({
      category: slugifyCategory(character.category),
      slug: character.slug
    }));
}

export async function generateMetadata({ params }: OCSPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const characterData = ocsData.find(c => 
    slugifyCategory(c.category) === params.category && c.slug === params.slug
  );

  if (!characterData) {
    return {
      title: "Character Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use cover image if available, otherwise use Kris Yotam's logo
  const images = [
    {      url: characterData.cover_image || 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 1200,
      alt: characterData.title
    }
  ];

  const url = `https://krisyotam.com/ocs/${params.category}/${params.slug}`;

  return {
    title: `${characterData.title} | ${characterData.category} Characters | Kris Yotam`,
    description: characterData.preview || `Character profile for ${characterData.title}`,
    openGraph: {
      title: characterData.title,
      description: characterData.preview || `Character profile for ${characterData.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: characterData.title,
      description: characterData.preview || `Character profile for ${characterData.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default async function OCSPage({ params }: OCSPageProps) {
  const characterData = ocsData.find(c => 
    slugifyCategory(c.category) === params.category && c.slug === params.slug
  );

  if (!characterData) {
    notFound();
  }
  
  // Check if the character is meant to be hidden
  if (characterData.state === "hidden") {
    notFound();
  }
  
  const character: OCSMeta = {
    ...characterData,
    status: characterData.status as OCSStatus,
    confidence: characterData.confidence as OCSConfidence,
    state: (characterData.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
  };
  
  const ocs: OCSMeta[] = (ocsData as OCSData[]).map(character => ({
    ...character,
    status: character.status as OCSStatus,
    confidence: character.confidence as OCSConfidence,
    state: (character.state as "active" | "hidden" | undefined) || "active" // Default to "active" if state is not defined
  }))
  // Filter to only show characters with state "active" or undefined state
  .filter(character => character.state === "active" || character.state === undefined);

  // Extract headings from the character MDX content
  const headings = await extractHeadingsFromMDX('ocs', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const Character = (await import(`@/app/(content)/ocs/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <OCSPageClient character={character} allCharacters={ocs} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="ocs-content">
            <Character />
          </div>
          <OCSPageClient character={character} allCharacters={ocs} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
