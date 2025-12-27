import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.archive

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
