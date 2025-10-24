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

  // URLs for data sources
  const dataUrls = {
    pages: '/api/data?file=page-directory.json',
    posts: '/api/data?file=feed.json',
    notes: '/api/data?file=quick-notes.json',
    tags: '/api/data?file=tags.json',
    sequences: '/api/data?file=seq.json',
    categories: '/api/data?file=category-data.json',
    poems: '/api/data?file=poems.json'
  };

  // Function to fetch JSON data from a URL
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null;
    }
  }

  // Extract paths from each data source
  async function collectPaths() {
    const allPaths = [];
    
    try {
      // Pages
      const pagesData = await fetchData(dataUrls.pages);
      if (pagesData && pagesData.pages) {
        pagesData.pages.forEach(page => {
          if (page.path) {
            allPaths.push(page.path);
          }
        });
      }

      // Posts
      const postsData = await fetchData(dataUrls.posts);
      if (postsData && postsData.posts) {
        postsData.posts.forEach(post => {
          if (post.slug) {
            allPaths.push(`/blog/${post.slug}`);
          }
        });
      }

      // Notes
      const notesData = await fetchData(dataUrls.notes);
      if (notesData && Array.isArray(notesData)) {
        notesData.forEach(note => {
          if (note.slug) {
            allPaths.push(`/notes/${note.slug}`);
          }
        });
      }

      // Tags
      const tagsData = await fetchData(dataUrls.tags);
      if (tagsData && tagsData.tags) {
        tagsData.tags.forEach(tag => {
          if (tag.slug) {
            allPaths.push(`/tag/${tag.slug}`);
          }
        });
      }

      // sequences
      const sequencesData = await fetchData(dataUrls.sequences);
      if (sequencesData && sequencesData.sequences) {
        sequencesData.sequences.forEach(sequences => {
          if (sequences.slug) {
            allPaths.push(`/sequences/${sequences.slug}`);
          }
        });
      }

      // Categories
      const categoriesData = await fetchData(dataUrls.categories);
      if (categoriesData && categoriesData.categories) {
        categoriesData.categories.forEach(category => {
          if (category.slug) {
            allPaths.push(`/category/${category.slug}`);
          }
        });
      }

      // Poems
      const poemsData = await fetchData(dataUrls.poems);
      if (poemsData && poemsData.poems) {
        poemsData.poems.forEach(poem => {
          if (poem.slug) {
            allPaths.push(`/poetry/${poem.slug}`);
          }
        });
      }
    } catch (error) {
      console.error("Error collecting paths:", error);
    }

    return allPaths;
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

  // Function to find similar URLs
  function findSimilarUrls(paths, targetPath, n = MAX_SUGGESTIONS, maxDistance = MAX_DISTANCE) {
    // Quick filter based on length difference
    const potentialMatches = paths.filter(path => 
      Math.abs(path.length - targetPath.length) <= maxDistance
    );

    const similarUrls = potentialMatches
      .map(path => ({
        path,
        distance: boundedLevenshteinDistance(path, targetPath, maxDistance)
      }))
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    // De-duplicate while preserving order
    const seenUrls = new Set();
    const uniqueSimilarUrls = similarUrls.filter(item => {
      if (seenUrls.has(item.path)) return false;
      seenUrls.add(item.path);
      return true;
    }).slice(0, n);

    return uniqueSimilarUrls.map(item => ({
      path: item.path,
      url: window.location.origin + item.path
    }));
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