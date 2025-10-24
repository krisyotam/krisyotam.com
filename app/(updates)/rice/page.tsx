import RiceMDX from "./data/page.mdx"
import { PageHeader } from "@/components/page-header"

export default function RicePage() {
  return (
    <>
      <div className="mb-8 max-w-[672px] mx-auto">
        <PageHeader
          title="Rice"
          subtitle="Utility scripts and one-liners"
          start_date="2025-10-06"
          preview="A small collection of shell snippets and commands (Windows & Linux) for bootstrapping tools and dotfiles from my site. Pull directly from krisyotam.com rather than GitHub."
          status="In Progress"
          confidence="likely"
          importance={3}
          backText="Updates"
          backHref="/updates"
        />
      </div>

      <div className="mdx-note"><RiceMDX /></div>
    </>
  )
}
