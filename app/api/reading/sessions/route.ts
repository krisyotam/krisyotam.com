import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const readingDir = path.join(process.cwd(), 'data', 'reading', 'reading');
    const files = fs.readdirSync(readingDir);
    const allSessions: any[] = [];    for (const file of files) {
      // Skip to-be-read.json as it's handled separately
      if (file.endsWith('.json') && file !== 'to-be-read.json') {
        console.log(`Processing file: ${file}`);
        
        const filePath = path.join(readingDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);        // Handle different file structures and normalize the data
        if (data.books) {
          // Books have book_slug and reading_sessions
          const normalizedBooks = data.books.map((item: any) => ({
            ...item,
            content_slug: item.book_slug,
            content_type: 'book'
          }));
          allSessions.push(...normalizedBooks);
        } else if (data.research_articles) {
          // Research articles have article_slug and reading_sessions  
          const normalizedArticles = data.research_articles.map((item: any) => ({
            ...item,
            content_slug: item.article_slug,
            content_type: 'research_article'
          }));
          allSessions.push(...normalizedArticles);
        } else if (data.audiobooks) {
          // Audiobooks have book_slug and listening_sessions
          const normalizedAudiobooks = data.audiobooks.map((item: any) => ({
            ...item,
            content_slug: item.book_slug,
            content_type: 'audiobook',
            reading_sessions: item.listening_sessions // Normalize session name
          }));
          allSessions.push(...normalizedAudiobooks);
        } else if (data.poems) {
          // Poems have poem_slug and reading_sessions
          const normalizedPoems = data.poems.map((item: any) => ({
            ...item,
            content_slug: item.poem_slug,
            content_type: 'poem'
          }));
          allSessions.push(...normalizedPoems);
        } else if (data.light_novels) {
          // Light novels have novel_slug and reading_sessions
          const normalizedNovels = data.light_novels.map((item: any) => ({
            ...item,
            content_slug: item.novel_slug,
            content_type: 'light_novel'
          }));
          allSessions.push(...normalizedNovels);
        } else if (data.blog_posts) {
          // Blog posts have post_slug and reading_sessions
          const normalizedPosts = data.blog_posts.map((item: any) => ({
            ...item,
            content_slug: item.post_slug,
            content_type: 'blog_post'
          }));
          allSessions.push(...normalizedPosts);
        }
      }
    }

    console.log('Aggregated sessions:', allSessions);

    return NextResponse.json(allSessions);
  } catch (error) {
    console.error('Error loading reading sessions:', error);
    return NextResponse.json([], { status: 500 });
  }
}
