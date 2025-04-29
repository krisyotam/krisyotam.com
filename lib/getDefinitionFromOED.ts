import oed from '@/data/reference/oed.json';
import merriam from '@/data/reference/merriam-webster.json';

interface OEDEntry {
  _id?: { $oid: string };
  word: string;
  definition: string;
  __v?: number;
}

// Normalize words
function normalizeWord(word: string): string {
  return word
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .trim()
    .toUpperCase();
}

// Build OED map
const definitionsMap: Map<string, string> = new Map(
  (oed as OEDEntry[]).map(e => [normalizeWord(e.word), e.definition])
);

// Build fallback Merriam map
let fallbackDefinitionsMap: Map<string, string>;

if (Array.isArray(merriam)) {
  fallbackDefinitionsMap = new Map(
    (merriam as OEDEntry[]).map(e => [normalizeWord(e.word), e.definition])
  );
} else {
  fallbackDefinitionsMap = new Map(
    Object.entries(merriam).map(([word, definition]) => [
      normalizeWord(word),
      typeof definition === 'string' ? definition : (definition as any).definition
    ])
  );
}

/**
 * Returns definition from OED first, then fallback Merriam-Webster if not found.
 */
export async function getDefinitionFromOED(
  word: string
): Promise<string | null> {
  const cleaned = normalizeWord(word);
  console.log(`[DEFINE] Looking up cleaned word: '${cleaned}'`);

  const exactMatch = definitionsMap.get(cleaned);
  if (exactMatch) {
    console.log(`[DEFINE] ✅ Found in OED.`);
    return exactMatch;
  }

  const fallbackMatch = fallbackDefinitionsMap.get(cleaned);
  if (fallbackMatch) {
    console.log(`[DEFINE] ✅ Found in Merriam-Webster.`);
    return fallbackMatch;
  }

  console.error(`[DEFINE] ❌ No match found.`);
  return null;
}
