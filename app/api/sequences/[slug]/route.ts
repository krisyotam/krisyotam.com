import { NextResponse } from 'next/server';
import sequencesData from '@/data/sequences/sequences.json';
import essaysData from '@/data/essays/essays.json';
import notesData from '@/data/notes/notes.json';
import papersData from '@/data/papers/papers.json';
import reviewsData from '@/data/reviews/reviews.json';
import fictionData from '@/data/fiction/fiction.json';
import verseData from '@/data/verse/verse.json';
import { Sequence, SequencesData, PostType } from '@/types/sequences';

interface Params {
  slug: string;
}

// Helper function to get post URL by looking up category from data
function getPostUrl(type: PostType, slug: string): string {
  let category = '';
  
  try {
    switch (type) {
      case 'essay':
        const essay = (essaysData as any).essays?.find((e: any) => e.slug === slug);
        if (essay) category = essay.category;
        return category ? `/essays/${category}/${slug}` : `/essays/unknown/${slug}`;
        
      case 'note':
        const note = (notesData as any[]).find((n: any) => n.slug === slug);
        if (note) category = note.category.toLowerCase().replace(/\s+/g, "-");
        return category ? `/notes/${category}/${slug}` : `/notes/unknown/${slug}`;
        
      case 'paper':
        const paper = (papersData as any).papers?.find((p: any) => p.slug === slug);
        if (paper) category = paper.category.toLowerCase().replace(/\s+/g, "-");
        return category ? `/papers/${category}/${slug}` : `/papers/unknown/${slug}`;
        
      case 'review':
        const review = (reviewsData as any).reviews?.find((r: any) => r.slug === slug);
        if (review) category = review.category?.toLowerCase().replace(/\s+/g, "-") || 'general';
        return category ? `/reviews/${category}/${slug}` : `/reviews/unknown/${slug}`;
        
      case 'fiction':
        const fiction = (fictionData as any).fiction?.find((f: any) => f.slug === slug);
        if (fiction) category = fiction.category?.toLowerCase().replace(/\s+/g, "-") || 'general';
        return category ? `/fiction/${category}/${slug}` : `/fiction/unknown/${slug}`;

      case 'verse':
        const verseItem = (verseData as any[]).find((v: any) => v.slug === slug);
        if (verseItem) category = verseItem.category?.toLowerCase().replace(/\s+/g, "-") || 'general';
        return category ? `/verse/${category}/${slug}` : `/verse/unknown/${slug}`;
        
      default:
        return `/unknown/${slug}`;
    }
  } catch (error) {
    console.error('Error getting URL for', type, slug, error);
    const typePath = type === 'lecture-note' ? 'lecture-notes' : `${type}s`;
    return `/${typePath}/unknown/${slug}`;
  }
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = params;
    const data = sequencesData as SequencesData;
    
    const sequence = data.sequences.find(seq => seq.slug === slug && seq.state === "active");
    
    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Pre-calculate URLs for all posts
    const postUrls: Record<string, string> = {};
    const allPosts = sequence.sections 
      ? sequence.sections.flatMap(section => section.posts)
      : sequence.posts || [];
      
    for (const post of allPosts) {
      postUrls[post.slug] = getPostUrl(post.type, post.slug);
    }
    
    return NextResponse.json({ sequence, postUrls });
  } catch (error) {
    console.error('Error fetching sequence:', error);
    return NextResponse.json({ error: 'Failed to fetch sequence' }, { status: 500 });
  }
}
