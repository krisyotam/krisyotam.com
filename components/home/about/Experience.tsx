"use client"

import Experience from "@/components/experience"

const EXPERIENCE_CONTENT = "Over a decade of experience in classical education, research, and mentoring. Specialized in combining traditional teaching methods with contemporary approaches."

export default function ExperienceComponent() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        {EXPERIENCE_CONTENT}
      </p>
      <Experience />
    </div>
  )
} 