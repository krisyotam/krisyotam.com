import React from 'react';
import { Quote } from '@/components/posts/typography/quote';
import quotesFromFile from '@/data/quotes.json';

interface HeaderQuoteItem {
  author: string;
  text?: string; // Optional text field for the actual quote
}

interface HeaderQuotesData {
  quotes: HeaderQuoteItem[];
}

const quotesData: HeaderQuotesData = quotesFromFile;

export function QuotesFeed() {
  if (!quotesData || !quotesData.quotes || quotesData.quotes.length === 0) {
    return <p>No quotes available to display.</p>;
  }

  return (
    <div className="quotes-feed-container">
      {quotesData.quotes.map((item, index) => (
        <Quote key={index} author={item.author}>
          {item.text || `Collected thoughts from ${item.author}`}
        </Quote>
      ))}
    </div>
  );
}

export default QuotesFeed;
