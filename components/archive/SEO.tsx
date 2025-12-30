import Head from "next/head";
import { DefaultSeo } from "next-seo";

// Base URL for the website
export const baseUrl = "https://krisyotam.com";

// Default SEO settings
export const defaultSEO = {
  title: "Kris Yotam",
  description: "Ideas, works, and reflections of a contemporary polymath",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    site_name: "Kris Yotam",
    images: [
      {
        url: `${baseUrl}/social.png`, // Replace with your social image URL
        alt: "Kris Yotam",
      },
    ],
  },
  twitter: {
    handle: "@krisyotam", // Your Twitter handle
    site: "@krisyotam", // Your Twitter site handle
    cardType: "summary_large_image",
  },
};

// SEO props interface for custom values
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export function SEO({ seo }: { seo?: SEOProps }) {
  return (
    <>
      <DefaultSeo
        {...{
          ...defaultSEO,
          openGraph: {
            ...defaultSEO.openGraph,
            images: [{ url: seo?.image || `${baseUrl}/social.png`, alt: seo?.title || "Website" }],
          },
          ...seo, // Ensure 'seo' is not undefined or null
        }}
      />
      <Head>
        <meta name="googlebot" content="index,follow" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {seo?.path && (
          <link
            rel="canonical"
            href={`${baseUrl}${seo.path === "/" ? "" : seo.path}`}
          />
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebSite",
              name: defaultSEO.title,
              url: baseUrl,
              image: defaultSEO.openGraph.images[0].url,
              author: {
                "@context": "http://schema.org",
                "@type": "Person",
                name: defaultSEO.title,
                url: baseUrl,
                jobTitle: "Mathematics Student", // Your job title
                alumniOf: "Indiana University", // Your university name
                gender: "male", // Your gender
                image: defaultSEO.openGraph.images[0].url,
                sameAs: [
                  "https://twitter.com/krisyotam", // Your Twitter handle
                  "https://www.linkedin.com/in/krisyotam", // Your LinkedIn profile
                  "https://writing.exchange/@krisyotam", // Your Mastodon profile
                ],
              },
            }),
          }}
        />

        <meta name="author" content="Kris Yotam" />
        <meta name="theme-color" content="#DFDFDE" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000" media="(prefers-color-scheme: dark)" />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <link rel="me" href="https://writing.exchange/@krisyotam" /> {/* Correct Mastodon URL */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed"
          href={`${baseUrl}/posts/rss`} // Replace with your RSS feed URL
        />
        <script
          defer
          src="https://your-analytics-provider.com/script.js"
        ></script> {/* Replace with your analytics script */}
      </Head>
    </>
  );
}
