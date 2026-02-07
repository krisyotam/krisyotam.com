#!/usr/bin/env node
/**
 * =============================================================================
 * Create Post Script
 * =============================================================================
 *
 * A minimal CLI tool for creating new posts via Claude Code. This script
 * collects only essential information from the user - Claude analyzes the
 * content and determines appropriate metadata (category, tags, status,
 * certainty, importance) based on the taxonomy rules in CLAUDE.md.
 *
 * Usage:
 *   node public/scripts/keep/createPost.js
 *
 * What This Script Asks For:
 *   - Post type (papers, blog, essays, notes, diary, progymnasmata, reviews, til, now)
 *   - Title (for most types)
 *   - Preview/description
 *   - Content (for TIL and Now entries)
 *   - Rating (for reviews only - this is user opinion, not metadata)
 *
 * What Claude Determines:
 *   - Category (from global pool or type-specific categories)
 *   - Tags (3+ relevant tags following taxonomy rules)
 *   - Status (Abandoned, Notes, Draft, In Progress, Finished)
 *   - Certainty (certain to impossible scale)
 *   - Importance (1-10 based on reader impact)
 *
 * Workflow:
 *   1. User provides minimal input via this script
 *   2. Script calls Claude with content analysis instructions
 *   3. Claude determines metadata following CLAUDE.md taxonomy rules
 *   4. Claude calls generateMetadata.js to create database entry and MDX file
 *
 * Author: Kris Yotam
 * =============================================================================
 */

const { spawn } = require('child_process');
const readline = require('readline');

// =============================================================================
// Configuration
// =============================================================================

/**
 * All supported content types
 */
const ALL_TYPES = [
  'papers', 'blog', 'essays', 'notes', 'diary',
  'progymnasmata', 'reviews', 'til', 'now'
];

/**
 * Types that require full content entry (not just title/preview)
 */
const CONTENT_ENTRY_TYPES = ['til', 'now'];

/**
 * Types where user provides a rating (subjective opinion)
 */
const RATING_TYPES = ['reviews'];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Create readline interface for user input
 */
function createReadline() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompt user for single-line input
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User's response (trimmed)
 */
function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt user for multi-line input
 * @param {readline.Interface} rl - Readline interface
 * @param {string} message - Message to display before input
 * @returns {Promise<string>} Multi-line content joined with newlines
 */
function promptMultiline(rl, message) {
  return new Promise((resolve) => {
    console.log(message);
    console.log('(Enter your content. Type END on a new line when done)\n');

    let lines = [];
    const lineHandler = (line) => {
      if (line === 'END') {
        rl.removeListener('line', lineHandler);
        resolve(lines.join('\n'));
      } else {
        lines.push(line);
      }
    };

    rl.on('line', lineHandler);
  });
}

/**
 * Validate user input against allowed choices
 * @param {string} value - User's input
 * @param {string[]} validChoices - Array of valid options
 * @returns {string|null} Matched choice or null if invalid
 */
function validateChoice(value, validChoices) {
  const normalized = value.toLowerCase();
  return validChoices.find(c => c.toLowerCase() === normalized) || null;
}

/**
 * Validate numeric input within range
 * @param {string} value - User's input
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number|null} Parsed number or null if invalid
 */
function validateNumber(value, min, max) {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= min && num <= max ? num : null;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// =============================================================================
// Type-Specific Handlers
// =============================================================================

/**
 * Handle TIL (Today I Learned) entry
 * Collects title and full content from user
 */
async function handleTil(rl) {
  console.log('\n=== Create TIL (Today I Learned) Entry ===\n');

  const title = await prompt(rl, 'What did you learn? (title): ');
  if (!title) {
    console.error('Error: Title is required');
    return null;
  }

  const content = await promptMultiline(rl, '\nEnter the TIL content:');
  if (!content) {
    console.error('Error: Content is required');
    return null;
  }

  return {
    type: 'til',
    title,
    content,
    date: getToday(),
  };
}

/**
 * Handle Now update
 * Collects full content from user (no title needed)
 */
async function handleNow(rl) {
  console.log('\n=== Create Now Update ===\n');
  console.log('This captures what you\'re focused on right now.\n');

  const content = await promptMultiline(rl, 'Enter the Now update content:');
  if (!content) {
    console.error('Error: Content is required');
    return null;
  }

  return {
    type: 'now',
    title: null,
    content,
    date: getToday(),
  };
}

/**
 * Handle Review entry
 * Collects title, preview, and user's rating (subjective)
 */
async function handleReview(rl) {
  console.log('\n=== Create Review ===\n');

  const title = await prompt(rl, 'What are you reviewing? (title): ');
  if (!title) {
    console.error('Error: Title is required');
    return null;
  }

  const preview = await prompt(rl, 'Brief description/preview: ');

  // Rating is subjective - user must provide this
  let rating = null;
  while (!rating) {
    const input = await prompt(rl, 'Your rating (1-10): ');
    rating = validateNumber(input, 1, 10);
    if (!rating) {
      console.log('Invalid. Must be a number between 1 and 10.');
    }
  }

  return {
    type: 'reviews',
    title,
    preview,
    rating,
    date: getToday(),
  };
}

/**
 * Handle standard content types
 * Collects only title and preview - Claude determines metadata
 */
async function handleStandardContent(rl, postType) {
  const typeName = postType.charAt(0).toUpperCase() + postType.slice(1);
  console.log(`\n=== Create ${typeName} Entry ===\n`);

  const title = await prompt(rl, 'Title: ');
  if (!title) {
    console.error('Error: Title is required');
    return null;
  }

  const preview = await prompt(rl, 'Preview/description: ');

  return {
    type: postType,
    title,
    preview,
    date: getToday(),
  };
}

// =============================================================================
// Claude Instruction Builder
// =============================================================================

/**
 * Build instruction for Claude to analyze content and generate metadata
 * @param {object} data - Collected user input
 * @returns {string} Instruction text for Claude
 */
function buildClaudeInstruction(data) {
  const scriptPath = 'node public/scripts/keep/generateMetadata.js';

  // Base instruction with context
  let instruction = `You are creating a new ${data.type} entry. Analyze the content and determine appropriate metadata following the taxonomy rules in CLAUDE.md.

=== USER INPUT ===
Type: ${data.type}
Title: ${data.title || '(none)'}
Preview: ${data.preview || '(none)'}
Date: ${data.date}`;

  // Add type-specific data
  if (data.content) {
    instruction += `\n\nContent:\n${data.content}`;
  }

  if (data.rating) {
    instruction += `\nUser Rating: ${data.rating}/10`;
  }

  // Add metadata determination instructions based on type
  instruction += `\n\n=== YOUR TASK ===

1. ANALYZE the title${data.preview ? ', preview,' : ''} ${data.content ? 'and content ' : ''}to understand the subject matter.

2. DETERMINE the following metadata:`;

  if (data.type === 'til' || data.type === 'now') {
    // TIL and Now don't need category/tags/ratings
    instruction += `
   - No additional metadata needed for ${data.type} entries.

3. CREATE the entry using this command:
   ${scriptPath} --type ${data.type} --title "${data.title || ''}" --content "<full content here>"`;

  } else if (data.type === 'diary') {
    // Diary needs category and tags but not quality ratings
    instruction += `
   - Category: Choose from global categories (culture, film, history, literature, philosophy, psychology, science, technology, theology, on-myself, manuals-of-style, website)
   - Tags: Select 3+ relevant tags that follow taxonomy rules (lowercase, stable, specific but not too narrow)

3. CREATE the entry using this command:
   ${scriptPath} --type diary --title "${data.title}" --preview "${data.preview || ''}" --category <chosen-category> --tags "<tag1,tag2,tag3>"`;

  } else if (data.type === 'progymnasmata') {
    // Progymnasmata has fixed categories
    instruction += `
   - Category: Choose from progymnasmata exercises (chreia, commonplace, comparison, confirmation, description, encomium, fable, impersonation, introduction-of-a-law, maxim, narrative, refutation, thesis, vituperation)
   - Tags: Select 3+ relevant tags
   - Status: Assess completion level (Notes, Draft, In Progress, Finished)
   - Certainty: How verifiable/reliable is the content? (certain, highly likely, likely, possible, unlikely, highly unlikely, remote, impossible)
   - Importance: Rate 1-10 based on potential impact on readers

3. CREATE the entry using this command:
   ${scriptPath} --type progymnasmata --title "${data.title}" --preview "${data.preview || ''}" --category <chosen-category> --tags "<tag1,tag2,tag3>" --status <status> --certainty <certainty> --importance <1-10>`;

  } else if (data.type === 'reviews') {
    // Reviews have fixed categories and user-provided rating
    instruction += `
   - Category: Choose media type (anime, book, bookstores, film, manga, television)
   - Tags: Select 3+ relevant tags (genre, themes, etc.)
   - Status: Usually "Finished" for reviews, unless it's a draft
   - Certainty: Reviews are opinion-based, typically "likely" to "possible"
   - Importance: Rate 1-10 based on the work's significance

3. CREATE the entry using this command:
   ${scriptPath} --type reviews --title "${data.title}" --preview "${data.preview || ''}" --category <chosen-category> --tags "<tag1,tag2,tag3>" --status <status> --certainty <certainty> --importance <1-10> --rating ${data.rating}`;

  } else {
    // Standard content types (papers, blog, essays, notes)
    instruction += `
   - Category: Choose from global categories (culture, film, history, literature, philosophy, psychology, science, technology, theology, on-myself, manuals-of-style, website)
   - Tags: Select 3+ relevant tags that follow taxonomy rules
   - Status: Assess the content's completion level:
     * Notes: Raw, unorganized thoughts
     * Draft: Structured but incomplete
     * In Progress: Being actively developed
     * Finished: Complete and polished
     * Abandoned: No longer being developed
   - Certainty: How verifiable/reliable is the content?
     * certain: Highly sourced, professionally verified facts
     * highly likely / likely: Well-supported claims
     * possible: Reasonable speculation or interpretation
     * unlikely / highly unlikely: Contrarian or speculative
     * remote / impossible: Highly speculative (e.g., conspiracies)
   - Importance: Rate 1-10 based on potential impact:
     * 1-3: Niche interest, limited audience
     * 4-6: Moderate interest, specific domain
     * 7-8: Broad interest, significant insight
     * 9-10: Essential reading, major impact

3. CREATE the entry using this command:
   ${scriptPath} --type ${data.type} --title "${data.title}" --preview "${data.preview || ''}" --category <chosen-category> --tags "<tag1,tag2,tag3>" --status <status> --certainty <certainty> --importance <1-10>`;
  }

  instruction += `

4. VERIFY the entry was created successfully.

Execute this now without asking for confirmation. Make thoughtful metadata choices based on the content.`;

  return instruction;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const rl = createReadline();

  console.log('\n=== Create New Post ===\n');
  console.log('This script collects minimal input. Claude will analyze your');
  console.log('content and determine appropriate metadata (category, tags, etc.)\n');
  console.log(`Available types: ${ALL_TYPES.join(', ')}\n`);

  // Get post type
  let postType = null;
  while (!postType) {
    const input = await prompt(rl, 'Post type: ');
    postType = validateChoice(input, ALL_TYPES);
    if (!postType) {
      console.log(`Invalid type. Must be one of: ${ALL_TYPES.join(', ')}`);
    }
  }

  // Route to appropriate handler
  let data = null;

  switch (postType) {
    case 'til':
      data = await handleTil(rl);
      break;
    case 'now':
      data = await handleNow(rl);
      break;
    case 'reviews':
      data = await handleReview(rl);
      break;
    default:
      data = await handleStandardContent(rl, postType);
  }

  rl.close();

  if (!data) {
    process.exit(1);
  }

  // Build Claude instruction
  const instruction = buildClaudeInstruction(data);

  console.log('\n=== Calling Claude Code ===\n');
  console.log('Claude will analyze your content and determine metadata...\n');

  // Call Claude Code
  try {
    const claude = spawn('claude', ['-p', instruction], {
      stdio: 'inherit',
      shell: true,
    });

    claude.on('close', (code) => {
      if (code === 0) {
        console.log('\n=== Post created successfully ===\n');
      } else {
        console.error(`\nClaude Code exited with code ${code}`);
      }
      process.exit(code);
    });

    claude.on('error', (err) => {
      console.error('Failed to start Claude Code:', err.message);
      console.log('\nManual fallback - run Claude with this instruction:\n');
      console.log(instruction);
      process.exit(1);
    });
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
