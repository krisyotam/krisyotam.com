"use client"

/**
 * Site Info Tabs Component
 * @author Kris Yotam
 * @date 2026-02-03
 * @description Tabbed interface for About This Site and Support Me content
 *              with circle dot navigation matching the BentoNav aesthetic
 */

import { useState, useRef } from "react"
import Dropcap from "@/components/core/dropcap"
import { Notice } from "@/components/posts/typography/notice"

const tabs = [
  { id: "about", label: "About This Site" },
  { id: "support", label: "Support Me" },
]

export function SiteInfoTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    // Scroll to top of content block
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="w-full" ref={contentRef}>
      {/* Header banner */}
      <div
        className="h-10 flex items-center justify-center border border-border bg-muted/20"
        style={{ borderRadius: 0 }}
      >
        <span className="text-xs font-light tracking-wide text-foreground/80">
          {tabs[activeTab].label}
        </span>
      </div>

      {/* Content area */}
      <div
        className="border border-t-0 border-border bg-card p-6"
        style={{ borderRadius: 0 }}
      >
        {activeTab === 0 && <AboutContent />}
        {activeTab === 1 && <SupportContent />}
      </div>

      {/* Bottom navigation with dots */}
      <div
        className="h-12 flex items-center justify-center gap-3 border border-t-0 border-border bg-muted/20"
        style={{ borderRadius: 0 }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              index === activeTab
                ? "bg-foreground"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to ${tab.label}`}
          />
        ))}
      </div>
    </div>
  )
}

function AboutContent() {
  return (
    <div className="text-[0.9375rem] leading-relaxed text-foreground/90 space-y-3">
      <p>
        <Dropcap type="william-morris-gothic" width={48} height={48} className="dropcap-tabs">T</Dropcap>his site belongs to <strong>Kris Yotam</strong>. I write about AI, mathematics, art, philosophy, psychology, literature, history, and much more. I am an undergraduate student in Mathematics with a specialization in Pure Mathematics.
      </p>
      <p>
        The main content on this site is arranged in a tiered hierarchy. The highest tier is <a href="/essays" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Essays</a>—long-form, stable posts that are continually revised as long as their topics remain relevant. These can be accessed through the <a href="/" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">main feed</a>, the <a href="/essays" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">essays page</a>, or browsed by <a href="/tags" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">tags</a>, <a href="/categories" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">categories</a>, and <a href="/series" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">series</a>. Some essays may eventually be deprecated if a subject becomes obsolete—such as when a tool is no longer supported.
      </p>
      <p>
        <a href="/blog" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Blog Posts</a> are reserved for short-form thoughts, quick essays, and reflections. <a href="/notes" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Notes</a> may be the most expansive section of the site, featuring reviews of books, anime, manga, literature, cuisine, as well as CTF writeups, algorithmic coding challenge solutions, and curated library catalogues from academics and notable internet figures.
      </p>
      <p>
        There is also other content such as my original <a href="/verse" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Poetry</a>, formal <a href="/reports" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Academic Essays</a>, and my <a href="/lecture-notes" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Lecture Notes</a> for classes, courses, and guest lectures. Pages like <a href="/library" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Library</a> archive my personal physical book collection, while <a href="/reading" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Reading</a> tracks my current reading sessions. You'll also find <a href="/anime" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Anime</a>, <a href="/manga" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Manga</a>, <a href="/film" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Film</a>, and <a href="/music" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Music</a>, which document my media consumption across each of those domains.
      </p>
      <p>
        I write a dedicated series of classical rhetorical exercises known as <a href="/progymnasmata" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Progymnasmata</a>, inspired by Aelius Theon and the ancient Greek tradition. These exercises help refine argumentation, stylistic clarity, and narrative construction.
      </p>
      <p>
        I am also a Bible-believer, and have created a clean, scripturally referenced version of the 613 commandments—known as the mitzvot—presented clearly and readably at <a href="/mitzvah" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">/mitzvah</a>.
      </p>
      <p>
        Among the lighter offerings is a cultural preservation of one of the internet's most storied traditions: the <a href="/rules-of-the-internet" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">Rules of the Internet</a>, reformatted and archived here for historical and ironic appreciation.
      </p>
      <p>
        For navigation, the site includes several unique features: on the <a href="/" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">homepage</a>, a button in the bottom-left corner toggles between grid and list views for browsing posts. Most top-level pages also include a discreet question mark icon in the lower left—clicking it reveals a helpful page explanation.
      </p>
      <p>
        The floating button in the bottom-right corner labeled <code className="text-xs bg-muted px-1 py-0.5">⌘K</code> opens the global <strong>Command Menu</strong>. From here, you can instantly jump to any page, toggle between light and dark themes, and explore the full index of site sections ranging from essays and blog posts to playlists and academic resources.
      </p>
      <p>
        The gear icon in the top-right corner opens the <strong>Settings Menu</strong>, which includes:
      </p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li><strong>Search</strong> — a floating window with support for posts, pages, and even Bible search across various versions.</li>
        <li><strong>Link Preview Mode</strong> — configure how external links are opened (e.g., modal vs. direct).</li>
        <li><strong>Quick Links</strong> — jump to RSS, FAQ, changelog, GitHub, or user settings instantly.</li>
      </ul>
      <p>
        Together, these tools aim to keep the interface minimal yet powerful, ensuring that both new readers and returning visitors can explore with ease and precision.
      </p>
    </div>
  )
}

function SupportContent() {
  return (
    <div className="text-[0.9375rem] leading-relaxed text-foreground/90 space-y-3">
      <Notice type="info">
        These methods have not yet been fully set up yet. You will know they have been set up when this notice is removed. Until then, if you'd like to support me, please see the "Buy Me a Tea" option above!
      </Notice>

      <p>
        <Dropcap type="william-morris-gothic" width={48} height={48} className="dropcap-tabs">I</Dropcap> spend a lot of time learning. I also spend a lot of time writing about it. Through this process, I have found thousands of unique ideas, underseen content, and have created some gems myself. If you value any of this and would like to support this site, I have tried to make it as easy and profitable for you to do so.
      </p>

      <p className="font-medium mt-4">Patreon Tiers</p>

      <ul className="list-disc list-inside space-y-2 ml-2">
        <li>
          <strong>Supporter ($5)</strong>: Access to downloadable Obsidian notes
        </li>
        <li>
          <strong>Muse ($10)</strong>: Choose 2 characters and fitting theme for me to write a blog post about
        </li>
        <li>
          <strong>Patron ($20)</strong>: Web Clippings, Private Downloadable Archive, Obsidian Repo (Access to make contributions on GitHub), Anki Flash Cards, Vote on Essay Topics
        </li>
      </ul>
    </div>
  )
}

export default SiteInfoTabs
