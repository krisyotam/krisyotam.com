import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic';
export async function POST() {
  try {
    const refreshToken = process.env.MAL_REFRESH_TOKEN

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is not configured" }, { status: 500 })
    }

    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
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
    }

    const tokenData = await response.json()
    console.log("MAL API Debug - refresh-token: Successfully refreshed token")

    // Update environment variables
    process.env.MAL_ACCESS_TOKEN = tokenData.access_token
    process.env.MAL_REFRESH_TOKEN = tokenData.refresh_token

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
    })
  } catch (error) {
    console.error("MAL API Debug - refresh-token: Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


