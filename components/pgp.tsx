"use client"

import { Card } from "@/components/ui/card"
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PgpProps {
  email: string
  fingerprint: string
  publicKey: string
  mirror?: string
}

export default function PGP({ email, fingerprint, publicKey, mirror }: PgpProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  // Format the public key for display with proper line breaks
  const formatPublicKey = (key: string) => {
    // Split the key into chunks of 64 characters for display
    const chunkSize = 64
    const chunks = []

    for (let i = 0; i < key.length; i += chunkSize) {
      chunks.push(key.substring(i, i + chunkSize))
    }

    return chunks.join("\n")
  }

  return (
    <div className="!flex !flex-col !gap-4 !w-full">
      {/* Contact Info Bento */}
      <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800">
        <div className="!flex !flex-col !gap-2">
          <div className="!flex !items-start !gap-2">
            <div className="!text-muted-foreground dark:!text-zinc-400">
              <span className="!inline-flex !items-center">
                <svg viewBox="0 0 24 24" className="!h-4 !w-4 !mr-2" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email:
              </span>
            </div>
            <div className="!flex !items-center !gap-2">
              <a href={`mailto:${email}`} className="!text-foreground dark:!text-zinc-100 hover:!underline">
                {email}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="!h-6 !w-6 !text-muted-foreground dark:!text-zinc-400 hover:!text-foreground dark:hover:!text-zinc-100"
                onClick={() => copyToClipboard(email, "email")}
              >
                <Copy className="!h-3.5 !w-3.5" />
                <span className="!sr-only">Copy email</span>
              </Button>
              {copied === "email" && <span className="!text-xs !text-green-500">Copied!</span>}
            </div>
          </div>

          <div className="!flex !items-start !gap-2">
            <div className="!text-muted-foreground dark:!text-zinc-400">
              <span className="!inline-flex !items-center">
                <svg viewBox="0 0 24 24" className="!h-4 !w-4 !mr-2" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                PGP key
              </span>
            </div>
            <div className="!flex !items-center !gap-2">
              {mirror && (
                <>
                  <a href={mirror} className="!text-foreground dark:!text-zinc-100 hover:!underline">
                    [mirror]
                  </a>
                  <span className="!text-muted-foreground dark:!text-zinc-400">;</span>
                </>
              )}
              <span className="!text-muted-foreground dark:!text-zinc-400">fingerprint:</span>
              <code className="!bg-muted dark:!bg-zinc-800 !px-1 !py-0.5 !rounded !text-sm !font-mono">{fingerprint}</code>
              <Button
                variant="ghost"
                size="icon"
                className="!h-6 !w-6 !text-muted-foreground dark:!text-zinc-400 hover:!text-foreground dark:hover:!text-zinc-100"
                onClick={() => copyToClipboard(fingerprint, "fingerprint")}
              >
                <Copy className="!h-3.5 !w-3.5" />
                <span className="!sr-only">Copy fingerprint</span>
              </Button>
              {copied === "fingerprint" && <span className="!text-xs !text-green-500">Copied!</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Public Key Bento */}
      <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800">
        <div className="!flex !justify-between !items-center !mb-2">
          <div className="!text-sm !text-muted-foreground dark:!text-zinc-400">PGP PUBLIC KEY</div>
          <Button
            variant="ghost"
            size="sm"
            className="!h-7 !text-muted-foreground dark:!text-zinc-400 hover:!text-foreground dark:hover:!text-zinc-100 !text-xs"
            onClick={() => copyToClipboard(publicKey, "key")}
          >
            <Copy className="!h-3.5 !w-3.5 !mr-1.5" />
            {copied === "key" ? "Copied!" : "Copy key"}
          </Button>
        </div>
        <pre className="!bg-muted dark:!bg-zinc-950 !p-4 !rounded-md !overflow-x-auto !text-xs !font-mono !text-foreground dark:!text-zinc-300 !whitespace-pre-wrap !break-all">
          {`-----BEGIN PGP PUBLIC KEY BLOCK-----\n${formatPublicKey(publicKey)}\n-----END PGP PUBLIC KEY BLOCK-----`}
        </pre>
      </Card>
    </div>
  )
}