/**
 * Home Focus Section Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Focus section with sliding quotes, site info tabs, bento nav, theme compare
 */

import { InfiniteMovingQuotes } from "@/components/quotes/InfiniteMovingQuotes"
import { BentoNav } from "@/components/home/bento-nav"
import { ThemeImageCompare, SiteInfoTabs } from "./about"

export function HomeFocus() {
  return (
    <div className="my-6 md:my-8">
      <div className="space-y-6 md:space-y-8">
        {/* Sliding Quotes Animation (trim internal bottom padding) */}
        <InfiniteMovingQuotes className="[&>ul]:py-1 md:[&>ul]:py-2" />

        {/* Site Info Tabs - About This Site & Support Me */}
        <SiteInfoTabs />

        {/* Bento navigation */}
        <BentoNav />

        {/* Theme Image Compare Animation with caption */}
        <div>
          <ThemeImageCompare />
          <p className="mt-2 text-center text-xs text-muted-foreground">hover to view site in dark mode</p>
        </div>
      </div>
    </div>
  )
}
