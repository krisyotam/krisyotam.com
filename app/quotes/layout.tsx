import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.quotes

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
