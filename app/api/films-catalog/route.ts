import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'library', 'films.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return NextResponse.json(data.films || [])
  } catch (error) {
    console.error('Error reading films catalog:', error)
    return NextResponse.json({ error: 'Failed to load films catalog' }, { status: 500 })
  }
}
