export type BlockType = 'painting' | 'poem' | 'quote' | 'book' | 'movie' | 'other'

export interface BaseItem {
  id: string
  title: string
  category: string
  tags: string[]
  description?: string
  author: string
  blockType: BlockType
  icon?: React.ComponentType
  color?: string
  theme?: Record<string, string>
}

export interface PaintingItem extends BaseItem {
  blockType: 'painting'
  imageUrl: string
  year?: number
  medium?: string
  dimensions?: string
}

export interface PoemItem extends BaseItem {
  blockType: 'poem'
  content: string
  year?: number
  collection?: string
}

export interface QuoteItem extends BaseItem {
  blockType: 'quote'
  context?: string
}

export interface BookItem extends BaseItem {
  blockType: 'book'
  imageUrl: string
  year?: number
  publisher?: string
}

export interface MovieItem extends BaseItem {
  blockType: 'movie'
  imageUrl: string
  year?: number
  runtime?: number
}

interface LinkItem extends BaseItem {
  type: "link"
  href: string
}

interface ProjectItem extends BaseItem {
  type: "project"
  image: string
  tags: string[]
  github?: string
  demo?: string
}

interface SocialItem extends BaseItem {
  type: "social"
  username: string
  platform: string
  url: string
}

interface ToolItem extends BaseItem {
  type: "tool"
  category: string
  url: string
}

interface ArticleItem extends BaseItem {
  type: "article"
  date: string
  url: string
  readingTime?: string
}

type Item = LinkItem | ProjectItem | SocialItem | ToolItem | BookItem | ArticleItem | PaintingItem | PoemItem | QuoteItem | MovieItem | BaseItem 