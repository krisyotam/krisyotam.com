import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const accessToken = process.env.MAL_ACCESS_TOKEN
    const refreshToken = process.env.MAL_REFRESH_TOKEN
    const clientId = process.env.MAL_CLIENT_ID
    const clientSecret = process.env.MAL_CLIENT_SECRET

    const status = {
      accessTokenPresent: !!accessToken,
      refreshTokenPresent: !!refreshToken,
      clientIdPresent: !!clientId,
      clientSecretPresent: !!clientSecret,
      accessTokenLength: accessToken ? accessToken.length : 0,
      refreshTokenLength: refreshToken ? refreshToken.length : 0,
    }

    // Test a simple API call if we have an access token
    let apiTest = null
    if (accessToken) {
      try {
        const response = await fetch("https://api.myanimelist.net/v2/users/@me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        
        apiTest = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        }

        if (!response.ok && response.status === 401) {
          apiTest.message = "Token appears to be expired or invalid"
        } else if (response.ok) {
          apiTest.message = "API call successful"
        }
      } catch (error: any) {
        apiTest = {
          status: 'error',
          message: error.message,
        }
      }
    }

    return NextResponse.json({
      status,
      apiTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("MAL Health Check Error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}
