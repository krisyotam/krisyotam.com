/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║               4 0 4   S U G G E S T E R                                   ║
 * ║                                                                           ║
 * ║        "A Gentleperson's Guide to Lost Paths"                             ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Author:      Kris Yotam                                                  ║
 * ║  License:     CC-0                                                        ║
 * ║  Created:     2023-08-20                                                  ║
 * ║  Refactored:  2026-01-06                                                  ║
 * ║                                                                           ║
 * ║  Description:                                                             ║
 * ║  This script graces the humble 404 error page with an air of utility.     ║
 * ║  When a visitor wanders into the void of a non-existent path, this        ║
 * ║  script—employing a symphony of string similarity algorithms—divines      ║
 * ║  the most likely intended destinations and presents them with grace.      ║
 * ║                                                                           ║
 * ║  Algorithms Employed:                                                     ║
 * ║    • Levenshtein Distance (bounded, for efficiency)                       ║
 * ║    • Jaro-Winkler Similarity (for fuzzy matching)                         ║
 * ║    • Soundex Phonetic Encoding (for acoustic approximation)               ║
 * ║    • Composite Scoring (weighted ensemble)                                ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║    • Fetches valid paths from the server-side API                         ║
 * ║    • Presents ≤10 unique, most similar URLs as suggestions                ║
 * ║    • Gracefully injects suggestions into the page DOM                     ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/* ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Maximum number of suggestions to present */
const MAX_SUGGESTIONS = 10

/** Maximum edit distance to consider a path as a potential match */
const MAX_DISTANCE = 8

/* ═══════════════════════════════════════════════════════════════════════════
 * SCRIPT INITIALIZATION GUARD
 * ═══════════════════════════════════════════════════════════════════════════ */

if (typeof window.URL_SUGGESTER_LOADED === 'undefined') {
  window.URL_SUGGESTER_LOADED = true

  /* ═════════════════════════════════════════════════════════════════════════
   * API COMMUNICATION
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Fetches the list of valid paths from the server-side endpoint
   * @returns {Promise<string[]>} Promise resolving to an array of valid site paths
   */
  async function collectPaths() {
    try {
      const response = await fetch('/api/utils?type=404-suggester')

      if (!response.ok) {
        console.warn(`404 Suggester: API responded with status ${response.status}`)
        return []
      }

      const body = await response.json()

      // Expose the site map on window for debugging and potential UI enhancements
      if (body && body.map) {
        try {
          window.URL_SUGGESTER_MAP = body.map
        } catch (e) {
          // Ignore in restrictive environments
        }
      }

      return Array.isArray(body && body.paths) ? body.paths : []
    } catch (error) {
      console.error('404 Suggester: Error fetching paths', error)
      return []
    }
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * STRING SIMILARITY ALGORITHMS
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Calculates Levenshtein distance with early termination optimization
   * @param {string} a First string
   * @param {string} b Second string
   * @param {number} maxDistance Maximum distance to compute before early termination
   * @returns {number} The edit distance, or maxDistance + 1 if exceeded
   */
  function boundedLevenshteinDistance(a, b, maxDistance) {
    // Early termination if length difference exceeds maximum
    if (Math.abs(a.length - b.length) > maxDistance) {
      return maxDistance + 1
    }

    const matrix = []

    // Initialize first column
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }

    // Initialize first row
    for (let j = 1; j <= a.length; j++) {
      matrix[0][j] = j
    }

    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
      let minDistance = maxDistance + 1

      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        }
        minDistance = Math.min(minDistance, matrix[i][j])
      }

      // Early termination if all values in row exceed maximum
      if (minDistance > maxDistance) {
        return maxDistance + 1
      }
    }

    return matrix[b.length][a.length]
  }

  /**
   * Computes Jaro-Winkler similarity between two strings
   * @param {string} s1 First string
   * @param {string} s2 Second string
   * @returns {number} Similarity score between 0 (no similarity) and 1 (identical)
   */
  function jaroWinkler(s1, s2) {
    if (!s1 || !s2) return 0

    const str1 = s1.toLowerCase()
    const str2 = s2.toLowerCase()

    if (str1 === str2) return 1

    const maxDist = Math.floor(Math.max(str1.length, str2.length) / 2) - 1
    const matched1 = new Array(str1.length).fill(false)
    const matched2 = new Array(str2.length).fill(false)
    let matches = 0

    // Find matching characters
    for (let i = 0; i < str1.length; i++) {
      const start = Math.max(0, i - maxDist)
      const end = Math.min(str2.length - 1, i + maxDist)

      for (let j = start; j <= end; j++) {
        if (matched2[j]) continue
        if (str1[i] !== str2[j]) continue

        matched1[i] = true
        matched2[j] = true
        matches++
        break
      }
    }

    if (matches === 0) return 0

    // Count transpositions
    let transpositions = 0
    let k = 0

    for (let i = 0; i < str1.length; i++) {
      if (!matched1[i]) continue
      while (!matched2[k]) k++
      if (str1[i] !== str2[k]) transpositions++
      k++
    }

    transpositions = transpositions / 2

    // Calculate Jaro similarity
    const m = matches
    const jaro = (m / str1.length + m / str2.length + (m - transpositions) / m) / 3

    // Apply Winkler prefix boost
    let prefixLength = 0
    const prefixLimit = 4
    const scalingFactor = 0.1

    for (let i = 0; i < Math.min(prefixLimit, str1.length, str2.length); i++) {
      if (str1[i] === str2[i]) prefixLength++
      else break
    }

    return jaro + prefixLength * scalingFactor * (1 - jaro)
  }

  /**
   * Computes Soundex phonetic encoding for a word
   * @param {string} word Input word
   * @returns {string} Four-character Soundex code
   */
  function soundex(word) {
    if (!word) return ''

    const s = word.toUpperCase().replace(/[^A-Z]/g, '')
    if (!s) return ''

    const first = s[0]
    const codeMap = {
      B: 1, F: 1, P: 1, V: 1,
      C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2,
      D: 3, T: 3,
      L: 4,
      M: 5, N: 5,
      R: 6
    }

    let prev = codeMap[first] || 0
    let out = first

    for (let i = 1; i < s.length && out.length < 4; i++) {
      const c = s[i]
      const code = codeMap[c] || 0
      if (code === prev) continue
      if (code !== 0) out += String(code)
      prev = code
    }

    while (out.length < 4) out += '0'
    return out
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * PATH NORMALIZATION & TOKENIZATION
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Normalizes a path for comparison
   * @param {string} p Input path
   * @returns {string} Normalized path string
   */
  function normalizePath(p) {
    if (!p || typeof p !== 'string') return ''

    return p
      .toLowerCase()
      .trim()
      .replace(/\.html?$|\.mdx?$|\.md$/g, '')
      .replace(/[^a-z0-9/]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/(^-|-$)/g, '')
      .replace(/\/+$/g, '')
  }

  /**
   * Tokenizes a path into segments and words
   * @param {string} p Input path
   * @returns {{segments: string[], words: string[]}} Tokenized path object
   */
  function tokenizePath(p) {
    const norm = normalizePath(p)
    const segments = norm.split('/').filter(Boolean)
    const words = []

    segments.forEach((seg) => {
      seg.split(/[-_]+/).forEach((w) => {
        if (w) words.push(w)
      })
    })

    return { segments, words }
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * COMPOSITE SCORING
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Computes word-level normalized Levenshtein distance
   * @param {string[]} targetWords Words from the target path
   * @param {string[]} candWords Words from the candidate path
   * @returns {number} Normalized distance (lower is better)
   */
  function wordLevelDistance(targetWords, candWords) {
    if (!targetWords || targetWords.length === 0) return 0
    if (!candWords || candWords.length === 0) return Infinity

    let sum = 0

    targetWords.forEach((tw) => {
      let best = Infinity

      candWords.forEach((cw) => {
        const d = boundedLevenshteinDistance(tw, cw, Math.max(tw.length, cw.length))
        const norm = d / Math.max(1, Math.max(tw.length, cw.length))
        if (norm < best) best = norm
      })

      sum += best
    })

    return sum / targetWords.length
  }

  /**
   * Computes a composite similarity score using multiple algorithms
   * @param {string} targetPath The path the user attempted to access
   * @param {string} candidatePath A potential matching path
   * @returns {number} Composite score (lower is better)
   */
  function compositeScore(targetPath, candidatePath) {
    const target = tokenizePath(targetPath)
    const candidate = tokenizePath(candidatePath)

    // Word-level normalized Levenshtein (0 = best)
    const wordLev = wordLevelDistance(target.words, candidate.words)

    // Jaro-Winkler on full normalized path (1 = best) → convert to distance
    const jw = jaroWinkler(normalizePath(targetPath), normalizePath(candidatePath))
    const jwDist = 1 - jw

    // Phonetic boost: proportion of words whose Soundex matches
    let phoneticMatches = 0

    target.words.forEach((tw) => {
      const ts = soundex(tw)
      candidate.words.forEach((cw) => {
        if (ts && ts === soundex(cw)) phoneticMatches++
      })
    })

    const phoneticRatio = target.words.length ? phoneticMatches / target.words.length : 0
    const phoneticBoost = 1 - phoneticRatio // Lower is better

    // Weighted combination
    const score = (wordLev * 0.6) + (jwDist * 0.3) + (phoneticBoost * 0.1)
    return score
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * URL SIMILARITY SEARCH
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Finds URLs most similar to the target path
   * @param {string[]} paths Array of valid site paths
   * @param {string} targetPath The path that resulted in 404
   * @param {number} n Maximum number of suggestions
   * @param {number} maxDistance Maximum edit distance to consider
   * @returns {{path: string, url: string}[]} Array of URL suggestions
   */
  function findSimilarUrls(paths, targetPath, n = MAX_SUGGESTIONS, maxDistance = MAX_DISTANCE) {
    // Quick filter based on length difference
    const potentialMatches = paths.filter(
      (path) => Math.abs(path.length - targetPath.length) <= maxDistance
    )

    // Apply folder preference boost if applicable
    const folderPrefix = (function () {
      try {
        const map = window.URL_SUGGESTER_MAP
        if (!map || !map.folders) return null
        const seg = targetPath.split('/').filter(Boolean)[0]
        if (seg && map.folders[seg]) return `/${seg}/`
      } catch (e) {
        // Ignore errors
      }
      return null
    })()

    // Score all potential matches
    const scored = potentialMatches
      .map((path) => {
        const score = compositeScore(targetPath, path)
        const folderBoost = folderPrefix && path.startsWith(folderPrefix) ? 0.15 : 0
        return { path, score: score - folderBoost }
      })
      .filter((item) => Number.isFinite(item.score))

    // Sort by score (ascending)
    scored.sort((a, b) => a.score - b.score)

    // Deduplicate while preserving order
    const seenUrls = new Set()
    const uniqueSuggestions = []

    for (const item of scored) {
      if (seenUrls.has(item.path)) continue
      seenUrls.add(item.path)
      uniqueSuggestions.push(item)
      if (uniqueSuggestions.length >= n) break
    }

    return uniqueSuggestions.map((item) => ({
      path: item.path,
      url: window.location.origin + item.path
    }))
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * DOM UTILITIES
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Creates a DOM element from an HTML string
   * @param {string} html HTML string
   * @returns {Element} The created element
   */
  function elementFromHTML(html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstElementChild
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * SUGGESTION INJECTION
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Injects URL suggestions into the page DOM
   * @param {string} currentPath The path that resulted in 404
   * @param {{path: string, url: string}[]} suggestions Array of URL suggestions
   */
  function injectSuggestions(currentPath, suggestions) {
    const isDedicatedContainer = !!document.getElementById('url-suggestions-container')

    const suggestionsHtml = suggestions.length > 0
      ? suggestions
          .map((item) => `<li class="py-3 px-4"><a class="link-live block" href="${item.url}"><code>${item.path}</code></a></li>`)
          .join('')
      : `<li class="py-3 px-4"><strong>No similar URLs found.</strong></li>`

    let suggestionsElement

    if (isDedicatedContainer) {
      // Only produce the inner list so the page's card header remains
      suggestionsElement = elementFromHTML(
        `<div><ul class="divide-y divide-border">${suggestionsHtml}</ul></div>`
      )
    } else {
      // Full fallback section
      suggestionsElement = elementFromHTML(`
        <section class="space-y-4">
          <h2 class="text-2xl font-semibold" id="guessed-urls">Suggested pages</h2>
          <p class="text-muted-foreground">Did you mean one of these? (<code>${currentPath}</code>)</p>
          <div>
            <ul class="space-y-2">${suggestionsHtml}</ul>
          </div>
        </section>
      `)
    }

    // Attempt injection into various containers
    const suggestionsContainer = document.getElementById('url-suggestions-container')
    if (suggestionsContainer) {
      suggestionsContainer.innerHTML = ''
      suggestionsContainer.appendChild(suggestionsElement)
      console.log('404 Suggester: Injected into #url-suggestions-container')
      return
    }

    const markdownBody = document.getElementById('markdownBody')
    if (markdownBody) {
      const otherOptions = document.getElementById('other-options')
      if (otherOptions) {
        markdownBody.insertBefore(suggestionsElement, otherOptions)
        console.log('404 Suggester: Inserted before #other-options')
        return
      } else {
        markdownBody.prepend(suggestionsElement)
        console.log('404 Suggester: Inserted at start of #markdownBody')
        return
      }
    }

    // Fallback selectors
    const fallbackTargets = [
      '.space-y-8',
      '.max-w-2xl',
      'main',
      '.main-content',
      '#content',
      'body'
    ]

    for (const selector of fallbackTargets) {
      const elements = document.querySelectorAll(selector)
      if (elements.length > 0) {
        const target = elements[0]
        if (target.children.length > 1) {
          const pos = Math.min(1, Math.floor(target.children.length / 4))
          target.insertBefore(suggestionsElement, target.children[pos])
        } else {
          target.appendChild(suggestionsElement)
        }
        console.log(`404 Suggester: Inserted into ${selector}`)
        return
      }
    }

    // Last resort
    document.body.appendChild(suggestionsElement)
    console.log('404 Suggester: Appended to body')
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * STYLING
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Injects CSS styles for URL suggestions
   */
  function addSuggestionStyles() {
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      #url-suggestions-loading {
        margin: 20px 0;
        padding: 12px 16px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        font-style: italic;
      }

      .dark #url-suggestions-loading {
        background-color: rgba(255, 255, 255, 0.05);
      }

      #guessed-urls + p + div li {
        transition: all 0.2s ease;
      }

      #guessed-urls + p + div li:hover {
        transform: translateX(2px);
      }

      #guessed-urls + p + div a {
        text-decoration: none;
        display: inline-block;
        padding: 4px 0;
      }

      #guessed-urls + p + div a:hover {
        text-decoration: underline;
      }

      #guessed-urls + p + div code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.9em;
      }

      .dark #guessed-urls + p + div code {
        background-color: rgba(255, 255, 255, 0.1);
      }
    `
    document.head.appendChild(styleElement)
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * MAIN EXECUTION
   * ═════════════════════════════════════════════════════════════════════════ */

  /**
   * Main function: orchestrates the suggestion process
   */
  async function suggest404Alternatives() {
    const currentPath = window.location.pathname

    // Skip generic 404 pages
    if (currentPath === '/404' || currentPath === '/404.html' || currentPath === '/404/') {
      console.log('404 Suggester: Generic 404 page detected, skipping suggestions')
      return
    }

    console.log(`404 Suggester: Processing path "${currentPath}"`)

    try {
      // Show loading indicator
      const loadingElement = elementFromHTML(
        '<div id="url-suggestions-loading">Searching for similar pages...</div>'
      )

      const container = document.getElementById('url-suggestions-container')
      if (container) {
        container.appendChild(loadingElement)
      } else {
        document.body.appendChild(loadingElement)
      }

      // Fetch paths
      const allPaths = await collectPaths()

      // Remove loading indicator
      const loading = document.getElementById('url-suggestions-loading')
      if (loading) loading.remove()

      if (allPaths.length === 0) {
        console.warn('404 Suggester: No paths collected from API')
        injectSuggestions(currentPath, [])
        return
      }

      console.log(`404 Suggester: Comparing against ${allPaths.length} paths`)

      // Find and inject suggestions
      const similarUrls = findSimilarUrls(allPaths, currentPath)
      console.log(`404 Suggester: Found ${similarUrls.length} similar URLs`, similarUrls)

      injectSuggestions(currentPath, similarUrls)
    } catch (error) {
      console.error('404 Suggester: Error during suggestion process', error)
      const loading = document.getElementById('url-suggestions-loading')
      if (loading) loading.remove()
    }
  }

  /**
   * Initialization function
   */
  function init() {
    console.log('404 Suggester: Initializing...')
    addSuggestionStyles()
    suggest404Alternatives()
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * EXECUTION ENTRY POINT
   * ═════════════════════════════════════════════════════════════════════════ */

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}
