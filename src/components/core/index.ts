/**
 * Core Components Barrel Export
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Central export point for all core components used across pages
 */

export { Header, PageHeader, PostHeader, CategoryHeader } from './header'
export type {
  HeaderProps,
  HeaderVariant,
  HeaderStatus,
  HeaderConfidence,
  PageHeaderProps,
  PostHeaderProps,
  CategoryHeaderProps
} from './header'
export { PageDescription } from './page-description'
export { Comments } from './comments'
export { Chat } from './chat'
export { Popups, UniversalLinkModal } from './popups'
export { Sidenotes } from './sidenotes'
export { TOC } from './toc'
export type { TOCItem, TOCProps } from './toc'
export { Footnotes } from './footnotes'
export {
  JsonLd,
  WebsiteJsonLd,
  PersonJsonLd,
  ArticleJsonLd,
  BreadcrumbJsonLd,
  ArticlePageJsonLd,
  HomePageJsonLd,
} from './SEO'
export { Survey } from './survey'
export type { SurveySchema, SurveyQuestion } from '@/lib/survey-parser'

// Moved from root
export { Citation } from './citation'
export { Bibliography } from './bibliography'
export { default as Dropcap } from './dropcap'
export { Poetry } from './poetry'
export { default as LinkIcon, ICONS_DATA } from './link-icon'
export { default as TimeStamp } from './time-stamp'
export { default as SimpleBib } from './simplebib'
export { Footer } from './footer'
export { ViewTracker } from './view-tracker'
export { default as RelatedPosts } from './related-posts'
export { SectionHeader, TraktSectionHeader } from './section-header'
