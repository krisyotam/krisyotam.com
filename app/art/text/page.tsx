import { Suspense } from "react"
import TextFeed from "@/components/art/text-feed"
import artTexts from "@/data/art-texts.json"

export default function TextPage() {
  return (
    <div>
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading updates...</div>}>
        <TextFeed entries={artTexts} />
      </Suspense>
    </div>
  )
}

