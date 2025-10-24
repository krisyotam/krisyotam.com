'use client';

import { useEffect } from 'react';

export default function MusicRedirect() {
  useEffect(() => {
    window.open('https://www.last.fm/user/krisyotam', '_blank');
    // Redirect back to home page after opening Last.fm
    window.location.href = '/';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Opening Last.fm in a new tab...</p>
    </div>
  );
} 