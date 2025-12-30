import dynamicImport from 'next/dynamic'
import { redirect } from 'next/navigation'

const HomeWrapper = dynamicImport(() => import('./home/home-wrapper'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  ),
})

export const dynamic = "force-dynamic"

export default function RootPage() {
  return <HomeWrapper />
}

