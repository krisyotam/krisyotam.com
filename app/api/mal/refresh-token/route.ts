import { NextResponse } from "next/server"
import { updateMalTokensInEnv } from "@/lib/update-mal-tokens"


export const dynamic = 'force-dynamic';
export async function POST() {
  try {
    const refreshToken = process.env.MAL_REFRESH_TOKEN

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is not configured" }, { status: 500 })
    }    if (!process.env.MAL_CLIENT_ID || !process.env.MAL_CLIENT_SECRET) {
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.MAL_CLIENT_ID,
      client_secret: process.env.MAL_CLIENT_SECRET,
    })

    const response = await fetch("https://myanimelist.net/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("MAL API Debug - refresh-token: Failed to refresh token:", errorData)
      return NextResponse.json({ error: "Failed to refresh token", details: errorData }, { status: response.status })
    }    const tokenData = await response.json()
    console.log("MAL API Debug - refresh-token: Successfully refreshed token")

    // Update environment variables in memory
    process.env.MAL_ACCESS_TOKEN = tokenData.access_token
    process.env.MAL_REFRESH_TOKEN = tokenData.refresh_token

    // Persist tokens to .env.local file
    const envUpdateSuccess = await updateMalTokensInEnv(tokenData.access_token, tokenData.refresh_token)
    
    if (!envUpdateSuccess) {
      console.warn("MAL API Debug - refresh-token: Failed to persist tokens to .env.local file")
    }

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      env_updated: envUpdateSuccess,
    })
  } catch (error) {
    console.error("MAL API Debug - refresh-token: Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


