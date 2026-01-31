"use client";

import { useState, useEffect } from "react";
import { PostHeader } from "@/components/core";
import Link from "next/link";
import { Sequence, SequenceSection, PostType } from "@/types/content";

interface SequenceDetailPageProps {
  slug: string;
}

async function fetchSequence(slug: string): Promise<{ sequence: Sequence; postUrls: Record<string, string> } | null> {
  try {
    const response = await fetch(`/api/content?type=sequences&slug=${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch sequence');
    }
    const data = await response.json();
    return { sequence: data.sequence, postUrls: data.postUrls };
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

  useEffect(() => {
    const loadSequence = async () => {
      setLoading(true);
      const sequenceData = await fetchSequence(slug);
      if (sequenceData) {
        setSequence(sequenceData.sequence);
        setPostUrls(sequenceData.postUrls);
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
  
  // Calculate total posts count
  const totalPosts = isNewFormat 
    ? sequence.sections!.reduce((total, section) => total + section.posts.length, 0)
    : sequence.posts ? sequence.posts.length : 0;

  const headerData = {
    title: sequence.title,
    subtitle: "Learning Sequence",
    start_date: sequence.start_date,
    end_date: (sequence.end_date && sequence.end_date.trim()) ? sequence.end_date : new Date().toISOString().split('T')[0],
    preview: sequence.preview,
    status: sequence.status,
    confidence: sequence.confidence,
    importance: sequence.importance,
    tags: sequence.tags?.slice(0, 3) || [],
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
        <PostHeader
          title={headerData.title}
          subtitle={headerData.subtitle}
          start_date={headerData.start_date}
          end_date={headerData.end_date}
          preview={headerData.preview}
          status={headerData.status}
          confidence={headerData.confidence}
          importance={headerData.importance}
          backText={headerData.backText}
          backHref={headerData.backHref}
          tags={headerData.tags}
          category={headerData.category}
        />

        {/* Posts count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} in this sequence
        </div>

        {/* Posts table with sections */}
        <div className="border border-border overflow-hidden shadow-sm">
          {isNewFormat ? (
            // New sectioned format
            sequence.sections!.map((section, sectionIndex) => (
              <div key={section.title}>
                {/* Section header */}
                <div className="section-header py-3 px-4">
                  {section.title}
                </div>
                
                {/* Section posts */}
                <table className="w-full text-sm">
                  <tbody>
                    {section.posts.map((post, postIndex) => (
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
                        <td className="py-2 px-3 text-muted-foreground text-xs w-20">{post.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            // Old flat format fallback
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">#</th>
                  <th className="py-2 text-left font-medium px-3">Title</th>
                  <th className="py-2 text-left font-medium px-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {sequence.posts && [...sequence.posts].sort((a, b) => a.order - b.order).map((post, index) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
