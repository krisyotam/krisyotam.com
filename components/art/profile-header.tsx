"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

type ProfileData = {
  name: string
  username: string
  profilePicture: string
  bio: string
  caraProfileUrl: string
}

export default function ProfileHeader({ profileData }: { profileData: ProfileData }) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8">
      <Link
        href={profileData.caraProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300"
        aria-label={`Visit ${profileData.name}'s Cara profile`}
      >
        <Image
          src={profileData.profilePicture || "/placeholder.svg"}
          alt={profileData.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 96px, 128px"
        />
      </Link>

      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-2xl md:text-3xl font-bold">{profileData.name}</h1>
        <p className="text-sm text-muted-foreground mb-2">@{profileData.username}</p>
        <p className="text-center md:text-left max-w-md">{profileData.bio}</p>
      </div>
    </div>
  )
}

