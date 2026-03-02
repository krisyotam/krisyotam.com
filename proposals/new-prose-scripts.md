# Prose Scripts Proposal

All scripts use Claude Code headless (`claude -p`) with Opus 4.6.
Same box-header convention as `paragraphizer.py`. Located in `public/scripts/prose/`.

---

## 1. transitionAudit.py

**Purpose:** Read an MDX file and identify weak, missing, or abrupt transitions between paragraphs. Suggest improvements inline.

**Modes:**
- `--suggest` (default): Print each transition point with a suggested connector/rewrite
- `--annotate`: Output the full file with `<!-- TRANSITION: ... -->` comments inserted at each seam
- `--rewrite`: Output the full file with transitions applied (still requires manual review)

**Usage:**
```bash
python transitionAudit.py ~/content/essays/stoicism-daily-practice.mdx
python transitionAudit.py --annotate ~/content/blog/some-post.mdx
```

**What it flags:**
- Topic jumps with no bridging sentence
- Overused transitions ("However," "Furthermore," "Additionally" chains)
- Tonal shifts between paragraphs (formal paragraph followed by casual, etc.)
- Missing causal links where argument flow demands one

---

## 2. proseLinter.py

**Purpose:** Multi-level prose quality audit. Operates on a severity spectrum.

**Modes (severity tiers):**
- `--proof` : Grammar, spelling, punctuation, subject-verb agreement only. The copyeditor pass.
- `--refine` : Everything in proof + word choice upgrades, filler removal, passive voice flags, sentence rhythm analysis.
- `--forge` : Everything in refine + voice modulation against Kris's voice profile, literary device suggestions, structural critique, epistemic honesty checks.

**Voice Profile (built into the prompt):**

The linter carries a voice profile that protects Kris's writing identity:

| Preserve | Flag | Encourage |
|----------|------|-----------|
| Intellectual rigor without pretension | Content marketing cliches | Footnotes and marginalia |
| Varied sentence rhythm (short for impact, long for argument) | Over-simplification of complex concepts | Paradox and productive tension |
| Precision over brevity | Motivational platitudes | Original metaphor |
| Cross-domain vocabulary | Performative certainty ("Obviously...") | Epistemic honesty markers |
| Em-dashes and subordinate clauses | Repetitive phrasing patterns | Structural signposting |
| Reflective, questioning tone | Filler words that dilute precision | Definitions via em-dash or parenthetical |

**Usage:**
```bash
python proseLinter.py --proof ~/content/essays/some-essay.mdx
python proseLinter.py --refine ~/content/blog/some-post.mdx
python proseLinter.py --forge ~/content/essays/major-essay.mdx
```

**Output format:** Numbered findings with line references, severity, and suggested fix. Does NOT auto-modify the file.

---

## 3. dialogueCleaner.py

**Purpose:** Transform messy fast-drafted dialogue into clean, consistently formatted dialogue. Handles interviews, fictional exchanges, Socratic dialogues, and block-quote conversations.

**Formats (user-selectable):**
- `--format prose` : Standard prose fiction style (said-tags, new paragraph per speaker)
- `--format script` : Screenplay/stage direction style (CHARACTER: line)
- `--format socratic` : Named interlocutors in bold, indented exchanges (for philosophical dialogues)
- `--format interview` : Q/A format with bold speaker labels

**What it fixes:**
- Inconsistent speaker attribution
- Missing line breaks between speakers
- Garbled quotation marks (smart quotes, mismatched pairs, mixed styles)
- Run-on exchanges where multiple speakers share a paragraph
- Stage direction vs. dialogue separation

**Usage:**
```bash
python dialogueCleaner.py --format socratic ~/content/essays/dialogue-on-beauty.mdx
python dialogueCleaner.py --format interview < rough-transcript.txt
```

---

## 4. densityMapper.py

**Purpose:** Analyze prose density across a document and flag sections that are too dense to parse or too thin to hold weight. Produces a structural X-ray of the piece.

**Output:**
- Per-paragraph metrics: word count, average sentence length, vocabulary complexity score, clause depth
- Flagged zones: "wall of text" (>200 words, no structural relief), "thin" (<30 words doing heavy lifting), "rhythm break" (sudden density shift)
- Overall document rhythm visualization (ASCII sparkline of paragraph lengths)

**Usage:**
```bash
python densityMapper.py ~/content/essays/on-intelligence.mdx
```

**Example output:**
```
 Density Map: on-intelligence.mdx
 ================================
 P1  ████████████████░░░░  182w  avg:28w/sent  [OK]
 P2  ██████░░░░░░░░░░░░░░   71w  avg:14w/sent  [THIN - carrying too much argument for length]
 P3  ████████████████████  241w  avg:34w/sent  [WALL - consider splitting]
 P4  ████████████░░░░░░░░  134w  avg:22w/sent  [OK]
 ...
 Rhythm: ▅▂▇▄▃▆▁▅▄  (varied - good)
```

---

## 5. openingGrader.py

**Purpose:** Evaluate the first 1-3 paragraphs of a piece against standards for strong openings. Grades the hook, stakes establishment, voice clarity, and promise to the reader.

**What it evaluates:**
- **Hook strength:** Does the first sentence compel continued reading?
- **Stakes clarity:** Does the reader know within 3 paragraphs why this matters?
- **Voice establishment:** Is the authorial voice immediately present?
- **Promise:** Does the opening implicitly promise a payoff the piece delivers?
- **Originality:** Does it avoid the 5 most overused opening patterns (question opener, dictionary definition, "Since the dawn of time...", anecdote-then-pivot, statistic shock)

**Usage:**
```bash
python openingGrader.py ~/content/essays/some-essay.mdx
```

**Output:** Letter grade (A-F) per dimension with 1-2 sentence justification, plus a rewrite suggestion for the weakest dimension.

---

## 6. clicheHunter.py

**Purpose:** Find and flag cliches, dead metaphors, and worn phrases. Suggests original alternatives grounded in Kris's vocabulary and domain interests.

**What it catches:**
- Dead metaphors ("tip of the iceberg," "at the end of the day")
- Academic filler ("it is worth noting that," "it should be mentioned")
- Hedge stacking ("it could potentially perhaps be argued")
- Inflated diction (using five words where one precise word exists)
- Zombie nouns (nominalizations that kill verbs: "the implementation of" vs "implementing")

**Usage:**
```bash
python clicheHunter.py ~/content/blog/some-post.mdx
```

**Output:** Each cliche with line number, the offending phrase highlighted, and a suggested replacement that fits Kris's voice.

---

## 7. closingAudit.py

**Purpose:** Evaluate the final 1-3 paragraphs. The inverse of openingGrader. Checks whether the piece lands.

**What it evaluates:**
- **Resolution:** Does the ending address what the opening promised?
- **Resonance:** Does the final sentence have staying power?
- **Avoiding traps:** Flags "In conclusion..." summaries, new-argument introductions in the last paragraph, abrupt stops, and hollow calls-to-action
- **Circularity check:** Does the ending echo the opening in a meaningful way (good) or just repeat it (lazy)?

**Usage:**
```bash
python closingAudit.py ~/content/essays/some-essay.mdx
```

---

## 8. readAloud.py

**Purpose:** Flag sentences that are hard to read aloud — a proxy for awkward phrasing, excessive clause nesting, and rhythm problems. Based on the principle that good prose should survive being spoken.

**What it catches:**
- Sentences requiring more than one breath (>40 words with no natural pause)
- Consonant clusters that trip the tongue
- Ambiguous pronoun references
- Sentences where the subject and verb are separated by >15 words
- Repeated word sounds in close proximity (unintentional internal rhyme or alliteration)

**Usage:**
```bash
python readAloud.py ~/content/essays/some-essay.mdx
```

---

## Priority Order

| Priority | Script | Reason |
|----------|--------|--------|
| 1 | proseLinter.py | Most broadly useful, daily driver |
| 2 | transitionAudit.py | Transitions are the hardest to self-edit |
| 3 | clicheHunter.py | Small, focused, immediately valuable |
| 4 | openingGrader.py | Openings determine whether anyone reads further |
| 5 | densityMapper.py | Structural insight, unique capability |
| 6 | closingAudit.py | Pairs with openingGrader |
| 7 | dialogueCleaner.py | Needed but less frequent use case |
| 8 | readAloud.py | Polish-level, for final drafts |

---

## Existing Scripts to Migrate

The three remaining Gwern scripts still use OpenAI and should be migrated to Claude Code headless in the same rewrite pass:

| Script | Current State | Migration Notes |
|--------|--------------|-----------------|
| date-guesser.py | OpenAI API | Simple prompt, straightforward port |
| tagguesser.py | OpenAI API | Used in clustering workflows, test carefully |
| title-cleaner.py | OpenAI API | Short prompt, easy port |

---
---

# Verse Scripts

All verse scripts follow the same convention: Claude Code headless, one job per script, output to terminal for manual review.

Kris's verse catalog spans 16 forms across 88 poems. Dominant form is haiku (61), with formal constrained verse (sonnet, villanelle, ode, antiphon) and free forms (free-verse, concrete-poem, slam-poetry). The scripts below serve that range.

---

## 9. formClassifier.py

**Purpose:** Given a poem (from file or stdin), identify which poetic form it is. The prompt carries strict definitions for every form Kris uses.

**Form definitions baked into the prompt:**

| Form | Constraints |
|------|------------|
| haiku | 3 lines, 5-7-5 syllables, nature/season imagery, present tense, no title required |
| lune | 3 lines, 3-5-3 word count (American lune) OR 5-7-5 syllable count |
| limerick | 5 lines, AABBA rhyme, anapestic meter, lines 1/2/5 trimeter, lines 3/4 dimeter |
| sonnet | 14 lines, iambic pentameter. Subtypes: Shakespearean (ABAB CDCD EFEF GG), Petrarchan (ABBAABBA + CDECDE/CDCDCD), Spenserian (ABAB BCBC CDCD EE) |
| villanelle | 19 lines, 5 tercets + 1 quatrain, ABA rhyme, two repeating refrains (lines 1 and 3) |
| ode | Variable stanza, elevated subject, praise/address form, apostrophe ("O...") common |
| antiphon | Liturgical call-and-response, anaphoric repetition, no fixed meter |
| elegy | Mourning/lament, meditative tone, traditionally in couplets or quatrains |
| free-verse | No fixed meter or rhyme, lineation carries rhythm |
| concrete-poem | Visual layout is semantic, spatial arrangement carries meaning |
| cinquain | 5 lines, 2-4-6-8-2 syllable count (Adelaide Crapsey form) |
| quatrain-ballad-meter | 4-line stanzas, alternating 4-3 stress (iambic tetrameter/trimeter), ABAB or ABCB |
| slam-poetry | Performance-oriented, strong rhythm, rhetorical devices, no fixed form |
| list-poem | Catalog/enumeration structure, anaphora common |
| lyric | Short, musical, first-person, emotional expression |
| light-verse | Humorous/witty, often formal meter with comic content |

**Usage:**
```bash
python formClassifier.py ~/content/verse/some-poem.mdx
python formClassifier.py < poem.txt
```

**Output:**
```
Form:       sonnet (Shakespearean)
Confidence: high
Evidence:   14 lines, ABAB CDCD EFEF GG rhyme scheme, predominantly iambic pentameter
Notes:      Line 8 breaks meter (trochaic substitution on "even")
```

---

## 10. meterDetector.py

**Purpose:** Identify the dominant meter of a poem. Scans each line and reports the prevailing metrical pattern.

**What it detects:**
- Iambic (da-DUM): pentameter, tetrameter, trimeter, dimeter, hexameter
- Trochaic (DUM-da)
- Anapestic (da-da-DUM)
- Dactylic (DUM-da-da)
- Spondaic (DUM-DUM)
- Mixed/free (no dominant pattern)
- Sprung rhythm (Hopkins-style stress-based)

**Usage:**
```bash
python meterDetector.py ~/content/verse/shall-i-compare-thee-to-a-winters-night.mdx
```

**Output:**
```
Dominant meter: iambic pentameter
Lines scanned: 14

L1  da-DUM da-DUM da-DUM da-DUM da-DUM    iambic pentameter  [OK]
L2  da-DUM da-DUM da-DUM da-DUM da-DUM    iambic pentameter  [OK]
L3  da-DUM da-DUM da-DUM DUM-da da-DUM    iambic pentameter  [trochaic sub. foot 4]
...
Regularity: 85% (12/14 lines clean)
```

---

## 11. iambicPentameter.py

**Purpose:** Dedicated iambic pentameter checker. Because it's the most common English meter and the one most worth getting exactly right. Checks by line or full poem.

**Modes:**
- `--line "Shall I compare thee to a winter's night?"` : Check a single line
- `--file poem.mdx` : Check every line in a file
- `--strict` : Flag ALL deviations (pyrrhic, spondaic, trochaic substitutions)
- `--lenient` (default) : Allow standard substitutions (trochaic inversion at line start, feminine endings, spondaic substitution)

**Usage:**
```bash
python iambicPentameter.py --line "Shall I compare thee to a winter's night?"
python iambicPentameter.py --file ~/content/verse/shall-i-compare-thee-to-a-winters-night.mdx
python iambicPentameter.py --strict --file ~/content/verse/shall-i-compare-thee-to-a-winters-night.mdx
```

**Output (line mode):**
```
  Shall I | com-PARE | thee TO | a WIN | ter's NIGHT
  da DUM  | da DUM   | da DUM  | da DUM | da    DUM
  ✓ iambic pentameter (5 feet, clean)
```

**Output (file mode with errors):**
```
L1  ✓  Shall I compare thee to a winter's night?
L2  ✓  Thou art more cruel and keen in thy sting.
L3  ⚠  A bitter breeze doth seize November light.
        foot 3: spondaic (SEIZE NO-) — allowable substitution
L8  ✗  and yet even still ice be frozen through.
        11 syllables detected (expected 10), possible hypermetrical line
        foot 3: pyrrhic (e-ven) weakens the line

Summary: 11/14 clean, 2 substitutions, 1 error
```

---

## 12. rhymeChecker.py

**Purpose:** Verify rhyme scheme against a declared or detected pattern. Catches slant rhymes, near-misses, and broken schemes.

**Usage:**
```bash
python rhymeChecker.py ~/content/verse/shall-i-compare-thee-to-a-winters-night.mdx
python rhymeChecker.py --scheme ABABCDCDEFEFGG ~/content/verse/some-sonnet.mdx
python rhymeChecker.py --scheme ABA ~/content/verse/laborius-night-sky.mdx
```

**Output:**
```
Detected scheme: ABAB CDCD EFEF GG (Shakespearean sonnet)

L1  night   A
L2  sting   B
L3  light   A  ✓ (night/light — perfect rhyme)
L4  cling   B  ✓ (sting/cling — perfect rhyme)
...
L13 thee    G
L14 she     G  ✓ (thee/she — perfect rhyme)

Scheme integrity: 100% (14/14 end-words match declared pattern)
```

**What it catches:**
- Broken rhymes (expected rhyme pair that doesn't rhyme)
- Slant rhymes (flags but doesn't reject — "love/move" is valid in many traditions)
- Eye rhymes ("cough/through" — look like rhymes but aren't)
- Missing refrains in villanelles/pantoums
- Identical rhyme (same word used twice — usually a defect)

---

## 13. syllableCount.py

**Purpose:** Count syllables per line. The atomic unit that every other verse tool depends on. Haiku validation, meter checking, and form classification all need accurate syllable counts.

**Usage:**
```bash
python syllableCount.py --line "Shall I compare thee to a winter's night?"
python syllableCount.py --file ~/content/verse/the-ambulance.mdx
```

**Output (line mode):**
```
"Shall I compare thee to a winter's night?"
Syllables: 10
Breakdown: Shall(1) I(1) com-pare(2) thee(1) to(1) a(1) win-ter's(2) night(1)
```

**Output (file mode, haiku):**
```
L1  "a ambulance"           4 syllables  [expected 5 — SHORT]
L2  "its siren blaring"     5 syllables  [expected 7 — SHORT]
L3  "a spirit wailing"      5 syllables  [expected 5 — OK]

Form validation (haiku 5-7-5): FAIL (4-5-5)
```

---

## 14. stanzaMapper.py

**Purpose:** Structural analysis of a poem's stanza architecture. Reports stanza lengths, symmetry, and whether the structure matches the declared form.

**Usage:**
```bash
python stanzaMapper.py ~/content/verse/laborius-night-sky.mdx
```

**Output:**
```
Stanzas: 6
Structure: 3-3-3-3-3-3 (regular tercets)
Form match: villanelle expects 5 tercets + 1 quatrain (ABA ABA ABA ABA ABA ABAA)
            Found: 6 tercets, 0 quatrains
            ⚠ Missing closing quatrain — villanelle requires final 4-line stanza

Refrain tracking:
  R1 "If only you knew you weren't alone" — appears L3, L9, L15 ✓
  R2 "Confined to a precinct of darkness" — appears L6, L12, L18 ✓
  ⚠ Refrains should appear in final quatrain (L17, L19) — missing
```

---

## 15. enjambmentDetector.py

**Purpose:** Identify and classify line breaks as end-stopped or enjambed. Useful for understanding a poem's pacing and for catching accidental enjambment in formal verse.

**Usage:**
```bash
python enjambmentDetector.py ~/content/verse/forsaken.mdx
```

**Output:**
```
L1  "I have forsaken my passion,"           END-STOPPED (comma)
L2  "and my passion has forsaken me."       END-STOPPED (period)
L3  ""                                       [stanza break]
L4  "I grieve,"                              ENJAMBED → L5
L5  "but my tears fail to fall."             END-STOPPED (period)
...

Summary: 8 end-stopped, 4 enjambed, 4 stanza breaks
Pacing: predominantly end-stopped (declarative, heavy cadence)
```

---

## 16. volta.py

**Purpose:** Detect the volta (the turn/shift) in a poem. In sonnets the volta is structural (line 9 in Petrarchan, line 13 in Shakespearean). In other forms it's a tonal/argumentative pivot. Reports where it occurs and whether it's in the expected position.

**Usage:**
```bash
python volta.py ~/content/verse/shall-i-compare-thee-to-a-winters-night.mdx
```

**Output:**
```
Form: sonnet (Shakespearean)
Expected volta: L13 (before closing couplet)

Detected shift at L13: "Not flame nor time dare try to reach to thee."
  Preceding tone: melancholic, accusatory (frozen, frost, scorn, hail)
  Turn: defiance/admiration ("Sublime!")
  ✓ Volta in expected position

Secondary shift at L5: "A soul beguiled by snow in chilling clasp."
  Moves from address (thou art...) to interior reflection (a soul...)
  This functions as the octave-sestet turn — Petrarchan echo within Shakespearean frame
```

---

## Verse Scripts Priority

| Priority | Script | Reason |
|----------|--------|--------|
| 1 | iambicPentameter.py | Most immediately useful, testable, clear pass/fail |
| 2 | syllableCount.py | Foundation for haiku validation (61 poems) and all meter work |
| 3 | formClassifier.py | Automates what `verse_type` field does manually |
| 4 | rhymeChecker.py | Objective verification, catches subtle breaks |
| 5 | meterDetector.py | Broader than iambic, covers all formal verse |
| 6 | stanzaMapper.py | Structural validation for villanelle, sonnet, etc. |
| 7 | volta.py | Sophisticated analysis, more interpretive |
| 8 | enjambmentDetector.py | Polish-level, for understanding pacing |
