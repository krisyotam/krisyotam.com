// app/poetry/[type]/[year]/[slug]/PoemPageClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Bookmark } from "lucide-react";
import poemsData from "@/data/poems.json";
import type { Poem } from "@/utils/poems";
import { notFound } from "next/navigation";

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

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* back button */}
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href={`/poetry/${type}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to {type}
            </Link>
          </Button>
        </div>

        {/* layout: image + metadata on left, text on right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={poem.image || "/placeholder.svg?height=300&width=300"}
                alt={poem.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{poem.dateCreated}</span>
              </div>
              {poem.collection && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>From "{poem.collection}"</span>
                </div>
              )}
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {poem.type}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight mb-6">{poem.title}</h1>
            {poem.description && (
              <div className="bg-muted p-4 rounded-lg mb-6 text-sm italic text-muted-foreground">
                {poem.description}
              </div>
            )}

            {/* stanza styling */}
            <style jsx global>{`
              .poetry-content {
                font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                font-size: 1.125rem;
                line-height: 1.75;
                color: hsl(222.2, 47.4%, 11.2%);
              }
              .dark .poetry-content {
                color: hsl(210, 40%, 98%);
              }
              .poetry-stanza {
                margin-bottom: 1.5em;
                white-space: pre-line;
              }
            `}</style>

            <div className="poetry-content prose dark:prose-invert max-w-none">
              {stanzas.length > 0 ? (
                stanzas.map((stanza, i) => (
                  <div key={i} className="poetry-stanza">
                    {stanza}
                  </div>
                ))
              ) : (
                <div className="poetry-stanza">No content available for this poem.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
