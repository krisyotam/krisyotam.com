import type { Metadata } from "next"
import ShopClient from "./shop-client"
import { staticMetadata } from "@/lib/staticMetadata"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"

export const metadata: Metadata = staticMetadata.shop || {
  title: "Shop",
}

export default function ShopPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <PageHeader
          title="Shop"
          subtitle="Small goods and prints"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split("T")[0]}
          preview="A small shop of items, prints, and digital goods."
        />
      </div>

      <ShopClient />

      <PageDescription
        title="About the Shop"
        description="A small selection of physical and digital goods. Click an item to go to the payment page. Use the search or category filter to find items."
      />
    </div>
  )
}
