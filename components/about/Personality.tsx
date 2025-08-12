"use client"

import { useState } from "react"
import PersonalityCarousel from "@/components/personality-carousel"
import personalityAssessmentsData from "@/data/personality-assessments.json"

export default function Personality() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Results from various personality assessments that provide insight into my cognitive preferences,
        behavioral tendencies, and working style.
      </p>
      <PersonalityCarousel data={personalityAssessmentsData} />
    </div>
  )
} 