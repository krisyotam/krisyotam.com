/**
 * =============================================================================
 * frontmatter.js
 * =============================================================================
 *
 * Webpack loader to strip custom frontmatter blocks from MDX files.
 * Runs before MDX compilation to remove # === delimited blocks.
 *
 * @author Kris Yotam
 * @type loader
 * @path src/lib/frontmatter.js
 * =============================================================================
 */

const DELIMITER = '# =============================================================================='

/**
 * Webpack loader that strips custom frontmatter from MDX content
 *
 * @param {string} source - The raw file content
 * @returns {string} - Content with frontmatter stripped
 */
module.exports = function stripFrontmatterLoader(source) {
  const lines = source.split('\n')
  let delimiterCount = 0
  let contentStartIndex = 0

  // Find where content starts (after 4 delimiters = 2 blocks)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line === DELIMITER) {
      delimiterCount++

      if (delimiterCount === 4) {
        contentStartIndex = i + 1
        break
      }
    }
  }

  // If we found all 4 delimiters, return content after them
  if (delimiterCount === 4) {
    return lines.slice(contentStartIndex).join('\n').trim()
  }

  // Otherwise return original content
  return source
}
