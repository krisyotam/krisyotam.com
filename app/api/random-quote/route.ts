import { NextResponse } from 'next/server';
import quotesData from '../../../data/quotes.json';

export async function GET() {
  try {
    const quotes = quotesData.quotes;
    
    // Get a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

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