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

function isErrorWithMessage(error: unknown): error is { message: string; stack?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

function toErrorWithMessage(maybeError: unknown): { message: string; stack?: string } {
  if (isErrorWithMessage(maybeError)) return maybeError
  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[doc/[id]] Processing request for ID: ${params.id}`);
  
  try {
    const id = params.id;
    
    // Load references data
    const dataPath = path.join(process.cwd(), 'data', 'references.json');
    console.log(`[doc/[id]] Looking for references.json at: ${dataPath}`);
    
    let data;
    try {
      data = await fs.readFile(dataPath, 'utf8');
      console.log(`[doc/[id]] Successfully loaded references.json`);
    } catch (fileError: unknown) {
      const errorWithMessage = toErrorWithMessage(fileError);
      console.error(`[doc/[id]] Error loading references.json:`, errorWithMessage);
      return new Response(`Could not load references data: ${errorWithMessage.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    const references: Reference[] = JSON.parse(data);
    console.log(`[doc/[id]] Parsed ${references.length} references`);
    
    // Find the reference with the matching ID
    const reference = references.find(ref => ref.id === id);
    
    if (!reference) {
      console.log(`[doc/[id]] No reference found with ID: ${id}`);
      console.log(`[doc/[id]] Available IDs: ${references.map(r => r.id).join(', ')}`);
      return new Response(`Document not found with ID: ${id}`, { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    console.log(`[doc/[id]] Found reference: ${reference.title}, URL: ${reference.url}`);
    
    // Handle different types of URLs
    if (reference.url.startsWith('http')) {
      // External URL - redirect to it
      console.log(`[doc/[id]] Redirecting to external URL: ${reference.url}`);
      return NextResponse.redirect(reference.url);
    } else {
      // Internal URL - use the path as is, since files are accessed through
      // absolute paths or symlinks from their original locations
      
      // Just redirect to the URL as specified in the reference
      const fullUrl = new URL(reference.url, request.nextUrl.origin);
      console.log(`[doc/[id]] Redirecting to internal URL: ${fullUrl.toString()}`);
      return NextResponse.redirect(fullUrl);
    }
  } catch (error: unknown) {
    const errorWithMessage = toErrorWithMessage(error);
    console.error('[doc/[id]] Unhandled error:', errorWithMessage);
    return new Response(`Error processing request: ${errorWithMessage.message}\n\n${errorWithMessage.stack}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
} 