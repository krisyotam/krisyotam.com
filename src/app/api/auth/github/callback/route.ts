import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  // Get the proper base URL from headers (handles proxy)
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  let returnUrl = "/"
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString())
      returnUrl = decoded.returnUrl || "/"
    } catch {}
  }

  if (!code) {
    return NextResponse.redirect(new URL(returnUrl, baseUrl))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error("GitHub OAuth error:", tokenData.error, tokenData.error_description)
      // Return error to user for debugging
      return NextResponse.redirect(new URL(`${returnUrl}?auth_error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`, baseUrl))
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    // Store user info in a secure cookie
    const cookieStore = await cookies()
    const userSession = {
      id: userData.id.toString(),
      username: userData.login,
      avatar_url: userData.avatar_url,
      access_token: tokenData.access_token,
    }

    cookieStore.set("github_user", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return NextResponse.redirect(new URL(returnUrl, baseUrl))
  } catch (error) {
    console.error("GitHub OAuth callback error:", error)
    return NextResponse.redirect(new URL(returnUrl, baseUrl))
  }
}
