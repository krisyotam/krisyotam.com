"use client"

import Link from "next/link"
import NameBreakdown from "@/components/about/name-breakdown"
import writingStats from "@/../public/data/writing-stats.json"

const ABOUT_ME_CONTENT = "Hi! I am Kris Yotam, a Applied Researcher, Essayist, Critic, and Blogger. I write about a wide variety of topics, and if you are interested in my work you can even view my notes at notes.krisyotam.com"
import PersonalBio from "@/components/about/personal-bio"
import { WordOfTheDay } from "@/components/home/about/WordOfTheDay"
import { QuoteOfTheDay } from "@/components/quotes/quoteOfTheDay"
import { CurrentlyListening } from "@/components/media/music/CurrentlyListening"
import { CurrentlyReading } from "@/components/media/reading/reading"

export default function AboutMe() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* About Me */}
        <div className="col-span-1 md:col-span-2 border border-border">
          <div className="flex items-stretch border-b border-border">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/30">
              About
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{ABOUT_ME_CONTENT}</p>
          </div>
        </div>

        {/* Connect */}
        <div className="border border-border flex flex-col">
          <div className="flex items-stretch border-b border-border">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/30">
              Connect
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <Link
              href="https://github.com/krisyotam"
              target="_blank"
              rel="noopener noreferrer"
              data-no-preview="true"
              className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors border-b border-border"
            >
              <span>GitHub</span>
              <span className="text-xs text-muted-foreground">@krisyotam</span>
            </Link>
            <Link
              href="https://x.com/krisyotam"
              target="_blank"
              rel="noopener noreferrer"
              data-no-preview="true"
              className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors border-b border-border"
            >
              <span>Twitter</span>
              <span className="text-xs text-muted-foreground">@krisyotam</span>
            </Link>
            <Link
              href="mailto:kris@krisyotam.com"
              data-no-preview="true"
              className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors"
            >
              <span>Email</span>
              <span className="text-xs text-muted-foreground">kris@krisyotam.com</span>
            </Link>
          </div>
        </div>

        {/* Writing */}
        <div className="col-span-1 md:col-span-2 border border-border">
          <div className="flex items-stretch border-b border-border">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/30">
              Writing
            </div>
          </div>
          <div className="flex items-stretch">
            <div className="flex-1 text-center px-3 py-3 border-r border-border">
              <span className="text-2xl font-bold tabular-nums">{writingStats.total}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">posts</span>
            </div>
            <div className="flex-1 text-center px-3 py-3 border-r border-border">
              <span className="text-2xl font-bold tabular-nums">{writingStats.totalCategories}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">categories</span>
            </div>
            <div className="flex-1 text-center px-3 py-3 border-r border-border">
              <span className="text-2xl font-bold tabular-nums">{writingStats.totalTags}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">tags</span>
            </div>
            <div className="flex-1 text-center px-3 py-3">
              <span className="text-2xl font-bold tabular-nums">{Object.keys(writingStats.counts).length}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">types</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="border border-border flex flex-col">
          <div className="flex items-stretch border-b border-border">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/30">
              Location
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center px-4 py-3">
            <span className="text-sm">United States</span>
            <span className="text-xs text-muted-foreground mt-1">Working remotely & globally</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <NameBreakdown />
      </div>

      <div className="mb-6">
        <PersonalBio />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-1">listening</div>
          <CurrentlyListening />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">reading</div>
          <CurrentlyReading />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">word of the day</div>
          <WordOfTheDay />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">quote of the day</div>
          <QuoteOfTheDay />
        </div>
      </div>
    </>
  )
} 