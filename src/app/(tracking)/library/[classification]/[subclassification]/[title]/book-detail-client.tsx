'use client'

import React, { useState } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Share2, BookOpen, Calendar, Building, Hash, Tag, Globe, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { PostHeader } from "@/components/core"
import { Citation } from '@/components/core/citation'
import { Footer } from '@/components/core/footer'

type Book = {
  title: string
  slug: string
  authorName: string
  publisher: string
  yearPublished: string
  edition?: string
  isbn?: string
  pages?: string
  language: string
  series?: string
  volume?: string
  doi?: string
  url?: string
  description: string
  notes?: string
  tags?: string[]
  subjects?: string[]
  classification: string
  subClassification: string
  acquired?: string
  location?: string
  condition?: string
  format?: string
  citation?: string
  coverUrl?: string
}

interface BookDetailClientProps {
  book: Book
}

export function BookDetailClient({ book }: BookDetailClientProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  console.log("BookDetailClient - Received book:", book.title)
  console.log("BookDetailClient - Book slug:", book.slug)

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(item)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const shareBook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${book.title} - Library Reference`,
          text: `${book.title} by ${book.authorName} - ${book.description}`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(window.location.href, 'url')
    }
  }

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

  // Prepare tags for PostHeader
  const postTags = [
    ...(book.tags || []),
    ...(book.subjects || []),
    book.classification,
    book.subClassification,
    book.language
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Post Header */}        <PostHeader
          title={book.title}
          subtitle={`by ${book.authorName}`}
          start_date={book.yearPublished}
          end_date=""
          category={book.classification}
          tags={postTags}
          preview={book.description}
          backText="library"
          backHref="/library"
          status="Finished"
          confidence="certain"
          importance={7}
        />        {/* Book Display Section */}
        <div className="mb-8">
          <div className="flex items-stretch gap-3">
            <Card className="flex-shrink-0">
              <CardContent className="flex items-center justify-center p-6 h-full">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    width={80}
                    height={100}
                    className="rounded shadow-lg object-cover"
                    unoptimized={book.coverUrl?.includes('krisyotam.com')}
                  />
                ) : (
                  <div className="text-6xl text-primary">
                    <BookOpen className="w-16 h-16" />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex-1">
              <Card className="h-full">
                <CardContent className="space-y-3 pt-6 h-full">                  <div className="grid grid-cols-2 gap-2">
                    <CopyButton text={book.title} item="title">
                      Copy Title
                    </CopyButton>
                    <CopyButton text={book.authorName} item="author">
                      Copy Author
                    </CopyButton>
                    {book.isbn ? (
                      <CopyButton text={book.isbn} item="isbn">
                        Copy ISBN
                      </CopyButton>
                    ) : (
                      <div></div>
                    )}
                    <Button variant="outline" size="sm" onClick={shareBook} className="h-8">
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
        )}        {/* Content Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Details</CardTitle>
                  <CardDescription>
                    Technical information and identifiers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Publisher</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {book.publisher}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Year</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {book.yearPublished}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {book.isbn && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">ISBN</span>
                          <CopyButton text={book.isbn} item="isbn-detail">
                            Copy
                          </CopyButton>
                        </div>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {book.isbn}
                        </code>
                      </div>
                    </>
                  )}

                  {book.edition && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium">Edition</span>
                        <div className="mt-1">
                          <Badge variant="secondary">{book.edition}</Badge>
                        </div>
                      </div>
                    </>
                  )}

                  {book.pages && (
                    <div>
                      <span className="text-sm font-medium">Pages</span>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {book.pages} pages
                      </div>
                    </div>
                  )}

                  <Separator />
                  <div>
                    <span className="text-sm font-medium">Language</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Globe className="w-3 h-3" />
                        {book.language}
                      </Badge>
                    </div>
                  </div>

                  {book.series && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium">Series</span>
                        <div className="mt-1">
                          <Badge variant="secondary">{book.series}</Badge>
                          {book.volume && (
                            <Badge variant="outline" className="ml-2">
                              Vol. {book.volume}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {book.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{book.description}</p>
                  </CardContent>
                </Card>
              )}

              {book.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {book.notes}
                    </p>
                  </CardContent>
                </Card>              )}
            </div>

            {/* External Links */}
            {(book.url || book.doi) && (
              <Card>
                <CardHeader>
                  <CardTitle>External Links</CardTitle>
                  <CardDescription>
                    Additional resources and references
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {book.url && (
                      <Button variant="outline" size="sm" asChild className="w-full justify-start">
                        <a href={book.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Online
                        </a>
                      </Button>
                    )}
                    {book.doi && (
                      <Button variant="outline" size="sm" asChild className="w-full justify-start">
                        <a href={`https://doi.org/${book.doi}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          DOI: {book.doi}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                  <CardDescription>
                    Library classification and organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Classification</span>
                      <div className="mt-1">
                        <Badge variant="default">{book.classification}</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Sub-classification</span>
                      <div className="mt-1">
                        <Badge variant="secondary">{book.subClassification}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {book.subjects && book.subjects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                    <CardDescription>
                      Academic subjects and topics covered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {book.tags && book.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>
                      Keywords and descriptive tags
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>          </TabsContent>
        </Tabs>

        {/* Book Citation Display */}
        {book.citation && (
          <div className="mt-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Book Citation</CardTitle>
                <CardDescription>
                  Copy this citation for academic references
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="bg-muted/50 p-4 rounded-lg border mb-3">
                    <p className="text-sm font-mono leading-relaxed">
                      {book.citation}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <CopyButton text={book.citation} item="book-citation">
                      Copy Citation
                    </CopyButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Citation Component */}
        <div className="mt-12 mb-8">
          <Citation
            title={book.title}
            slug={book.slug}
            date={book.yearPublished}
            url={`https://krisyotam.com/library/${book.classification}/${book.subClassification}/${book.slug}`}
          />
        </div>

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  )
}