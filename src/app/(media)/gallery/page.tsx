import { Suspense } from "react";
import { PageHeader } from "@/components/core";
import GalleryClientPage from "./GalleryClientPage";
import { getGallery } from "@/lib/content-db";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata = staticMetadata.art ? { ...staticMetadata.art, title: "Gallery", openGraph: { ...staticMetadata.art.openGraph, title: "Gallery" }, twitter: { ...staticMetadata.art.twitter, title: "Gallery" } } : { title: "Gallery" };

export default function GalleryPage() {
  const galleryData = getGallery();

  const mappedArtworks = galleryData.map(artwork => ({
    id: String(artwork.id),
    title: artwork.title,
    description: artwork.description || "",
    imageUrl: artwork.image_url || "",
    dimension: artwork.dimension || "",
    start_date: artwork.start_date || "",
    end_date: artwork.end_date || undefined,
    date: artwork.end_date || artwork.start_date || "",
    category: artwork.category_slug || "",
    tags: [],
    status: artwork.status || "",
    confidence: artwork.confidence || "",
    importance: artwork.importance || 0,
    bio: artwork.bio || "",
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
