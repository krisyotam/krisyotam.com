import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  
  const validPasswords = [
    process.env.THEORY_PASSWORD_1,
    process.env.THEORY_PASSWORD_2,
    process.env.THEORY_PASSWORD_3,
    process.env.THEORY_PASSWORD_4,
    process.env.THEORY_PASSWORD_5,
  ]

  if (validPasswords.includes(password)) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false })
  }
}
