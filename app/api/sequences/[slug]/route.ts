/**
 * =============================================================================
 * Sequence Detail API Route
 * =============================================================================
 *
 * Returns a single sequence by slug with pre-calculated post URLs.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import {
  getSequencesData,
  getContentByType,
  type Sequence
} from '@/lib/data';

// =============================================================================
// Types
// =============================================================================

interface Params {
  slug: string;
}

type PostType = 'essay' | 'note' | 'paper' | 'review' | 'fiction' | 'verse';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get cached content data for all relevant types
 */
function getContentData(): Map<string, Array<{ slug: string; category: string }>> {
  const contentMap = new Map<string, Array<{ slug: string; category: string }>>();

  // Map PostType to content type names in database
  const typeMapping: Record<PostType, string> = {
    'essay': 'essays',
    'note': 'notes',
    'paper': 'papers',
    'review': 'reviews',
    'fiction': 'fiction',
    'verse': 'verse'
  };

  for (const [postType, contentType] of Object.entries(typeMapping)) {
    const content = getContentByType(contentType);
    contentMap.set(postType, content.map(c => ({
      slug: c.slug,
      category: c.category
    })));
  }

  return contentMap;
}

/**
 * Get post URL by looking up category from data
 */
function getPostUrl(
  type: PostType,
  slug: string,
  contentData: Map<string, Array<{ slug: string; category: string }>>
): string {
  let category = '';

  try {
    const items = contentData.get(type) || [];
    const item = items.find(i => i.slug === slug);

    if (item) {
      category = item.category?.toLowerCase().replace(/\s+/g, "-") || '';
    }

    switch (type) {
      case 'essay':
        return category ? `/essays/${category}/${slug}` : `/essays/unknown/${slug}`;
      case 'note':
        return category ? `/notes/${category}/${slug}` : `/notes/unknown/${slug}`;
      case 'paper':
        return category ? `/papers/${category}/${slug}` : `/papers/unknown/${slug}`;
      case 'review':
        return category ? `/reviews/${category}/${slug}` : `/reviews/unknown/${slug}`;
      case 'fiction':
        return category ? `/fiction/${category}/${slug}` : `/fiction/unknown/${slug}`;
      case 'verse':
        return category ? `/verse/${category}/${slug}` : `/verse/unknown/${slug}`;
      default:
        return `/unknown/${slug}`;
    }
  } catch (error) {
    console.error('Error getting URL for', type, slug, error);
    return `/${type}s/unknown/${slug}`;
  }
}

// =============================================================================
// GET Handler
// =============================================================================

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = params;
    const data = await getSequencesData();

    // Find active sequence by slug
    const sequence = data.sequences.find(seq => seq.slug === slug && seq.state === "active");

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Get content data for URL lookups
    const contentData = getContentData();

    // Pre-calculate URLs for all posts
    const postUrls: Record<string, string> = {};
    const allPosts = sequence.sections
      ? sequence.sections.flatMap(section => section.posts)
      : sequence.posts || [];

    for (const post of allPosts) {
      // Use content_slug as the key - the API returns db field names
      const slug = post.content_slug || (post as any).slug;
      const type = post.content_type || (post as any).type;
      if (slug && type) {
        postUrls[slug] = getPostUrl(type as PostType, slug, contentData);
      }
    }

    // Transform sequence to expected format
    const transformedSequence = {
      ...sequence,
      posts: sequence.posts?.map(p => ({
        slug: p.content_slug,
        order: p.position,
        type: p.content_type,
        title: p.title,
        preview: p.preview,
        status: p.status
      })),
      sections: sequence.sections?.map(s => ({
        title: s.title,
        posts: s.posts.map(p => ({
          slug: p.content_slug,
          order: p.position,
          type: p.content_type,
          title: p.title,
          preview: p.preview,
          status: p.status
        }))
      }))
    };

    return NextResponse.json({ sequence: transformedSequence, postUrls });
  } catch (error) {
    console.error('Error fetching sequence:', error);
    return NextResponse.json({ error: 'Failed to fetch sequence' }, { status: 500 });
  }
}
