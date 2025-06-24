import { Metadata } from 'next'
import { SymbolsClient } from './symbols-client-page'

export const metadata: Metadata = {
  title: 'Symbols | Mathematical & Scientific Notation Reference',
  description: 'Comprehensive reference for mathematical, scientific, and logical symbols. Browse by category, search by name, and explore detailed explanations with examples.',
  keywords: 'mathematical symbols, Greek letters, operators, set theory, logic symbols, unicode, reference',
  openGraph: {
    title: 'Symbols Reference - Mathematical & Scientific Notation',
    description: 'Complete guide to mathematical and scientific symbols with categories, examples, and usage contexts.',
    type: 'website',
  },
}

export default function SymbolsPage() {
  return <SymbolsClient />
}
