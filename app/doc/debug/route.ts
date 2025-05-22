import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Debug route to check if routes are working and test file access
function isErrorWithMessage(error: unknown): error is { message: string; stack?: string; name?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

function toErrorWithMessage(maybeError: unknown): { message: string; stack?: string; name?: string } {
  if (isErrorWithMessage(maybeError)) return maybeError
  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

export async function GET(request: NextRequest) {
  try {
    // Try to load references.json
    const dataPath = path.join(process.cwd(), 'data', 'references.json');
    let fileContent;
    let fileExists = false;
    
    try {
      fileContent = await fs.readFile(dataPath, 'utf8');
      fileExists = true;
    } catch (fileError: unknown) {
      const errorWithMessage = toErrorWithMessage(fileError);
      fileContent = `Error reading file: ${errorWithMessage.message}`;
    }

    // Return a JSON response with debugging info
    return NextResponse.json({
      success: true,
      message: 'Debug route is working',
      routes: {
        current: request.nextUrl.pathname,
        origin: request.nextUrl.origin
      },
      file: {
        path: dataPath,
        exists: fileExists,
        sampleContent: fileExists ? fileContent.substring(0, 200) + '...' : null
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        nextPublicEnv: process.env.NEXT_PUBLIC_ENV || 'not set'
      }
    });
  } catch (error: unknown) {
    const errorWithMessage = toErrorWithMessage(error);
    // Return detailed error information
    return NextResponse.json({
      success: false,
      error: {
        message: errorWithMessage.message,
        stack: errorWithMessage.stack,
        name: errorWithMessage.name
      }
    }, { status: 500 });
  }
} 