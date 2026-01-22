/**
 * ============================================================================
 * Lab Database Access Library
 * ============================================================================
 * TypeScript library for accessing lab.db SQLite database
 *
 * Tables:
 *   - survey_responses: Survey submission data
 *   - surveys: Survey metadata
 *
 * @author Kris Yotam
 * @type utils
 * @path src/lib/lab-db.ts
 * @date 2026-01-21
 * ============================================================================
 */

import Database from "better-sqlite3";
import path from "path";

// ============================================================================
// Types
// ============================================================================

export interface SurveyResponse {
  id: number;
  survey_slug: string;
  response_data: Record<string, any>;
  submitted_at: string;
  ip_hash: string | null;
  user_agent: string | null;
}

export interface SurveyMeta {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  state: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Database Connection
// ============================================================================

const DB_PATH = path.join(process.cwd(), "public", "data", "lab.db");

function getDb(readonly = true): Database.Database {
  return new Database(DB_PATH, { readonly });
}

function getWriteDb(): Database.Database {
  return new Database(DB_PATH, { readonly: false });
}

// ============================================================================
// Survey Response Functions
// ============================================================================

export function submitSurveyResponse(
  surveySlug: string,
  responseData: Record<string, any>,
  ipHash?: string,
  userAgent?: string
): number {
  const db = getWriteDb();
  try {
    const stmt = db.prepare(`
      INSERT INTO survey_responses (survey_slug, response_data, ip_hash, user_agent)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      surveySlug,
      JSON.stringify(responseData),
      ipHash || null,
      userAgent || null
    );
    return result.lastInsertRowid as number;
  } finally {
    db.close();
  }
}

export function getSurveyResponses(surveySlug: string): SurveyResponse[] {
  const db = getDb();
  try {
    const rows = db
      .prepare(`
        SELECT id, survey_slug, response_data, submitted_at, ip_hash, user_agent
        FROM survey_responses
        WHERE survey_slug = ?
        ORDER BY submitted_at DESC
      `)
      .all(surveySlug) as any[];

    return rows.map((row) => ({
      ...row,
      response_data: JSON.parse(row.response_data),
    }));
  } finally {
    db.close();
  }
}

export function getAllSurveyResponses(): SurveyResponse[] {
  const db = getDb();
  try {
    const rows = db
      .prepare(`
        SELECT id, survey_slug, response_data, submitted_at, ip_hash, user_agent
        FROM survey_responses
        ORDER BY submitted_at DESC
      `)
      .all() as any[];

    return rows.map((row) => ({
      ...row,
      response_data: JSON.parse(row.response_data),
    }));
  } finally {
    db.close();
  }
}

export function getSurveyResponseCount(surveySlug: string): number {
  const db = getDb();
  try {
    const row = db
      .prepare(`SELECT COUNT(*) as count FROM survey_responses WHERE survey_slug = ?`)
      .get(surveySlug) as { count: number };
    return row.count;
  } finally {
    db.close();
  }
}

// ============================================================================
// Survey Metadata Functions
// ============================================================================

export function getAllSurveys(): SurveyMeta[] {
  const db = getDb();
  try {
    return db
      .prepare(`
        SELECT id, slug, title, description, state, created_at, updated_at
        FROM surveys
        ORDER BY created_at DESC
      `)
      .all() as SurveyMeta[];
  } finally {
    db.close();
  }
}

export function getSurveyBySlug(slug: string): SurveyMeta | null {
  const db = getDb();
  try {
    const row = db
      .prepare(`
        SELECT id, slug, title, description, state, created_at, updated_at
        FROM surveys
        WHERE slug = ?
      `)
      .get(slug) as SurveyMeta | undefined;
    return row || null;
  } finally {
    db.close();
  }
}

export function upsertSurvey(
  slug: string,
  title: string,
  description?: string,
  state: string = "active"
): void {
  const db = getWriteDb();
  try {
    db.prepare(`
      INSERT INTO surveys (slug, title, description, state, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        state = excluded.state,
        updated_at = datetime('now')
    `).run(slug, title, description || null, state);
  } finally {
    db.close();
  }
}

export function getActiveSurveys(): SurveyMeta[] {
  const db = getDb();
  try {
    return db
      .prepare(`
        SELECT id, slug, title, description, state, created_at, updated_at
        FROM surveys
        WHERE state = 'active'
        ORDER BY title ASC
      `)
      .all() as SurveyMeta[];
  } finally {
    db.close();
  }
}

// ============================================================================
// Survey Sync Functions
// ============================================================================

export function syncSurveysFromFiles(
  surveys: Array<{ slug: string; title: string; description?: string; state?: string }>
): void {
  const db = getWriteDb();
  try {
    const stmt = db.prepare(`
      INSERT INTO surveys (slug, title, description, state, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        state = excluded.state,
        updated_at = datetime('now')
    `);

    for (const survey of surveys) {
      stmt.run(
        survey.slug,
        survey.title,
        survey.description || null,
        survey.state || "active"
      );
    }
  } finally {
    db.close();
  }
}
