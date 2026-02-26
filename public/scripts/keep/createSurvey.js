#!/usr/bin/env node

/**
 * createSurvey.js
 *
 * Generates survey files for krisyotam.com using Claude Code CLI.
 * Takes an abstract description of what questions you want and generates
 * the proper survey format with appropriate question types.
 *
 * Usage:
 *   node scripts/createSurvey.js "I want to survey readers about their favorite topics and reading habits"
 *   node scripts/createSurvey.js --id reader-survey "Survey about reading preferences"
 *   echo "Survey about X" | node scripts/createSurvey.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Paths
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SURVEYS_DIR = path.join(PROJECT_ROOT, 'src/app/(misc)/surveys/content');

// Survey system documentation for Claude
const SURVEY_DOCS = `
# Survey File Format Documentation

You are generating a survey file for krisyotam.com. The file uses a TOML-like syntax in markdown.

## File Structure

\`\`\`toml
# ==============================================================================
# SURVEY:    [Title]
# OWNER:     Kris Yotam
# UPDATED:   [Date YYYY-MM-DD]
# ==============================================================================

[survey]
id = "slug-name"              # Required: URL slug (lowercase, hyphens)
title = "Survey Title"        # Required: Display title
subtitle = "Optional subtitle"
description = "What this survey is about"
anonymous = true              # Default: true
estimated_time = "5m"         # Estimated completion time
status = "active"             # Required: active|draft|closed
start_date = "YYYY-MM-DD"     # Optional
end_date = "YYYY-MM-DD"       # Optional
confidence = "likely"         # certain|highly likely|likely|possible|unlikely|remote|impossible
importance = 7                # 1-10 scale
tags = ["tag1", "tag2"]
category = "Category Name"

[[section]]                   # Optional: group questions
id = "section-id"
title = "Section Title"
description = "Optional description"

[[question]]
id = "question-id"
type = "text"
label = "Question text?"
section = "section-id"        # Optional: assign to section
required = true
placeholder = "Hint text"
description = "Help text"
condition = "other_field == 'value'"  # Optional: conditional logic
\`\`\`

## Question Types

| Type | Properties | Use Case |
|------|-----------|----------|
| text | min, max, placeholder | Single-line text input |
| textarea | rows, placeholder | Multi-line text input |
| email | placeholder | Email with validation |
| url | placeholder | URL with validation |
| number | min, max, step | Numeric input |
| scale | min, max, labels | Likert scale (e.g., 1-5, 1-10) |
| rating | max, icon | Star rating |
| radio | options | Single choice (all visible) |
| select | options | Dropdown single choice |
| checkbox | options, min_select, max_select | Multiple choice |
| boolean | true_label, false_label | Yes/No toggle |
| date | min, max | Date picker |
| time | (none) | Time picker |
| file | accept, max_size | File upload |
| image | accept, max_size | Image upload |
| ranking | options | Drag to rank items |
| matrix | rows, columns | Grid selection |

## Example Question Blocks

### Scale with Labels
\`\`\`toml
[[question]]
id = "satisfaction"
type = "scale"
label = "How satisfied are you with our service?"
min = 1
max = 5
labels = { 1 = "Very Unsatisfied", 3 = "Neutral", 5 = "Very Satisfied" }
required = true
\`\`\`

### Radio Options
\`\`\`toml
[[question]]
id = "frequency"
type = "radio"
label = "How often do you visit?"
options = [
  "Daily",
  "Weekly",
  "Monthly",
  "Rarely"
]
required = true
\`\`\`

### Checkbox with Constraints
\`\`\`toml
[[question]]
id = "interests"
type = "checkbox"
label = "Select your interests (choose up to 3)"
options = ["Technology", "Science", "Art", "Music", "Sports"]
min_select = 1
max_select = 3
required = true
\`\`\`

### Matrix
\`\`\`toml
[[question]]
id = "feature_satisfaction"
type = "matrix"
label = "Rate each feature"
rows = ["Speed", "Design", "Usability", "Support"]
columns = ["Poor", "Fair", "Good", "Excellent"]
required = true
\`\`\`

### Conditional Question
\`\`\`toml
[[question]]
id = "other_specify"
type = "text"
label = "Please specify"
condition = "category == 'Other'"
required = false
\`\`\`

## Best Practices

1. Use clear, concise question labels
2. Group related questions into sections
3. Use appropriate question types (don't use text when radio makes sense)
4. Set sensible required fields (not everything needs to be required)
5. Use scale for rating/satisfaction, radio for categorical choices
6. Add placeholders for text inputs to guide users
7. Use conditional logic to hide irrelevant questions
8. Keep surveys focused - aim for 5-15 questions
9. Estimate completion time accurately
10. Use description field to clarify complex questions

## Output Requirements

1. Generate ONLY the survey file content (no explanation)
2. Use proper TOML-like syntax exactly as shown
3. Include the header comment block with title, owner, date
4. Set status to "draft" so it can be reviewed before publishing
5. Generate a sensible slug-based ID from the survey topic
6. Choose question types that best match the intent
7. Group questions into logical sections when there are 5+ questions
`;

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    .replace(/-+$/, '');
}

async function getPromptFromStdin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  return new Promise((resolve) => {
    let input = '';
    rl.on('line', (line) => {
      input += line + '\n';
    });
    rl.on('close', () => {
      resolve(input.trim());
    });
  });
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  let customId = null;
  let prompt = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      customId = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node scripts/createSurvey.js [options] "prompt"

Options:
  --id <slug>    Custom survey ID/slug
  --help, -h     Show this help

Examples:
  node scripts/createSurvey.js "Survey about reading habits"
  node scripts/createSurvey.js --id reader-survey "Questions about reader preferences"
  echo "Survey about X" | node scripts/createSurvey.js
      `);
      process.exit(0);
    } else {
      prompt += args[i] + ' ';
    }
  }

  prompt = prompt.trim();

  // If no prompt from args, try stdin
  if (!prompt && !process.stdin.isTTY) {
    prompt = await getPromptFromStdin();
  }

  if (!prompt) {
    console.error('Error: No prompt provided');
    console.error('Usage: node scripts/createSurvey.js "describe your survey"');
    process.exit(1);
  }

  console.log('Generating survey...');
  console.log(`Prompt: "${prompt}"`);

  // Generate ID from prompt if not provided
  const surveyId = customId || generateSlug(prompt);
  const filename = `${surveyId}.survey.md`;
  const filepath = path.join(SURVEYS_DIR, filename);

  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.error(`Error: Survey file already exists: ${filepath}`);
    console.error('Use --id to specify a different slug');
    process.exit(1);
  }

  // Build the Claude prompt
  const claudePrompt = `${SURVEY_DOCS}

---

Generate a survey file based on this request:

"${prompt}"

Survey ID to use: "${surveyId}"
Today's date: ${new Date().toISOString().split('T')[0]}

Output ONLY the survey file content, nothing else. No markdown code fences, just the raw content.`;

  try {
    // Call Claude Code CLI
    const result = execSync(`claude -p "${claudePrompt.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Clean up output (remove any markdown fences if present)
    let content = result.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
    }

    // Write the file
    fs.writeFileSync(filepath, content);

    console.log(`\nSurvey created successfully!`);
    console.log(`File: ${filepath}`);
    console.log(`URL:  /surveys/${surveyId}`);
    console.log(`\nNote: Survey is set to "draft" status. Edit the file and change to "active" when ready.`);

  } catch (error) {
    console.error('Error generating survey:', error.message);
    if (error.stderr) {
      console.error(error.stderr.toString());
    }
    process.exit(1);
  }
}

main().catch(console.error);
