"use client";

import { useState, useEffect } from "react";
import { SequenceHeader } from "@/components/core";
import { Navigation } from "@/components/content/navigation";
import Link from "next/link";
import { Sequence, SequenceSection, PostType } from "@/types/content";
import { formatYMD } from "@/lib/date";

interface SequenceDetailPageProps {
  slug: string;
}

interface PostDates {
  start_date?: string;
  end_date?: string;
}

async function fetchSequence(slug: string): Promise<{ sequence: Sequence; postUrls: Record<string, string>; postDates: Record<string, PostDates> } | null> {
  try {
    const response = await fetch(`/api/content?type=sequences&slug=${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch sequence');
    }
    const data = await response.json();
    return { sequence: data.sequence, postUrls: data.postUrls, postDates: data.postDates || {} };
  } catch (error) {
    console.error('Error fetching sequence:', error);
    return null;
  }
}

export default function SequenceDetailPage({ slug }: SequenceDetailPageProps) {
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [postUrls, setPostUrls] = useState<Record<string, string>>({});
  const [postDates, setPostDates] = useState<Record<string, PostDates>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadSequence = async () => {
      setLoading(true);
      const sequenceData = await fetchSequence(slug);
      if (sequenceData) {
        setSequence(sequenceData.sequence);
        setPostUrls(sequenceData.postUrls);
        setPostDates(sequenceData.postDates);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    loadSequence();
  }, [slug]);

  if (notFound) {
    return null;
  }

  if (!sequence) {
    return null;
  }

  // Handle both old flat format and new sectioned format
  const isNewFormat = sequence.sections && sequence.sections.length > 0;

  const headerData = {
    title: sequence.title,
    start_date: sequence.start_date,
    end_date: (sequence.end_date && sequence.end_date.trim()) ? sequence.end_date : new Date().toISOString().split('T')[0],
    preview: sequence.preview,
    coverUrl: sequence["cover-url"] || "",
    status: sequence.status,
    confidence: sequence.confidence,
    importance: sequence.importance,
    tags: sequence.tags || [],
    category: sequence.category,
    backText: "Sequences",
    backHref: "/sequences"
  };

  return (
    <>
      <style jsx global>{`
        .sequence-container {
          font-family: 'Geist', sans-serif;
        }
        .section-header {
          background: #f8f9fa;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6c757d;
        }
        .dark .section-header {
          background: #1a1a1a;
          color: #9ca3af;
        }
      `}</style>

      <div className="sequence-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <SequenceHeader
          title={headerData.title}
          start_date={headerData.start_date}
          end_date={headerData.end_date}
          preview={headerData.preview}
          coverUrl={headerData.coverUrl}
          status={headerData.status}
          confidence={headerData.confidence}
          importance={headerData.importance}
          backText={headerData.backText}
          backHref={headerData.backHref}
          tags={headerData.tags}
          category={headerData.category}
          className="mb-3"
        />

        {/* Navigation bar */}
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search posts..."
          viewMode="list"
          onViewModeChange={() => {}}
          showViewToggle={true}
          showGridOption={false}
          className="mb-3"
        />

        {/* Posts table with sections */}
        <div className="border border-border overflow-hidden shadow-sm">
          {isNewFormat ? (
            // New sectioned format
            sequence.sections!.map((section) => {
              const filteredPosts = section.posts.filter(post =>
                !searchQuery || post.slug.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (filteredPosts.length === 0) return null;
              return (
                <div key={section.title}>
                  {/* Section header */}
                  <div className="section-header py-3 px-4">
                    {section.title}
                  </div>

                  {/* Section posts */}
                  <table className="w-full text-sm">
                    <tbody>
                      {filteredPosts.map((post, postIndex) => {
                        const dates = postDates[post.slug] || {};
                        return (
                          <tr
                            key={post.slug}
                            className={`border-b border-border hover:bg-secondary/50 transition-colors ${postIndex % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                          >
                            <td className="py-2 px-3 text-muted-foreground w-12">{post.order}</td>
                            <td className="py-2 px-3">
                              <Link
                                href={postUrls[post.slug] || `#error-${post.slug}`}
                                className="font-medium"
                              >
                                {post.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Link>
                            </td>
                            <td className="py-2 px-3 text-muted-foreground text-xs w-16">{post.type}</td>
                            <td className="py-2 px-3 text-muted-foreground text-xs font-mono w-24">
                              {dates.start_date ? formatYMD(dates.start_date) : '—'}
                            </td>
                            <td className="py-2 px-3 text-muted-foreground text-xs font-mono w-24">
                              {dates.end_date ? formatYMD(dates.end_date) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })
          ) : (
            // Old flat format fallback
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">#</th>
                  <th className="py-2 text-left font-medium px-3">Title</th>
                  <th className="py-2 text-left font-medium px-3">Type</th>
                  <th className="py-2 text-left font-medium px-3">Start</th>
                  <th className="py-2 text-left font-medium px-3">End</th>
                </tr>
              </thead>
              <tbody>
                {sequence.posts && [...sequence.posts]
                  .sort((a, b) => a.order - b.order)
                  .filter(post => !searchQuery || post.slug.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((post, index) => {
                    const dates = postDates[post.slug] || {};
                    return (
                      <tr
                        key={post.slug}
                        className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                      >
                        <td className="py-2 px-3 text-muted-foreground">{post.order}</td>
                        <td className="py-2 px-3">
                          <Link
                            href={postUrls[post.slug] || `#error-${post.slug}`}
                            className="font-medium"
                          >
                            {post.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Link>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{post.type}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs font-mono">
                          {dates.start_date ? formatYMD(dates.start_date) : '—'}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground text-xs font-mono">
                          {dates.end_date ? formatYMD(dates.end_date) : '—'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
