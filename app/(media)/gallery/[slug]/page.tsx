// app/gallery/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getGallery } from "@/lib/content-db";
import { PageHeader } from "@/components/core";
import { Citation } from "@/components/citation";
import { LiveClock } from "@/components/live-clock";
import { Footer } from "@/components/footer";
import { Box } from "@/components/posts/typography/box";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  const artworks = getGallery();
  return artworks.map(artwork => ({
    slug: generateSlug(artwork.title)
  }));
}

export async function generateMetadata(props: GalleryPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const artworks = getGallery();
  const artwork = artworks.find(a => generateSlug(a.title) === params.slug);

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
      images: artwork.image_url ? [{
        url: artwork.image_url,
        width: 1200,
        height: 630,
        alt: artwork.title
      }] : undefined
    }
  };
}

export default async function PhotoPage(props: GalleryPageProps) {
  const params = await props.params;
  const artworks = getGallery();
  const artwork = artworks.find(a => generateSlug(a.title) === params.slug);

  if (!artwork) {
    return notFound();
  }

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={artwork.title}
        start_date={artwork.start_date || undefined}
        end_date={artwork.end_date || undefined}
        backHref="/gallery"
        backText="Gallery"
        preview={artwork.description || undefined}
        status={artwork.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | undefined}
        confidence={artwork.confidence as any}
        importance={artwork.importance || undefined}
      />
      <div className="my-8">
        <img src={artwork.image_url || ""} alt={artwork.title} className="w-full h-auto rounded shadow" />
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
        url={`https://krisyotam.com/gallery/${params.slug}`}
      />
      <div className="mt-8">
        <LiveClock />
      </div>
      <Footer />
    </div>
  );
}
