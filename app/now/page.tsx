import { getNowData } from "@/lib/data"
import type { Metadata } from "next"
import NowClientPage from "./NowClientPage"

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm focused on right now",
}

export default async function NowPage() {
  const nowData = await getNowData()
  const nowEntries = nowData.now.filter(entry => entry.state === "active")

  return <NowClientPage nowEntries={nowEntries} />
}

