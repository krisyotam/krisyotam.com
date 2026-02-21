/**
 * ============================================================================
 * Contact Page
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Updated: 2026-02-18
 * Filename: page.tsx
 * Description: Contact page with email rules, alternative contact methods,
 *              PGP encryption details, and a contact form powered by the
 *              modern survey system.
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { parseSurveyMarkdown } from "@/lib/survey-parser";
import ContactPageClient from "./ContactPageClient";

const SURVEYS_DIR = path.join(
  process.cwd(),
  "src/app/(misc)/surveys/content"
);

function loadContactSurvey() {
  const filePath = path.join(SURVEYS_DIR, "contact.survey.md");
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return parseSurveyMarkdown(content);
}

export default function ContactPage() {
  const schema = loadContactSurvey();
  if (!schema) notFound();
  return <ContactPageClient schema={schema} />;
}
