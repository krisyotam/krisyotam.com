// app/verse/[type]/[year]/[slug]/PoemPageClient.tsx
"use client";

import { VerseHeader } from "@/components/verse-header";
import { PoemBox } from "@/components/posts/typography/poem";
import poemsData from "@/data/poems.json";
import type { Poem } from "@/utils/poems";
import { notFound } from "next/navigation";
import { Footer } from "@/app/blog/(post)/components/footer";

export default function PoemPageClient({
  params: { type, year, slug },
}: {
  params: { type: string; year: string; slug: string };
}) {
  const y = parseInt(year, 10);
  if (isNaN(y)) notFound();

  // find the poem by matching slugified type + year + slug
  const poem = (poemsData as Poem[]).find((p) => {
    const tSlug = p.type.toLowerCase().replace(/\s+/g, "-");
    return tSlug === type && p.year === y && p.slug === slug;
  });
  if (!poem) notFound();

  // collect stanzas
  const stanzas: string[] = [];
  let idx = 1;
  while ((poem as any)[`stanza${idx}`]) {
    stanzas.push((poem as any)[`stanza${idx}`]);
    idx++;
  }

  // Default values for new fields if they don't exist in the data
  const status = poem.status || "Finished";
  const confidence = poem.confidence || "likely";
  const importance = poem.importance || 5;
  const tags = poem.tags || [];

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Use the VerseHeader component with headerDescription */}
        <VerseHeader
          title={poem.title}
          date={poem.dateCreated}
          type={poem.type}
          collection={poem.collection}
          preview={poem.headerDescription}
          status={status}
          confidence={confidence}
          importance={importance}
          tags={tags}
        />

        {/* Use PoemBox for the poem content without the title */}
        <PoemBox>
          {stanzas.length > 0 ? (
            stanzas.map((stanza) => stanza).join("\n\n")
          ) : (
            "No content available for this poem."
          )}
        </PoemBox>
        
        <Footer />
      </div>
    </div>
  );
}
