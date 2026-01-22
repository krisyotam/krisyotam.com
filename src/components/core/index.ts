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
