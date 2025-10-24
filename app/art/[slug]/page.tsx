// app/art/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import artworksData from "@/data/art/art.json";
import { Art } from "@/components/art/art";
import { PageHeader } from "@/components/page-header";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import { Box } from "@/components/posts/typography/box";

interface ArtPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Generate all slugs
  return artworksData.artworks.map(artwork => ({
    slug: artwork.title.toLowerCase().replace(/\s+/g, '-')
  }));
}

export async function generateMetadata({ params }: ArtPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const artwork = artworksData.artworks.find(a => 
    a.title.toLowerCase().replace(/\s+/g, '-') === params.slug
  );

  if (!artwork) {
    return {
      title: "Artwork Not Found",
    };
  }

  const url = `https://krisyotam.com/art/${params.slug}`;

  return {
    title: `${artwork.title} | Kris Yotam`,
    description: artwork.description || "View this artwork by Kris Yotam",
    openGraph: {
      title: artwork.title,
      description: artwork.description || "View this artwork by Kris Yotam",
      url,
      type: "website",
      images: [{
        url: artwork.imageUrl,
        width: 1200,
        height: 630,
        alt: artwork.title
      }]
    }
  };
}

export default function ArtworkPage({ params }: ArtPageProps) {
  // Find the artwork by slug
  const artwork = artworksData.artworks.find(
    a => a.title.toLowerCase().replace(/\s+/g, '-') === params.slug
  );

  // If no artwork found, return 404
  if (!artwork) {
    return notFound();
  }

  // Map confidence to PageHeader compatible format
  const mapConfidence = (confidence: string): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" => {
    const confidenceMap: Record<string, "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"> = {
      low: "unlikely",
      medium: "possible",
      high: "likely"
    };
    return confidenceMap[confidence] || "possible";
  };

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={artwork.title}
        start_date={artwork.start_date}
        end_date={artwork.end_date}
        backHref="/art"
        backText="Art"
        preview={artwork.description}
        status={artwork.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned"}
        confidence={mapConfidence(artwork.confidence)}
        importance={artwork.importance}
      />
      
      <div className="my-8">
        <Art imageUrl={artwork.imageUrl} dimension={artwork.dimension} />
      </div>
      
      {artwork.bio && (
        <Box className="my-8">
          <p>{artwork.bio}</p>
        </Box>
      )}
      
      <Citation 
        title={artwork.title}
        start_date={artwork.start_date}
        end_date={artwork.end_date}
        url={`https://krisyotam.com/art/${params.slug}`}
      />
      
      <div className="mt-8">
        <LiveClock />
      </div>
      
      <Footer />
    </div>
  );
}
