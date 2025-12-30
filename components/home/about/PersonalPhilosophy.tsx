"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import personalPhilosophyData from "@/data/about/personal-philosophy.json"

export default function PersonalPhilosophy() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        My personal approach to life, learning, and living with intention.
      </p>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4 text-foreground">My Philosophy</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {personalPhilosophyData.content}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Principles</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Continuous learning and intellectual growth</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Balance between tradition and innovation</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Thoughtful creation over mindless consumption</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Approach</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Systematic thinking with room for intuition</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Balancing depth and breadth of knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Embracing complexity while seeking clarity</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 