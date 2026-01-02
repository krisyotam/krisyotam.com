// app/verse/[type]/[slug]/PoemPageClient.tsx
"use client";

import { VerseHeader } from "@/components/verse-header";
import poemsData from "@/data/verse/verse.json";
import type { Poem } from "@/types/content";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Citation } from "@/components/citation";
import { Comments } from "@/components/core/comments";
import { useEffect, useState } from "react";

export default function PoemPageClient({
  params: { type, slug },
}: {
  params: { type: string; slug: string };
}) {
  // find the poem by matching slugified type + slug (no year)
  const poem = (poemsData as Poem[]).find((p) => {
  const tSlug = (p.type ?? "").toLowerCase().replace(/\s+/g, "-");
  return tSlug === type && (p.slug ?? "") === slug;
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

  // Function to render poem content with proper line breaks and stanza spacing
  const renderPoemContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.trim() === '') {
        // Empty line - add stanza break
        elements.push(<div key={`stanza-${i}`} className="h-4" />);
      } else {
        // Non-empty line with hover effect
        elements.push(
          <div 
            key={i} 
            className="leading-relaxed px-1 hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors duration-150 rounded-sm cursor-pointer"
          >
            {line}
          </div>
        );
      }
    }
    
    return elements;
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <VerseHeader
          title={poem.title ?? ""}
          start_date={poem.start_date ?? ""}
          end_date={poem.end_date ?? ""}
          type={poem.type ?? ""}
          collection={poem.collection ?? ""}
          preview={poem.description ?? ""}
          status={poem.status ?? undefined}
          confidence={poem.confidence ?? undefined}
          importance={poem.importance ?? 0}
          tags={tags ?? []}
        />

        <div className="p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] overflow-y-auto max-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground animate-pulse">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4 text-center">{error}</div>
          ) : (
            <div className="poem-content">
              {renderPoemContent(poemContent)}
            </div>
          )}
        </div>
        
        <Comments />

        <div className="mt-4 mb-8">
          <Citation
            title={poem.title ?? ""}
            slug={poem.slug ?? ""}
            date={((poem.end_date ?? "").trim()) || (poem.start_date ?? "")}
            url={`https://krisyotam.com/verse/${type}/${slug}`}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
