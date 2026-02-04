/**
 * Home About Section
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Accordion section containing all About subsections
 */

"use client"

import { useState } from "react"
import { AccordionItem } from "./accordion"
import {
  AboutMe,
  Personality,
  PersonalityMorals,
  Intelligence,
  Certifications,
  AreasOfInterest,
  MySites,
  SiteInfo,
  Hosting,
  Uses,
  TestimonialsSection,
} from "./about"
import Favorites from "@/components/home/about/Favorites"

export function HomeAbout() {
  const [openSections, setOpenSections] = useState<number[]>([0])

  const toggleSection = (index: number) => {
    setOpenSections((current) => {
      if (current.includes(index)) {
        return current.filter((i) => i !== index)
      } else {
        return [...current, index]
      }
    })
  }
  return (
    <>
      {/* About Accordion */}
      <div className="mb-8">
        <AccordionItem
          title="About Me"
          content={<AboutMe />}
          isOpen={openSections.includes(0)}
          onToggle={() => toggleSection(0)}
        />
        <AccordionItem
          title="Favorites"
          content={<Favorites />}
          isOpen={openSections.includes(-1)}
          onToggle={() => toggleSection(-1)}
        />
        <AccordionItem
          title="Uses"
          content={<Uses />}
          isOpen={openSections.includes(-2)}
          onToggle={() => toggleSection(-2)}
        />
        <AccordionItem
          title="Socials"
          content={<MySites />}
          isOpen={openSections.includes(1)}
          onToggle={() => toggleSection(1)}
        />
        <AccordionItem
          title="Hosting"
          content={<Hosting />}
          isOpen={openSections.includes(2)}
          onToggle={() => toggleSection(2)}
        />
        <AccordionItem
          title="Intelligence"
          content={<Intelligence />}
          isOpen={openSections.includes(4)}
          onToggle={() => toggleSection(4)}
        />
        <AccordionItem
          title="Personality"
          content={<Personality />}
          isOpen={openSections.includes(5)}
          onToggle={() => toggleSection(5)}
        />
        <AccordionItem
          title="Morals"
          content={<PersonalityMorals />}
          isOpen={openSections.includes(6)}
          onToggle={() => toggleSection(6)}
        />
        <AccordionItem
          title="Certifications"
          content={<Certifications />}
          isOpen={openSections.includes(9)}
          onToggle={() => toggleSection(9)}
        />
        <AccordionItem
          title="Areas of Interest"
          content={<AreasOfInterest />}
          isOpen={openSections.includes(15)}
          onToggle={() => toggleSection(15)}
        />
        <AccordionItem
          title="Testimonials"
          content={<TestimonialsSection />}
          isOpen={openSections.includes(16)}
          onToggle={() => toggleSection(16)}
        />
        <AccordionItem
          title="Site Info"
          content={<SiteInfo />}
          isOpen={openSections.includes(18)}
          onToggle={() => toggleSection(18)}
        />
      </div>
    </>
  )
}
