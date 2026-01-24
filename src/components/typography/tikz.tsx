'use client'
import { useState, useEffect, ReactNode } from 'react'
import dynamic from 'next/dynamic'

interface TikzProps {
  children: ReactNode
}

// Client-side TikZ renderer component
const TikzRenderer = ({ children }: TikzProps) => {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!children) {
      setError('No TikZ code provided');
      setIsLoading(false);
      return;
    }

    // Normalize the children to a string
    const tikzCode = typeof children === 'string' 
      ? children 
      : children?.toString() || '';

    // Send directly to the API for rendering
    fetch('/api/utils?type=tikz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: tikzCode }),
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            setError(`Error: ${res.status} - ${text}`);
            throw new Error(text);
          });
        }
        return res.text();
      })
      .then(svg => {
        if (!svg.includes('<svg')) {
          throw new Error('Invalid SVG content received');
        }
        setSvg(svg);
      })
      .catch(err => {
        console.error('Failed to render TikZ:', err);
        setError(err.message || 'Failed to render diagram');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [children]);

  if (error) {
    return (
      <div style={{
        maxWidth: '100%',
        margin: '1em auto',
        textAlign: 'center',
        color: 'red',
        border: '1px solid red',
        padding: '1em',
      }}>
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        maxWidth: '100%',
        margin: '1em auto',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '100%',
        margin: '1em auto',
        display: 'block',
      }}
      dangerouslySetInnerHTML={{ __html: svg || '' }}
    />
  );
}

// Export a client-only version with no SSR to avoid hydration errors
export default dynamic(() => Promise.resolve(TikzRenderer), { ssr: false })
