/**
 * GitHub Contributions Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Displays GitHub contribution graph
 */

import { Card } from "@/components/ui/card"
import { Github } from "lucide-react"

export function GitHubContributions() {
  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Github className="h-4 w-4" />
        <h3 className="text-sm font-medium">GitHub Contributions</h3>
      </div>
      <div className="w-full overflow-hidden">
        <img
          src={`https://ghchart.rshah.org/krisyotam`}
          alt="Kris Yotam's GitHub Contributions"
          className="w-full h-auto dark:invert"
          style={{ filter: "hue-rotate(180deg)" }}
        />
      </div>
      <div className="mt-2 text-xs text-right">
        <a
          href="https://github.com/krisyotam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View on GitHub
        </a>
      </div>
    </Card>
  )
}
