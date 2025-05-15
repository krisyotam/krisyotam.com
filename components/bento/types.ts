export type BlockType = 'painting' | 'poem' | 'quote' | 'book' | 'movie' | 'other'

export interface BaseItem {
  id: string
  title: string
  category: string
  tags: string[]
  description?: string
  author: string
  blockType: BlockType
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

export type Item = PaintingItem | PoemItem | QuoteItem | BookItem | MovieItem | BaseItem 