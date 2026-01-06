"use client";

import React, { useEffect, useState } from 'react';
import { Quote } from '@/components/posts/typography/quote';

interface QuoteItem {
  id?: number;
  text: string;
  author: string;
  source?: string | null;
}

export function QuotesFeed() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const response = await fetch('/api/quotes');
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes || []);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  if (loading) {
    return <p>Loading quotes...</p>;
  }

  if (!quotes || quotes.length === 0) {
    return <p>No quotes available to display.</p>;
  }

  return (
    <div className="quotes-feed-container">
      {quotes.map((item, index) => (
        <Quote key={index} author={item.author}>
          {item.text || `Collected thoughts from ${item.author}`}
        </Quote>
      ))}
    </div>
  );
}

export default QuotesFeed;
