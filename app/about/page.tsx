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
import { getNowPosts } from "../../utils/ghost"
import { Button } from "@/components/ui/button";


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
  const [blogs, setBlogs] = useState<Array<{ title: string; tags: string[]; url: string }>>([])
  const [sections, setSections] = useState<Array<{ title: string; content: string | React.ReactNode }>>([])
  const [nowPosts, setNowPosts] = useState<Array<{ title: string; published_at: string; slug: string }>>([])
  const [age, setAge] = useState<string>("")

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
        setBlogs(recommendedBlogsData.blogs)
        const fetchedNowPosts = await getNowPosts()
        setNowPosts(fetchedNowPosts)
        setSections([
          {
            title: "About Me",
            content: (
              <>
                <div>{aboutMeData.content}</div>
                <h3 className="text-lg mt-4 mb-2">Name Breakdown</h3>
                <ul className="list-disc list-inside mb-4">
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
                <h3 className="text-lg mt-4 mb-2">Age</h3>
                <p>{age}</p>
              </>
            ),
          },
          { title: "My Mission", content: missionData.content },
          { title: "Experience", content: experienceData.content },
          { title: "Personal Philosophy", content: personalPhilosophyData.content },
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
            title: "Now",
            content: (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left text-foreground">Name</th>
                      <th className="px-4 py-2 text-left text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nowPosts.map((post, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 text-foreground">
                          <Link href={`/post/${post.slug}`} className="hover:underline">
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {new Date(post.published_at).toLocaleDateString()}
                        </td>
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
  }, [nowPosts]) // Added nowPosts to the dependency array

  const toggleSection = (index: number) => {
    setOpenSections((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]))
  }

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
        <div className="flex justify-center my-6">
        <Link href="/wishlist" passHref>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
            View My Wishlist
          </Button>
        </Link>
      </div>


        <div>
        <h3 className="text-xl font-medium mb-4 text-foreground">Recommended Blogs</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {blogs.map((blog, index) => (
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


