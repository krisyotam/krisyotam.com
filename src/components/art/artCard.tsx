"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export interface ArtworkItem {
  id: string;
  title: string;
  type?: string;
  category?: string;
  description: string;
  imageUrl?: string;
  dimension: string;
  start_date: string;
  end_date?: string;
  date?: string;
  tags?: string[];
  status?: string;
  confidence?: string;
  importance?: number;
  bio?: string;
}

type ArtCardVariant = "square" | "wide" | "tall";

interface ArtCardProps {
  artwork: ArtworkItem;
  variant?: ArtCardVariant;
  disableLink?: boolean;
}

function getAspectClass(variant: ArtCardVariant): string {
  switch (variant) {
    case "wide":
      return "aspect-[7/4]";
    case "tall":
      return "aspect-[4/7]";
    case "square":
    default:
      return "aspect-square";
  }
}

function getVariantFromDimension(dimension: string): ArtCardVariant {
  switch (dimension) {
    case "7x4":
      return "wide";
    case "4x7":
      return "tall";
    case "1x1":
    default:
      return "square";
  }
}

export default function ArtCard({ artwork, variant, disableLink = false }: ArtCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resolvedVariant = variant || getVariantFromDimension(artwork.dimension);
  const aspectClass = getAspectClass(resolvedVariant);
  const slug = artwork.title.toLowerCase().replace(/\s+/g, "-");
  const imageUrl = artwork.imageUrl || "/placeholder.svg?height=600&width=600";

  const displayDate = artwork.end_date || artwork.start_date || artwork.date;
  let formattedDate = "";
  if (displayDate && displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = displayDate.split("-").map((num) => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } else if (displayDate) {
    formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  const cardContent = (
    <div
      className={`group relative overflow-hidden bg-card text-card-foreground transition-all cursor-pointer ${aspectClass}`}
      onClick={disableLink ? () => setIsModalOpen(true) : undefined}
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={imageUrl?.includes("krisyotam.com")}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-lg font-semibold text-white">{artwork.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-white/80">{formattedDate}</span>
            <span className="text-xs px-2 py-1 bg-primary/80 text-primary-foreground">
              {artwork.category || artwork.type || "Art"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {disableLink ? (
        cardContent
      ) : (
        <Link href={`/art/${slug}`}>{cardContent}</Link>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative max-h-[90vh] max-w-[90vw] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-lg hover:bg-muted z-10"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={imageUrl}
              alt={artwork.title}
              className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain shadow-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-lg font-semibold text-white">{artwork.title}</h3>
              <p className="text-sm text-white/80">{artwork.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
