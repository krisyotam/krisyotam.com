import { ProgymnasmataClient } from "../progymnasmata-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Progymnasmata | Kris Yotam",
  description: "A collection of rhetorical exercises in the classical tradition, exploring various forms of composition and argumentation.",
}

interface PageProps {
  params: { type: string }
}

export default function ProgymnasmataTypePage({ params }: PageProps) {
  return <ProgymnasmataClient initialTypeFilter={params.type} />
} 