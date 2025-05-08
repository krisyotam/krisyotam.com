import { NextResponse } from 'next/server';
import quotes from '@/data/header-quotes.json';

export async function GET() {
  try {
    // Get a random quote from the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
    const randomQuote = quotes.quotes[randomIndex];
    
    // Return the random quote
    return NextResponse.json(randomQuote);
  } catch (error) {
    console.error('Error fetching random quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random quote' },
      { status: 500 }
    );
  }
} 