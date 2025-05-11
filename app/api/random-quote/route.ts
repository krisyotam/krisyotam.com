import { NextResponse } from 'next/server';
import quotesData from '../../../data/header-quotes.json';

export async function GET() {
  try {
    const quotes = quotesData.quotes;
    
    // Get a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return NextResponse.json(randomQuote);
  } catch (error) {
    console.error('Error retrieving random quote:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve a random quote' },
      { status: 500 }
    );
  }
} 