/**
 * ============================================================================
 * Markdown Form Parser
 * ============================================================================
 * Parses .form.md files into SurveySchema objects
 *
 * Format:
 * ---
 * slug: contact
 * title: Contact Form
 * description: Get in touch
 * submitLabel: Send
 * successMessage: Thank you!
 * ---
 *
 * [text: name | Your Name | required | placeholder: John Doe]
 * [email: email | Email Address | required | description: We'll respond here]
 * [textarea: message | Message | required | min: 10]
 * [select: topic | Topic | required | options: General, Feedback, Other]
 * [radio: priority | Priority | options: Low, Medium, High]
 * [checkbox: interests | Interests | options: Tech, Art, Music]
 *
 * @author Kris Yotam
 * @type utils
 * @path src/lib/form-parser.ts
 * @date 2026-01-21
 * ============================================================================
 */

import type { SurveySchema, SurveyField, FieldType } from "@/components/core/survey";
import matter from "gray-matter";

// ============================================================================
// Types
// ============================================================================

interface FormFrontmatter {
  slug: string;
  title: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  state?: string;
}

// ============================================================================
// Parser
// ============================================================================

export function parseFormMarkdown(content: string): SurveySchema {
  const { data, content: body } = matter(content);
  const frontmatter = data as FormFrontmatter;

  if (!frontmatter.slug || !frontmatter.title) {
    throw new Error("Form must have slug and title in frontmatter");
  }

  const fields = parseFields(body);

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    submitLabel: frontmatter.submitLabel,
    successMessage: frontmatter.successMessage,
    fields,
  };
}

function parseFields(body: string): SurveyField[] {
  const fields: SurveyField[] = [];

  // Match field definitions: [type: name | label | ...modifiers]
  const fieldRegex = /\[(\w+):\s*(\w+)\s*\|([^\]]+)\]/g;
  let match;

  while ((match = fieldRegex.exec(body)) !== null) {
    const type = match[1] as FieldType;
    const name = match[2];
    const parts = match[3].split("|").map((p) => p.trim());

    const label = parts[0];
    const field: SurveyField = { name, label, type };

    // Parse modifiers
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      if (part === "required") {
        field.required = true;
      } else if (part.startsWith("placeholder:")) {
        field.placeholder = part.replace("placeholder:", "").trim();
      } else if (part.startsWith("description:")) {
        field.description = part.replace("description:", "").trim();
      } else if (part.startsWith("options:")) {
        field.options = part
          .replace("options:", "")
          .split(",")
          .map((o) => o.trim());
      } else if (part.startsWith("min:")) {
        const val = parseInt(part.replace("min:", "").trim(), 10);
        if (type === "number") {
          field.min = val;
        } else {
          field.minLength = val;
        }
      } else if (part.startsWith("max:")) {
        const val = parseInt(part.replace("max:", "").trim(), 10);
        if (type === "number") {
          field.max = val;
        } else {
          field.maxLength = val;
        }
      }
    }

    fields.push(field);
  }

  return fields;
}

export function extractFormFrontmatter(content: string): FormFrontmatter {
  const { data } = matter(content);
  return data as FormFrontmatter;
}
