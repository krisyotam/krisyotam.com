import { getNowData } from "@/lib/data"
import type { Metadata } from "next"
import { Suspense } from "react"
import NowClientPage from "./NowClientPage"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.now

export default async function NowPage() {
  const nowData = await getNowData()
  const nowEntries = nowData.now.filter(entry => entry.state === "active")

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NowClientPage nowEntries={nowEntries} />
    </Suspense>
  )
}

