import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SymbolDetailClient } from './symbol-detail-client'
import symbolsData from '@/data/symbols.json'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const symbol = symbolsData.symbols.find(s => s.id === params.id)
  
  if (!symbol) {
    return {
      title: 'Symbol Not Found',
      description: 'The requested symbol could not be found.',
    }
  }

  return {
    title: `${symbol.name} (${symbol.symbol}) | Symbol Reference`,
    description: `Learn about ${symbol.name} symbol (${symbol.symbol}) - ${symbol.description}. Includes usage examples, contexts, and related symbols.`,
    keywords: `${symbol.name}, ${symbol.symbol}, ${symbol.category}, ${symbol.contexts.join(', ')}, mathematical symbol, unicode`,
    openGraph: {
      title: `${symbol.name} Symbol Reference`,
      description: symbol.description,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  return symbolsData.symbols.map((symbol) => ({
    id: symbol.id,
  }))
}

export default function SymbolDetailPage({ params }: Props) {
  const symbol = symbolsData.symbols.find(s => s.id === params.id)
  
  if (!symbol) {
    notFound()
  }

  return <SymbolDetailClient symbol={symbol} />
}
