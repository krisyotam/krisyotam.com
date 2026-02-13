"use client";

import { useState, useEffect } from "react";
import ArtCard, { type ArtworkItem } from "./artCard";

export default function MasonryGrid({ artworks }: { artworks: ArtworkItem[] }) {
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkItem[]>(artworks);

  useEffect(() => {
    setFilteredArtworks(artworks);
  }, [artworks]);

  if (filteredArtworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No artworks found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {filteredArtworks.map((artwork) => (
        <div key={artwork.id} className="w-full">
          <ArtCard artwork={artwork} />
        </div>
      ))}
    </div>
  );
}

export type { ArtworkItem };
