"use client"

import { useState } from "react"
import Experience from "@/components/experience"
import experienceData from "@/data/experience.json"

export default function ExperienceComponent() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        {experienceData.content}
      </p>
      <Experience />
    </div>
  )
} 