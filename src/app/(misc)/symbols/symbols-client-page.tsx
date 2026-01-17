'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Search, Grid3X3, List, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader, PageDescription } from '@/components/core'
import Link from 'next/link'

interface Symbol {
  id: number
  slug: string
  name: string
  symbol: string
  url: string | null
}

type ViewMode = 'grid' | 'list'

// Define categories with their slugs
const SYMBOL_CATEGORIES = [
  {
    name: "Greek Letters",
    slugs: [
      "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta",
      "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho",
      "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"
    ]
  },
  {
    name: "Mathematical Operators",
    slugs: [
      "infinity", "integral", "partial", "nabla", "sum", "product",
      "not-equal", "less-than-equal", "greater-than-equal", "approximately",
      "much-less", "much-greater", "plus-minus", "minus-plus", "square-root",
      "proportional"
    ]
  },
  {
    name: "Set Theory",
    slugs: [
      "element-of", "not-element-of", "subset", "proper-subset", "superset",
      "proper-superset", "union", "intersection", "empty-set", "complement"
    ]
  },
  {
    name: "Logic",
    slugs: [
      "implies", "equivalent", "for-all", "exists", "exists-unique",
      "therefore", "because", "logical-and", "logical-or", "logical-not",
      "xor", "nand", "nor", "models", "proves", "forces"
    ]
  },
  {
    name: "Geometric Symbols",
    slugs: [
      "angle", "parallel", "perpendicular", "triangle", "pentagram"
    ]
  },
  {
    name: "Hate Symbols",
    slugs: [
      "ku-klux-klan"
    ]
  }
] as const

export function SymbolsClient() {
  const [symbols, setSymbols] = useState<Symbol[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null)

  // Fetch symbols from API
  useEffect(() => {
    async function fetchSymbols() {
      try {
        const response = await fetch('/api/symbols')
        if (!response.ok) throw new Error('Failed to fetch symbols')
        const data = await response.json()
        setSymbols(data.symbols || [])
      } catch (error) {
        console.error('Error fetching symbols:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSymbols()
  }, [])

  // Create a map from slug to symbol for easy lookup
  const symbolMap = useMemo(() => {
    const map = new Map<string, Symbol>()
    symbols.forEach(s => map.set(s.slug, s))
    return map
  }, [symbols])

  // Get all slugs that are assigned to a category
  const assignedSlugs = useMemo(() => {
    const slugs = new Set<string>()
    SYMBOL_CATEGORIES.forEach(cat => cat.slugs.forEach(slug => slugs.add(slug)))
    return slugs
  }, [])

  // Filter symbols based on search
  const filteredSymbols = useMemo(() => {
    if (!searchTerm) return symbols
    const term = searchTerm.toLowerCase()
    return symbols.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.symbol.toLowerCase().includes(term) ||
      s.slug.toLowerCase().includes(term)
    )
  }, [symbols, searchTerm])

  // Get symbols for a category (filtered)
  const getSymbolsForCategory = (slugs: readonly string[]) => {
    return slugs
      .map(slug => symbolMap.get(slug))
      .filter((s): s is Symbol => s !== undefined)
      .filter(s => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()
        return s.name.toLowerCase().includes(term) ||
               s.symbol.toLowerCase().includes(term) ||
               s.slug.toLowerCase().includes(term)
      })
  }

  // Get miscellaneous symbols (not in any category)
  const miscSymbols = useMemo(() => {
    return filteredSymbols.filter(s => !assignedSlugs.has(s.slug))
  }, [filteredSymbols, assignedSlugs])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSymbol(text)
      setTimeout(() => setCopiedSymbol(null), 2000)
    } catch (err) {
      console.error('Failed to copy symbol:', err)
    }
  }

  const isImageSymbol = (symbol: string) => symbol.startsWith('http')

  const SymbolCard = ({ symbol }: { symbol: Symbol }) => (
    <Link href={`/symbols/${symbol.slug}`}>
      <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20 bg-muted/50 dark:bg-[hsl(var(--popover))] cursor-pointer aspect-square relative">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-mono mb-3 group-hover:scale-110 transition-transform">
            {isImageSymbol(symbol.symbol) ? (
              <img
                src={symbol.symbol}
                alt={symbol.name}
                className="w-12 h-12 object-contain"
              />
            ) : (
              symbol.symbol
            )}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {symbol.name}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              copyToClipboard(isImageSymbol(symbol.symbol) ? symbol.name : symbol.symbol)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )

  const SymbolListItem = ({ symbol }: { symbol: Symbol }) => (
    <Link href={`/symbols/${symbol.slug}`}>
      <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-mono bg-muted/50 rounded-md p-3 border min-w-[70px] text-center">
              {isImageSymbol(symbol.symbol) ? (
                <img
                  src={symbol.symbol}
                  alt={symbol.name}
                  className="w-10 h-10 object-contain mx-auto"
                />
              ) : (
                symbol.symbol
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{symbol.name}</h3>
              <p className="text-sm text-muted-foreground">{symbol.slug}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(isImageSymbol(symbol.symbol) ? symbol.name : symbol.symbol)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  const renderSymbolsSection = (categorySymbols: Symbol[], categoryName: string) => {
    if (categorySymbols.length === 0) return null

    return (
      <section key={categoryName} className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">{categoryName}</h2>
        <div className="border-t border-border mb-4" />
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categorySymbols.map((symbol) => (
              <SymbolCard key={symbol.slug} symbol={symbol} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categorySymbols.map((symbol) => (
              <SymbolListItem key={symbol.slug} symbol={symbol} />
            ))}
          </div>
        )}
      </section>
    )
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="py-24 text-center">Loading symbols...</div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader
        title="Symbols"
        subtitle="Mathematical, Scientific, and Logical Symbols"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="a comprehensive reference for symbols and their meanings"
        status="In Progress"
        confidence="likely"
        importance={6}
      />

      <div className="mt-8">
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* View toggle */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSymbols.length} of {symbols.length} symbols
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Copy Notification */}
        {copiedSymbol && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
            Copied "{copiedSymbol}" to clipboard!
          </div>
        )}

        {/* Render categories */}
        {SYMBOL_CATEGORIES.map((cat) =>
          renderSymbolsSection(getSymbolsForCategory(cat.slugs), cat.name)
        )}

        {/* Misc category for uncategorized symbols */}
        {renderSymbolsSection(miscSymbols, "Misc")}

        {/* No Results */}
        {filteredSymbols.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No symbols found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search term
            </p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>

      <PageDescription
        title="About Symbols"
        description="This comprehensive symbols reference contains mathematical, scientific, and logical symbols commonly used in academic and professional contexts. Each symbol includes its name, character, and optional reference URL. The collection covers Greek letters, mathematical operators, set theory symbols, logic symbols, and geometric notation."
      />
    </main>
  )
}
