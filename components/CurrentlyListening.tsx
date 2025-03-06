"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

let accessToken: string | null = null
let refreshToken: string | null = null

export function CurrentlyListening() {
  const [track, setTrack] = useState({
    name: "Loading...",
    artist: "Loading...",
    albumCover: "/assets/fallback/fallback_album_cover.svg",
    spotifyLink: "#",
  })

  useEffect(() => {
    loadTokens()
  }, [])

  async function loadTokens() {
    refreshToken =
      "AQDiLckWXGzUEhM287-Ully5479EwH81IOB2eQvOLEGCWLgn1idv23jgG2qb6RfN_N1bYbyB3Ugpcsa6hoRCYujZvKKe1inkf9-Q7mQ3Td1maL-W-wa8bndIn5pYc8c50Cc"
    await refreshAccessToken()
    fetchRecentTrack()
  }

  async function refreshAccessToken() {
    try {
      const url = "https://accounts.spotify.com/api/token"
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken!,
        }),
      }

      const response = await fetch(url, payload)
      const data = await response.json()

      if (data.access_token) {
        accessToken = data.access_token
        console.log("Access Token refreshed:", accessToken)
        return accessToken
      } else {
        console.error("Failed to refresh access token:", data)
        return null
      }
    } catch (error) {
      console.error("Error refreshing access token:", error)
      return null
    }
  }

  async function fetchRecentTrack() {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const track = data.items[0].track
        setTrack({
          name: track.name,
          artist: `${track.artists.map((artist: { name: string }) => artist.name).join(", ")} - ${track.album.name}`,
          albumCover: track.album.images[0]?.url || "/assets/fallback/fallback_album_cover.svg",
          spotifyLink: track.external_urls.spotify,
        })
      } else {
        setTrack({
          name: "Ave Maria",
          artist: "Hannah Holgersson",
          albumCover: "/assets/fallback/fallback_cover.jpg",
          spotifyLink: "#",
        })
      }
    } catch (error) {
      console.error("Error fetching recent track:", error)
      setTrack({
        name: "Ave Maria",
        artist: "Hannah Holgersson",
        albumCover: "/assets/fallback/fallback_cover.jpg",
        spotifyLink: "#",
      })

      if (error instanceof Error && error.message === "Unauthorized") {
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
          fetchRecentTrack()
        } else {
          console.error("Could not refresh the access token")
        }
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshAccessToken()
      fetchRecentTrack()
    }, 1800000) // 30 minutes in milliseconds
    return () => clearInterval(interval)
  }, [accessToken]) // Added accessToken to dependencies

  return (
    <Card className="flex overflow-hidden h-[100px]">
      <div className="w-[100px] bg-muted p-4 flex items-center justify-center">
        <a href={track.spotifyLink} target="_blank" rel="noopener noreferrer" className="relative w-full h-full">
          <Image
            src={track.albumCover || "/placeholder.svg"}
            alt="Album cover"
            fill
            className="object-cover rounded-md transition-transform duration-300 hover:scale-110"
          />
        </a>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
        <div className="font-normal text-sm truncate">{track.name}</div>
        <div className="text-gray-600 text-sm truncate">{track.artist}</div>
      </div>
    </Card>
  )
}

