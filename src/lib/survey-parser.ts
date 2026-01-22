/**
 * ============================================================================
 * Survey Parser
 * ============================================================================
 * Parses .survey.md files in TOML-like format into SurveySchema objects
 *
 * @author Kris Yotam
 * @type utils
 * @path src/lib/survey-parser.ts
 * @date 2026-01-22
 * ============================================================================
 */

// ============================================================================
// Types
// ============================================================================

export interface SurveyMeta {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  anonymous?: boolean;
  estimated_time?: string;
  status: "active" | "draft" | "closed";
  // PageHeader fields
  start_date?: string;
  end_date?: string;
  confidence?: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance?: number;
  tags?: string[];
  category?: string;
}

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
}

export type QuestionType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "number"
  | "scale"
  | "rating"
  | "radio"
  | "select"
  | "checkbox"
  | "boolean"
  | "ranking"
  | "matrix"
  | "date"
  | "time"
  | "file"
  | "image";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  label: string;
  section?: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  // Text constraints
  min?: number;
  max?: number;
  rows?: number;
  // Choice options
  options?: string[];
  min_select?: number;
  max_select?: number;
  // Scale/rating
  labels?: Record<number, string>;
  icon?: string;
  step?: number;
  // Boolean
  true_label?: string;
  false_label?: string;
  // Matrix
  matrix_rows?: string[];
  columns?: string[];
  // File
  accept?: string;
  max_size?: string;
  // Conditional
  condition?: string;
}

export interface SurveySchema {
  meta: SurveyMeta;
  sections: SurveySection[];
  questions: SurveyQuestion[];
}

// ============================================================================
// Parser
// ============================================================================

export function parseSurveyMarkdown(content: string): SurveySchema {
  const lines = content.split("\n");

  let meta: Partial<SurveyMeta> = {};
  const sections: SurveySection[] = [];
  const questions: SurveyQuestion[] = [];

  let currentBlock: "survey" | "section" | "question" | null = null;
  let currentSection: Partial<SurveySection> | null = null;
  let currentQuestion: Partial<SurveyQuestion> | null = null;
  let currentSectionId: string | undefined;
  let multilineKey: string | null = null;
  let multilineBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith("#") || trimmed === "") {
      continue;
    }

    // Block headers
    if (trimmed === "[survey]") {
      saveCurrentBlock();
      currentBlock = "survey";
      continue;
    }

    if (trimmed === "[[section]]") {
      saveCurrentBlock();
      currentBlock = "section";
      currentSection = {};
      continue;
    }

    if (trimmed === "[[question]]") {
      saveCurrentBlock();
      currentBlock = "question";
      currentQuestion = { section: currentSectionId };
      continue;
    }

    // Handle multiline arrays
    if (multilineKey) {
      if (trimmed === "]") {
        // End of multiline array
        const value = multilineBuffer
          .map(s => s.replace(/^["']|["'],?$/g, "").trim())
          .filter(s => s.length > 0);
        setProperty(multilineKey, value);
        multilineKey = null;
        multilineBuffer = [];
        continue;
      } else {
        multilineBuffer.push(trimmed);
        continue;
      }
    }

    // Parse key = value pairs
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();

      // Check for multiline array start
      if (value === "[") {
        multilineKey = key;
        multilineBuffer = [];
        continue;
      }

      // Parse inline arrays
      if (value.startsWith("[") && value.endsWith("]")) {
        const arrayContent = value.slice(1, -1);
        const items = parseInlineArray(arrayContent);
        setProperty(key, items);
        continue;
      }

      // Parse inline objects (for labels, etc)
      if (value.startsWith("{") && value.endsWith("}")) {
        const obj = parseInlineObject(value.slice(1, -1));
        setProperty(key, obj);
        continue;
      }

      // Parse strings
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse booleans
      if (value === "true") {
        setProperty(key, true);
        continue;
      }
      if (value === "false") {
        setProperty(key, false);
        continue;
      }

      // Parse numbers
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        setProperty(key, parseFloat(value));
        continue;
      }

      // String value
      setProperty(key, value);
    }
  }

  // Save final block
  saveCurrentBlock();

  // Validate required fields
  if (!meta.id || !meta.title) {
    throw new Error("Survey must have id and title");
  }

  return {
    meta: {
      id: meta.id,
      title: meta.title,
      subtitle: meta.subtitle,
      description: meta.description,
      anonymous: meta.anonymous ?? true,
      estimated_time: meta.estimated_time,
      status: meta.status ?? "active",
      start_date: meta.start_date,
      end_date: meta.end_date,
      confidence: meta.confidence,
      importance: meta.importance,
      tags: meta.tags,
      category: meta.category,
    },
    sections,
    questions,
  };

  function setProperty(key: string, value: any) {
    switch (currentBlock) {
      case "survey":
        (meta as any)[key] = value;
        break;
      case "section":
        if (currentSection) {
          (currentSection as any)[key] = value;
        }
        break;
      case "question":
        if (currentQuestion) {
          // Handle matrix rows specially
          if (key === "rows" && Array.isArray(value)) {
            currentQuestion.matrix_rows = value;
          } else {
            (currentQuestion as any)[key] = value;
          }
        }
        break;
    }
  }

  function saveCurrentBlock() {
    if (currentBlock === "section" && currentSection?.id) {
      sections.push(currentSection as SurveySection);
      currentSectionId = currentSection.id;
      currentSection = null;
    }
    if (currentBlock === "question" && currentQuestion?.id) {
      questions.push(currentQuestion as SurveyQuestion);
      currentQuestion = null;
    }
  }
}

function parseInlineArray(content: string): string[] {
  const items: string[] = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";

  for (const char of content) {
    if (!inQuote && (char === '"' || char === "'")) {
      inQuote = true;
      quoteChar = char;
    } else if (inQuote && char === quoteChar) {
      inQuote = false;
      if (current.trim()) {
        items.push(current.trim());
      }
      current = "";
    } else if (!inQuote && char === ",") {
      if (current.trim()) {
        items.push(current.trim());
      }
      current = "";
    } else if (inQuote || (char !== " " && char !== '"' && char !== "'")) {
      current += char;
    }
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  return items;
}

function parseInlineObject(content: string): Record<string | number, string> {
  const obj: Record<string | number, string> = {};
  const pairs = content.split(",");

  for (const pair of pairs) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex > 0) {
      let key = pair.slice(0, eqIndex).trim();
      let value = pair.slice(eqIndex + 1).trim();

      // Remove quotes from value
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse numeric keys
      if (/^\d+$/.test(key)) {
        obj[parseInt(key, 10)] = value;
      } else {
        obj[key] = value;
      }
    }
  }

  return obj;
}

// ============================================================================
// File Loading
// ============================================================================

export function extractSurveyMeta(content: string): SurveyMeta {
  const schema = parseSurveyMarkdown(content);
  return schema.meta;
}
