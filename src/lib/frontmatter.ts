/**
 * =============================================================================
 * frontmatter.ts
 * =============================================================================
 *
 * Utility functions for handling MDX frontmatter and header blocks.
 * Strips comment headers and YAML frontmatter from raw MDX content.
 *
 * @author Kris Yotam
 * @type utils
 * @path src/lib/frontmatter.ts
 * =============================================================================
 */

// =============================================================================
// Constants
// =============================================================================

const DELIMITER = '# =============================================================================='

// =============================================================================
// Strip Frontmatter
// =============================================================================

/**
 * Strips the comment header and YAML frontmatter from raw MDX content.
 *
 * Expected format:
 * - Comment header block (delimited by # ===)
 * - YAML frontmatter block (delimited by # ===)
 * - Actual content
 *
 * @param raw - The raw MDX file content
 * @returns The content with header and frontmatter stripped
 */
export function stripFrontmatter(raw: string): string {
  const lines = raw.split('\n')
  let delimiterCount = 0
  let contentStartIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line === DELIMITER) {
      delimiterCount++

      // After 4 delimiters (2 blocks), content starts
      if (delimiterCount === 4) {
        contentStartIndex = i + 1
        break
      }
    }
  }

  // If we didn't find all 4 delimiters, return original content
  if (delimiterCount < 4) {
    return raw
  }

  // Return content after the frontmatter blocks, trimmed
  return lines.slice(contentStartIndex).join('\n').trim()
}

// =============================================================================
// Parse Frontmatter (optional utility)
// =============================================================================

/**
 * Parses the YAML frontmatter block and returns it as an object.
 *
 * @param raw - The raw MDX file content
 * @returns Parsed frontmatter object or null if not found
 */
export function parseFrontmatter(raw: string): Record<string, unknown> | null {
  const lines = raw.split('\n')
  let delimiterCount = 0
  let yamlStartIndex = -1
  let yamlEndIndex = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line === DELIMITER) {
      delimiterCount++

      // Third delimiter marks start of YAML block
      if (delimiterCount === 3) {
        yamlStartIndex = i + 1
      }

      // Fourth delimiter marks end of YAML block
      if (delimiterCount === 4) {
        yamlEndIndex = i
        break
      }
    }
  }

  if (yamlStartIndex === -1 || yamlEndIndex === -1) {
    return null
  }

  // Parse simple YAML (key: value format)
  const yamlLines = lines.slice(yamlStartIndex, yamlEndIndex)
  const result: Record<string, unknown> = {}

  for (const line of yamlLines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value: unknown = line.slice(colonIndex + 1).trim()

    // Handle arrays [item1, item2]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    }
    // Handle quoted strings
    else if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    // Handle numbers
    else if (typeof value === 'string' && !isNaN(Number(value)) && value.length > 0) {
      value = Number(value)
    }

    if (key) {
      result[key] = value
    }
  }

  return result
}
