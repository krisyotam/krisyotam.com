"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import NameBreakdown from "@/components/about/name-breakdown"

const ABOUT_ME_CONTENT = "Hi! I am Kris Yotam, a Applied Researcher, Essayist, Critic, and Blogger. I write about a wide variety of topics, and if you are interested in my work you can even view my notes at notes.krisyotam.com"
import PersonalBio from "@/components/about/personal-bio"
import { WordOfTheDay } from "@/components/home/about/WordOfTheDay"
import { QuoteOfTheDay } from "@/components/quotes/quoteOfTheDay"
import { CurrentlyListening } from "@/components/media/music/CurrentlyListening"
import { CurrentlyReading } from "@/components/media/reading"

export default function AboutMe() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1 md:col-span-2 bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">About Me</h3>
            <p className="text-muted-foreground">{ABOUT_ME_CONTENT}</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-medium mb-2">Connect</h3>
              <p className="text-muted-foreground">Find me online and reach out.</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Link
                  href="https://github.com/krisyotam"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-no-preview="true"
                  className="hover:text-gray-400 transition-colors"
                >
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Link
                  href="https://x.com/krisyotam"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-no-preview="true"
                  className="hover:text-gray-400 transition-colors"
                >
                  Twitter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Current Focus</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                Pure Mathematics
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                Expositional Writing
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">Poetry</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                Web Development
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                Classical Education
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">AI/ML</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                Open Source
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                Classical Pedagogy
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <p className="text-muted-foreground">Based in the United States</p>
            <p className="text-xs text-muted-foreground mt-2">Working remotely & globally</p>
          </CardContent>
        </Card>
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