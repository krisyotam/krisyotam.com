'use client'

import React, { useState } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Share2, Film, Calendar, Building, Hash, Tag, Globe, MapPin, User, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { PostHeader } from "@/components/core"
import { Citation } from '@/components/citation'
import { Footer } from '@/app/(content)/essays/components/footer'

type Film = {
  id: string
  slug: string
  title: string
  director: string
  originalTitle?: string
  year: number
  country: string
  runtime: number
  genre: string[]
  posterUrl: string
  production: string
  collection: string
  language: string
  classification: string
  subClassification: string
}

interface FilmDetailClientProps {
  film: Film
}

export function FilmDetailClient({ film }: FilmDetailClientProps) {
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

  const shareFilm = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${film.title} - Library Reference`,
          text: `${film.title} (${film.year}) directed by ${film.director}`,
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
    ...film.genre,
    film.classification,
    film.subClassification,
    film.language,
    film.country,
    film.collection
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Post Header */}
        <PostHeader
          title={film.title}
          subtitle={`directed by ${film.director}`}
          start_date={film.year.toString()}
          end_date=""
          category={film.classification}
          tags={postTags}
          preview={`${film.title} (${film.year}) is a ${film.genre.join(", ").toLowerCase()} film directed by ${film.director}${film.originalTitle ? `, originally titled "${film.originalTitle}"` : ''}.`}
          backText="library"
          backHref="/library"
          status="Finished"
          confidence="certain"
          importance={7}
        />

        {/* Film Display Section */}
        <div className="mb-8">
          <div className="flex items-stretch gap-3">
            <Card className="flex-shrink-0">
              <CardContent className="flex items-center justify-center p-6 h-full">
                <Image
                  src={film.posterUrl}
                  alt={`Poster of ${film.title}`}
                  width={80}
                  height={120}
                  className="rounded shadow-lg object-cover"
                  unoptimized={film.posterUrl?.includes('krisyotam.com')}
                />
              </CardContent>
            </Card>
            
            <div className="flex-1">
              <Card className="h-full">
                <CardContent className="space-y-3 pt-6 h-full">
                  <div className="grid grid-cols-2 gap-2">
                    <CopyButton text={film.title} item="title">
                      Copy Title
                    </CopyButton>
                    <CopyButton text={film.director} item="director">
                      Copy Director
                    </CopyButton>
                    <CopyButton text={`${film.title} (${film.year})`} item="citation">
                      Copy Citation
                    </CopyButton>
                    <Button variant="outline" size="sm" onClick={shareFilm} className="h-8">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Film Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Year:</span>
                    <span className="text-sm">{film.year}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Runtime:</span>
                    <span className="text-sm">{film.runtime} minutes</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Country:</span>
                    <span className="text-sm">{film.country}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Language:</span>
                    <span className="text-sm">{film.language}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Production:</span>
                    <span className="text-sm">{film.production}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Collection:</span>
                    <span className="text-sm">{film.collection}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classification" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Library Classification
                </CardTitle>
                <CardDescription>
                  Library of Congress Classification System
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Classification:</span>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-sm">{film.classification}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(film.classification, 'classification')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedItem === 'classification' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subclassification:</span>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-sm">{film.subClassification}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(film.subClassification, 'subclassification')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedItem === 'subclassification' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>P - Language and Literature:</strong> This classification covers works in language, literature, and film studies.
                  </p>
                  <p className="mt-2">
                    <strong>PN1995 - Motion Pictures:</strong> Specifically for film and cinema studies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Footer />
      </div>
    </div>
  )
}
