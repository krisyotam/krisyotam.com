// app/gallery/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import galleryData from "@/data/gallery/gallery.json";
import { PageHeader } from "@/components/core";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import { Box } from "@/components/posts/typography/box";

interface GalleryPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Generate all slugs
  return galleryData.artworks.map(artwork => ({
    slug: artwork.title.toLowerCase().replace(/\s+/g, '-')
  }));
}

export async function generateMetadata({ params }: GalleryPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const artwork = galleryData.artworks.find(a => 
    a.title.toLowerCase().replace(/\s+/g, '-') === params.slug
  );

  if (!artwork) {
    return {
      title: "Photo Not Found",
    };
  }

  const url = `https://krisyotam.com/gallery/${params.slug}`;

  return {
    title: `${artwork.title} | Kris Yotam`,
    description: artwork.description || "View this photo by Kris Yotam",
    openGraph: {
      title: artwork.title,
      description: artwork.description || "View this photo by Kris Yotam",
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

export default function PhotoPage({ params }: GalleryPageProps) {
  // Find the artwork by slug
  const artwork = galleryData.artworks.find(
    a => a.title.toLowerCase().replace(/\s+/g, '-') === params.slug
  );

  if (!artwork) {
    return notFound();
  }

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={artwork.title}
        start_date={artwork.start_date}
        end_date={artwork.end_date}
        backHref="/gallery"
        backText="Gallery"
        preview={artwork.description}
        status={artwork.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned"}
        confidence={artwork.confidence as any}
        importance={artwork.importance}
      />
      <div className="my-8">
        <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-auto rounded shadow" />
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
        url={`https://krisyotam.com/gallery/${params.slug}`}
      />
      <div className="mt-8">
        <LiveClock />
      </div>
      <Footer />
    </div>
  );
}
