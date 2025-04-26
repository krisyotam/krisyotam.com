// **************************************************************************  
// getDefinitionFromOED.ts  
// **************************************************************************  

interface OEDEntry {
    _id: { $oid: string };
    word: string;
    definition: string;
    __v: number;
  }
  
  // module-level cache
  let definitionsMap: Map<string, string> | null = null;
  
  async function fetchAndBuildMap(): Promise<Map<string, string>> {
    if (definitionsMap) return definitionsMap;
  
    const url = 'https://raw.githubusercontent.com/krisyotam/oed/main/oed.json';
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch OED data: ${res.status}`);
      return new Map();
    }
  
    const entries: OEDEntry[] = await res.json();
    // build map keyed by uppercase word
    definitionsMap = new Map(
      entries.map(e => [e.word.toUpperCase(), e.definition])
    );
    return definitionsMap;
  }
  
  /**
   * Returns the definition for a given word (case-insensitive).
   */
  export async function getDefinitionFromOED(
    word: string
  ): Promise<string | null> {
    const map = await fetchAndBuildMap();
    return map.get(word.trim().toUpperCase()) ?? null;
  }
  