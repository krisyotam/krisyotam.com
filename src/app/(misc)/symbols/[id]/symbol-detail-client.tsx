'use client'

import React, { useState } from 'react'
import { Copy, Check, Share2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { PostHeader } from "@/components/core"
import { Citation } from '@/components/citation'
import { Footer } from '@/app/(content)/essays/components/footer'

interface Symbol {
  id: number
  slug: string
  name: string
  symbol: string
  url: string | null
}

interface SymbolDetailClientProps {
  symbol: Symbol
}

export function SymbolDetailClient({ symbol }: SymbolDetailClientProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(item)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const shareSymbol = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${symbol.name} Symbol Reference`,
          text: `${symbol.name} (${symbol.symbol})`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(window.location.href, 'url')
    }
  }

  const isImageSymbol = symbol.symbol.startsWith('http')

  const CopyButton = ({ text, item, children }: { text: string, item: string, children: React.ReactNode }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, item)}
      className="h-8"
    >
      {copiedItem === item ? (
        <Check className="h-3 w-3 mr-1" />
      ) : (
        <Copy className="h-3 w-3 mr-1" />
      )}
      {children}
    </Button>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Post Header */}
        <PostHeader
          title={symbol.name}
          subtitle={`Symbol: ${isImageSymbol ? '(image)' : symbol.symbol}`}
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          category="Symbols"
          tags={[]}
          preview={`The ${symbol.name} symbol`}
          backText="symbols"
          backHref="/symbols"
          status="Finished"
          confidence="certain"
          importance={6}
        />

        {/* Symbol Display Section */}
        <div className="mb-8">
          <div className="flex items-stretch gap-3">
            <Card className="flex-shrink-0">
              <CardContent className="flex items-center justify-center p-6 h-full">
                <div className="text-6xl font-mono">
                  {isImageSymbol ? (
                    <img
                      src={symbol.symbol}
                      alt={symbol.name}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    symbol.symbol
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex-1">
              <Card className="h-full">
                <CardContent className="space-y-3 pt-6 h-full">
                  <div className="grid grid-cols-2 gap-2">
                    <CopyButton text={isImageSymbol ? symbol.name : symbol.symbol} item="symbol">
                      Copy {isImageSymbol ? 'Name' : 'Symbol'}
                    </CopyButton>
                    {isImageSymbol && (
                      <CopyButton text={symbol.symbol} item="image">
                        Copy Image URL
                      </CopyButton>
                    )}
                    <Button variant="outline" size="sm" onClick={shareSymbol}>
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    {symbol.url && (
                      <Link href={symbol.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Reference
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Copy Notification */}
        {copiedItem && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
            Copied to clipboard!
          </div>
        )}

        {/* Symbol Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-lg">{symbol.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Slug</dt>
                <dd className="font-mono text-sm">{symbol.slug}</dd>
              </div>
              {symbol.url && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Reference URL</dt>
                  <dd>
                    <Link href={symbol.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {symbol.url}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Citation Component */}
        <div className="mt-12 mb-8">
          <Citation
            title={symbol.name}
            slug={symbol.slug}
            date="2025-05-28"
            url={`https://krisyotam.com/symbols/${symbol.slug}`}
          />
        </div>

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  )
}
