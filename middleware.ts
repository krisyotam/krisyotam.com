import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getTodaysClacks } from "./lib/memoriam"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const name = getTodaysClacks()
  if (name) {
    response.headers.set("X-Clacks-Overhead", name)
  }

  return response
}

export const config = {
  // Run middleware for most app routes, but exclude API, next internals, vercel internals, and direct asset requests
  matcher: ["/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)"],
}

