// components/progymnasmata/progymnasmata-entry-page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/date-formatter";
import { LiveClock } from "@/components/live-clock";
import type { ProgymnasmataEntry } from "@/types/progymnasmata";

interface ProgymnasmataEntryPageProps {
  entry: ProgymnasmataEntry;
}

export function ProgymnasmataEntryPage({ entry }: ProgymnasmataEntryPageProps) {
  const date = new Date(entry.date);
  const formattedDate = formatDate(date, "MM-dd-yyyy");

  // Always treat entry.type as defined here
  const typeSlug = entry.type.toLowerCase();

  return (
    <>
      <style jsx global>{`
        .entry-container {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
      `}</style>

      <div className="entry-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:underline">
            home
          </Link>
          <span className="mx-2">›</span>

          <Link href="/progymnasmata" className="hover:underline">
            progymnasmata
          </Link>
          <span className="mx-2">›</span>

          <Link
            href={`/progymnasmata?type=${encodeURIComponent(typeSlug)}`}
            className="hover:underline"
          >
            {entry.type}
          </Link>
          <span className="mx-2">›</span>

          <span>{entry.title}</span>
        </nav>

        {/* Featured Image */}
        {entry.image && (
          <div className="mb-6 relative w-full h-[300px] rounded-lg overflow-hidden">
            <Image
              src={entry.image}
              alt={entry.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title & Meta */}
        <h1 className="text-2xl font-medium mb-1">{entry.title}</h1>
        <p className="text-muted-foreground">Published {formattedDate}</p>
        <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mt-2">
          {entry.type}
        </div>

        {/* Content */}
        <div className="mt-8 prose dark:prose-invert max-w-none">
          {entry.paragraphs.map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Placeholder for Prev/Next */}
        <div className="border-t border-border pt-6 mt-12">
          <div className="flex justify-between">
            {/* TODO: add Previous / Next links */}
          </div>
        </div>

        {/* Live Clock at bottom */}
        <LiveClock />
      </div>
    </>
  );
}

export default ProgymnasmataEntryPage;
