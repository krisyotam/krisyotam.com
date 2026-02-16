#!/usr/bin/env node
/**
 * =============================================================================
 * Git Commit with Changelog Integration (v3)
 * =============================================================================
 *
 * A CLI tool for committing changes with automatic changelog database updates.
 * Syncs all ~/content/ repos before committing the main site repo.
 *
 * Interactive Mode (default):
 *   node public/scripts/keep/git.js
 *
 * Headless Mode:
 *   node public/scripts/keep/git.js --headless --content "entry" --kind daily
 *   node public/scripts/keep/git.js --headless --infra "entry" --kind milestone
 *   node public/scripts/keep/git.js --headless --content "content" --infra "infra" --kind reflection
 *   node public/scripts/keep/git.js --headless --message "regular commit msg"
 *
 * Flags:
 *   --headless     Run without prompts (requires --content, --infra, or --message)
 *   --content      Content changelog entry text
 *   --infra        Infrastructure changelog entry text
 *   --kind         Entry type: daily, reflection, milestone (default: daily)
 *   --message      Regular commit message (skips changelog)
 *   --no-push      Skip pushing to remote
 *   --no-sync      Skip syncing content repos
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

const DB_PATH = path.join(__dirname, '../../data/system.db');
const VALID_KINDS = ['daily', 'reflection', 'milestone'];

// =============================================================================
// CLI Argument Parsing
// =============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    headless: false,
    content: null,
    infra: null,
    kind: 'daily',
    message: null,
    noPush: false,
    noSync: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--headless') {
      parsed.headless = true;
    } else if (arg === '--no-push') {
      parsed.noPush = true;
    } else if (arg === '--no-sync') {
      parsed.noSync = true;
    } else if (arg === '--content' && args[i + 1]) {
      parsed.content = args[++i];
    } else if (arg === '--infra' && args[i + 1]) {
      parsed.infra = args[++i];
    } else if (arg === '--kind' && args[i + 1]) {
      const kind = args[++i].toLowerCase();
      if (VALID_KINDS.includes(kind)) {
        parsed.kind = kind;
      } else {
        console.error(`Invalid kind: ${kind}. Must be one of: ${VALID_KINDS.join(', ')}`);
        process.exit(1);
      }
    } else if (arg === '--message' && args[i + 1]) {
      parsed.message = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`
Git Commit with Changelog Integration

Usage:
  Interactive:  node git.js
  Headless:     node git.js --headless [options]

Options:
  --headless          Run without prompts
  --content "text"    Content changelog entry
  --infra "text"      Infrastructure changelog entry
  --kind TYPE         Entry type: daily, reflection, milestone (default: daily)
  --message "text"    Regular commit message (skips changelog)
  --no-push           Skip pushing to remote
  --no-sync           Skip syncing content repos
  --help, -h          Show this help

Examples:
  node git.js --headless --content "Added new blog post" --kind daily
  node git.js --headless --infra "Fixed API bug" --kind milestone
  node git.js --headless --content "New essay" --infra "Refactored db" --kind reflection
  node git.js --headless --message "Minor fix"
`);
}

// =============================================================================
// Readline Interface
// =============================================================================

let rl = null;

function getReadline() {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  return rl;
}

function closeReadline() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

function question(prompt) {
  return new Promise((resolve) => {
    getReadline().question(prompt, resolve);
  });
}

function select(prompt, options) {
  return new Promise((resolve) => {
    const r = getReadline();

    console.log(`\n${prompt}`);
    options.forEach((opt, i) => {
      console.log(`  ${i + 1}. ${opt}`);
    });

    r.question('\nSelect (number): ', (answer) => {
      const idx = parseInt(answer, 10) - 1;
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx]);
      } else {
        resolve(options[0]); // Default to first option
      }
    });
  });
}

// =============================================================================
// Date Utilities
// =============================================================================

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
// Content Repo Sync
// =============================================================================

/**
 * Sync all ~/content/ repos by calling the `sync` script.
 * This ensures content repos are committed and pushed before the main
 * site repo commit, preventing build errors from stale submodules.
 */
function syncContentRepos() {
  console.log('\nSyncing content repos...');

  try {
    execSync('sync --quiet', {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` },
    });
    console.log('Content repos synced.\n');
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString().trim() : '';
    const stdout = err.stdout ? err.stdout.toString().trim() : '';
    const output = stderr || stdout || err.message;

    console.error(`\nContent sync issue: ${output}`);
    console.error('Continuing with site commit anyway.\n');
  }
}

// =============================================================================
// Database Operations
// =============================================================================

function insertChangelog(db, table, text, kind = 'daily') {
  const { id, day, weekday, month, year } = getDateParts();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO ${table} (id, day, weekday, month, year, text, kind)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, day, weekday, month, year, text, kind);
}

function writeChangelog(contentEntry, infraEntry, kind) {
  try {
    const db = new Database(DB_PATH);

    if (contentEntry) {
      insertChangelog(db, 'changelog_content', contentEntry, kind);
      console.log('  -> Content changelog entry added');
    }

    if (infraEntry) {
      insertChangelog(db, 'changelog_infra', infraEntry, kind);
      console.log('  -> Infra changelog entry added');
    }

    db.close();
    return true;
  } catch (err) {
    console.error('Database error:', err.message);
    return false;
  }
}

// =============================================================================
// Commit Message Formatting
// =============================================================================

function formatCommitMessage(contentEntry, infraEntry, kind) {
  const date = getDateParts();
  const dateStr = `${date.month} ${date.day}, ${date.year}`;
  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1);

  const sections = [];

  if (contentEntry && infraEntry) {
    sections.push(`[${kindLabel}] ${dateStr}`);
    sections.push('');
    sections.push('== Content ==');
    sections.push(contentEntry);
    sections.push('');
    sections.push('== Infrastructure ==');
    sections.push(infraEntry);
  } else if (contentEntry) {
    sections.push(`[Content/${kindLabel}] ${contentEntry}`);
  } else if (infraEntry) {
    sections.push(`[Infra/${kindLabel}] ${infraEntry}`);
  }

  return sections.join('\n');
}

// =============================================================================
// Git Operations
// =============================================================================

function executeGit(commitMessage, noPush = false) {
  try {
    console.log('\nStaging changes...');
    execSync('git add .', { stdio: 'inherit' });

    console.log('Committing...');
    const escapedMsg = commitMessage.replace(/'/g, "'\\''");
    execSync(`git commit -m $'${escapedMsg.replace(/\n/g, '\\n')}'`, { stdio: 'inherit' });

    if (!noPush) {
      console.log('Pushing to origin/main...');
      execSync('git checkout -B main', { stdio: 'inherit' });
      execSync('git push -u origin main', { stdio: 'inherit' });
    } else {
      console.log('Skipping push (--no-push flag)');
    }

    console.log('\nDone.');
    return true;
  } catch (err) {
    console.error('\nGit error:', err.message);
    return false;
  }
}

// =============================================================================
// Headless Mode
// =============================================================================

async function runHeadless(args) {
  if (args.message) {
    console.log('Headless mode: Regular commit');
    return executeGit(args.message, args.noPush);
  }

  if (!args.content && !args.infra) {
    console.error('Headless mode requires --content, --infra, or --message');
    process.exit(1);
  }

  console.log('Headless mode: Changelog commit');
  console.log(`  Kind: ${args.kind}`);
  if (args.content) console.log(`  Content: ${args.content}`);
  if (args.infra) console.log(`  Infra: ${args.infra}`);

  writeChangelog(args.content, args.infra, args.kind);

  const commitMessage = formatCommitMessage(args.content, args.infra, args.kind);
  return executeGit(commitMessage, args.noPush);
}

// =============================================================================
// Interactive Mode
// =============================================================================

async function runInteractive(args) {
  console.log('\n========================================');
  console.log('  Git Commit with Changelog Integration');
  console.log('========================================\n');

  // Step 1: Select feed type
  const feedChoice = await select('Which changelog feed(s)?', [
    'Content only',
    'Infrastructure only',
    'Both Content and Infrastructure',
    'Skip changelog (regular commit)'
  ]);

  let contentEntry = null;
  let infraEntry = null;
  let commitMessage = '';

  if (feedChoice === 'Skip changelog (regular commit)') {
    commitMessage = await question('\nCommit message: ');

    if (!commitMessage.trim()) {
      console.log('\nError: Commit message cannot be empty');
      closeReadline();
      return;
    }
  } else {
    const needsContent = feedChoice.includes('Content');
    const needsInfra = feedChoice.includes('Infrastructure');

    // Step 2: Select kind
    const kind = await select('Entry type?', ['daily', 'reflection', 'milestone']);

    // Step 3: Get entries
    if (needsContent) {
      contentEntry = await question('\nContent entry: ');
      if (!contentEntry.trim()) {
        console.log('Error: Content entry cannot be empty');
        closeReadline();
        return;
      }
      contentEntry = contentEntry.trim();
    }

    if (needsInfra) {
      infraEntry = await question('\nInfrastructure entry: ');
      if (!infraEntry.trim()) {
        console.log('Error: Infrastructure entry cannot be empty');
        closeReadline();
        return;
      }
      infraEntry = infraEntry.trim();
    }

    writeChangelog(contentEntry, infraEntry, kind);

    commitMessage = formatCommitMessage(contentEntry, infraEntry, kind);
  }

  // Show preview
  console.log('\n--- Commit Message Preview ---');
  console.log(commitMessage);
  console.log('------------------------------\n');

  const confirm = await question('Proceed with commit? (y/n): ');

  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('Aborted.');
    closeReadline();
    return;
  }

  closeReadline();
  executeGit(commitMessage, args.noPush);
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const args = parseArgs();

  try {
    // Sync content repos first (unless --no-sync)
    if (!args.noSync) {
      syncContentRepos();
    }

    if (args.headless) {
      await runHeadless(args);
    } else {
      await runInteractive(args);
    }
  } finally {
    closeReadline();
  }
}

main();
