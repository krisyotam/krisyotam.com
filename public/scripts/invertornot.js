/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║               I N V E R T   O R   N O T                                   ║
 * ║                                                                           ║
 * ║        "Intelligent Dark Mode Image Inversion"                            ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Author:      Kris Yotam                                                  ║
 * ║  License:     CC-0                                                        ║
 * ║  Created:     2026-01-06                                                  ║
 * ║                                                                           ║
 * ║  Description:                                                             ║
 * ║  This script integrates with the invertornot API to automatically         ║
 * ║  determine which images should be inverted for optimal dark mode          ║
 * ║  rendering. Diagrams and line art benefit from inversion, while           ║
 * ║  photographs become distorted—this script distinguishes between them.     ║
 * ║                                                                           ║
 * ║  The API uses an EfficientNet model fine-tuned on a custom dataset        ║
 * ║  to predict invertibility with high accuracy.                             ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║    • Batch processing of images to minimize API calls                     ║
 * ║    • LocalStorage caching with configurable TTL (7 days default)          ║
 * ║    • MutationObserver for dynamically loaded images                       ║
 * ║    • Respects prefers-color-scheme media query                            ║
 * ║    • Exclusion support via data-no-invert attribute                       ║
 * ║    • Debug mode for troubleshooting                                       ║
 * ║                                                                           ║
 * ║  Usage:                                                                   ║
 * ║    InvertOrNot.init({ apiUrl: 'https://your-api.com' })                   ║
 * ║                                                                           ║
 * ║  Inspired by:                                                             ║
 * ║    gwern.net/idea#invertornot                                             ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/* ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Base URL of the invertornot API */
const INVERTORNOT_API_URL = 'http://localhost:8000'

/** Number of images to process per API request */
const BATCH_SIZE = 50

/** Delay between batch requests (ms) */
const BATCH_DELAY = 100

/** Cache time-to-live (7 days in ms) */
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000

/* ═══════════════════════════════════════════════════════════════════════════
 * SCRIPT INITIALIZATION GUARD
 * ═══════════════════════════════════════════════════════════════════════════ */

if (typeof window.INVERT_OR_NOT_LOADED === 'undefined') {
  window.INVERT_OR_NOT_LOADED = true

  /* ═════════════════════════════════════════════════════════════════════════
   * MAIN OBJECT
   * ═════════════════════════════════════════════════════════════════════════ */

  const InvertOrNot = {
    config: {
      apiUrl: INVERTORNOT_API_URL,
      batchSize: BATCH_SIZE,
      batchDelay: BATCH_DELAY,
      cacheKey: 'invertornot_cache',
      cacheTTL: CACHE_TTL,
      selector: 'img',
      excludeSelector: '[data-no-invert]',
      invertClass: 'invertornot-invert',
      processedAttr: 'data-invertornot-processed',
      observeMutations: true,
      respectColorScheme: true,
      debug: false
    },

    cache: {},
    queue: [],
    processing: false,
    observer: null,

    /* ═══════════════════════════════════════════════════════════════════════
     * INITIALIZATION
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Initializes InvertOrNot with custom configuration
     * @param {Object} options - Configuration options to override defaults
     */
    init: function(options = {}) {
      this.config = { ...this.config, ...options }
      this.loadCache()
      this.injectStyles()

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.processAllImages())
      } else {
        this.processAllImages()
      }

      if (this.config.observeMutations) {
        this.setupMutationObserver()
      }

      if (this.config.respectColorScheme) {
        this.setupColorSchemeListener()
      }

      this.log('Initialized with config:', this.config)
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * STYLE INJECTION
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Injects CSS styles for image inversion
     * Uses CSS filter with hue-rotate to preserve color relationships
     */
    injectStyles: function() {
      if (document.getElementById('invertornot-styles')) return

      const style = document.createElement('style')
      style.id = 'invertornot-styles'
      style.textContent = `
        .${this.config.invertClass} {
          filter: invert(1) hue-rotate(180deg);
        }
        @media (prefers-color-scheme: light) {
          .${this.config.invertClass} {
            filter: none;
          }
        }
      `
      document.head.appendChild(style)
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * CACHE MANAGEMENT
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Loads cached results from localStorage
     * Filters out expired entries based on TTL
     */
    loadCache: function() {
      try {
        const stored = localStorage.getItem(this.config.cacheKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          const now = Date.now()
          this.cache = Object.fromEntries(
            Object.entries(parsed).filter(([_, v]) => now - v.timestamp < this.config.cacheTTL)
          )
        }
      } catch (e) {
        this.log('Failed to load cache:', e)
        this.cache = {}
      }
    },

    /**
     * Persists cache to localStorage
     */
    saveCache: function() {
      try {
        localStorage.setItem(this.config.cacheKey, JSON.stringify(this.cache))
      } catch (e) {
        this.log('Failed to save cache:', e)
      }
    },

    /**
     * Retrieves cached invert value for a URL
     * @param {string} url - Image URL
     * @returns {number|null} Cached invert value (0 or 1) or null if not cached
     */
    getCached: function(url) {
      const entry = this.cache[url]
      if (entry && Date.now() - entry.timestamp < this.config.cacheTTL) {
        return entry.invert
      }
      return null
    },

    /**
     * Stores invert result in cache
     * @param {string} url - Image URL
     * @param {number} invert - Invert value (0 = don't invert, 1 = invert)
     */
    setCache: function(url, invert) {
      this.cache[url] = { invert, timestamp: Date.now() }
      this.saveCache()
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * IMAGE PROCESSING
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Processes all images currently in the DOM
     * Filters images based on configuration and queues them for API processing
     */
    processAllImages: function() {
      const images = document.querySelectorAll(this.config.selector)
      const toProcess = []

      images.forEach(img => {
        if (this.shouldProcess(img)) {
          toProcess.push(img)
        }
      })

      this.log(`Found ${toProcess.length} images to process`)
      this.queueImages(toProcess)
    },

    /**
     * Determines if an image should be processed
     * @param {HTMLImageElement} img - Image element to check
     * @returns {boolean} True if image should be processed
     */
    shouldProcess: function(img) {
      // Skip if already processed
      if (img.hasAttribute(this.config.processedAttr)) return false

      // Skip if excluded by selector
      if (this.config.excludeSelector && img.matches(this.config.excludeSelector)) return false

      // Skip if no source
      if (!img.src && !img.dataset.src) return false

      // Skip data URLs (cannot be sent to API)
      if (img.src && img.src.startsWith('data:')) return false

      return true
    },

    /**
     * Queues images for batch processing
     * Images with cached results are processed immediately
     * @param {HTMLImageElement[]} images - Array of image elements
     */
    queueImages: function(images) {
      images.forEach(img => {
        const url = img.src || img.dataset.src
        if (!url) return

        // Apply cached result immediately if available
        const cached = this.getCached(url)
        if (cached !== null) {
          this.applyResult(img, cached)
          return
        }

        this.queue.push({ img, url })
      })

      this.processQueue()
    },

    /**
     * Processes the queue in batches
     * Sends batch requests to the API and applies results
     */
    processQueue: async function() {
      if (this.processing || this.queue.length === 0) return

      this.processing = true

      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.config.batchSize)
        const urls = [...new Set(batch.map(item => item.url))]

        try {
          const results = await this.fetchPredictions(urls)

          batch.forEach(item => {
            const result = results.find(r => r.url === item.url)
            if (result && result.error === '') {
              this.setCache(item.url, result.invert)
              this.applyResult(item.img, result.invert)
            } else {
              this.log('Error processing:', item.url, result?.error)
              item.img.setAttribute(this.config.processedAttr, 'error')
            }
          })
        } catch (e) {
          this.log('Batch request failed:', e)
          batch.forEach(item => {
            item.img.setAttribute(this.config.processedAttr, 'error')
          })
        }

        if (this.queue.length > 0) {
          await this.delay(this.config.batchDelay)
        }
      }

      this.processing = false
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * API COMMUNICATION
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Fetches invert predictions from the API
     * @param {string[]} urls - Array of image URLs to process
     * @returns {Promise<Array>} Array of prediction results
     */
    fetchPredictions: async function(urls) {
      const response = await fetch(`${this.config.apiUrl}/api/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(urls),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      return response.json()
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * RESULT APPLICATION
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Applies inversion result to an image element
     * @param {HTMLImageElement} img - Image element
     * @param {number} invert - Invert value (0 = don't invert, 1 = invert)
     */
    applyResult: function(img, invert) {
      img.setAttribute(this.config.processedAttr, invert)

      if (invert === 1) {
        img.classList.add(this.config.invertClass)
      } else {
        img.classList.remove(this.config.invertClass)
      }
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * MUTATION OBSERVER
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Sets up MutationObserver to detect dynamically added images
     * Automatically processes new images as they appear in the DOM
     */
    setupMutationObserver: function() {
      this.observer = new MutationObserver(mutations => {
        const newImages = []

        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return

            // Check if the added node is an image
            if (node.matches && node.matches(this.config.selector) && this.shouldProcess(node)) {
              newImages.push(node)
            }

            // Check for images within the added node
            if (node.querySelectorAll) {
              node.querySelectorAll(this.config.selector).forEach(img => {
                if (this.shouldProcess(img)) {
                  newImages.push(img)
                }
              })
            }
          })
        })

        if (newImages.length > 0) {
          this.log(`Found ${newImages.length} new images`)
          this.queueImages(newImages)
        }
      })

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * COLOR SCHEME LISTENER
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Sets up listener for system color scheme changes
     * CSS media query handles the visual toggle automatically
     */
    setupColorSchemeListener: function() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      mediaQuery.addEventListener('change', (e) => {
        this.log('Color scheme changed:', e.matches ? 'dark' : 'light')
      })
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * PUBLIC METHODS
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Manually processes a specific image
     * @param {HTMLImageElement} img - Image element to process
     */
    processImage: function(img) {
      if (this.shouldProcess(img)) {
        this.queueImages([img])
      }
    },

    /**
     * Clears all cached results from localStorage
     */
    clearCache: function() {
      this.cache = {}
      localStorage.removeItem(this.config.cacheKey)
      this.log('Cache cleared')
    },

    /**
     * Resets all processed images to their original state
     */
    reset: function() {
      document.querySelectorAll(`[${this.config.processedAttr}]`).forEach(img => {
        img.removeAttribute(this.config.processedAttr)
        img.classList.remove(this.config.invertClass)
      })
      this.queue = []
      this.log('Reset complete')
    },

    /**
     * Destroys the instance and cleans up all resources
     */
    destroy: function() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
      this.reset()
      const styles = document.getElementById('invertornot-styles')
      if (styles) styles.remove()
      this.log('Destroyed')
    },

    /* ═══════════════════════════════════════════════════════════════════════
     * UTILITIES
     * ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Promise-based delay utility
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Resolves after delay
     */
    delay: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    /**
     * Debug logging utility
     * Only outputs when debug mode is enabled
     * @param {...any} args - Arguments to log
     */
    log: function(...args) {
      if (this.config.debug) {
        console.log('[InvertOrNot]', ...args)
      }
    }
  }

  /* ═════════════════════════════════════════════════════════════════════════
   * EXPORT TO GLOBAL SCOPE
   * ═════════════════════════════════════════════════════════════════════════ */

  window.InvertOrNot = InvertOrNot
}
