/**
 * =============================================================================
 * SEO Components - JSON-LD Structured Data
 * =============================================================================
 *
 * Components for injecting JSON-LD structured data into pages.
 * Helps search engines understand content for rich snippets.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import {
  generateWebsiteJsonLd,
  generatePersonJsonLd,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo'

// =============================================================================
// Generic JSON-LD Script Component
// =============================================================================

interface JsonLdProps {
  data: object
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// =============================================================================
// Schema Components
// =============================================================================

export function WebsiteJsonLd() {
  return <JsonLd data={generateWebsiteJsonLd()} />
}

export function PersonJsonLd() {
  return <JsonLd data={generatePersonJsonLd()} />
}

interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  tags?: string[]
  section?: string
  wordCount?: number
}

export function ArticleJsonLd(props: ArticleJsonLdProps) {
  return <JsonLd data={generateArticleJsonLd(props)} />
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return <JsonLd data={generateBreadcrumbJsonLd(items)} />
}

// =============================================================================
// Page-Level Components
// =============================================================================

interface ArticlePageJsonLdProps extends ArticleJsonLdProps {
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function ArticlePageJsonLd({ breadcrumbs, ...articleProps }: ArticlePageJsonLdProps) {
  return (
    <>
      <ArticleJsonLd {...articleProps} />
      {breadcrumbs && breadcrumbs.length > 0 && <BreadcrumbJsonLd items={breadcrumbs} />}
    </>
  )
}

export function HomePageJsonLd() {
  return (
    <>
      <WebsiteJsonLd />
      <PersonJsonLd />
    </>
  )
}
