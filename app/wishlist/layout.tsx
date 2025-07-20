import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.wishlist

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
