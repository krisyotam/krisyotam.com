/**
 * =============================================================================
 * SEO Utilities
 * =============================================================================
 *
 * Centralized SEO utilities for metadata generation, JSON-LD structured data,
 * and Open Graph optimization.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import type { Metadata } from 'next'

// =============================================================================
// Site Configuration
// =============================================================================

export const siteConfig = {
  name: 'Kris Yotam',
  title: 'Kris Yotam',
  description: 'Ideas, works, and reflections of a contemporary polymath',
  url: 'https://krisyotam.com',
  ogImage: 'https://krisyotam.com/og/default',
  locale: 'en_US',
  creator: '@krisyotam',
  author: {
    name: 'Kris Yotam',
    url: 'https://krisyotam.com',
    email: 'krisyotam@pm.me',
  },
  links: {
    twitter: 'https://x.com/krisyotam',
    github: 'https://github.com/krisyotam',
  },
  keywords: [
    'Kris Yotam',
    'polymath',
    'essays',
    'mathematics',
    'philosophy',
    'technology',
    'writing',
  ],
} as const

// =============================================================================
// Metadata Helpers
// =============================================================================

interface PageMetadataOptions {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  section?: string
  noIndex?: boolean
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description = siteConfig.description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = [siteConfig.author.name],
    tags = [],
    section,
    noIndex = false,
  } = options

  const ogImage = image || `${siteConfig.url}/og?title=${encodeURIComponent(title)}`
  const canonicalUrl = url || siteConfig.url

  const metadata: Metadata = {
    title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
    description,
    keywords: [...siteConfig.keywords, ...tags],
    authors: authors.map(name => ({ name })),
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      types: {
        'application/rss+xml': `${siteConfig.url}/feed.xml`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        tags,
        section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.creator,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }

  return metadata
}

// =============================================================================
// JSON-LD Structured Data Generators
// =============================================================================

export interface JsonLdWebsite {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  description: string
  url: string
  author: JsonLdPerson
  potentialAction?: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

export interface JsonLdPerson {
  '@context'?: 'https://schema.org'
  '@type': 'Person'
  name: string
  url: string
  email?: string
  sameAs?: string[]
  jobTitle?: string
  description?: string
  image?: string
}

export interface JsonLdArticle {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  author: JsonLdPerson
  publisher: JsonLdOrganization
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  keywords?: string[]
  articleSection?: string
  wordCount?: number
}

export interface JsonLdOrganization {
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
}

export interface JsonLdBreadcrumb {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export function generateWebsiteJsonLd(): JsonLdWebsite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: generatePersonJsonLd(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generatePersonJsonLd(): JsonLdPerson {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    email: siteConfig.author.email,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
    jobTitle: 'Polymath',
    description: siteConfig.description,
  }
}

export function generateArticleJsonLd(options: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  tags?: string[]
  section?: string
  wordCount?: number
}): JsonLdArticle {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    url: options.url,
    image: options.image,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/favicon.png`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
    keywords: options.tags,
    articleSection: options.section,
    wordCount: options.wordCount,
  }
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): JsonLdBreadcrumb {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// =============================================================================
// Content Type Helpers
// =============================================================================

export const contentTypes = [
  'blog',
  'essays',
  'fiction',
  'news',
  'notes',
  'ocs',
  'papers',
  'progymnasmata',
  'reviews',
  'sequences',
  'verse',
] as const

export type ContentType = (typeof contentTypes)[number]

export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    blog: 'Blog',
    essays: 'Essays',
    fiction: 'Fiction',
    news: 'News',
    notes: 'Notes',
    ocs: 'Original Characters',
    papers: 'Papers',
    progymnasmata: 'Progymnasmata',
    reviews: 'Reviews',
    sequences: 'Sequences',
    verse: 'Verse',
  }
  return labels[type]
}

// =============================================================================
// URL Helpers
// =============================================================================

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.url}${cleanPath}`
}

export function getOgImageUrl(title: string, type?: string): string {
  const params = new URLSearchParams({ title })
  if (type) params.set('type', type)
  return `${siteConfig.url}/og?${params.toString()}`
}
