import dynamicImport from 'next/dynamic'
import { staticMetadata } from '@/lib/staticMetadata'
import type { Metadata } from 'next'

export const metadata: Metadata = staticMetadata.grid

const HomeWrapper = dynamicImport(() => import('../home-wrapper'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  ),
})

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour
export const fetchCache = 'force-cache'

export default function GridPage() {
  return <HomeWrapper initialView="grid" />
}