# Data Consolidation Complications Report

Generated: 2026-01-04T08:23:54.933Z

## Scope

Only these content routes are analyzed:
```
blog, essays, fiction, news, newsletter, notes, ocs, papers, progymnasmata, reviews, verse
```

---

## Within-File Duplicates (Auto-Fixed)

The following duplicates were automatically removed (kept first occurrence):

### Categories Fixed

- **news/categories.json**: removed `runwayml`
- **notes/categories.json**: removed `mathematics`, `gaming`, `hack-the-box`, `try-hack-me`, `nursery-rhymes`

---

## Summary (Cross-File Issues)

| Metric | Count |
|--------|-------|
| Content routes analyzed | 11 |
| Unique category slugs | 102 |
| **Cross-file duplicate categories** | 16 |
| Unique tag slugs | 17 |
| **Cross-file duplicate tags** | 1 |
| Unique content slugs | 31 |
| **Cross-file duplicate content** | 0 |
| Defined tag slugs | 17 |
| Defined category slugs | 102 |
| Tags used but not defined | 79 |
| Categories used but not defined | 0 |

---

## 1. Cross-File Duplicate Category Slugs

These category slugs appear in multiple categories.json files:

### `on-myself`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | On Myself | Personal reflections, introspections, and observations about my thoughts, belief |
| notes/categories.json | On Myself | Personal reflections, introspections, and observations about my thoughts, belief |

### `philosophy`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Philosophy | Philosophical musings, ethical considerations, and explorations of fundamental q |
| essays/categories.json | Philosophy | Inquiries into existence, ethics, pain, beauty, and the art of living well and w |
| notes/categories.json | Philosophy | Philosophical musings, ethical considerations, and explorations of fundamental q |
| papers/categories.json | Philosophy | Inquiries into existence, ethics, pain, beauty, and the art of living well and w |

### `verse`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Verse | Poetry, haiku, and verse forms - explorations in rhythm, meter, and poetic expre |
| notes/categories.json | Verse | Poetry, haiku, and verse forms - explorations in rhythm, meter, and poetic expre |

### `culture`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Culture | Cultural observations, critiques, and analyses of society, media, and social phe |
| notes/categories.json | Culture | Cultural observations, critiques, and analyses of society, media, and social phe |

### `design`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Design | Design principles, aesthetic considerations, and thoughts on simplicity and visu |
| notes/categories.json | Design | Design principles, aesthetic considerations, and thoughts on simplicity and visu |

### `health`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Health | Health, fitness, and wellness observations - both physical and mental wellbeing  |
| notes/categories.json | Health | Health, fitness, and wellness observations - both physical and mental wellbeing  |

### `lifestyle`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Lifestyle | Daily life observations, routines, and reflections on simple pleasures and lifes |
| notes/categories.json | Lifestyle | Daily life observations, routines, and reflections on simple pleasures and lifes |

### `mathematics`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Mathematics | Mathematical concepts, beauty in mathematics, and explorations of mathematical t |
| notes/categories.json | Mathematics | Mathematical concepts, beauty in mathematics, and explorations of mathematical t |

### `libraries`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Libraries | An archive of other people's book collections, reading lists, and personal libra |
| notes/categories.json | Libraries | An archive of other people's book collections, reading lists, and personal libra |

### `film`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Film | analyses, and reflections on cinema as an art form |
| notes/categories.json | Film | long-form deep dives of the topics I've fallen into, linking to my public notes  |

### `psychology`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Psychology | Mental models, emotional mechanisms, and investigations into the human mind and  |
| papers/categories.json | Psychology | cognitive, emotional, behavioral, and social mechanisms of the human mind |

### `intelligence`

| File | Title | Preview |
|------|-------|--------|
| blog/categories.json | Intelligence | thoughts on intelligence, its nature, measurement, and implications for understa |
| papers/categories.json | Intelligence | research on cognitive abilities, potential, and the measurement of intelligence. |

### `pedagogy`

| File | Title | Preview |
|------|-------|--------|
| essays/categories.json | Pedagogy | Essays on the theory, trials, and transformative nature of teaching and learning |
| papers/categories.json | Pedagogy | Essays on the theory, trials, and transformative nature of teaching and learning |

### `letters`

| File | Title | Preview |
|------|-------|--------|
| essays/categories.json | Letters | Personal and philosophical letters written to the lost, the learning, and the lo |
| papers/categories.json | Letters | Personal and philosophical letters written to the lost, the learning, and the lo |

### `short-stories`

| File | Title | Preview |
|------|-------|--------|
| fiction/categories.json | Short Stories | Brief works of fiction exploring various themes and styles |
| notes/categories.json | Short Stories | A collection of short fictional works—spanning surreal dialogues, allegorical dr |

### `learning`

| File | Title | Preview |
|------|-------|--------|
| notes/categories.json | Learning | notes on learning methods, resources, and personal education |
| papers/categories.json | Learning | Analyses of modern reading habits, educational tools, and knowledge acquisition. |

---

## 2. Cross-File Duplicate Tag Slugs

These tag slugs appear in multiple tags.json files:

### `philosophy`

| File | Title | Preview |
|------|-------|--------|
| blog/tags.json | Philosophy | philosophical musings, thought experiments, and ethical considerations |
| papers/tags.json | Philosophy | Philosophical inquiry, ethical reasoning, and conceptual analysis. |

---

## 3. Cross-File Duplicate Content Slugs

These content slugs appear in multiple content type files:

*No cross-file duplicate content slugs found.*

---

## 4. Undefined Tags (Used in Content but Not in tags.json)

| Tag | Usage Count | Example Files |
|-----|-------------|---------------|
| education | 4 | essays/essays.json, essays/essays.json, essays/essays.json |
| ethics | 4 | essays/essays.json, essays/essays.json, papers/papers.json |
| learning | 3 | essays/essays.json, essays/essays.json, papers/papers.json |
| morality | 3 | essays/essays.json, essays/essays.json, essays/essays.json |
| trauma | 2 | essays/essays.json, essays/essays.json |
| psychology | 2 | essays/essays.json, papers/papers.json |
| fear | 2 | essays/essays.json, papers/papers.json |
| letters | 2 | essays/essays.json, essays/essays.json |
| memory | 2 | papers/papers.json, papers/papers.json |
| retention | 2 | papers/papers.json, papers/papers.json |
| learning-styles | 2 | papers/papers.json, papers/papers.json |
| intelligence | 2 | papers/papers.json, papers/papers.json |
| depression | 1 | essays/essays.json |
| solitude | 1 | essays/essays.json |
| endurance | 1 | essays/essays.json |
| self-cultivation | 1 | essays/essays.json |
| lifelong-learning | 1 | essays/essays.json |
| self-education | 1 | essays/essays.json |
| wisdom | 1 | essays/essays.json |
| pain | 1 | essays/essays.json |
| resilience | 1 | essays/essays.json |
| body | 1 | essays/essays.json |
| death | 1 | essays/essays.json |
| mortality | 1 | essays/essays.json |
| aesthetics | 1 | essays/essays.json |
| beauty | 1 | essays/essays.json |
| perception | 1 | essays/essays.json |
| mental-health | 1 | essays/essays.json |
| boyhood | 1 | essays/essays.json |
| emotional-development | 1 | essays/essays.json |
| self | 1 | essays/essays.json |
| solipsism | 1 | essays/essays.json |
| evil | 1 | essays/essays.json |
| existence | 1 | essays/essays.json |
| defense | 1 | essays/essays.json |
| imagination | 1 | papers/papers.json |
| lucid-dreaming | 1 | papers/papers.json |
| nightmares | 1 | papers/papers.json |
| tiredness | 1 | papers/papers.json |
| sleep-disorders | 1 | papers/papers.json |
| discipline-specific-learning | 1 | papers/papers.json |
| decay-curve | 1 | papers/papers.json |
| time-perception | 1 | papers/papers.json |
| sensory-processing | 1 | papers/papers.json |
| cognitive-science | 1 | papers/papers.json |
| illusions | 1 | papers/papers.json |
| collapse | 1 | papers/papers.json |
| sexuality | 1 | papers/papers.json |
| sociology | 1 | papers/papers.json |
| civilization | 1 | papers/papers.json |
| cycles | 1 | papers/papers.json |
| philosophy-of-history | 1 | papers/papers.json |
| moral-psychology | 1 | papers/papers.json |
| chronobiology | 1 | papers/papers.json |
| decision-fatigue | 1 | papers/papers.json |
| iq | 1 | papers/papers.json |
| pedagogy | 1 | papers/papers.json |
| cognitive-psychology | 1 | papers/papers.json |
| study-methods | 1 | papers/papers.json |
| discipline-specific | 1 | papers/papers.json |
| digital-reading | 1 | papers/papers.json |
| print-vs.-screen | 1 | papers/papers.json |
| information-processing | 1 | papers/papers.json |
| emotion | 1 | papers/papers.json |
| affective-neuroscience | 1 | papers/papers.json |
| valence | 1 | papers/papers.json |
| existentialism | 1 | papers/papers.json |
| well-being | 1 | papers/papers.json |
| quantification | 1 | papers/papers.json |
| ai-alignment | 1 | papers/papers.json |
| language-models | 1 | papers/papers.json |
| benchmarking | 1 | papers/papers.json |
| nootropics | 1 | papers/papers.json |
| self-experimentation | 1 | papers/papers.json |
| quantified-self | 1 | papers/papers.json |
| predictive-modeling | 1 | papers/papers.json |
| open-data | 1 | papers/papers.json |
| iq-alternatives | 1 | papers/papers.json |
| psychometrics | 1 | papers/papers.json |

---

## 5. Undefined Categories (Used in Content but Not in categories.json)

*All categories are properly defined.*

---

## Resolution Required

### For Cross-File Duplicate Categories
Choose one canonical definition per slug. Options:
1. Keep the most complete definition (longest preview, has importance)
2. Merge into a new universal categories table

### For Cross-File Duplicate Tags
Choose one canonical definition per slug.

### For Duplicate Content Slugs
**MUST be resolved before consolidation.**
Options: prefix with type (e.g., `essay-slug`), or rename one.

### For Undefined Tags/Categories
Create definitions in the universal tables, or correct typos in content files.
