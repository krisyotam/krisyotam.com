"use client"

import type React from "react"

import { useState, useEffect } from "react"
import auctionStatsData from "../../data/auction-stats.json"
import auctionGoalsData from "../../data/auction-goals.json"
import auctionInterestsData from "../../data/auction-interests.json"
import auctionPlatformsData from "../../data/auction-platforms.json"
import { PageHeader } from "@/components/page-header"

export default function AuctionPage() {
  const [openSections, setOpenSections] = useState<number[]>([0])
  const [stats, setStats] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [interests, setInterests] = useState<any[]>([])
  const [platforms, setPlatforms] = useState<any[]>([])

  useEffect(() => {
    setStats(auctionStatsData)
    setGoals(auctionGoalsData.goals)
    setInterests(auctionInterestsData.interests)
    setPlatforms(auctionPlatformsData.platforms)
  }, [])

  const toggleSection = (index: number) => {
    setOpenSections((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]))
  }

  const inPersonPercentage = stats
    ? Math.round((stats.bidTypes.inPerson / (stats.bidTypes.inPerson + stats.bidTypes.online)) * 100)
    : 0
  const onlinePercentage = 100 - inPersonPercentage

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 pt-24 md:p-16 md:pt-32 lg:p-24 lg:pt-40">
        <PageHeader
          title="Auction"
          subtitle="Personal Bidding Analytics"
          date="2025-03-28"
          preview="A comprehensive record of my auction activities, interests, and acquisitions across various platforms and categories."
          status="In Progress"
          confidence="likely"
          importance={7}
          className="mb-12"
        />

        {stats && (
          <div className="mb-12">
            <div className="mb-6">
              <h1 className="text-3xl font-normal mb-2">Auction Statistics</h1>
              <div className="h-px w-full bg-border"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left side - 2x2 grid of stats */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-secondary/20 rounded-lg p-6 flex flex-col justify-center hover:bg-secondary/30 transition-colors duration-200 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Highest Bid</p>
                  <p className="text-2xl font-medium">{stats.highestBid}</p>
                </div>

                <div className="bg-secondary/20 rounded-lg p-6 flex flex-col justify-center hover:bg-secondary/30 transition-colors duration-200 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-2xl font-medium">{stats.successRate}</p>
                </div>

                <div className="bg-secondary/20 rounded-lg p-6 flex flex-col justify-center hover:bg-secondary/30 transition-colors duration-200 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
                  <p className="text-2xl font-medium">{stats.totalBids}</p>
                </div>

                <div className="bg-secondary/20 rounded-lg p-6 flex flex-col justify-center hover:bg-secondary/30 transition-colors duration-200 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
                  <p className="text-2xl font-medium">{stats.totalSpend}</p>
                </div>
              </div>

              {/* Right side - Bid type breakdown */}
              <div className="md:col-span-1 bg-secondary/20 rounded-lg p-6 flex flex-col justify-between hover:bg-secondary/30 transition-colors duration-200 border border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Bid Type Breakdown</p>
                  <div className="flex items-center mb-3">
                    <div className="h-5 rounded-l-full bg-primary/80" style={{ width: `${inPersonPercentage}%` }}></div>
                    <div className="h-5 rounded-r-full bg-secondary" style={{ width: `${onlinePercentage}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary/80 rounded-full mr-2"></div>
                      <span className="text-sm">In Person</span>
                    </div>
                    <span className="text-sm font-medium">{inPersonPercentage}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                      <span className="text-sm">Online</span>
                    </div>
                    <span className="text-sm font-medium">{onlinePercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-px mb-16">
          <AccordionItem
            title="History"
            content={
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground font-light">
                  My journey into the world of auctions began in 2018 when I attended my first estate sale. What started
                  as curiosity quickly evolved into a passionate pursuit of rare and unique items.
                </p>
                <p className="text-lg text-muted-foreground font-light">
                  Initially focusing on literary works, I expanded my interests to include art, collectibles, and
                  vintage items. My first significant acquisition was a first-edition Steinbeck that I won after a tense
                  bidding war at a small auction house in San Francisco.
                </p>
                <p className="text-lg text-muted-foreground font-light">
                  Over the years, I've developed relationships with several auction houses and refined my bidding
                  strategy. I've learned to research extensively, set firm limits, and recognize the psychological
                  aspects of competitive bidding.
                </p>
                <p className="text-lg text-muted-foreground font-light">
                  While I started exclusively with in-person auctions, I've gradually embraced online platforms, which
                  now constitute the majority of my bidding activity, though I still prefer the atmosphere and immediacy
                  of live auctions when possible.
                </p>
              </div>
            }
            isOpen={openSections.includes(0)}
            onToggle={() => toggleSection(0)}
          />

          <AccordionItem
            title="Goals"
            content={
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Item</th>
                      <th className="px-4 py-2 text-left text-foreground">Target Price</th>
                      <th className="px-4 py-2 text-left text-foreground">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">{goal.item}</td>
                        <td className="px-4 py-2 text-muted-foreground">{goal.targetPrice}</td>
                        <td className="px-4 py-2 text-muted-foreground">{goal.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            isOpen={openSections.includes(1)}
            onToggle={() => toggleSection(1)}
          />

          <AccordionItem
            title="Interests"
            content={
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Type</th>
                      <th className="px-4 py-2 text-left text-foreground">Specifics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interests.map((interest, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">{interest.type}</td>
                        <td className="px-4 py-2 text-muted-foreground">{interest.specifics.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            isOpen={openSections.includes(2)}
            onToggle={() => toggleSection(2)}
          />

          <AccordionItem
            title="Platforms"
            content={
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Platform</th>
                      <th className="px-4 py-2 text-left text-foreground">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.map((platform, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">
                          <a href={platform.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {platform.platform}
                          </a>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{platform.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            isOpen={openSections.includes(3)}
            onToggle={() => toggleSection(3)}
          />
        </div>
      </div>
    </div>
  )
}

interface AccordionItemProps {
  title: string
  content: string | React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ title, content, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full py-8 flex justify-between items-center text-left"
        aria-expanded={isOpen}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <h2 className="text-2xl font-normal text-foreground">{title}</h2>
        {isOpen ? (
          <span className="text-2xl text-foreground" aria-hidden="true">
            -
          </span>
        ) : (
          <span className="text-2xl text-foreground" aria-hidden="true">
            +
          </span>
        )}
      </button>
      <div
        id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] mb-8" : "max-h-0"
        }`}
      >
        {typeof content === "string" ? <p className="text-lg text-muted-foreground font-light">{content}</p> : content}
      </div>
    </div>
  )
}

