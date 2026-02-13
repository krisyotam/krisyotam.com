"use client"

import { Box } from "@/components/typography/box"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function Hosting() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const services = [
    {
      name: "deSEC (DNS)",
      addresses: ["krisyotam.com", "krisyotam.net"],
      status: "Active"
    },
    {
      name: "DOH dns (with filtering)",
      addresses: ["krisyotam.com", "krisyotam.net"],
      status: "Active"
    },
    {
      name: "IPFS",
      addresses: ["krisyotam.eth"],
      status: "Active"
    },
    {
      name: "STARGATE (my personal server)",
      addresses: ["krisyotam.com", "krisyotam.com/doc", "git.krisyotam.com", "notes.krisyotam.com"],
      status: "Active"
    }
  ]

  const torServices = [
    {
      site: "krisyotam.com",
      address: "csuci2mrgl2dh54avsbd5q4mmwtaaybx3lakva3qy3l242lkzrrr5xqd.onion"
    },
    {
      site: "notes.krisyotam.com",
      address: "7e3j77iotv6cap5tktskf6exrfzqsnj7herossbltv27tiqsq7uhnuid.onion"
    }
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Publicly hosted services that I maintain and operate:
      </p>

      <div className="space-y-3">
        {services.map((service, index) => (
          <Box key={index} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{service.status}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.addresses.map((address, addressIndex) => (
                <div key={addressIndex} className="flex items-center gap-2 bg-background border border-border px-3 py-2">
                  <span className="text-xs font-mono text-foreground">{address}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-secondary"
                    onClick={() => copyToClipboard(address)}
                  >
                    {copiedAddress === address ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </Box>
        ))}

        {/* Tor Hidden Services */}
        <Box className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Tor Hidden Services</span>
            </div>
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <div className="space-y-3">
            {torServices.map((tor, index) => (
              <div key={index} className="space-y-1">
                <span className="text-xs text-muted-foreground">{tor.site}</span>
                <div className="flex items-center gap-2 bg-background border border-border px-3 py-2">
                  <span className="text-xs font-mono text-foreground break-all">{tor.address}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-secondary flex-shrink-0"
                    onClick={() => copyToClipboard(tor.address)}
                  >
                    {copiedAddress === tor.address ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </div>
    </div>
  )
}
