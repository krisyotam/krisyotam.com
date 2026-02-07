# Claude CLI Script Proposals

Proposed scripts that leverage Claude Code CLI to accelerate krisyotam.com workflows.

---

## Content Creation Scripts

### `createPost.js`
Generate any content type (blog/essay/note/verse) with proper frontmatter, file placement, and slug. Takes abstract description, outputs complete MDX with metadata.

**Usage:**
```bash
node scripts/createPost.js --type essay --category philosophy "An exploration of epistemic humility"
```

### `createVerse.js`
Poetry-specific generator. Input: topic + form (haiku/sonnet/ode/elegy). Claude writes the poem AND formats it correctly for the verse system.

**Usage:**
```bash
node scripts/createVerse.js --form haiku "morning fog in the city"
```

### `createSequence.js`
Creates multi-part series. Generates all parts with proper `sequences` linking, ordering, and cross-references.

**Usage:**
```bash
node scripts/createSequence.js --parts 3 "A three-part series on the history of logic"
```

---

## Content Maintenance Scripts

### `tagSuggester.js`
Reads a post, suggests 3 optimal tags from your existing tag pool (reuse-focused). Checks for consistency with similar content.

**Usage:**
```bash
node scripts/tagSuggester.js src/app/(content)/essays/content/philosophy/some-essay.mdx
```

### `metadataAuditor.js`
Scans all MDX files, finds missing/inconsistent metadata. Reports: missing importance, bad status values, orphaned tags.

**Usage:**
```bash
node scripts/metadataAuditor.js          # Full scan
node scripts/metadataAuditor.js --fix    # Auto-fix where possible
```

### `importanceRater.js`
Reads a post and suggests an importance score (1-10) based on the "polymath reader" avatar criteria.

**Usage:**
```bash
node scripts/importanceRater.js src/app/(content)/blog/content/ideas/some-post.mdx
```

### `certaintyChecker.js`
Analyzes claims in a post, suggests appropriate certainty level (certain/highly likely/likely/possible/unlikely/remote/impossible).

**Usage:**
```bash
node scripts/certaintyChecker.js src/app/(content)/essays/content/science/hypothesis.mdx
```

---

## Content Enhancement Scripts

### `abstractGenerator.js`
Reads a finished essay/paper, generates a proper academic abstract/description for frontmatter.

**Usage:**
```bash
node scripts/abstractGenerator.js src/app/(content)/papers/content/math/proof.mdx
```

### `titleOptimizer.js`
Takes draft title, suggests alternatives that match your style (concise, intellectual, non-clickbait).

**Usage:**
```bash
node scripts/titleOptimizer.js "Why I Think This Thing Is Important And You Should Too"
```

### `linkSuggester.js`
Reads a post, suggests internal links to your other content based on topic overlap.

**Usage:**
```bash
node scripts/linkSuggester.js src/app/(content)/essays/content/philosophy/new-essay.mdx
```

### `coverImagePrompt.js`
Reads post content, generates a detailed image prompt for cover art (for AI image generation tools).

**Usage:**
```bash
node scripts/coverImagePrompt.js src/app/(content)/blog/content/art/piece.mdx
```

---

## Workflow Automation Scripts

### `draftToFinished.js`
Takes a rough draft, polishes prose, checks grammar, maintains voice. Interactive review mode available.

**Usage:**
```bash
node scripts/draftToFinished.js src/app/(content)/blog/content/ideas/draft.mdx
node scripts/draftToFinished.js --interactive src/app/(content)/blog/content/ideas/draft.mdx
```

### `changelogWriter.js`
Summarizes recent git commits into proper changelog entries for `git.js` integration.

**Usage:**
```bash
node scripts/changelogWriter.js           # Last 10 commits
node scripts/changelogWriter.js --since "2026-02-01"
```

### `contentSearch.js`
Natural language search across all content. Returns matching files with relevance.

**Usage:**
```bash
node scripts/contentSearch.js "posts about epistemology and certainty"
node scripts/contentSearch.js "my haikus about nature"
```

---

## Priority Recommendations

Start with these 5 (highest value):

1. **`createPost.js`** - Universal content creator (biggest time saver)
2. **`tagSuggester.js`** - Keeps taxonomy clean and consistent
3. **`abstractGenerator.js`** - Automates tedious description writing
4. **`metadataAuditor.js`** - Finds problems before they compound
5. **`createVerse.js`** - Poetry is structured enough for great AI assistance

---

## Implementation Notes

All scripts should:
- Use Claude Code CLI (`claude -p "prompt"`)
- Accept stdin or file path arguments
- Output to correct directories based on content type
- Follow existing frontmatter conventions
- Set status to `draft` by default for review
- Include `--dry-run` option where applicable

Reference existing implementation: `scripts/createSurvey.js`
