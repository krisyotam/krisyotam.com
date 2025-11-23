/*
 * Title: 404 Error Page URL Suggester
 * Author: Kris Yotam
 * Date: 2023-08-20
 * License: CC-0
 *
 * This script enhances the 404 error page by suggesting similar URLs
 * based on the current path that resulted in the 404 error. It loads URLs from various
 * JSON data files (pages, posts, notes, tags, sequences, categories) and presents the most 
 * similar ones by text edit distance as suggestions to the user.
 *
 * Features:
 * - Collects URLs from multiple JSON data sources
 * - Uses Levenshtein distance algorithm for efficient URL comparison
 * - Presents ≤10 unique, most similar URLs as suggestions
 * - Injects the suggestions into the current page
 *
 * Example:
 * If a user goes to `/bloog`, intending to go to `/blog`, this will return
 * suggestions including `/blog` and other similar paths.
 */

// Check if script was already loaded to prevent duplicate declarations
if (typeof window.URL_SUGGESTER_LOADED === 'undefined') {
  // Mark script as loaded
  window.URL_SUGGESTER_LOADED = true;

  // Configuration
  const MAX_SUGGESTIONS = 10;
  const MAX_DISTANCE = 8; // Max edit distance to consider

  // The script now relies on the server-side `/api/404-suggester` endpoint which
  // returns { paths: string[], map: { rootFiles: string[], folders: { [name]: { files: string[], hasPosts, hasTags, hasCategories } } } }

  // Function to fetch path list from the new server-side endpoint
  async function collectPaths() {
    try {
      const resp = await fetch('/api/404-suggester');
      if (!resp.ok) {
        console.warn('404 Suggester: /api/404-suggester responded with', resp.status);
        return [];
      }
      const body = await resp.json();
      // Expose the hard map on window for debugging and possible future UI uses
      if (body && body.map) {
        try { window.URL_SUGGESTER_MAP = body.map; } catch (e) { /* ignore in restrictive envs */ }
      }
      if (body && Array.isArray(body.paths)) return body.paths;
      return (body && body.paths) || [];
    } catch (err) {
      console.error('404 Suggester: Error fetching /api/404-suggester', err);
      return [];
    }
  }

  // Function to calculate Levenshtein distance with early termination
  function boundedLevenshteinDistance(a, b, maxDistance) {
    // Early termination if length difference exceeds maxDistance
    if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 1; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      let minDistance = maxDistance + 1;
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
        minDistance = Math.min(minDistance, matrix[i][j]);
      }
      // Early termination if all values in the current row exceed maxDistance
      if (minDistance > maxDistance) {
        return maxDistance + 1;
      }
    }

    return matrix[b.length][a.length];
  }

  // Normalize a path for comparison: lowercase, trim, remove extension, collapse separators
  function normalizePath(p) {
    if (!p || typeof p !== 'string') return '';
    return p
      .toLowerCase()
      .trim()
      .replace(/\.html?$|\.mdx?$|\.md$/g, '')
      .replace(/[^a-z0-9/]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/(^-|-$)/g, '')
      .replace(/\/+$/g, '')
      ;
  }

  // Split a path into meaningful tokens (segments and words)
  function tokenizePath(p) {
    const norm = normalizePath(p);
    const segments = norm.split('/').filter(Boolean);
    const words = [];
    segments.forEach(seg => {
      seg.split(/[-_]+/).forEach(w => {
        if (w) words.push(w);
      });
    });
    return { segments, words };
  }

  // Simple Soundex implementation for phonetic comparison
  function soundex(word) {
    if (!word) return '';
    const s = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (!s) return '';
    const first = s[0];
    const map = { B:1,F:1,P:1,V:1, C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2, D:3,T:3, L:4, M:5,N:5, R:6 };
    let prev = map[first] || 0;
    let out = first;
    for (let i = 1; i < s.length && out.length < 4; i++) {
      const c = s[i];
      const code = map[c] || 0;
      if (code === prev) continue;
      if (code !== 0) out += String(code);
      prev = code;
    }
    while (out.length < 4) out += '0';
    return out;
  }

  // Jaro-Winkler similarity (returns 0..1 where 1 is identical)
  function jaroWinkler(s1, s2) {
    if (!s1 || !s2) return 0;
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    if (s1 === s2) return 1;
    const maxDist = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    const matched1 = new Array(s1.length).fill(false);
    const matched2 = new Array(s2.length).fill(false);
    let matches = 0;
    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - maxDist);
      const end = Math.min(s2.length - 1, i + maxDist);
      for (let j = start; j <= end; j++) {
        if (matched2[j]) continue;
        if (s1[i] !== s2[j]) continue;
        matched1[i] = true;
        matched2[j] = true;
        matches++;
        break;
      }
    }
    if (matches === 0) return 0;
    let t = 0;
    let k = 0;
    for (let i = 0; i < s1.length; i++) {
      if (!matched1[i]) continue;
      while (!matched2[k]) k++;
      if (s1[i] !== s2[k]) t++;
      k++;
    }
    t = t / 2;
    const m = matches;
    const jaro = (m / s1.length + m / s2.length + (m - t) / m) / 3;
    // Winkler boost
    let l = 0;
    const prefixLimit = 4;
    for (let i = 0; i < Math.min(prefixLimit, s1.length, s2.length); i++) {
      if (s1[i] === s2[i]) l++; else break;
    }
    const p = 0.1; // scaling factor
    return jaro + l * p * (1 - jaro);
  }

  // Word-level aggregated Levenshtein: for each target word, find best match in candidate words,
  // normalize by length and sum. Lower is better.
  function wordLevelDistance(targetWords, candWords) {
    if (!targetWords || targetWords.length === 0) return 0;
    if (!candWords || candWords.length === 0) return Infinity;
    let sum = 0;
    targetWords.forEach(tw => {
      let best = Infinity;
      candWords.forEach(cw => {
        const d = boundedLevenshteinDistance(tw, cw, Math.max(tw.length, cw.length));
        const norm = d / Math.max(1, Math.max(tw.length, cw.length));
        if (norm < best) best = norm;
      });
      sum += best;
    });
    // average
    return sum / targetWords.length;
  }

  // Composite score: lower is better
  function compositeScore(targetPath, candidatePath) {
    const t = tokenizePath(targetPath);
    const c = tokenizePath(candidatePath);

    // Word-level normalized Levenshtein (0 best)
    const wordLev = wordLevelDistance(t.words, c.words);

    // Jaro-Winkler on full normalized path (1 best) -> convert to distance
    const jw = jaroWinkler(normalizePath(targetPath), normalizePath(candidatePath));
    const jwDist = 1 - jw;

    // Phonetic boost: proportion of words whose soundex matches
    let phoneticMatches = 0;
    t.words.forEach(tw => {
      const ts = soundex(tw);
      c.words.forEach(cw => {
        if (ts && ts === soundex(cw)) phoneticMatches += 1;
      });
    });
    const phoneticRatio = t.words.length ? phoneticMatches / t.words.length : 0;
    const phoneticBoost = 1 - phoneticRatio; // lower is better

    // Combine with weights
    const score = (wordLev * 0.6) + (jwDist * 0.3) + (phoneticBoost * 0.1);
    return score;
  }

  // Function to find similar URLs
  function findSimilarUrls(paths, targetPath, n = MAX_SUGGESTIONS, maxDistance = MAX_DISTANCE) {
    // Quick filter based on length difference
    const potentialMatches = paths.filter(path => 
      Math.abs(path.length - targetPath.length) <= maxDistance
    );

    // If we have a folder map and the current path belongs to a folder under /data,
    // prefer results that live in that folder by applying a small boost to their score.
    const folderPrefix = (function() {
      try {
        const map = window.URL_SUGGESTER_MAP;
        if (!map || !map.folders) return null;
        const seg = targetPath.split('/').filter(Boolean)[0];
        if (seg && map.folders[seg]) return `/${seg}/`;
      } catch (e) { /* ignore */ }
      return null;
    })();

      const scored = potentialMatches.map(path => {
        const score = compositeScore(targetPath, path);
        const folderBoost = folderPrefix && path.startsWith(folderPrefix) ? 0.15 : 0;
        return { path, score: score - folderBoost };
      }).filter(item => Number.isFinite(item.score));

      scored.sort((a, b) => a.score - b.score);

      // De-duplicate while preserving order
      const seenUrls = new Set();
      const uniqueSimilarUrls = [];
      for (const item of scored) {
        if (seenUrls.has(item.path)) continue;
        seenUrls.add(item.path);
        uniqueSimilarUrls.push(item);
        if (uniqueSimilarUrls.length >= n) break;
      }

      return uniqueSimilarUrls.map(item => ({ path: item.path, url: window.location.origin + item.path }));
  }

  // Function to inject suggestions into the page
  function injectSuggestions(currentPath, suggestions) {
    let suggestionsHtml = suggestions.length > 0
      ? suggestions.map(item => `<li><p><a class="link-live" href="${item.url}"><code>${item.path}</code></a></p></li>`).join("")
      : "<li><p><strong>No similar URLs found.</strong></p></li>";

    let suggestionsElement = elementFromHTML(`<section class="space-y-4">
        <h2 class="text-2xl font-semibold" id="guessed-urls">Suggested URLs</h2>
        <p class="text-muted-foreground dark:text-zinc-400">Similar URLs to your current path (<code>${currentPath}</code>):</p>
        <div>
          <ul class="space-y-2">${suggestionsHtml}</ul>
        </div>
    </section>`);

    // First try to find the #markdownBody element because that's specifically set up for this in not-found.tsx
    const markdownBody = document.getElementById('markdownBody');
    if (markdownBody) {
      const otherOptions = document.getElementById('other-options');
      if (otherOptions) {
        markdownBody.insertBefore(suggestionsElement, otherOptions);
        console.log('404 Suggester: Successfully inserted suggestions before #other-options');
        return;
      } else {
        // If other-options doesn't exist but markdownBody does, insert at beginning
        markdownBody.prepend(suggestionsElement);
        console.log('404 Suggester: Successfully inserted suggestions at start of #markdownBody');
        return;
      }
    }

    // Fallbacks if the expected structure isn't found
    const possibleTargets = [
      ".space-y-8", 
      ".max-w-2xl", 
      "main", 
      ".main-content",
      "#content",
      "body"
    ];
    
    // Find the first matching target
    let targetFound = false;
    for (const selector of possibleTargets) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Insert after the first quarter of elements or as the second element
        const targetElement = elements[0];
        
        if (targetElement.children.length > 1) {
          const insertPosition = Math.min(1, Math.floor(targetElement.children.length / 4));
          targetElement.insertBefore(suggestionsElement, targetElement.children[insertPosition]);
        } else {
          targetElement.appendChild(suggestionsElement);
        }
        
        console.log(`404 Suggester: Inserted suggestions into ${selector}`);
        targetFound = true;
        break;
      }
    }

    if (!targetFound) {
      // Last resort: append to body
      document.body.appendChild(suggestionsElement);
      console.log("404 Suggester: Appended suggestions to body as no suitable target was found");
    }
  }

  // Function to create DOM elements from HTML string
  function elementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  // Main function
  async function suggest404Alternatives() {
    const currentPath = window.location.pathname;
    
    // Skip if we're on the main 404 page (not a specific URL that led to 404)
    if (currentPath === "/404" || currentPath === "/404.html" || currentPath === "/404/") {
      console.log("Current page is a generic 404 page; unable to guess intended URL. Skipping suggestions.");
      return;
    }

    console.log(`404 Suggester: Processing path "${currentPath}"`);

    try {
      // Show a loading message in the dedicated container if it exists
      const suggestionsContainer = document.getElementById('url-suggestions-container');
      const loadingElement = elementFromHTML('<div id="url-suggestions-loading">Looking for similar URLs...</div>');
      
      if (suggestionsContainer) {
        suggestionsContainer.appendChild(loadingElement);
      } else {
        document.body.appendChild(loadingElement);
      }

      const allPaths = await collectPaths();

      // Remove loading message
      document.getElementById("url-suggestions-loading")?.remove();
      
      // Ensure suggestions are injected even if no data is fetched
      if (allPaths.length === 0) {
        console.error("No paths collected from data sources");
        injectSuggestions(currentPath, []); // Inject empty suggestions
        return;
      }

      console.log(`404 Suggester: Collected ${allPaths.length} paths to compare against`);
      const similarUrls = findSimilarUrls(allPaths, currentPath);
      console.log(`404 Suggester: Found ${similarUrls.length} similar URLs`, similarUrls);

      // Inject suggestions into the page
      injectSuggestions(currentPath, similarUrls);
    } catch (error) {
      console.error("Error suggesting alternatives:", error);
      document.getElementById("url-suggestions-loading")?.remove();
    }
  }

  // Add styles for URL suggestions
  function addSuggestionStyles() {
    const styleElement = document.createElement('style');
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
      
      /* Make URL links stand out */
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
    `;
    document.head.appendChild(styleElement);
  }

  // Run the script when the page loads
  function init() {
    console.log("404 Suggester: Initializing...");
    addSuggestionStyles();
    suggest404Alternatives();
  }

  // Use different event strategies for compatibility
  if (document.readyState === 'loading') {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM already loaded, run now
    init();
  }
}