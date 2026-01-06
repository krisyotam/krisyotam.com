import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SymbolDetailClient } from './symbol-detail-client'
import { getSymbolBySlug, getAllSymbols } from '@/lib/reference-db'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const symbol = getSymbolBySlug(params.id)

  if (!symbol) {
    return {
      title: 'Symbol Not Found',
      description: 'The requested symbol could not be found.',
    }
  }

  return {
    title: `${symbol.name} (${symbol.symbol}) | Symbol Reference`,
    description: `Learn about the ${symbol.name} symbol (${symbol.symbol}).`,
    keywords: `${symbol.name}, ${symbol.symbol}, mathematical symbol, unicode`,
    openGraph: {
      title: `${symbol.name} Symbol Reference`,
      description: `The ${symbol.name} symbol: ${symbol.symbol}`,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const symbols = getAllSymbols()
  return symbols.map((symbol) => ({
    id: symbol.slug,
  }))
}

export default async function SymbolDetailPage(props: Props) {
  const params = await props.params;
  const symbol = getSymbolBySlug(params.id)

  if (!symbol) {
    notFound()
  }

  return <SymbolDetailClient symbol={symbol} />
}
