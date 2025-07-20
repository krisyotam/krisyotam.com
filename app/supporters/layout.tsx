import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.supporters

export default function SupportersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
