"use client"

import { Card, CardContent } from "@/components/ui/card"

const MISSION_CONTENT = "To refine my taste and understanding by drawing from the wisdom of masters across diverse fields, cultivating a unique and complex perspective. I seek to immerse myself in the richness of different cultures, religions, belief systems, and political landscapes, to truly understand the motivations behind human actions. Through this journey, I aim to write polarizing articles that spark meaningful feedback and discussion. Above all, I am committed to the revival of *ad fontes* education, learning from the old masters to rediscover timeless wisdom and foster a deeper, more nuanced understanding of the world."

export default function MyMission() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1 md:col-span-3 bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4 text-foreground">Mission Statement</h3>
            <p className="text-muted-foreground leading-relaxed">{MISSION_CONTENT}</p>
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