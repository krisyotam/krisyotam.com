"use client"

import { useState } from "react"
import coreValuesData from "@/data/about/core-values.json"

export default function CoreValues() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Intellectual curiosity, authenticity, simplicity, and the pursuit of excellence in all endeavors. 
        These principles guide both my personal and professional life.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Value</th>
              <th className="px-4 py-2 text-left text-foreground">Definition</th>
            </tr>
          </thead>
          <tbody>
            {coreValuesData.values.map((value, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">{value.term}</td>
                <td className="px-4 py-2 text-muted-foreground">{value.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 