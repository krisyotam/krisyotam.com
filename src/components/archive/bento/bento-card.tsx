"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { 
  Item, 
  PaintingItem, 
  PoemItem, 
  QuoteItem,
  BookItem,
  MovieItem
} from "./types"
import { Badge } from "@/components/ui/badge"
import { PoemBox } from "@/components/content/verse"
import { Quote } from "@/components/typography/quote"
import Book from "@/components/archive/book"
import Frame from "@/components/typography/frame"

export default function BentoCard({ item }: { item: Item }) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent outline flash during view transitions
  const noOutlineStyle = {
    outline: 'none',
    backfaceVisibility: 'hidden', 
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)'
  } as React.CSSProperties

  const renderItemPreview = () => {
    switch (item.blockType) {
      case 'painting':
        return <PaintingPreview item={item as PaintingItem} />
      case 'poem':
        return <PoemPreview item={item as PoemItem} />
      case 'quote':
        return <QuotePreview item={item as QuoteItem} />
      case 'book':
        return <BookPreview item={item as BookItem} />
      case 'movie':
        return <MoviePreview item={item as MovieItem} />
      default:
        return <DefaultPreview item={item} />
    }
  }
  return (
    <>
      <div 
        className="group relative bg-card text-card-foreground shadow-sm transition-transform cursor-pointer h-full flex flex-col overflow-hidden hover:shadow-md"
        onClick={() => setIsOpen(true)}
        style={noOutlineStyle}
      >
        {renderItemPreview()}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm border">
          <UnifiedModal item={item} />
        </DialogContent>
      </Dialog>
    </>
  )
}

// Preview Components
function PaintingPreview({ item }: { item: PaintingItem }) {
  return (
    <>
      <div className="relative w-full h-48">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ outline: 'none' }}
          unoptimized={item.imageUrl?.includes('krisyotam.com')}
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
    </>
  )
}

function BookPreview({ item }: { item: BookItem }) {
  return (
    <>
      <div className="relative w-full h-48">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={item.imageUrl?.includes('krisyotam.com')}
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
    </>
  )
}

function MoviePreview({ item }: { item: MovieItem }) {
  return (
    <>
      <div className="relative w-full h-48">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={item.imageUrl?.includes('krisyotam.com')}
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
    </>
  )
}

function PoemPreview({ item }: { item: PoemItem }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
      <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
      <div className="line-clamp-4 text-sm mb-4 italic flex-grow">
        {item.content.split('\n').slice(0, 4).join('\n')}
        {item.content.split('\n').length > 4 && '...'}
      </div>
      <div className="flex flex-wrap gap-1 mt-auto">
        {item.tags.slice(0, 3).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
        ))}
      </div>
    </div>
  )
}

function QuotePreview({ item }: { item: QuoteItem }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="text-3xl text-muted-foreground mb-2">"</div>
      <p className="text-sm font-medium mb-4 flex-grow">{item.title}</p>
      <p className="text-sm text-muted-foreground">— {item.author}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {item.tags.slice(0, 3).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
        ))}
      </div>
    </div>
  )
}

function DefaultPreview({ item }: { item: Item }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
      <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
      {item.description && (
        <p className="text-sm line-clamp-3 mb-4 flex-grow">{item.description}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-auto">
        {item.tags.slice(0, 3).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
        ))}
      </div>
    </div>
  )
}

// Unified Modal Component for all item types
function UnifiedModal({ item }: { item: Item }) {
  // Common header section for all modal types
  const renderHeader = () => (
    <div className="p-6 border-b">
      <h2 className="text-2xl font-bold mb-1">{item.title}</h2>
      <p className="text-lg text-muted-foreground">{item.author}</p>
    </div>
  )

  // Type-specific content section
  const renderContent = () => {
    switch (item.blockType) {
      case 'painting':
        const paintingItem = item as PaintingItem
        return (
          <div className="flex flex-col">
            <div className="relative w-full h-[50vh]">
              <Image
                src={paintingItem.imageUrl || "/placeholder.svg"}
                alt={paintingItem.title}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized={paintingItem.imageUrl?.includes('krisyotam.com')}
              />
            </div>
            <div className="p-6">
              {item.description && <p className="mb-4">{item.description}</p>}
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                {paintingItem.year && <div><span className="font-medium">Year:</span> {paintingItem.year}</div>}
                {paintingItem.medium && <div><span className="font-medium">Medium:</span> {paintingItem.medium}</div>}
                {paintingItem.dimensions && <div><span className="font-medium">Dimensions:</span> {paintingItem.dimensions}</div>}
              </div>
            </div>
          </div>
        )
      
      case 'book':
        const bookItem = item as BookItem
        return (
          <div className="flex flex-col">
            <div className="relative w-full flex justify-center py-8">
              <Book
                cover={bookItem.imageUrl}
                name={bookItem.title}
                author={bookItem.author}
                link="#"
              />
            </div>
            <div className="p-6">
              {item.description && <p className="mb-4">{item.description}</p>}
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                {bookItem.year && <div><span className="font-medium">Year:</span> {bookItem.year}</div>}
                {bookItem.publisher && <div><span className="font-medium">Publisher:</span> {bookItem.publisher}</div>}
              </div>
            </div>
          </div>
        )

      case 'movie':
        const movieItem = item as MovieItem
        return (
          <div className="flex flex-col">
            <div className="relative w-full flex justify-center py-8">
              <Frame
                cover={movieItem.imageUrl}
                title={movieItem.title}
                creator={movieItem.author}
                link="#"
                year={movieItem.year}
              />
            </div>
            <div className="p-6">
              {item.description && <p className="mb-4">{item.description}</p>}
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                {movieItem.year && <div><span className="font-medium">Year:</span> {movieItem.year}</div>}
                {movieItem.runtime && (
                  <div>
                    <span className="font-medium">Runtime:</span> {Math.floor(movieItem.runtime / 60)}h {movieItem.runtime % 60}m
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'poem':
        const poemItem = item as PoemItem
        return (
          <div className="p-6">
            {item.description && <p className="mb-4">{item.description}</p>}
            <div className="my-6">
              <PoemBox>{poemItem.content}</PoemBox>
            </div>
            {(poemItem.year || poemItem.collection) && (
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                {poemItem.year && <div><span className="font-medium">Year:</span> {poemItem.year}</div>}
                {poemItem.collection && <div><span className="font-medium">Collection:</span> {poemItem.collection}</div>}
              </div>
            )}
          </div>
        )
      
      case 'quote':
        const quoteItem = item as QuoteItem
        return (
          <div className="p-6">
            <div className="my-6">
              <Quote author={quoteItem.author}>{quoteItem.title}</Quote>
            </div>
            {quoteItem.context && (
              <div className="mt-4 text-muted-foreground text-center">
                <p>{quoteItem.context}</p>
              </div>
            )}
          </div>
        )
      
      default:
        return (
          <div className="p-6">
            {item.description && <p className="mb-4">{item.description}</p>}
          </div>
        )
    }
  }

  // Common footer section with tags
  const renderFooter = () => (
    <div className="p-6 border-t">
      <div className="flex flex-wrap gap-2">
        {item.tags.map(tag => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </div>
  )
}