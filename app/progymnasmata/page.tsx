// app/progymnasmata/page.tsx
import type { Metadata } from "next"
import { ProgymnasmataClient } from "./progymnasmata-client"

export const metadata: Metadata = {
  title: "Progymnasmata | Kris Yotam",
  description:
    "A collection of rhetorical exercises in the classical tradition, exploring various forms of composition and argumentation.",
}

export default function ProgymnasmataPage() {
  return <ProgymnasmataClient />
}
