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

// Cache for loaded data
let definitionsMap: Map<string, string> | null = null;
let fallbackDefinitionsMap: Map<string, string> | null = null;

// Load OED data from API
async function loadOEDData(): Promise<Map<string, string>> {
  if (definitionsMap) {
    return definitionsMap;
  }

  try {
    const response = await fetch('/api/data/reference/oed');
    if (!response.ok) {
      throw new Error(`Failed to fetch OED data: ${response.statusText}`);
    }
    const oed = await response.json() as OEDEntry[];
    
    definitionsMap = new Map(
      oed.map(e => [normalizeWord(e.word), e.definition])
    );
    
    return definitionsMap;
  } catch (error) {
    console.error('Error loading OED data:', error);
    return new Map();
  }
}

// Load Merriam-Webster data from API
async function loadMerriamData(): Promise<Map<string, string>> {
  if (fallbackDefinitionsMap) {
    return fallbackDefinitionsMap;
  }

  try {
    const response = await fetch('/api/data/reference/merriam-webster');
    if (!response.ok) {
      throw new Error(`Failed to fetch Merriam-Webster data: ${response.statusText}`);
    }
    const merriam = await response.json();

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

    return fallbackDefinitionsMap;
  } catch (error) {
    console.error('Error loading Merriam-Webster data:', error);
    return new Map();
  }
}

/**
 * Returns definition from OED first, then fallback Merriam-Webster if not found.
 */
export async function getDefinitionFromOED(
  word: string
): Promise<string | null> {
  const cleaned = normalizeWord(word);
  console.log(`[DEFINE] Looking up cleaned word: '${cleaned}'`);

  // Load the data maps
  const oedMap = await loadOEDData();
  const merriamMap = await loadMerriamData();

  const exactMatch = oedMap.get(cleaned);
  if (exactMatch) {
    console.log(`[DEFINE] ✅ Found in OED.`);
    return exactMatch;
  }

  const fallbackMatch = merriamMap.get(cleaned);
  if (fallbackMatch) {
    console.log(`[DEFINE] ✅ Found in Merriam-Webster.`);
    return fallbackMatch;
  }

  console.error(`[DEFINE] ❌ No match found.`);
  return null;
}
