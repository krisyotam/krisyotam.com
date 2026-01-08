/**
 * =============================================================================
 * Git Commit with Changelog Integration
 * =============================================================================
 *
 * A CLI tool for committing changes with automatic changelog database updates.
 * Prompts for optional content and infra updates, inserts them into system.db,
 * and creates a formatted git commit.
 *
 * Usage: node public/scripts/keep/git.js
 *
 * Flow:
 *   1. Prompt for Content Update (optional)
 *   2. Prompt for Infra Update (optional)
 *   3. If either provided: insert into DB and format commit message
 *   4. If both skipped: prompt for regular commit message
 *   5. Stage, commit, and push to origin/main
 *
 * Database: public/data/system.db
 *   - changelog_content: Content-related updates
 *   - changelog_infra: Infrastructure-related updates
 *
 * Author: Kris Yotam
 * =============================================================================
 */

const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const Database = require('better-sqlite3');

// =============================================================================
// Configuration
// =============================================================================

const DB_PATH = path.join(__dirname, '../../../public/data/system.db');

// =============================================================================
// Readline Interface
// =============================================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// =============================================================================
// Date Utilities
// =============================================================================

/**
 * Get date parts formatted for changelog tables
 * @returns {Object} { id, day, weekday, month, year }
 */
function getDateParts() {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  const year = now.getFullYear().toString();
  const month = months[now.getMonth()];
  const day = now.getDate().toString();
  const weekday = days[now.getDay()];
  const id = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return { id, day, weekday, month, year };
}

// =============================================================================
// Database Operations
// =============================================================================

/**
 * Insert or replace a changelog entry
 * @param {Database} db - better-sqlite3 database instance
 * @param {string} table - Table name (changelog_content or changelog_infra)
 * @param {string} text - The changelog entry text
 * @param {string} kind - Entry type (default: 'daily')
 */
function insertChangelog(db, table, text, kind = 'daily') {
  const { id, day, weekday, month, year } = getDateParts();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO ${table} (id, day, weekday, month, year, text, kind)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, day, weekday, month, year, text, kind);
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('\nGit Commit with Changelog Integration\n');

  // Prompt for content update
  const contentUpdate = await question('Content Update (optional, press Enter to skip): ');

  // Prompt for infra update
  const infraUpdate = await question('Infra Update (optional, press Enter to skip): ');

  let commitMessage = '';
  let hasChangelog = false;

  // Build commit message
  if (contentUpdate.trim() || infraUpdate.trim()) {
    const parts = [];

    if (contentUpdate.trim()) {
      parts.push(`Content Updates: ${contentUpdate.trim()}`);
    }

    if (infraUpdate.trim()) {
      parts.push(`Infra Updates: ${infraUpdate.trim()}`);
    }

    commitMessage = parts.join('\n\n');
    hasChangelog = true;
  } else {
    // Both were skipped, ask for regular commit message
    commitMessage = await question('Commit message: ');

    if (!commitMessage.trim()) {
      console.log('\nError: Commit message cannot be empty');
      rl.close();
      return;
    }
  }

  // Insert into database if changelog entries were provided
  if (hasChangelog) {
    try {
      const db = new Database(DB_PATH);

      if (contentUpdate.trim()) {
        insertChangelog(db, 'changelog_content', contentUpdate.trim());
        console.log('Content changelog entry added');
      }

      if (infraUpdate.trim()) {
        insertChangelog(db, 'changelog_infra', infraUpdate.trim());
        console.log('Infra changelog entry added');
      }

      db.close();
    } catch (err) {
      console.error('\nDatabase error (continuing with commit):', err.message);
    }
  }

  // Execute git commands
  try {
    console.log('\nStaging changes...');
    execSync('git add .', { stdio: 'inherit' });

    console.log('Committing...');
    const escapedMsg = commitMessage.replace(/"/g, '\\"');
    execSync(`git commit -m "${escapedMsg}"`, { stdio: 'inherit' });

    console.log('Pushing to origin/main...');
    execSync('git checkout -B main', { stdio: 'inherit' });
    execSync('git push -u origin main', { stdio: 'inherit' });

    console.log('\nDone.');
  } catch (err) {
    console.error('\nGit error:', err.message);
  } finally {
    rl.close();
  }
}

main();
