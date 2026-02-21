/*
+------------------+----------------------------------------------------------+
| FILE             | irc.tsx                                                  |
| ROLE             | Paginated IRC network info display for contact page      |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-19                                               |
| UPDATED          | 2026-02-19                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/contact/irc.tsx                                        |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Displays IRC network connection details with pagination. Each page shows    |
| a single network with hostname, nick, direct message command, and channel.  |
+-----------------------------------------------------------------------------+
*/

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Hash, ChevronLeft, ChevronRight } from "lucide-react"

export interface IRCNetwork {
  name: string
  hostname: string
  port: number
  ssl: boolean
  nick: string
  channel?: string
  description?: string
}

interface IRCProps {
  networks: IRCNetwork[]
}

export default function IRC({ networks }: IRCProps) {
  const [page, setPage] = useState(0)

  if (networks.length === 0) return null

  const network = networks[page]
  const totalPages = networks.length

  return (
    <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800 !mb-4">
      <div className="!flex !items-start !gap-3">
        <Hash className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
        <div className="!flex-1">
          <div className="!flex !justify-between !items-center !mb-2">
            <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300">
              IRC
            </h3>
            {totalPages > 1 && (
              <div className="!flex !items-center !gap-1">
                <button
                  onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                  className="!p-0.5 !text-muted-foreground dark:!text-zinc-400 hover:!text-foreground dark:hover:!text-zinc-200 !transition-colors"
                  aria-label="Previous network"
                >
                  <ChevronLeft className="!h-3.5 !w-3.5" />
                </button>
                <span className="!text-xs !text-muted-foreground dark:!text-zinc-500 !tabular-nums !min-w-[3ch] !text-center">
                  {page + 1}/{totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => (p + 1) % totalPages)}
                  className="!p-0.5 !text-muted-foreground dark:!text-zinc-400 hover:!text-foreground dark:hover:!text-zinc-200 !transition-colors"
                  aria-label="Next network"
                >
                  <ChevronRight className="!h-3.5 !w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="!text-sm !text-foreground dark:!text-zinc-300 !space-y-1.5">
            {network.description && (
              <p className="!text-xs !text-muted-foreground dark:!text-zinc-500 !mb-2">
                {network.description}
              </p>
            )}
            <div className="!flex !items-center !gap-2">
              <span className="!font-medium !min-w-[105px]">Network:</span>
              <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-0.5 !rounded-none !text-xs">
                {network.name}
              </code>
            </div>
            <div className="!flex !items-center !gap-2">
              <span className="!font-medium !min-w-[105px]">Server:</span>
              <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-0.5 !rounded-none !text-xs">
                {network.hostname}:{network.port}{network.ssl ? " (SSL)" : ""}
              </code>
            </div>
            <div className="!flex !items-center !gap-2">
              <span className="!font-medium !min-w-[105px]">Nick:</span>
              <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-0.5 !rounded-none !text-xs">
                {network.nick}
              </code>
            </div>
            <div className="!flex !items-center !gap-2">
              <span className="!font-medium !min-w-[105px]">Direct message:</span>
              <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-0.5 !rounded-none !text-xs">
                /msg {network.nick}
              </code>
            </div>
            {network.channel && (
              <div className="!flex !items-center !gap-2">
                <span className="!font-medium !min-w-[105px]">Channel:</span>
                <code className="!bg-muted dark:!bg-zinc-800 !px-2 !py-0.5 !rounded-none !text-xs">
                  {network.channel}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
