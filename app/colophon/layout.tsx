import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.colophon

export default function ColophonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
