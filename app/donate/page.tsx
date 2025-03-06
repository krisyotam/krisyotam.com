"use client"

import { useState, useEffect } from "react"
import { Bitcoin, Wallet2 } from "lucide-react"
import cryptocurrenciesData from "../../data/cryptocurrencies.json"
import { Button } from "@/components/ui/button"
import { Link } from "@radix-ui/react-navigation-menu"

interface Cryptocurrency {
  name: string
  symbol: string
  address: string
}

const getCryptoIcon = (symbol: string) => {
  switch (symbol.toUpperCase()) {
    case "BTC":
      return Bitcoin
    default:
      return Wallet2
  }
}

export default function DonatePage() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCryptocurrencies(cryptocurrenciesData.cryptocurrencies)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <header className="mb-16">
        </header>
        <p className="mb-8 text-muted-foreground">
          If you find my content valuable, consider supporting my work with a crypto donation. Your contribution helps
          me continue creating and sharing knowledge.
        </p>
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            If you'd like to purchase something from my wishlist and have it shipped directly to me, you can send it to the following address:
          </p>
          <p className="text-sm font-mono break-all text-foreground">
            [Your Shipping Address Here]
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cryptocurrencies.map((crypto) => {
            const Icon = getCryptoIcon(crypto.symbol)
            return (
              <div key={crypto.symbol} className="p-6 bg-card rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 mr-2 text-foreground" />
                  <h2 className="text-xl font-semibold text-foreground">{crypto.name}</h2>
                </div>
                <p className="text-sm mb-2 text-muted-foreground">Address:</p>
                <p className="text-xs font-mono break-all text-foreground">{crypto.address}</p>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center my-6">
          <a href="/wishlist" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 rounded">
            View My Wishlist
          </a>
        </div>
      </div>
    </div>
  )
}
