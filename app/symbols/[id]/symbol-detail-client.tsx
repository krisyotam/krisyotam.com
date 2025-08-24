'use client'

import React, { useState } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import symbolsData from '@/data/symbols.json'
import { PostHeader } from '@/components/post-header'
import { Citation } from '@/components/citation'
import { Footer } from '@/app/(content)/essays/components/footer'

type Symbol = {
  id: string
  name: string
  symbol: string
  isImage?: boolean
  category: string
  description: string
  unicodeValue: string | null
  htmlEntity: string | null
  contexts: string[]
  commonUses: string[]
  related: string[]
  examples: string[]
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
          text: `${symbol.name} (${symbol.symbol}) - ${symbol.description}`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(window.location.href, 'url')
    }
  }

  // Get related symbols
  const relatedSymbols = symbolsData.symbols.filter(s => 
    symbol.related.includes(s.id)
  )

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
          subtitle={`Symbol: ${symbol.symbol}`}
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          category={symbol.category}
          tags={symbol.contexts}
          preview={symbol.description}
          backText="symbols"
          backHref="/symbols"
          status="Finished"
          confidence="certain"
          importance={6}
        />        {/* Symbol Display Section */}
        <div className="mb-8">
          <div className="flex items-stretch gap-3">
            <Card className="flex-shrink-0">
              <CardContent className="flex items-center justify-center p-6 h-full">
                <div className="text-6xl font-mono">
                  {symbol.isImage ? (
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
                    <CopyButton text={symbol.isImage ? symbol.name : symbol.symbol} item="symbol">
                      Copy {symbol.isImage ? 'Name' : 'Symbol'}
                    </CopyButton>
                    {symbol.unicodeValue && (
                      <CopyButton text={symbol.unicodeValue} item="unicode">
                        Copy Unicode
                      </CopyButton>
                    )}
                    {symbol.htmlEntity && (
                      <CopyButton text={symbol.htmlEntity} item="html">
                        Copy HTML
                      </CopyButton>
                    )}
                    {symbol.isImage && (
                      <CopyButton text={symbol.symbol} item="image">
                        Copy Image URL
                      </CopyButton>
                    )}
                    <Button variant="outline" size="sm" onClick={shareSymbol}>
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
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

        {/* Content Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6">              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                  <CardDescription>
                    {symbol.isImage ? 'Image and metadata information' : 'Unicode and encoding information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {symbol.isImage ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Image URL</span>
                        <CopyButton text={symbol.symbol} item="image-url-detail">
                          Copy
                        </CopyButton>
                      </div>
                      <code className="text-sm bg-muted px-2 py-1 rounded break-all">
                        {symbol.symbol}
                      </code>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Unicode Value</span>
                          <CopyButton text={symbol.unicodeValue!} item="unicode-detail">
                            Copy
                          </CopyButton>
                        </div>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {symbol.unicodeValue}
                        </code>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">HTML Entity</span>
                          <CopyButton text={symbol.htmlEntity!} item="html-detail">
                            Copy
                          </CopyButton>
                        </div>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {symbol.htmlEntity}
                        </code>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div>
                    <span className="text-sm font-medium">Category</span>
                    <div className="mt-1">
                      <Badge variant="secondary">{symbol.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contexts</CardTitle>
                  <CardDescription>
                    Fields where this symbol is commonly used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {symbol.contexts.map((context) => (
                      <Badge key={context} variant="outline">
                        {context}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Uses</CardTitle>
                <CardDescription>
                  Typical applications and meanings of {symbol.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {symbol.commonUses.map((use, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Examples</CardTitle>
                <CardDescription>
                  Real-world examples showing {symbol.name} in context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {symbol.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Example {index + 1}
                        </span>
                        <CopyButton text={example} item={`example-${index}`}>
                          Copy
                        </CopyButton>
                      </div>
                      <code className="text-sm font-mono break-all">
                        {example}
                      </code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Related Symbols</CardTitle>
                <CardDescription>
                  Other symbols commonly used with {symbol.name}
                </CardDescription>
              </CardHeader>              <CardContent>
                {relatedSymbols.length > 0 ? (
                  <div className="grid gap-4">
                    {relatedSymbols.map((relatedSymbol) => (
                      <Link key={relatedSymbol.id} href={`/symbols/${relatedSymbol.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-mono bg-background rounded p-2 border flex-shrink-0">
                                {relatedSymbol.isImage ? (
                                  <img 
                                    src={relatedSymbol.symbol} 
                                    alt={relatedSymbol.name} 
                                    className="w-8 h-8 object-contain"
                                  />
                                ) : (
                                  relatedSymbol.symbol
                                )}
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <h4 className="font-medium truncate">{relatedSymbol.name}</h4>
                                <p className="text-sm text-muted-foreground truncate">
                                  {relatedSymbol.description}
                                </p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No related symbols found for {symbol.name}.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>        </Tabs>        {/* Citation Component */}
        <div className="mt-12 mb-8">
          <Citation
            title={symbol.name}
            slug={symbol.id}
            date="2025-05-28"
            url={`https://krisyotam.com/symbols/${symbol.id}`}
          />
        </div>

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  )
}
