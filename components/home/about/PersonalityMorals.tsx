"use client"

import { useState } from "react"
import personalityMoralsData from "@/data/about/personality-morals.json"

export default function PersonalityMorals() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Results from various moral and ethical assessments that provide insight into my value system and ethical
        framework.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Assessment</th>
              <th className="px-4 py-2 text-left text-foreground">Definition</th>
            </tr>
          </thead>
          <tbody>
            {personalityMoralsData.map((item, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => window.open(item.link, "_blank")}
              >
                <td className="px-4 py-2 text-foreground">{item.test}</td>
                <td className="px-4 py-2 text-muted-foreground">{item.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 