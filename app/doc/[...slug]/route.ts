import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Prevent caching to ensure search engines always get the latest document
export const dynamic = 'force-dynamic';

interface Reference {
  id: string;
  title: string;
  type: string;
  format: string;
  author: string;
  date: string;
  url: string;
  preview: string;
  status: string;
  confidence: string;
  importance: number;
}

interface ErrorWithMessage {
  message: string
  stack?: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  console.log(`[doc/[...slug]] Processing request for slug: ${params.slug.join('/')}`);

  try {
    // We only want the last part of the slug path (e.g., "sample.pdf" from any nested path)
    const requestedFilename = params.slug[params.slug.length - 1];
    console.log(`[doc/[...slug]] Looking for file with name: ${requestedFilename}`);
    
    // Load references data
    const dataPath = path.join(process.cwd(), 'data', 'references.json');
    console.log(`[doc/[...slug]] Looking for references.json at: ${dataPath}`);
    
    let data;
    try {
      data = await fs.readFile(dataPath, 'utf8');
      console.log(`[doc/[...slug]] Successfully loaded references.json`);
    } catch (fileError: unknown) {
      const errorWithMessage = toErrorWithMessage(fileError);
      console.error(`[doc/[...slug]] Error loading references.json:`, errorWithMessage);
      return new Response(`Could not load references data: ${errorWithMessage.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    const references: Reference[] = JSON.parse(data);
    console.log(`[doc/[...slug]] Parsed ${references.length} references`);

    // Log all filenames from URLs for debugging
    const allFilenames = references.map(ref => {
      const filePart = ref.url.split('/').pop() || '';
      return `${ref.id}: ${filePart}`;
    });
    console.log(`[doc/[...slug]] Available filenames: ${allFilenames.join(', ')}`);
    
    // Find a reference where the last part of the URL matches the requested filename
    const reference = references.find(ref => {
      // Extract just the filename from the URL
      let urlFilename;
      
      if (ref.url.startsWith('http')) {
        // For http URLs, get the path and extract the last segment
        try {
          const urlObj = new URL(ref.url);
          urlFilename = urlObj.pathname.split('/').pop() || '';
          console.log(`[doc/[...slug]] Reference ${ref.id} has URL ${ref.url}, extracted filename: ${urlFilename}`);
        } catch (e) {
          // If URL parsing fails, try a simple split
          urlFilename = ref.url.split('/').pop() || '';
          console.log(`[doc/[...slug]] Reference ${ref.id} URL parsing failed, using simple extraction: ${urlFilename}`);
        }
      } else {
        // For local paths, just get the last segment
        urlFilename = ref.url.split('/').pop() || '';
        console.log(`[doc/[...slug]] Reference ${ref.id} has local path ${ref.url}, extracted filename: ${urlFilename}`);
      }
      
      // Check if this filename matches what was requested
      const matches = urlFilename === requestedFilename;
      if (matches) {
        console.log(`[doc/[...slug]] Found matching reference with ID: ${ref.id}`);
      }
      return matches;
    });
    
    if (!reference) {
      console.log(`[doc/[...slug]] No reference found with filename: ${requestedFilename}`);
      return new Response(`Document not found: ${requestedFilename}`, { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    console.log(`[doc/[...slug]] Found reference: ${reference.title}, URL: ${reference.url}`);
    
    // Handle different types of URLs
    if (reference.url.startsWith('http')) {
      // External URL - redirect to it
      console.log(`[doc/[...slug]] Redirecting to external URL: ${reference.url}`);
      return NextResponse.redirect(reference.url);
    } else {
      // Internal URL - use as is
      const fullUrl = new URL(reference.url, request.nextUrl.origin);
      console.log(`[doc/[...slug]] Redirecting to internal URL: ${fullUrl.toString()}`);
      return NextResponse.redirect(fullUrl);
    }
  } catch (error: unknown) {
    const errorWithMessage = toErrorWithMessage(error)
    return new Response(`Error processing request: ${errorWithMessage.message}${errorWithMessage.stack ? `\n\n${errorWithMessage.stack}` : ""}`, {
      status: 500,
    })
  }
} 