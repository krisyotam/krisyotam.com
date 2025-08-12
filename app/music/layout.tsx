import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.music

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
