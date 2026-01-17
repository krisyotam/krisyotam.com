import { NextResponse } from 'next/server'
import { getReadingBlogs } from '@/lib/media-db'

export async function GET() {
  try {
    const blogs = getReadingBlogs()
    return NextResponse.json({ 'blog-posts': blogs })
  } catch (error) {
    console.error('Error reading blogs:', error)
    return NextResponse.json({ 'blog-posts': [] })
  }
}
