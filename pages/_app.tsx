import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Head from 'next/head';
import '@/styles/globals.css'; // Global styles

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Check if the current path is under "app/posts"
    const isSpecialPost = window.location.pathname.startsWith('/posts');

    if (isSpecialPost) {
      // Dynamically load special-posts.css if the post is in the "app/posts" directory
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/styles/special-posts.css'; // Path to special CSS file
      document.head.appendChild(link);
    }
  }, [pageProps]);

  return <Component {...pageProps} />;
}
