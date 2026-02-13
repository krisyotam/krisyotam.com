// components/progymnasmata/progymnasmata-entry-page.tsx
"use client";

import Image from "next/image";
import { PostHeader } from "@/components/core";
import { LiveClock } from "@/components/ui/live-clock";
import type { ProgymnasmataEntry } from "@/types/content";
import { Footer } from "@/components/core/footer";
import { Citation } from "@/components/core/citation";

interface ProgymnasmataEntryPageProps {
  entry: ProgymnasmataEntry;
}

export function ProgymnasmataEntryPage({ entry }: ProgymnasmataEntryPageProps) {
  // Always treat entry.type as defined here
  const typeSlug = entry.type.toLowerCase();
  
  // Debug log to verify we're receiving correct values
  console.log("Progymnasmata Entry Data:", { 
    title: entry.title,
    importance: entry.importance, 
    status: entry.status, 
    certainty: entry.certainty 
  });

  return (
    <>
      <style jsx global>{`
        .entry-container {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
      `}</style>      <div className="flex flex-col min-h-screen">
        <div className="flex-grow entry-container container max-w-[672px] mx-auto px-4 pt-8 pb-8">          {/* Post Header */}
          <PostHeader
            title={entry.title}
            start_date={entry.start_date}
            end_date={entry.end_date}
            tags={entry.tags || []}
            importance={entry.importance}
            preview={entry.description}
            status={entry.status as any}
            confidence={entry.certainty as any}
            backText="Progymnasmata"
            backHref="/progymnasmata"
            category={entry.type}
          />
          
          {/* Featured Image */}
          {entry.image && (
            <div className="mb-6 relative w-full h-[300px] rounded-lg overflow-hidden">
              <Image
                src={entry.image}
                alt={entry.title}
                fill
                className="object-cover"
                priority
                unoptimized={entry.image?.includes('krisyotam.com')}
              />
            </div>
          )}
          
          {/* Content */}
          <div className="mt-8 prose dark:prose-invert max-w-none">
            {entry.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Citation section */}
        <div className="mt-8">
          <Citation
            title={entry.title}
            slug={entry.slug}
            start_date={entry.start_date}
            end_date={entry.end_date}
            url={`https://krisyotam.com/progymnasmata/${typeSlug}/${entry.slug}`}
          />
        </div>

        {/* Placeholder for Prev/Next */}
        <div className="border-t border-border pt-6 mt-8">
          <div className="flex justify-between">
            {/* TODO: add Previous / Next links */}
          </div>
        </div>

        {/* Live Clock at bottom */}
        <LiveClock />
      </div>
      
      {/* Footer fixed at bottom */}
      <div className="mt-auto">
        <div className="container max-w-[672px] mx-auto px-4">
          <Footer />
        </div>
      </div>
    </div>
    </>
  );
}

export default ProgymnasmataEntryPage;
