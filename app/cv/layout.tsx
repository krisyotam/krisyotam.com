import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.cv

export default function CVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
