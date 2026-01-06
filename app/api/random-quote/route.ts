import { NextResponse } from 'next/server';
import { getRandomQuote } from '@/lib/system-db';

export async function GET() {
  try {
    const randomQuote = getRandomQuote();

    if (!randomQuote) {
      return NextResponse.json(
        { error: 'No quotes available' },
        { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }

    // Ensure the response is not cached by proxies/CDNs or the browser
    return NextResponse.json(randomQuote, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error retrieving random quote:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve a random quote' },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  }
} 