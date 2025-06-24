"use client"

import { useState } from "react"
import CoreSkills from "@/components/core-skills"
import skillsData from "@/data/core-skills.json"

export default function CoreSkillsComponent() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        A visualization of my primary skills and knowledge areas across various disciplines.
      </p>
      <div className="max-w-[900px] mx-auto">
        <CoreSkills data={skillsData} className="max-w-full" />
      </div>
    </div>
  )
} 