"use client"

import { useState } from "react"
import IntelligenceCarousel from "@/components/intelligence-carousel"
import iqAssessmentsData from "@/data/iq-assessments.json"

export default function Intelligence() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Results from various intelligence assessments that provide insight into my cognitive abilities,
        processing speed, and problem-solving capabilities.
      </p>
      <IntelligenceCarousel data={iqAssessmentsData} />
    </div>
  )
}
