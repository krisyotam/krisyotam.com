import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/utils/posts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ 
        error: "Please provide a slug parameter",
        example: "/api/og-debug?slug=bash-style-guide" 
      }, { status: 400 });
    }
    
    // Get all posts
    const posts = await getAllPosts();
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      return NextResponse.json({ 
        error: "Post not found", 
        slug: slug 
      }, { status: 404 });
    }
    
    // Build OG metadata like the generateMetadata function does
    const coverUrl = post.cover_image || 
      post.cover || 
      `https://picsum.photos/1200/630?text=${encodeURIComponent(post.title)}`;
    
    const title = post.title;
    const subtitle = post.subtitle ? ` - ${post.subtitle}` : '';
    const description = post.preview || "Thoughts on math, poetry, and more.";
    
    // For blog post URL construction, extract year from date
    const year = new Date(post.date).getFullYear();
    const url = `https://krisyotam.com/blog/${year}/${slug}`;
    
    // Generate sample HTML with the OG tags
    const ogTags = {
      title: `${title}${subtitle} | Kris Yotam`,
      description,
      openGraph: {
        title: title + subtitle,
        description,
        url,
        siteName: 'Kris Yotam',
        images: [{ 
          url: coverUrl, 
          width: 1200, 
          height: 630, 
          alt: title 
        }],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: title + subtitle,
        description,
        images: [coverUrl],
        creator: '@krisyotam',
      },
    };
    
    // Create sample HTML
    const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>${ogTags.title}</title>
  <meta name="description" content="${ogTags.description}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${ogTags.openGraph.type}" />
  <meta property="og:url" content="${ogTags.openGraph.url}" />
  <meta property="og:title" content="${ogTags.openGraph.title}" />
  <meta property="og:description" content="${ogTags.openGraph.description}" />
  <meta property="og:image" content="${ogTags.openGraph.images[0].url}" />
  <meta property="og:image:width" content="${ogTags.openGraph.images[0].width}" />
  <meta property="og:image:height" content="${ogTags.openGraph.images[0].height}" />
  <meta property="og:image:alt" content="${ogTags.openGraph.images[0].alt}" />
  <meta property="og:site_name" content="${ogTags.openGraph.siteName}" />
  <meta property="og:locale" content="${ogTags.openGraph.locale}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="${ogTags.twitter.card}" />
  <meta name="twitter:title" content="${ogTags.twitter.title}" />
  <meta name="twitter:description" content="${ogTags.twitter.description}" />
  <meta name="twitter:image" content="${ogTags.twitter.images[0]}" />
  <meta name="twitter:creator" content="${ogTags.twitter.creator}" />
</head>
<body>
  <h1>OG Debug for: ${post.title}</h1>
  <p>This page shows the Open Graph tags that should be generated for this post.</p>
  
  <h2>Post Data:</h2>
  <pre>${JSON.stringify(post, null, 2)}</pre>
  
  <h2>OG Tags:</h2>
  <pre>${JSON.stringify(ogTags, null, 2)}</pre>
  
  <h2>Testing Tools:</h2>
  <ul>
    <li><a href="https://cards-dev.twitter.com/validator?url=${encodeURIComponent(url)}" target="_blank">Twitter Card Validator</a></li>
    <li><a href="https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}" target="_blank">Facebook Sharing Debugger</a></li>
    <li><a href="https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}" target="_blank">LinkedIn Post Inspector</a></li>
  </ul>
  
  <p>To force Discord to refresh its cache, try adding a random query parameter: <a href="${url}?refresh=${Date.now()}">${url}?refresh=${Date.now()}</a></p>
</body>
</html>
    `;
    
    return new Response(sampleHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('Error in OG debug endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 