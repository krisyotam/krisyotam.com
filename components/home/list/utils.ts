/**
 * List View Utilities
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Utility functions for list view quote formatting
 */

/**
 * Format quote text with line breaks at specified character limit
 */
export function formatQuoteWithLineBreaks(text: string, maxCharsPerLine = 75): string {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  words.forEach((word) => {
    // If adding this word would exceed the max length, start a new line
    if (currentLine.length + word.length + 1 > maxCharsPerLine && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = word
    } else {
      // Add word to current line (with a space if not the first word on the line)
      currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`
    }
  })

  // Add the last line if it's not empty
  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines.join("\n")
}

/**
 * Get a new random quote from the API
 */
export async function getNewRandomQuote(): Promise<{ text: string; author: string }> {
  try {
    const response = await fetch(`/api/random-quote?ts=${Date.now()}`, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch new quote:', error);
    throw error;
  }
}
