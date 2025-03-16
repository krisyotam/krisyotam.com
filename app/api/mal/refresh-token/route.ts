import { NextResponse } from "next/server"

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
      return NextResponse.json({ error: "Failed to refresh token", details: errorData }, { status: response.status })
    }

    const tokenData = await response.json()

    // In a production app, you would update the environment variables or store the tokens securely
    // For this example, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully. In a production app, you would update the environment variables.",
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

