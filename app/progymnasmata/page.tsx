// app/progymnasmata/page.tsx
import type { Metadata } from "next"
import { ProgymnasmataClient } from "./progymnasmata-client"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.progymnasmata

export default function ProgymnasmataPage() {
  return <ProgymnasmataClient />
}
