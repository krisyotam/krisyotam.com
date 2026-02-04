// app/art/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getArt } from "@/lib/content-db";
import { Art } from "@/components/core/art";
import { PageHeader } from "@/components/core";
import { Citation } from "@/components/core/citation";
import { LiveClock } from "@/components/ui/live-clock";
import { Footer } from "@/components/core/footer";
import { Box } from "@/components/posts/typography/box";

interface ArtPageProps {
  params: Promise<{ slug: string }>;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  const artworks = getArt();
  return artworks.map(artwork => ({
    slug: generateSlug(artwork.title)
  }));
}

export async function generateMetadata(props: ArtPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const artworks = getArt();
  const artwork = artworks.find(a => generateSlug(a.title) === params.slug);

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
      images: artwork.image_url ? [{
        url: artwork.image_url,
        width: 1200,
        height: 630,
        alt: artwork.title
      }] : undefined
    }
  };
}

export default async function ArtworkPage(props: ArtPageProps) {
  const params = await props.params;
  const artworks = getArt();
  const artwork = artworks.find(a => generateSlug(a.title) === params.slug);

  if (!artwork) {
    return notFound();
  }

  // Map confidence to PageHeader compatible format
  const mapConfidence = (confidence: string | null): "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" => {
    if (!confidence) return "possible";
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
        start_date={artwork.start_date || undefined}
        end_date={artwork.end_date || undefined}
        backHref="/art"
        backText="Art"
        preview={artwork.description || undefined}
        status={artwork.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | undefined}
        confidence={mapConfidence(artwork.confidence)}
        importance={artwork.importance || undefined}
      />

      <div className="my-8">
        <Art imageUrl={artwork.image_url || ""} dimension={artwork.dimension || ""} disableHover />
      </div>

      {artwork.bio && (
        <Box className="my-8">
          <p>{artwork.bio}</p>
        </Box>
      )}

      <Citation
        title={artwork.title}
        start_date={artwork.start_date || undefined}
        end_date={artwork.end_date || undefined}
        url={`https://krisyotam.com/art/${params.slug}`}
      />

      <div className="mt-8">
        <LiveClock />
      </div>

      <Footer />
    </div>
  );
}
