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

// Load Merriam-Webster data from API (paginated to avoid oversized responses)
async function loadMerriamData(): Promise<Map<string, string>> {
  if (fallbackDefinitionsMap) {
    return fallbackDefinitionsMap;
  }

  try {    fallbackDefinitionsMap = new Map();
    let page = 1;
    const limit = 50; // Smaller chunk size to avoid oversized responses
    let hasNext = true;

    // Load all pages
    while (hasNext) {
      const response = await fetch(`/api/data/reference/merriam-webster?page=${page}&limit=${limit}`, {
        cache: 'force-cache' // Use caching for build-time requests
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Merriam-Webster data: ${response.statusText}`);
      }
      
      const result = await response.json();
      const entries = result.data || [];
      
      // Add entries to the map
      entries.forEach((entry: any) => {
        if (entry.word && entry.definition) {
          fallbackDefinitionsMap!.set(normalizeWord(entry.word), entry.definition);
        }
      });
      
      hasNext = result.pagination?.hasNext || false;
      page++;
      
      // Safety check to prevent infinite loops
      if (page > 100) {
        console.warn('Merriam-Webster pagination exceeded 100 pages, stopping');
        break;
      }
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
