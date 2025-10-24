import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.ocs

export default function OcsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
