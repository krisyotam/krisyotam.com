import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/utils/posts';

// Return a set of pre-defined values for static rendering
export async function GET(request: NextRequest) {
  try {
    // Get all posts for static generation
    const posts = await getAllPosts();
    
    // Use the first few posts as examples
    const exampleSlugs = posts.slice(0, 5).map(p => p.slug);
    
    // Create static response with debugging information
    return NextResponse.json({ 
      message: "This endpoint requires a slug parameter for dynamic functionality",
      note: "For production deployment, please visit the page directly with a slug",
      availableExamples: exampleSlugs.map(slug => `/api/og-debug?slug=${slug}`),
      totalPosts: posts.length
    });
  } catch (error) {
    console.error('Error in OG debug endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 