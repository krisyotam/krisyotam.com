'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface BlogPostMetaProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

/**
 * Injects additional meta tags directly into the document head
 * This is a client component to ensure meta tags are properly rendered
 * for social media platforms that might have trouble with Next.js's default metadata
 */
export function BlogPostMeta({ title, description, imageUrl, url }: BlogPostMetaProps) {
  useEffect(() => {
    // Add direct meta tags to the head
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:image:url');
    meta.setAttribute('content', imageUrl);
    document.head.appendChild(meta);
    
    // Inject prefetch links to help with image loading
    const link = document.createElement('link');
    link.setAttribute('rel', 'prefetch');
    link.setAttribute('href', imageUrl);
    link.setAttribute('as', 'image');
    document.head.appendChild(link);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(link);
    };
  }, [imageUrl]);
  
  return null;
} 