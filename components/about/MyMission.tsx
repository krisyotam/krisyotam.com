"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import missionData from "@/data/mission.json"

export default function MyMission() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1 md:col-span-3 bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4 text-foreground">Mission Statement</h3>
            <p className="text-muted-foreground leading-relaxed">{missionData.content}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Educate</h3>
            <p className="text-muted-foreground">
              Share knowledge and insights to help others grow intellectually and personally.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Create</h3>
            <p className="text-muted-foreground">
              Build tools, content, and systems that solve real problems and inspire others.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Connect</h3>
            <p className="text-muted-foreground">
              Foster meaningful relationships and communities around shared interests and values.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 