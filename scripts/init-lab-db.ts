/**
 * ============================================================================
 * Initialize Lab Database
 * ============================================================================
 * Creates public/data/lab.db with survey_responses table
 *
 * Run: npx ts-node scripts/init-lab-db.ts
 *
 * @author Kris Yotam
 * @date 2026-01-21
 * ============================================================================
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "public", "data", "lab.db");

// Ensure directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

// Create survey_responses table
db.exec(`
  CREATE TABLE IF NOT EXISTS survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_slug TEXT NOT NULL,
    response_data TEXT NOT NULL,
    submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
    ip_hash TEXT,
    user_agent TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_survey_responses_slug ON survey_responses(survey_slug);
  CREATE INDEX IF NOT EXISTS idx_survey_responses_date ON survey_responses(submitted_at);
`);

// Create surveys metadata table (optional, for tracking)
db.exec(`
  CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    state TEXT DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

console.log("Lab database initialized at:", DB_PATH);
db.close();
