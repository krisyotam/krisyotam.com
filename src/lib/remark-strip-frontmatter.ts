/**
 * =============================================================================
 * remark-strip-frontmatter.ts
 * =============================================================================
 *
 * Remark plugin to strip custom frontmatter blocks from MDX content.
 * Removes content between # === delimiters before MDX compilation.
 *
 * @author Kris Yotam
 * @type utils
 * @path src/lib/remark-strip-frontmatter.ts
 * =============================================================================
 */

import type { Root } from 'mdast'
import type { Plugin } from 'unified'

const DELIMITER = '# =============================================================================='

/**
 * Remark plugin that strips custom frontmatter blocks delimited by # ===
 *
 * Expected format at start of file:
 * - Comment header block (between # ===)
 * - YAML frontmatter block (between # ===)
 * - Actual content
 *
 * This plugin removes both blocks before MDX rendering.
 */
const remarkStripFrontmatter: Plugin<[], Root> = () => {
  return (tree, file) => {
    // Get the raw content from the file
    const content = file.value as string

    if (typeof content !== 'string') {
      return
    }

    const lines = content.split('\n')
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

    // If we found all 4 delimiters, update the file content
    if (delimiterCount === 4) {
      const newContent = lines.slice(contentStartIndex).join('\n').trim()
      file.value = newContent

      // Clear the tree and let it be re-parsed with new content
      // This is a workaround since we're modifying raw content
      tree.children = []
    }
  }
}

export default remarkStripFrontmatter
