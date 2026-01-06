"use client"

import { useState } from "react"
import ProfileBento from "@/components/profile-bento"

const ABOUT_PROFILE_DATA = {
  briefBio: "At the moment I am not taking comissions for books reviews, projects, ect. but this will change soon. I plan to use my [Patreon](https://patreon.com/krisyotam) in the near future for such things. Everything on krisyotam.com is expressely mine own. No opinions shared should otherwise reflect on my past, current, future associates, clients, partners, ect.",
  quote: "The limits of my language mean the limits of my world.",
  selfExperiments: [
    {
      title: "Daily Writing Ritual",
      description: "Writing 1000 words before sunrise every day for 365 days",
      link: "/blog/2025/writing-ritual-results"
    },
    {
      title: "Mathematical Intuition Training",
      description: "Structured approach to developing mathematical intuition through visualization",
      link: "/blog/2025/math-intuition-experiment"
    },
    {
      title: "Classical Memory Techniques",
      description: "Implementing memory palace and loci methods for mathematical formulas",
      link: "/blog/2024/memory-techniques-mathematics"
    }
  ],
  masksIWear: [
    "Mathematician",
    "Writer",
    "Teacher",
    "Student",
    "Philosopher",
    "Poet",
    "Saint",
    "Creator",
    "Curator",
    "Web Sleuth"
  ]
}

const PREDICTIONS_DATA = [
  {
    statement: "Large language models will be integrated into standard mathematical research workflows by 2026",
    confidence: 85,
    date: "2023-11-15",
    category: "Technology",
    status: "active",
    expiryDate: "2026-12-31"
  },
  {
    statement: "A major breakthrough in P vs NP will occur before 2030",
    confidence: 30,
    date: "2024-01-03",
    category: "Mathematics",
    status: "active",
    expiryDate: "2030-12-31"
  },
  {
    statement: "Classical education methodologies will see a renaissance in online learning platforms by 2027",
    confidence: 75,
    date: "2023-09-22",
    category: "Education",
    status: "active",
    expiryDate: "2027-12-31"
  },
  {
    statement: "A new mathematical notation system optimized for digital environments will gain significant adoption by 2028",
    confidence: 60,
    date: "2024-02-18",
    category: "Mathematics",
    status: "active",
    expiryDate: "2028-12-31"
  },
  {
    statement: "Poetry written with AI assistance will win a major literary prize before 2026",
    confidence: 45,
    date: "2023-12-05",
    category: "Arts",
    status: "active",
    expiryDate: "2026-12-31"
  },
  {
    statement: "A proof of the Riemann Hypothesis will be published and verified by 2035",
    confidence: 25,
    date: "2024-03-01",
    category: "Mathematics",
    status: "active",
    expiryDate: "2035-12-31"
  },
  {
    statement: "Personalized education based on cognitive science will become standard in at least 30% of schools by 2029",
    confidence: 70,
    date: "2023-10-12",
    category: "Education",
    status: "active",
    expiryDate: "2029-12-31"
  },
  {
    statement: "A new form of digital literature combining interactive elements and traditional narrative will emerge as a distinct genre by 2027",
    confidence: 80,
    date: "2024-01-25",
    category: "Arts",
    status: "active",
    expiryDate: "2027-12-31"
  },
  {
    statement: "Quantum computing will solve a practically relevant problem that classical computers cannot by 2028",
    confidence: 65,
    date: "2023-08-30",
    category: "Technology",
    status: "active",
    expiryDate: "2028-12-31"
  },
  {
    statement: "Virtual reality will be used in at least 25% of university mathematics courses by 2029",
    confidence: 40,
    date: "2024-02-10",
    category: "Education",
    status: "active",
    expiryDate: "2029-12-31"
  },
  {
    statement: "A major social media platform will collapse and lose over 80% of its user base by 2026",
    confidence: 55,
    date: "2023-11-20",
    category: "Technology",
    status: "active",
    expiryDate: "2026-12-31"
  },
  {
    statement: "Handwritten mathematical notation will be accurately digitized by AI with over 99% accuracy by 2025",
    confidence: 90,
    date: "2023-07-15",
    category: "Technology",
    status: "succeeded",
    expiryDate: "2025-12-31"
  },
  {
    statement: "A new programming language specifically designed for mathematical computation will gain widespread adoption by 2027",
    confidence: 50,
    date: "2024-01-05",
    category: "Technology",
    status: "active",
    expiryDate: "2027-12-31"
  },
  {
    statement: "Traditional universities will see a 30% decline in enrollment for computer science degrees by 2028",
    confidence: 35,
    date: "2023-09-18",
    category: "Education",
    status: "dropped",
    expiryDate: "2028-12-31"
  },
  {
    statement: "A mathematical proof will be found that is too complex for humans to verify without AI assistance by 2030",
    confidence: 60,
    date: "2024-03-10",
    category: "Mathematics",
    status: "active",
    expiryDate: "2030-12-31"
  },
  {
    statement: "Blockchain technology will be integrated into academic publishing to verify research integrity by 2026",
    confidence: 45,
    date: "2023-10-28",
    category: "Technology",
    status: "failed",
    expiryDate: "2026-12-31"
  }
]

export default function Profile() {
  return (
    <div className="py-4">
      <ProfileBento data={ABOUT_PROFILE_DATA} predictions={PREDICTIONS_DATA} />
    </div>
  )
}
