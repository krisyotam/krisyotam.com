import { Metadata } from 'next'
import { SymbolsClient } from './symbols-client-page'
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.symbols

export default function SymbolsPage() {
  return <SymbolsClient />
}
