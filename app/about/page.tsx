"use client"


import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import aboutMeData from "../../data/about-me.json"
import missionData from "../../data/mission.json"
import experienceData from "../../data/experience.json"
import personalPhilosophyData from "../../data/personal-philosophy.json"
import coreValuesData from "../../data/core-values.json"
import recommendedBlogsData from "../../data/recommended-blogs.json"
import mySitesData from "../../data/my-sites.json"
import areasOfInterestData from "../../data/areas-of-interest.json"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

import { WordOfTheDay } from "@/components/WordOfTheDay"
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay"
import { CurrentlyListening } from "@/components/CurrentlyListening"
import { CurrentlyReading } from "@/components/CurrentlyReading"


export const dynamic = "force-dynamic"


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


export default function AboutPage() {
  const [openSections, setOpenSections] = useState<number[]>([0])
  const [sections, setSections] = useState<Array<{ title: string; content: string | React.ReactNode }>>([])
  const [age, setAge] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBlog, setSelectedBlog] = useState<any>(null)


  const updateAge = useCallback(() => {
    const birthDate = new Date("2004-08-05T18:31:00")
    const now = new Date()
    const ageInMilliseconds = now.getTime() - birthDate.getTime()
    const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))
    const ageInSeconds = Math.floor(ageInMilliseconds / 1000)
    return `I was born on August 5, 2004, at 6:31 PM. As of ${now.toLocaleString()}, I am ${ageInYears} years old, which is approximately ${ageInSeconds.toLocaleString()} seconds since my birth.`
  }, [])


  useEffect(() => {
    const timer = setInterval(() => setAge(updateAge()), 1000)
    return () => clearInterval(timer)
  }, [updateAge])


  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        setSections([
          {
            title: "About Me",
            content: (
              <>
                <div className="mb-6">{aboutMeData.content}</div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Name Breakdown</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong>Kris</strong> (KRISS): Follower of Christ
                    </li>
                    <li>
                      <strong>Lael</strong> (LAY-el): Belonging to God
                    </li>
                    <li>
                      <strong>Uri</strong> (OO-ree): Of Light
                    </li>
                    <li>
                      <strong>Mayim</strong> (mah-YEEM): Water
                    </li>
                    <li>
                      <strong>Yotam</strong> (yo-TAHM): God is Perfect
                    </li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Age</h3>
                  <p className="text-muted-foreground">{age}</p>
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
                
                <div className="flex justify-center space-x-4 mt-6">
                  <Link href="/cv" passHref>
                    <Button variant="outline" className="text-sm px-4 py-2 transition-colors hover:bg-primary hover:text-primary-foreground">
                      Curriculum Vitae
                    </Button>
                  </Link>
                  <Link href="/profile" passHref>
                    <Button variant="outline" className="text-sm px-4 py-2 transition-colors hover:bg-primary hover:text-primary-foreground">
                      Profile
                    </Button>
                  </Link>
                  <a href="https://krisbiogenerator.vercel.app" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="text-sm px-4 py-2 transition-colors hover:bg-primary hover:text-primary-foreground">
                      Bio Generator
                    </Button>
                  </a>
                </div>
              </>
            ),
          },
          { title: "My Mission", content: missionData.content },
          { title: "Experience", content: experienceData.content },
          {
            title: "Personal Philosophy",
            content: (
              <div className="mb-6">
                <p className="text-lg text-muted-foreground font-light">{personalPhilosophyData.content}</p>
              </div>
            ),
          },
          {
            title: "Areas of Interest",
            content: (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Field</th>
                      <th className="px-4 py-2 text-left text-foreground">Subfields</th>
                    </tr>
                  </thead>
                  <tbody>
                    {areasOfInterestData.map((area, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">{area.field}</td>
                        <td className="px-4 py-2 text-muted-foreground">{area.subfields.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: "Core Values",
            content: (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Value</th>
                      <th className="px-4 py-2 text-left text-foreground">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coreValuesData.values.map((value, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">{value.term}</td>
                        <td className="px-4 py-2 text-muted-foreground">{value.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: "My Sites",
            content: (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Name</th>
                      <th className="px-4 py-2 text-left text-foreground">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySitesData.sites.map((site, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">
                          <a href={site.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {site.name}
                          </a>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{site.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        ])
      }
    }


    fetchData()
  }, [age])


  const toggleSection = (index: number) => {
    setOpenSections((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]))
  }


  const categories = ["All", ...Array.from(new Set(recommendedBlogsData.blogs.map((blog) => blog.category)))]


  const filteredBlogs = recommendedBlogsData.blogs
    .filter((blog) => selectedCategory === "All" || blog.category === selectedCategory)
    .filter(
      (blog) =>
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.author?.name && blog.author.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )


  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 pt-24 md:p-16 md:pt-32 lg:p-24 lg:pt-40">
        <div className="space-y-px mb-16">
          {sections.map((section, index) => (
            <AccordionItem
              key={section.title}
              title={section.title}
              content={section.content}
              isOpen={openSections.includes(index)}
              onToggle={() => toggleSection(index)}
            />
          ))}
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Interesting People</h3>
          <p className="text-sm text-foreground pb-4">
            A curated list of writers, poets, artists, socialites, entrepreneurs, chairmen, politicians, academics,
            scientists, innovators, philosophers, educators, engineers, inventors, historians, activists, and more.
            People you should get to know.
          </p>


          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name, tag, or keyword..."
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>


          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`transition-colors hover:bg-primary hover:text-primary-foreground ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <tr
                    key={index}
                    className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <td className="py-4 pr-4">
                      <Link href={blog.url} target="_blank" rel="noopener noreferrer" className="block">
                        <span className="text-base font-normal text-foreground">{blog.title}</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blog.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedBlog(blog)}>
                            More Info
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{selectedBlog?.title}</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
                            <div className="space-y-6">
                              <Card>
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                                  <p>{selectedBlog?.description}</p>
                                </CardContent>
                              </Card>


                              <Card>
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-semibold mb-2">Author Details</h3>
                                  <p>
                                    <strong>Name:</strong> {selectedBlog?.author.name}
                                  </p>
                                  <p>
                                    <strong>Position:</strong> {selectedBlog?.author.position}
                                  </p>
                                  <div className="mt-2">
                                    <strong>Achievements:</strong>
                                    <ul className="list-disc list-inside">
                                      {selectedBlog?.author.achievements.map(
                                        (
                                          achievement:
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                            | Iterable<React.ReactNode>
                                            | React.ReactPortal
                                            | Promise<React.AwaitedReactNode>
                                            | null
                                            | undefined,
                                          index: React.Key | null | undefined,
                                        ) => (
                                          <li key={index}>{achievement}</li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </CardContent>
                              </Card>


                              <Card>
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-semibold mb-2">Blog Highlights</h3>
                                  <ul className="list-disc list-inside">
                                    {selectedBlog?.blogHighlights.map(
                                      (
                                        highlight:
                                          | string
                                          | number
                                          | bigint
                                          | boolean
                                          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                          | Iterable<React.ReactNode>
                                          | React.ReactPortal
                                          | Promise<React.AwaitedReactNode>
                                          | null
                                          | undefined,
                                        index: React.Key | null | undefined,
                                      ) => (
                                        <li key={index}>{highlight}</li>
                                      ),
                                    )}
                                  </ul>
                                </CardContent>
                              </Card>


                              <Card>
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-semibold mb-2">Reader Level</h3>
                                  <p>{selectedBlog?.readerLevel}</p>
                                </CardContent>
                              </Card>


                              <div className="flex justify-center">
                                <Button asChild>
                                  <Link href={selectedBlog?.url || "#"} target="_blank" rel="noopener noreferrer">
                                    Visit Blog
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

