"use client"

import { useState, useEffect } from "react"
import { Heart, HeartCrack } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeartButton() {
  const [count, setCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already liked
    const checkLiked = async () => {
      try {
        const response = await fetch('/api/hearts/check')
        const data = await response.json()
        setHasLiked(data.hasLiked)
        setCount(data.count)
      } catch (error) {
        console.error('Error checking like status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkLiked()
  }, [])

  const handleClick = async () => {
    if (hasLiked) return

    try {
      const response = await fetch('/api/hearts/increment', {
        method: 'POST'
      })
      const data = await response.json()
      setCount(data.count)
      setHasLiked(true)
    } catch (error) {
      console.error('Error incrementing hearts:', error)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
        <Heart className="h-4 w-4 mr-1" />
        Loading...
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={hasLiked}
      className={`group ${hasLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
    >
      {hasLiked ? (
        <Heart className="h-4 w-4 mr-1 fill-current" />
      ) : (
        <Heart className="h-4 w-4 mr-1 group-hover:fill-current" />
      )}
      {count} Upvotes
    </Button>
  )
}
