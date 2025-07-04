// app/verse/[type]/[year]/[slug]/PoemPageClient.tsx
"use client";

import { VerseHeader } from "@/components/verse-header";
import { PoemBox } from "@/components/posts/typography/poem";
import poemsData from "@/data/verse/poems.json";
import type { Poem } from "@/utils/poems";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";
import { useEffect, useState } from "react";

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

  // State for poem content and loading state
  const [poemContent, setPoemContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch poem content when component mounts
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/verse/content?type=${type}&slug=${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch poem content');
        }
        
        const data = await response.json();
        setPoemContent(data.content || "No content available for this poem.");
      } catch (error) {
        console.error('Error fetching poem content:', error);
        setError("Could not load poem content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [type, slug]);

  const tags = poem.tags || [];

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <VerseHeader
          title={poem.title}
          date={poem.dateCreated}
          type={poem.type}
          collection={poem.collection}
          preview={poem.description}
          status={poem.status}
          confidence={poem.confidence}
          importance={poem.importance}
          tags={tags}
        />

        <PoemBox>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground animate-pulse">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4 text-center">{error}</div>
          ) : (
            poemContent
          )}
        </PoemBox>
        
        <div className="my-8">
          <Citation 
            title={poem.title}
            slug={`verse/${type}/${year}/${slug}`}
            date={poem.dateCreated}
            url={`https://krisyotam.com/verse/${type}/${year}/${slug}`}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
