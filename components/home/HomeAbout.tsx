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
  Profile,
  Personality,
  PersonalityMorals,
  Intelligence,
  InterestingPeople,
  OnMyMethod,
  MyMission,
  Certifications,
  CoreValues,
  ExperienceComponent,
  CoreSkillsComponent,
  PersonalPhilosophy,
  AreasOfInterest,
  Practice,
  Companies,
  MySites,
  OtherSites,
  SiteInfo,
  Hosting,
  AboutThisSite,
  SupportMe,
  RecommendedContent,
  Uses,
} from "./about"
import Favorites from "@/components/Favorites"

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
      {/* About This Site Collapse */}
      <div className="mb-6">
        <AboutThisSite />
        <SupportMe />
        <RecommendedContent />
      </div>

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
          title="Profile"
          content={<Profile />}
          isOpen={openSections.includes(3)}
          onToggle={() => toggleSection(3)}
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
          title="On My Method"
          content={<OnMyMethod />}
          isOpen={openSections.includes(7)}
          onToggle={() => toggleSection(7)}
        />
        <AccordionItem
          title="My Mission"
          content={<MyMission />}
          isOpen={openSections.includes(8)}
          onToggle={() => toggleSection(8)}
        />
        <AccordionItem
          title="Certifications"
          content={<Certifications />}
          isOpen={openSections.includes(9)}
          onToggle={() => toggleSection(9)}
        />
        <AccordionItem
          title="Core Values"
          content={<CoreValues />}
          isOpen={openSections.includes(10)}
          onToggle={() => toggleSection(10)}
        />
        <AccordionItem
          title="Experience"
          content={<ExperienceComponent />}
          isOpen={openSections.includes(11)}
          onToggle={() => toggleSection(11)}
        />
        <AccordionItem
          title="Practice"
          content={<Practice />}
          isOpen={openSections.includes(12)}
          onToggle={() => toggleSection(12)}
        />
        <AccordionItem
          title="Core Skills"
          content={<CoreSkillsComponent />}
          isOpen={openSections.includes(13)}
          onToggle={() => toggleSection(13)}
        />
        <AccordionItem
          title="Personal Philosophy"
          content={<PersonalPhilosophy />}
          isOpen={openSections.includes(14)}
          onToggle={() => toggleSection(14)}
        />
        <AccordionItem
          title="Areas of Interest"
          content={<AreasOfInterest />}
          isOpen={openSections.includes(15)}
          onToggle={() => toggleSection(15)}
        />
        <AccordionItem
          title="Companies"
          content={<Companies />}
          isOpen={openSections.includes(16)}
          onToggle={() => toggleSection(16)}
        />
        <AccordionItem
          title="Other Sites"
          content={<OtherSites />}
          isOpen={openSections.includes(17)}
          onToggle={() => toggleSection(17)}
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
