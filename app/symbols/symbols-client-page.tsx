'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Grid3X3, List, Copy, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { PageDescription } from '@/components/posts/typography/page-description'
import Link from 'next/link'
import symbolsData from '@/data/symbols.json'

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

type ViewMode = 'grid' | 'list'

export function SymbolsClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedContext, setSelectedContext] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null)

  const symbols: Symbol[] = symbolsData.symbols

  // Get unique categories and contexts
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(symbols.map(s => s.category)))]
  }, [symbols])

  const contexts = useMemo(() => {
    const allContexts = symbols.flatMap(s => s.contexts)
    return ['all', ...Array.from(new Set(allContexts))]
  }, [symbols])

  // Filter symbols based on search and filters
  const filteredSymbols = useMemo(() => {
    return symbols.filter(symbol => {
      const matchesSearch = searchTerm === '' || 
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.symbol.includes(searchTerm) ||
        symbol.commonUses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase())) ||
        symbol.contexts.some(context => context.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || symbol.category === selectedCategory
      
      const matchesContext = selectedContext === 'all' || symbol.contexts.includes(selectedContext)

      return matchesSearch && matchesCategory && matchesContext
    })
  }, [symbols, searchTerm, selectedCategory, selectedContext])

  const copyToClipboard = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol)
      setCopiedSymbol(symbol)
      setTimeout(() => setCopiedSymbol(null), 2000)    } catch (err) {
      console.error('Failed to copy symbol:', err)
    }
  }
  const SymbolCard = ({ symbol }: { symbol: Symbol }) => (
    <Link href={`/symbols/${symbol.id}`}>
      <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20 bg-muted/50 dark:bg-[hsl(var(--popover))] cursor-pointer aspect-square">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-mono mb-3 group-hover:scale-110 transition-transform">
            {symbol.isImage ? (
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
              copyToClipboard(symbol.isImage ? symbol.name : symbol.symbol)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button></CardContent>
      </Card>
    </Link>
  )
  const SymbolListItem = ({ symbol }: { symbol: Symbol }) => (
    <Link href={`/symbols/${symbol.id}`}>
      <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-mono bg-muted/50 rounded-md p-3 border min-w-[70px] text-center">
              {symbol.isImage ? (
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
              <p className="text-sm text-muted-foreground">{symbol.category}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  copyToClipboard(symbol.isImage ? symbol.name : symbol.symbol)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
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
        {/* Search bar on one row */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols, names, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Filters below */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground">Category:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="context-filter" className="text-sm text-muted-foreground">Context:</label>
            <Select value={selectedContext} onValueChange={setSelectedContext}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Context" />
              </SelectTrigger>
              <SelectContent>
                {contexts.map((context) => (
                  <SelectItem key={context} value={context}>
                    {context === 'all' ? 'All' : context}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
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

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSymbols.length} of {symbols.length} symbols
          </p>
        </div>

        {/* Copy Notification */}
        {copiedSymbol && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
            Copied "{copiedSymbol}" to clipboard!
          </div>
        )}        {/* Symbols Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSymbols.map((symbol) => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSymbols.map((symbol) => (
              <SymbolListItem key={symbol.id} symbol={symbol} />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredSymbols.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No symbols found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search term or filters
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedContext('all')
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>        )}
      </div>

      {/* Page Description Component */}
      <PageDescription
        title="About Symbols"
        description="This comprehensive symbols reference contains over 50 mathematical, scientific, and logical symbols commonly used in academic and professional contexts. Each symbol includes detailed information about its Unicode value, HTML entity, usage contexts, and practical examples. The collection covers Greek letters (α, β, γ, etc.), mathematical operators (∫, ∂, ∇, ∑, ∏), set theory symbols (∈, ⊆, ∪, ∩), logic symbols (∀, ∃, ∧, ∨, →), and geometric notation (∠, ∥, ⊥). You can search symbols by name, description, or context, filter by category or usage area, and switch between grid and list views. Each symbol page provides comprehensive details including technical specifications, common uses across different fields, related symbols, and real-world examples. This resource is designed for students, researchers, educators, and professionals who need quick access to accurate symbol information and proper notation standards."
      />
    </main>
  )
}
