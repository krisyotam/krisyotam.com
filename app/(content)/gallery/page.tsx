'use client';

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";

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

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setArtworks(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    fetchArtworks();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHeader
        title="Photography Gallery"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="A curated collection of photography and visual storytelling."
      />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-muted-foreground">Loading...</div>
        ) : artworks.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">No artworks found.</div>
        ) : (
          artworks.map(art => (
            <div key={art.id} className="rounded shadow bg-card p-4 flex flex-col items-center">
              <img src={art.imageUrl} alt={art.title} className="w-full h-48 object-cover rounded mb-2" />
              <div className="font-semibold text-lg mb-1">{art.title}</div>
              <div className="text-xs text-muted-foreground mb-2">{art.dimension} | {art.category}</div>
              <div className="text-sm mb-2">{art.description}</div>
              <div className="text-xs text-muted-foreground mb-2">{art.tags.join(", ")}</div>
              <div className="text-xs text-muted-foreground">{art.status} | {art.confidence} | Importance: {art.importance}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
