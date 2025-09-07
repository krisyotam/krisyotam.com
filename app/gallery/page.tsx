import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
// import { FocusCards } from "@/app/(content)/gallery/FocusCards";
import GalleryClientPage from "./GalleryClientPage";
import galleryData from "@/data/gallery/gallery.json";
import { staticMetadata } from "@/lib/staticMetadata";

interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dimension: string;
  start_date: string;
  end_date?: string;
  category: string;
  tags: string[];
  status: string;
  confidence: string;
  importance: number;
  bio: string;
}

export const metadata = staticMetadata.art ? { ...staticMetadata.art, title: "Gallery", openGraph: { ...staticMetadata.art.openGraph, title: "Gallery" }, twitter: { ...staticMetadata.art.twitter, title: "Gallery" } } : { title: "Gallery" };

export default function GalleryPage() {
  const mappedArtworks = galleryData.artworks.map(artwork => ({
    ...artwork,
    date: artwork.end_date || artwork.start_date
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <PageHeader
          title="Photography"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="my personal photography portfolio"
        />
        <div className="mt-8">
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading gallery...</div>}>
            <GalleryClientPage artworks={mappedArtworks} initialCategory="all" />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
