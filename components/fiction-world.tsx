"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface FictionWorldProps {
  name: string
  novel: string
  imageSrc: string
  slug: string
  author?: string
}

export default function FictionWorld({
  name,
  novel,
  imageSrc = "/placeholder.svg?height=600&width=800",
  slug,
  author = "Kris Yotam",
}: FictionWorldProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card className="overflow-hidden w-full max-w-sm mx-auto group cursor-pointer">
      <Link href={`/ocs/${slug}`} className="block">
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={`${name} from ${novel}`}
              fill
              className={`object-cover transition-all duration-500 ${isHovered ? "brightness-100 scale-105" : "brightness-50"}`}
            />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white drop-shadow-md">{name}</h2>
              <p className="text-sm text-white/90 drop-shadow-md">From {novel}</p>
              <p className="text-sm text-white/80 drop-shadow-md">by {author}</p>
            </div>

            <Button
              variant="secondary"
              className="self-start mt-auto transition-transform duration-300 group-hover:translate-x-2"
            >
              View World
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  )
}

