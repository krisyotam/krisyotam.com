import dynamicImport from 'next/dynamic'

const HomeWrapper = dynamicImport(() => import('../home-wrapper'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  ),
})

export const dynamic = "force-dynamic"

export default function GridPage() {
  return <HomeWrapper initialView="grid" />
} 