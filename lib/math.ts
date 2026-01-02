/* =============================================================================
 * MATH UTILITIES
 * =============================================================================
 *
 * Centralized math rendering for the entire site. All LaTeX/math rendering
 * should go through this module for consistency.
 *
 * -----------------------------------------------------------------------------
 * @file        math.ts
 * @author      Kris Yotam
 * @created     2026-01-01
 * @modified    2026-01-01
 * @license     MIT
 * -----------------------------------------------------------------------------
 *
 * ARCHITECTURE
 * ------------
 * This module implements a hybrid approach:
 *   1. KaTeX (primary) - Fast, SSR-friendly, handles 95% of expressions
 *   2. MathJax (fallback) - Client-side, handles complex expressions KaTeX can't
 *
 * The fallback is triggered when KaTeX throws a parse error, ensuring all
 * valid LaTeX renders correctly while maintaining optimal performance.
 *
 * SUPPORTED DELIMITERS
 * --------------------
 *   - $...$       Inline math
 *   - $$...$$     Display/block math
 *   - \(...\)     Inline math (LaTeX style)
 *   - \[...\]     Display math (LaTeX style)
 *
 * USAGE
 * -----
 * Server-side (preferred):
 *   import { renderMath, renderMathToString } from "@/lib/math"
 *   const html = renderMathToString("E = mc^2", { displayMode: false })
 *
 * Client-side with fallback:
 *   import { renderMathClient } from "@/lib/math"
 *   await renderMathClient(element, "\\int_0^\\infty e^{-x^2} dx")
 *
 * Pre-processing markdown:
 *   import { preprocessMath } from "@/lib/math"
 *   const processed = preprocessMath(markdownContent)
 *
 * ============================================================================= */

import katex from "katex"

/* -----------------------------------------------------------------------------
 * TYPES
 * ----------------------------------------------------------------------------- */

export interface MathRenderOptions {
  /** Render as display (block) or inline math */
  displayMode?: boolean
  /** Throw error on invalid LaTeX (default: false, returns error message) */
  throwOnError?: boolean
  /** Color for error text when throwOnError is false */
  errorColor?: string
  /** Enable strict mode for warnings */
  strict?: boolean | "warn" | "error" | "ignore"
  /** Trust user input (allows certain commands) */
  trust?: boolean
  /** Macros to pre-define */
  macros?: Record<string, string>
  /** Minimum thickness for fraction lines, etc. */
  minRuleThickness?: number
  /** Max size for user-specified sizes */
  maxSize?: number
  /** Max macro expansion depth */
  maxExpand?: number
}

export interface MathResult {
  /** Rendered HTML string */
  html: string
  /** Whether KaTeX was used (true) or MathJax fallback (false) */
  usedKatex: boolean
  /** Error message if rendering failed */
  error?: string
}

export type MathDelimiter = "$" | "$$" | "\\(" | "\\[" | "\\begin"

/* -----------------------------------------------------------------------------
 * CONSTANTS
 * ----------------------------------------------------------------------------- */

/** Default KaTeX rendering options */
export const DEFAULT_KATEX_OPTIONS: katex.KatexOptions = {
  throwOnError: false,
  errorColor: "#cc0000",
  strict: false,
  trust: true,
  macros: {
    // Common macros
    "\\R": "\\mathbb{R}",
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\Q": "\\mathbb{Q}",
    "\\C": "\\mathbb{C}",
    "\\eps": "\\varepsilon",
    "\\phi": "\\varphi",
  },
}

/** MathJax CDN URL */
export const MATHJAX_CDN = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"

/** Regex patterns for detecting math delimiters */
export const MATH_PATTERNS = {
  /** Display math: $$...$$ */
  displayDollar: /\$\$([\s\S]*?)\$\$/g,
  /** Inline math: $...$ (not preceded/followed by $) */
  inlineDollar: /(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g,
  /** Display math: \[...\] */
  displayBracket: /\\\[([\s\S]*?)\\\]/g,
  /** Inline math: \(...\) */
  inlineParen: /\\\(([\s\S]*?)\\\)/g,
}

/** CSS class names for rendered math */
export const MATH_CLASSES = {
  display: "math-display",
  inline: "math-inline",
  error: "math-error",
  container: "math-container",
}

/* -----------------------------------------------------------------------------
 * SERVER-SIDE RENDERING (KaTeX)
 * -----------------------------------------------------------------------------
 * These functions render math to HTML strings at build/request time.
 * This is the preferred approach for static content.
 * ----------------------------------------------------------------------------- */

/**
 * Render a LaTeX string to HTML using KaTeX.
 * Returns an object with the HTML and metadata about the rendering.
 *
 * @param latex - The LaTeX string to render
 * @param options - Rendering options
 * @returns MathResult with rendered HTML
 *
 * @example
 * const result = renderMath("E = mc^2", { displayMode: false })
 * // result.html contains the rendered HTML
 * // result.usedKatex is true if KaTeX succeeded
 */
export function renderMath(latex: string, options: MathRenderOptions = {}): MathResult {
  const katexOptions: katex.KatexOptions = {
    ...DEFAULT_KATEX_OPTIONS,
    displayMode: options.displayMode ?? false,
    throwOnError: options.throwOnError ?? false,
    errorColor: options.errorColor ?? DEFAULT_KATEX_OPTIONS.errorColor,
    strict: options.strict ?? DEFAULT_KATEX_OPTIONS.strict,
    trust: options.trust ?? DEFAULT_KATEX_OPTIONS.trust,
    macros: { ...DEFAULT_KATEX_OPTIONS.macros, ...options.macros },
    minRuleThickness: options.minRuleThickness,
    maxSize: options.maxSize,
    maxExpand: options.maxExpand,
  }

  try {
    const html = katex.renderToString(latex, katexOptions)
    return { html, usedKatex: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // If throwOnError is true, propagate the error
    if (options.throwOnError) {
      throw error
    }

    // Return error HTML for display
    return {
      html: `<span class="${MATH_CLASSES.error}" style="color: ${katexOptions.errorColor}">${escapeHtml(latex)}</span>`,
      usedKatex: false,
      error: errorMessage,
    }
  }
}

/**
 * Render a LaTeX string to HTML string (convenience function).
 * For display math, automatically wraps in displaystyle.
 *
 * @param latex - The LaTeX string to render
 * @param options - Rendering options
 * @returns Rendered HTML string
 *
 * @example
 * const html = renderMathToString("\\frac{1}{2}", { displayMode: true })
 */
export function renderMathToString(latex: string, options: MathRenderOptions = {}): string {
  // For display mode, ensure we use displaystyle for better formatting
  let processedLatex = latex.trim()
  if (options.displayMode && !processedLatex.startsWith("\\displaystyle")) {
    processedLatex = `\\displaystyle ${processedLatex}`
  }

  return renderMath(processedLatex, options).html
}

/**
 * Check if a LaTeX string is valid and can be rendered by KaTeX.
 *
 * @param latex - The LaTeX string to validate
 * @returns true if the LaTeX is valid
 *
 * @example
 * if (isValidLatex("\\frac{1}{2}")) {
 *   // Safe to render
 * }
 */
export function isValidLatex(latex: string): boolean {
  try {
    katex.renderToString(latex, { throwOnError: true })
    return true
  } catch {
    return false
  }
}

/* -----------------------------------------------------------------------------
 * PRE-PROCESSING
 * -----------------------------------------------------------------------------
 * These functions process markdown/text content to render math expressions
 * before the content goes through other processing pipelines.
 * ----------------------------------------------------------------------------- */

/**
 * Pre-process a string to render all math expressions to HTML.
 * Handles all supported delimiter types.
 *
 * @param content - The content string containing math expressions
 * @param options - Optional rendering options
 * @returns Content with math expressions replaced by HTML
 *
 * @example
 * const processed = preprocessMath("The equation $E = mc^2$ is famous.")
 * // Returns: "The equation <span class="katex">...</span> is famous."
 */
export function preprocessMath(content: string, options: MathRenderOptions = {}): string {
  let result = content

  // Process display math first (longer patterns)
  // $$...$$ (display)
  result = result.replace(MATH_PATTERNS.displayDollar, (_, math) => {
    const rendered = renderMathToString(math.trim(), { ...options, displayMode: true })
    return `<div class="${MATH_CLASSES.display}">${rendered}</div>`
  })

  // \[...\] (display)
  result = result.replace(MATH_PATTERNS.displayBracket, (_, math) => {
    const rendered = renderMathToString(math.trim(), { ...options, displayMode: true })
    return `<div class="${MATH_CLASSES.display}">${rendered}</div>`
  })

  // Process inline math
  // \(...\) (inline)
  result = result.replace(MATH_PATTERNS.inlineParen, (_, math) => {
    const rendered = renderMathToString(math.trim(), { ...options, displayMode: false })
    return `<span class="${MATH_CLASSES.inline}">${rendered}</span>`
  })

  // $...$ (inline) - must be last to avoid conflicts
  result = result.replace(MATH_PATTERNS.inlineDollar, (_, math) => {
    const rendered = renderMathToString(math.trim(), { ...options, displayMode: false })
    return `<span class="${MATH_CLASSES.inline}">${rendered}</span>`
  })

  return result
}

/**
 * Extract math expressions from content without rendering them.
 * Useful for validation or analysis.
 *
 * @param content - The content string containing math expressions
 * @returns Array of extracted math expressions with their types
 *
 * @example
 * const expressions = extractMathExpressions("$x$ and $$y$$")
 * // Returns: [{ latex: "x", displayMode: false }, { latex: "y", displayMode: true }]
 */
export function extractMathExpressions(
  content: string
): Array<{ latex: string; displayMode: boolean; delimiter: MathDelimiter }> {
  const expressions: Array<{ latex: string; displayMode: boolean; delimiter: MathDelimiter }> = []

  // Display math $$...$$
  content.replace(MATH_PATTERNS.displayDollar, (_, math) => {
    expressions.push({ latex: math.trim(), displayMode: true, delimiter: "$$" })
    return ""
  })

  // Display math \[...\]
  content.replace(MATH_PATTERNS.displayBracket, (_, math) => {
    expressions.push({ latex: math.trim(), displayMode: true, delimiter: "\\[" })
    return ""
  })

  // Inline math \(...\)
  content.replace(MATH_PATTERNS.inlineParen, (_, math) => {
    expressions.push({ latex: math.trim(), displayMode: false, delimiter: "\\(" })
    return ""
  })

  // Inline math $...$
  content.replace(MATH_PATTERNS.inlineDollar, (_, math) => {
    expressions.push({ latex: math.trim(), displayMode: false, delimiter: "$" })
    return ""
  })

  return expressions
}

/* -----------------------------------------------------------------------------
 * CLIENT-SIDE RENDERING
 * -----------------------------------------------------------------------------
 * These functions handle client-side math rendering, including the MathJax
 * fallback for expressions KaTeX cannot handle.
 * ----------------------------------------------------------------------------- */

/** MathJax window interface */
declare global {
  interface Window {
    MathJax?: {
      startup?: {
        promise: Promise<void>
        typesetPromise?: (elements?: Element[]) => Promise<void>
      }
      typesetPromise?: (elements?: Element[]) => Promise<void>
      typeset?: (elements?: Element[]) => void
      tex?: Record<string, unknown>
      svg?: Record<string, unknown>
      options?: Record<string, unknown>
    }
  }
}

/** Track if MathJax has been loaded */
let mathjaxLoaded = false
let mathjaxLoading: Promise<void> | null = null

/**
 * Load MathJax from CDN (client-side only).
 * Returns a promise that resolves when MathJax is ready.
 *
 * @returns Promise that resolves when MathJax is loaded
 */
export async function loadMathJax(): Promise<void> {
  // Only run in browser
  if (typeof window === "undefined") return

  // Already loaded
  if (mathjaxLoaded && window.MathJax?.startup?.promise) {
    return window.MathJax.startup.promise
  }

  // Currently loading
  if (mathjaxLoading) {
    return mathjaxLoading
  }

  mathjaxLoading = new Promise((resolve, reject) => {
    // Configure MathJax before loading
    window.MathJax = {
      tex: {
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"]],
        processEscapes: true,
        processEnvironments: true,
        tags: "ams",
      },
      svg: {
        fontCache: "global",
        scale: 1.0,
      },
      options: {
        skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        enableMenu: false,
      },
      startup: {
        promise: Promise.resolve(),
      },
    }

    const script = document.createElement("script")
    script.src = MATHJAX_CDN
    script.async = true
    script.onload = () => {
      mathjaxLoaded = true
      resolve()
    }
    script.onerror = () => {
      mathjaxLoading = null
      reject(new Error("Failed to load MathJax"))
    }
    document.head.appendChild(script)
  })

  return mathjaxLoading
}

/**
 * Render math in a DOM element using MathJax (client-side fallback).
 * Use this when KaTeX fails to render an expression.
 *
 * @param element - The DOM element containing math to render
 * @returns Promise that resolves when rendering is complete
 */
export async function renderWithMathJax(element: Element): Promise<void> {
  if (typeof window === "undefined") return

  await loadMathJax()

  if (window.MathJax?.typesetPromise) {
    await window.MathJax.typesetPromise([element])
  } else if (window.MathJax?.startup?.typesetPromise) {
    await window.MathJax.startup.typesetPromise([element])
  } else if (window.MathJax?.typeset) {
    window.MathJax.typeset([element])
  }
}

/**
 * Render math client-side with KaTeX, falling back to MathJax if needed.
 * This is the hybrid approach for client components.
 *
 * @param element - The DOM element to render into
 * @param latex - The LaTeX string to render
 * @param options - Rendering options
 * @returns Promise that resolves when rendering is complete
 *
 * @example
 * // In a useEffect:
 * await renderMathClient(containerRef.current, "\\sum_{i=0}^n i^2")
 */
export async function renderMathClient(
  element: HTMLElement,
  latex: string,
  options: MathRenderOptions = {}
): Promise<void> {
  const result = renderMath(latex, { ...options, throwOnError: false })

  if (result.usedKatex) {
    // KaTeX succeeded
    element.innerHTML = result.html
  } else {
    // KaTeX failed, use MathJax fallback
    const delimiter = options.displayMode ? "$$" : "$"
    element.textContent = `${delimiter}${latex}${delimiter}`
    await renderWithMathJax(element)
  }
}

/**
 * Process all math expressions in a container element.
 * Renders with KaTeX first, falls back to MathJax for failures.
 *
 * @param container - The container element with math content
 * @returns Promise that resolves when all math is rendered
 */
export async function processContainerMath(container: HTMLElement): Promise<void> {
  // Find all elements with math delimiters in text content
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null)

  const mathNodes: { node: Text; matches: Array<{ full: string; latex: string; display: boolean }> }[] = []

  let node: Text | null
  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent || ""
    const matches: Array<{ full: string; latex: string; display: boolean }> = []

    // Check for display math
    let match: RegExpExecArray | null
    const displayRegex = /\$\$([\s\S]*?)\$\$/g
    while ((match = displayRegex.exec(text)) !== null) {
      matches.push({ full: match[0], latex: match[1], display: true })
    }

    // Check for inline math
    const inlineRegex = /(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g
    while ((match = inlineRegex.exec(text)) !== null) {
      matches.push({ full: match[0], latex: match[1], display: false })
    }

    if (matches.length > 0) {
      mathNodes.push({ node, matches })
    }
  }

  // Process each node with math
  const needsMathJax: Element[] = []

  for (const { node, matches } of mathNodes) {
    let html = node.textContent || ""

    for (const { full, latex, display } of matches) {
      const result = renderMath(latex, { displayMode: display })

      if (result.usedKatex) {
        const wrapper = display
          ? `<div class="${MATH_CLASSES.display}">${result.html}</div>`
          : `<span class="${MATH_CLASSES.inline}">${result.html}</span>`
        html = html.replace(full, wrapper)
      } else {
        // Mark for MathJax fallback
        needsMathJax.push(node.parentElement!)
      }
    }

    // Replace text node with HTML
    const span = document.createElement("span")
    span.innerHTML = html
    node.parentNode?.replaceChild(span, node)
  }

  // Process any failures with MathJax
  if (needsMathJax.length > 0) {
    await loadMathJax()
    for (const el of needsMathJax) {
      await renderWithMathJax(el)
    }
  }
}

/* -----------------------------------------------------------------------------
 * HELPER FUNCTIONS
 * ----------------------------------------------------------------------------- */

/**
 * Escape HTML special characters in a string.
 * Used for safe display of error messages.
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Strip math delimiters from a string.
 * Useful for extracting raw LaTeX from delimited content.
 *
 * @param content - String potentially wrapped in math delimiters
 * @returns The LaTeX content without delimiters
 */
export function stripMathDelimiters(content: string): string {
  return content
    .replace(/^\$\$/, "")
    .replace(/\$\$$/, "")
    .replace(/^\$/, "")
    .replace(/\$$/, "")
    .replace(/^\\\[/, "")
    .replace(/\\\]$/, "")
    .replace(/^\\\(/, "")
    .replace(/\\\)$/, "")
    .trim()
}

/**
 * Detect the delimiter type used in a math string.
 *
 * @param content - String with math delimiters
 * @returns The delimiter type or null if none found
 */
export function detectDelimiter(content: string): MathDelimiter | null {
  const trimmed = content.trim()
  if (trimmed.startsWith("$$")) return "$$"
  if (trimmed.startsWith("\\[")) return "\\["
  if (trimmed.startsWith("\\(")) return "\\("
  if (trimmed.startsWith("\\begin")) return "\\begin"
  if (trimmed.startsWith("$")) return "$"
  return null
}

/**
 * Check if a string contains any math expressions.
 *
 * @param content - The string to check
 * @returns true if the string contains math delimiters
 */
export function containsMath(content: string): boolean {
  return (
    MATH_PATTERNS.displayDollar.test(content) ||
    MATH_PATTERNS.inlineDollar.test(content) ||
    MATH_PATTERNS.displayBracket.test(content) ||
    MATH_PATTERNS.inlineParen.test(content)
  )
}

/* -----------------------------------------------------------------------------
 * LEGACY ALIASES
 * -----------------------------------------------------------------------------
 * These maintain backwards compatibility with existing code.
 * New code should use the functions above.
 * ----------------------------------------------------------------------------- */

/** @deprecated Use preprocessMath instead */
export const preprocessKaTeX = preprocessMath

/** @deprecated Use renderMathToString instead */
export function renderKatex(
  latex: string,
  displayMode: boolean = false
): string {
  return renderMathToString(latex, { displayMode })
}
