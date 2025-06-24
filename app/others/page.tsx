// app/others/page.tsx
import type { Metadata } from "next"
import { OthersClient } from "./others-client"

export const metadata: Metadata = {
  title: "Others | Kris Yotam",
  description:
    "A curated collection of websites and authors that inspire and inform.",
}

export default function OthersPage() {
  return <OthersClient />
} 