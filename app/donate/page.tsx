"use client"

import { useState } from "react"
import { Copy, Check, DollarSign, Gift, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import SiteStickerCarousel from "@/components/site-sticker-carousel"
import supportThemData from "@/data/support-them.json"

const CRYPTO_ADDRESSES = [
  {
    name: "Bitcoin (BTC)",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
  {
    name: "Solana (SOL)",
    address: "3n1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
]

const BENTO_OPTIONS = [
  {
    name: "Cash App",
    icon: <DollarSign className="h-6 w-6 text-green-500" />,
    address: "$krisyotam",
    description: "Send support instantly via Cash App.",
  },
  {
    name: "Supplies (Wishlist)",
    icon: <Gift className="h-6 w-6 text-pink-500" />,
    description: "Send me supplies or gear from my wishlist.",
    action: (
      <Button asChild variant="outline" className="w-full mt-2">
        <a href="/wishlist" target="_blank" rel="noopener noreferrer">
          View Wishlist <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    ),
  },
]

const patreonData = {
  ownerName: "Kris Yotam",
  siteSticker: "https://i.postimg.cc/5yzs0wj0/krisyotam.jpg",
  siteUrl: "https://www.patreon.com/krisyotam",
  tags: ["Essays", "Critical Analysis", "Research"],
  description: "long term stable essays on krisyotam.com",
}

export default function DonatePage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <PageHeader
        title="Donate"
        subtitle="Support My Work"
        date={new Date().toISOString()}
        status="In Progress"
        confidence="certain"
        importance={8}
        preview="Your support helps me continue creating high-quality content and research."
      />

      <div className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Support My Work</h2>
        <p className="text-muted-foreground mb-6">
          If you enjoy my essays and research, consider supporting me on Patreon for exclusive content and early access.
        </p>
        <div className="w-full mx-auto">
          <SiteStickerCarousel sites={[patreonData]} />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Cryptocurrency Donations</h2>
        <p className="text-muted-foreground mb-6">
          I accept donations in various cryptocurrencies. Simply copy the address to send your contribution.
        </p>
        <div className="flex flex-col space-y-4">
          {CRYPTO_ADDRESSES.map((crypto) => (
            <div key={crypto.name} className="border border-border p-4 rounded-sm bg-card shadow-sm">
              <h3 className="text-sm font-medium mb-2">{crypto.name}</h3>
              <div className="flex items-center">
                <code className="text-xs bg-muted p-1.5 rounded-sm flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {crypto.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(crypto.address)}
                  className="ml-1 flex-shrink-0 h-7 w-7 p-0"
                >
                  {copied === crypto.address ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-16">
        {BENTO_OPTIONS.map((option) => (
          <div key={option.name} className="rounded-xl border bg-card p-6 flex flex-col items-center shadow-sm">
            <div className="mb-2">{option.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{option.name}</h3>
            <p className="text-muted-foreground text-sm mb-3 text-center">{option.description}</p>
            {option.address && (
              <div className="flex items-center w-full mb-2">
                <code className="text-xs bg-muted p-1.5 rounded-sm flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {option.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(option.address!)}
                  className="ml-1 flex-shrink-0 h-7 w-7 p-0"
                >
                  {copied === option.address ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
            {option.action}
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Support These Creators</h2>
        <p className="text-muted-foreground mb-6">
          Here are some other creators whose work I admire. Consider supporting them as well.
        </p>
        <SiteStickerCarousel sites={supportThemData} />
      </div>

      <div className="text-center mt-12 text-muted-foreground">
        <p className="mb-2">
          Thank you for your support! It helps me continue creating content and conducting research.
        </p>
        <p className="text-sm">
          For other donation methods or questions, please{" "}
          <a href="/contact" className="underline hover:text-foreground">
            contact me
          </a>
          .
        </p>
      </div>
    </div>
  )
}
