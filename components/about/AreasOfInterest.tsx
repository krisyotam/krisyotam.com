"use client"

import { useState } from "react"
import areasOfInterestData from "@/data/areas-of-interest.json"

export default function AreasOfInterest() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Areas of academic and personal interest that I actively study, research, and explore.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Field</th>
              <th className="px-4 py-2 text-left text-foreground">Subfields</th>
            </tr>
          </thead>
          <tbody>
            {areasOfInterestData.map((area, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">{area.field}</td>
                <td className="px-4 py-2 text-muted-foreground">{area.subfields.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 