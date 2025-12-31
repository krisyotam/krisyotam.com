import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const returnUrl = searchParams.get("returnUrl") || "/"

  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: "GitHub OAuth not configured" }, { status: 500 })
  }

  // Auto-detect the host from the request
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  // Store return URL in state parameter (base64 encoded)
  const state = Buffer.from(JSON.stringify({ returnUrl })).toString("base64")

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/github/callback`,
    scope: "read:user",
    state,
  })

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
}
