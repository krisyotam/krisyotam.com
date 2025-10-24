import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.globe

export default function GlobeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
