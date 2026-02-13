/**
 * ============================================================================
 * OED Definition Lookup Library
 * Author: Kris Yotam
 * Date: 2026-01-04
 * Filename: getDefinitionFromOED.ts
 * Description: Provides word definition lookup from OED and Merriam-Webster
 *              dictionaries via API. Designed for client-side use.
 * ============================================================================
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize words for consistent lookup
 */
function normalizeWord(word: string): string {
  return word
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim()
    .toUpperCase();
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Returns definition from OED first, then fallback Merriam-Webster if not found.
 * This function uses the API for client-side compatibility.
 *
 * @param word - The word to look up
 * @returns The definition string or null if not found
 */
export async function getDefinitionFromOED(
  word: string
): Promise<string | null> {
  const cleaned = normalizeWord(word);
  console.log(`[DEFINE] Looking up cleaned word: '${cleaned}'`);

  try {
    // Call the dictionary API
    const response = await fetch(
      `/api/reference?type=dictionary&word=${encodeURIComponent(cleaned)}`
    );

    if (!response.ok) {
      // Try lowercase for Merriam-Webster fallback
      const fallbackResponse = await fetch(
        `/api/reference?type=dictionary&word=${encodeURIComponent(cleaned.toLowerCase())}`
      );

      if (!fallbackResponse.ok) {
        console.error(`[DEFINE] No match found.`);
        return null;
      }

      const fallbackData = await fallbackResponse.json();
      console.log(`[DEFINE] Found in fallback lookup.`);
      return fallbackData.definition || null;
    }

    const data = await response.json();
    console.log(`[DEFINE] Found definition.`);
    return data.definition || null;
  } catch (error) {
    console.error(`[DEFINE] Error fetching definition:`, error);
    return null;
  }
}
