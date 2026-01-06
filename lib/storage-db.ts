/**
 * ============================================================================
 * Storage Database Library
 * Author: Kris Yotam
 * Date: 2026-01-04
 * Filename: storage-db.ts
 * Description: Provides query functions for the storage.db SQLite database
 *              containing object storage bucket listings (doc, src, archive).
 * ============================================================================
 */

import Database from "better-sqlite3";
import path from "path";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface StorageObject {
  bucket: string;
  key: string;
  size: number;
  last_modified: string;
  original_url: string;
  public_url: string;
}

export interface Bucket {
  name: string;
  objects: StorageObject[];
}

export interface StorageData {
  buckets: Bucket[];
}

interface DbBucket {
  id: number;
  name: string;
  created_at: string;
}

interface DbObject {
  id: number;
  bucket_id: number;
  bucket_name: string;
  key: string;
  size: number;
  last_modified: string | null;
  original_url: string | null;
  public_url: string | null;
}

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

let db: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "public", "data", "storage.db");
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

// ============================================================================
// BUCKET QUERIES
// ============================================================================

/**
 * Get all bucket names
 */
export function getAllBuckets(): string[] {
  const database = getDatabase();
  const stmt = database.prepare(`SELECT name FROM buckets ORDER BY name`);
  const rows = stmt.all() as { name: string }[];
  return rows.map((row) => row.name);
}

/**
 * Get bucket info with object count and total size
 */
export function getBucketStats(): {
  name: string;
  objectCount: number;
  totalSize: number;
}[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT b.name, COUNT(o.id) as object_count, COALESCE(SUM(o.size), 0) as total_size
    FROM buckets b
    LEFT JOIN objects o ON b.id = o.bucket_id
    GROUP BY b.id
    ORDER BY b.name
  `);
  const rows = stmt.all() as {
    name: string;
    object_count: number;
    total_size: number;
  }[];
  return rows.map((row) => ({
    name: row.name,
    objectCount: row.object_count,
    totalSize: row.total_size,
  }));
}

// ============================================================================
// OBJECT QUERIES
// ============================================================================

/**
 * Get all objects for a specific bucket
 */
export function getObjectsByBucket(bucketName: string): StorageObject[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT bucket_name as bucket, key, size, last_modified, original_url, public_url
    FROM objects
    WHERE bucket_name = ?
    ORDER BY key
  `);
  const rows = stmt.all(bucketName) as DbObject[];
  return rows.map((row) => ({
    bucket: row.bucket_name,
    key: row.key,
    size: row.size,
    last_modified: row.last_modified || "",
    original_url: row.original_url || "",
    public_url: row.public_url || "",
  }));
}

/**
 * Get storage data for a bucket in the format expected by ArchivesComponent
 */
export function getBucketData(bucketName: string): StorageData {
  const objects = getObjectsByBucket(bucketName);
  return {
    buckets: [
      {
        name: bucketName,
        objects,
      },
    ],
  };
}

/**
 * Get storage data for all buckets in the format expected by ArchivesComponent
 */
export function getAllBucketsData(): StorageData {
  const bucketNames = getAllBuckets();
  const buckets: Bucket[] = bucketNames.map((name) => ({
    name,
    objects: getObjectsByBucket(name),
  }));
  return { buckets };
}

// ============================================================================
// SEARCH QUERIES
// ============================================================================

/**
 * Search objects by key pattern
 */
export function searchObjects(
  pattern: string,
  limit: number = 50
): StorageObject[] {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT bucket_name as bucket, key, size, last_modified, original_url, public_url
    FROM objects
    WHERE key LIKE ?
    ORDER BY bucket_name, key
    LIMIT ?
  `);
  const rows = stmt.all(`%${pattern}%`, limit) as DbObject[];
  return rows.map((row) => ({
    bucket: row.bucket_name,
    key: row.key,
    size: row.size,
    last_modified: row.last_modified || "",
    original_url: row.original_url || "",
    public_url: row.public_url || "",
  }));
}

/**
 * Search objects by file extension
 */
export function searchByExtension(
  extension: string,
  bucketName?: string
): StorageObject[] {
  const database = getDatabase();
  let query = `
    SELECT bucket_name as bucket, key, size, last_modified, original_url, public_url
    FROM objects
    WHERE key LIKE ?
  `;
  const params: (string | number)[] = [`%.${extension}`];

  if (bucketName) {
    query += ` AND bucket_name = ?`;
    params.push(bucketName);
  }

  query += ` ORDER BY bucket_name, key`;

  const stmt = database.prepare(query);
  const rows = stmt.all(...params) as DbObject[];
  return rows.map((row) => ({
    bucket: row.bucket_name,
    key: row.key,
    size: row.size,
    last_modified: row.last_modified || "",
    original_url: row.original_url || "",
    public_url: row.public_url || "",
  }));
}

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

/**
 * Get database statistics
 */
export function getStorageStats(): {
  bucketCount: number;
  objectCount: number;
  totalSize: number;
} {
  const database = getDatabase();

  const bucketCount = (
    database.prepare(`SELECT COUNT(*) as count FROM buckets`).get() as {
      count: number;
    }
  ).count;

  const objectStats = database
    .prepare(
      `SELECT COUNT(*) as count, COALESCE(SUM(size), 0) as total FROM objects`
    )
    .get() as { count: number; total: number };

  return {
    bucketCount,
    objectCount: objectStats.count,
    totalSize: objectStats.total,
  };
}
