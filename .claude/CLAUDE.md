#################################################################################
#                                                                               #
#   ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗   ███╗   ███╗██████╗       #
#  ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝   ████╗ ████║██╔══██╗      #
#  ██║     ██║     ███████║██║   ██║██║  ██║█████╗     ██╔████╔██║██║  ██║      #
#  ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝     ██║╚██╔╝██║██║  ██║      #
#  ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗   ██║ ╚═╝ ██║██████╔╝      #
#   ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝     ╚═╝╚═════╝       #
#                                                                               #
#  File      : CLAUDE.md                                                        #
#  Project   : krisyotam.com                                                    #
#  Author    : Kris Yotam                                                       #
#  Date      : 2026-02-04                                                       #
#  Purpose   : Claude guidance + project-specific conventions for krisyotam.com #
#                                                                               #
#################################################################################

# Taxonomy: Categories, Tags
  [ Categories ]
  Categories are Top-level tags, stable, general, and intentionally limited. 
  They function as primary entry points for navigation and retrieval.
    - Use as few as possible
      - Categories should be rare and durable. Adding a new one shoudl feel expensive.
    - Categories must not overlap
      - Ex. "philosophy" & "ethics" cannot both be categories, since philosophy is more general "ethics" is demoted to a tag. 
    - Categories are plural by convention
      - Ex. books, films, ideas
      - Special Case: a category that is obviouslly referred to in the singular i.e. software, hardware
    - Categories are lower-case
      - In the database categories are lowercase, the site can manipulate the data when a change in format is needed aesthetically. "Avant-Garde" is to be submitted as "avant-garde" and "Philosophy" as "philsophy" 
    - Categories are single words
      - i.e. most field names are singular, and in the case they are plural like "Marine Biology" it is a subset of the category "Biology"
      - Special Case: some field names at top level require two words i.e. "Computer Science" which is a top level field and thus a category.
    - Keep Categories on a general level.
      - i.e. It is preferred to have "Sports" over "Soccer" or "Weightlifting" as a Category. The other's as less general and tags. 
    - Omit Categories that are obvious
      - If it has a top level route in my site i.e. (papers, essays, blog, til, notes) it is obvious. Also things such as "Post" or "2026" ect. are to obvious and communicated via other formats. 
    - Keep one true language.
      - i.e. all tags are in english, "Philosophy" is taken over "Filosofia" in all cases
      - Special Case: the category is a field like "fiqh", "tafsir", ect. with no clean english alternative at all or well known. Other examples include: Otaku, Leitmotif, Ennui, "Avant-Garde"
    - Explain Categories
      - i.e. the description of a category should be to the point, specific. The following are key pairs in the fomrat [Category] [Description]
        - "software" "Programs, tools, and systems used to perform computational tasks or manage inforamtion"
        - "hardware" "Physical computing equipment, components, and peripherals."
        - "philosophy" "Notes and writings on metaphysics, epistemology, ethics, logic, and related fields"
        - "security" "Topics related to privacy, cryptography, threat models, and defensive computing practices"
        - "history" "Analyis and documentation of past events, periods, and historical narratives"
      - Categories should have Metadata
        - Status: includes one of the following {Abandoned, Notes, Draft, In Progress, Finished}, Tag pages are always "In Progress"
        - Confidence: includes {certain, highley likely, likely, possible, unlikely, highly unlikely, remote, impossible} Categories where the information is very verifiable and highly professionally sourced skews towards "certain" where a tag like "Conspiracies" would skew toward unlikely or even "impossible" on the major side. 
        - Importance: rank the content from 0-10 with it's potential impact on {The Reader, The intended audience, the world at large} For help with importance rankings use "Reader Avatar" section below for proper profiling. 
  [ Tags ]
  Tags exist under categories, one level deep. They refine, not replace categories.
    - Tags should be in relation to top level categories
      - i.e. where "sports" is a category sports (soccer, golf, ping-pong) is the relationship between 3 tgags and a category
    - Use few new tags as possible per item. 
      - i.e. the value of a tag increases the more it is used so rather than "jogging, sprinting, distance" prefer "running" which can class under "sports" as a category but also holds anything related to topics: distance running, sprinting, marathons, ect. 
      - Tags should remain stable
        - i.e. "soccer" is to be preferred to "world-cup-2022". for things that need classification this deep they have their own internal system for there route for ex. /reviews
      - Tags should be specific
        - "Marine Biology" is preferred to "Biology" as biology is to general and therefor considered a category
      - 3 Tags per piece of content
        - 3 is a minimum for the amount of tags I want used for a piece of content. Try to reuse as many that make sense as possible and be scarce with creation of new tags only if needed. 
        - Special Case: if a post is trule only explained by one or two tags that is fine. if a post needs more than 3 that is fine. 
    - Apply from [Categories] the following: "Are Lowercase", "One True Language", "Metadata"

# Applying Categories / Tags 
    
# Reader Avatar 
{
  "avatar_id": "polymath_reader_v1",
  "label": "The Serious Generalist",
  "core_identity": {
    "orientation": ["intellectually curious", "polymathic", "autodidactic", "analytical", "aesthetically literate"],
    "self_concept": ["sees learning as lifelong", "rejects shallow consensus", "values synthesis over specialization", "derives identity from taste and discernment"]
  },
  "domains_of_interest": {
    "primary": ["philosophy", "mathematics", "literary fiction", "film theory", "fine arts", "history", "political economy"],
    "secondary": ["theology", "systems theory", "technology criticism", "media studies", "ethics", "aesthetics"]
  },
  "intellectual_style": {
    "thinking_mode": ["first-principles reasoning", "comparative analysis", "historical contextualization", "cross-domain synthesis"],
    "preferred_signal": ["primary sources", "long-form argumentation", "formal structure", "conceptual rigor"],
    "disliked_signal": ["content marketing tone", "motivational abstraction", "simplified explainers", "performative certainty"]
  },
  "aesthetic_sensibility": {
    "values": ["restraint", "precision", "intentionality", "negative space"],
    "attracted_to": ["monochrome design", "dense but navigable text", "footnotes and marginalia", "archival presentation"]
  },
  "media_relationship": {
    "consumption_pattern": ["slow reading", "re-reading", "annotation-heavy", "offline or semi-offline workflows"],
    "output_modes": ["essays", "criticism", "research notes", "private archives"]
  },
  "psychological_profile": {
    "motivations": ["truth-seeking", "taste formation", "intellectual self-sovereignty", "coherence of worldview"],
    "frictions": ["distrust of mass culture", "fatigue with algorithmic feeds", "impatience with superficial discourse"]
  },
  "social_positioning": {
    "roles": ["critic", "analyst", "writer", "researcher", "archivist"],
    "community_preference": ["small, high-signal audiences", "asynchronous discussion", "written over spoken debate"]
  },
  "expectations_from_author": {
    "minimum": ["intellectual honesty", "clear epistemic boundaries", "non-patronizing tone"],
    "ideal": ["original synthesis", "willingness to be unfinished", "documented thinking over conclusions"]
  },
  "implicit_assumptions": ["intelligence is cultivated, not innate", "taste is a form of ethics", "clarity is a moral obligation", "archives outlast opinions"]
}







# Git Commits

All commits for this repository MUST be made using the git.js script:

```bash
# Interactive mode
node public/scripts/keep/git.js

# Headless mode (for automation)
node public/scripts/keep/git.js --headless --content "content entry" --kind daily
node public/scripts/keep/git.js --headless --infra "infrastructure entry" --kind daily
node public/scripts/keep/git.js --headless --content "content" --infra "infra" --kind reflection
node public/scripts/keep/git.js --headless --message "regular commit message"
```

Options:
- `--headless` - Run without prompts
- `--content "text"` - Content changelog entry (essays, blog posts, etc.)
- `--infra "text"` - Infrastructure changelog entry (code changes, bug fixes, etc.)
- `--kind TYPE` - Entry type: daily, reflection, milestone (default: daily)
- `--message "text"` - Regular commit message (skips changelog)
- `--no-push` - Skip pushing to remote

The script automatically updates the changelog database (public/data/system.db) and formats commit messages.

Do NOT use raw git commands for commits. If git.js is missing functionality, update it first then use it.


# Vercel Deployments & Builds

IMPORTANT: Do NOT run `npm run build` locally - it freezes the system. Use Vercel CLI for all build testing.

## Project Info
- Project: krisyotam.com (offlinedevs/krisyotam.com)
- Production is self-hosted via Dokploy, Vercel is used for preview builds and testing only

## Build Testing
```bash
# Preview deployment (creates a unique URL for testing)
vercel

# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>
```

## Environment Variables
```bash
# List all env vars
vercel env list

# Add a new env var (must add to each environment separately)
echo "value" | vercel env add VAR_NAME production
echo "value" | vercel env add VAR_NAME preview
echo "value" | vercel env add VAR_NAME development

# Remove an env var
vercel env rm VAR_NAME -y

# Pull env vars to local .env.local
vercel env pull
```

## Workflow
1. Make code changes locally
2. Run `vercel` to create a preview deployment
3. Check the preview URL for errors
4. If build passes, commit and push to trigger Dokploy production deploy


# MDX Content
Uses a industry standard w/ pretty yaml for documentation purposes which allows us to retain information even if the database 
was somehow to be lost or corrupted it could be restored by gathering data from pretty yaml. 
The comment header notice goes in every file the only edits being name is the DOCUMENT, and TYPE which are variables. 
TYPE is the type in (content) for ex. ESSAYS, PAPERS, BLOG, ect. and DOCUMENT is the filenmae for ex. thispost.mdx the rest is a a
defaualt informataive template for future editors, ect. 

# ==============================================================================
# DOCUMENT: filename
# TYPE:     PUBLICATION UNIT
#
# RATIONALE:
#   This document uses human-readable YAML front matter as a durable metadata
#   layer. In the event of database loss or corruption, content and metadata
#   can be reconstructed directly from source files.
#
# REQUIREMENTS:
#   - YAML front matter MUST be present
#   - @type @author, and @path MUST be defined
#
# @author Kris Yotam
# @type 
# @path 
# ==============================================================================

# ==============================================================================
title: "Post Title"
slug: post-title
date: YYYY-MM-DD
updated: YYYY-MM-DD
status: 
certainty: 
importance: 
author: "Kris Yotam"
description: 
tags: [tag, tag2, tag3]
category: 
sequences: [example-slug, example-slug-II, example-slug-III]
cover: https://krisyotam.com/doc/path-to-file
# ==============================================================================


# Constants
 [] any owner var will always be set to Kris Yotam, as I am the primary sole developer even though occasionally friends or a prof. might look at a code base all creations within it are assumed to be mine. 
 [] 


# Metadata Type Standard 

@type --> file type, ex.: @type type, @type utils @type component, @type styles
@data --> in public/data what database does this file pull from if any: ex. @data content, @data media --> the value is the database name without ".db" tacked on to it so @data media evaluates to public/data/media.db
@path --> points to exact file path from root
@origin --> if needed to give credit to another person it will evaluate to a value of name and url for persons site 
for ex.: @origin project:<name> <url> or @origin person:Chris P. <https://ch1p.io>, for another origin in the same file 
please do not comma seperate instead add a second @origin beneat the first one 

if a specific type of metadata for ex. origin is not needed it does not need to be included with the exception of @type, and 
@path which must be in every file. 
@date --> the date the file was created 
@updated --> the date the file was last touched 




# Components 

/*
+------------------+----------------------------------------------------------+
| FILE             | {FILE} # Full File Name i.e. this-file.tsx               |
| ROLE             | {ROLE}                                                   |
| OWNER            | {OWNER, i.e Kris Yotam}                                  |
| CREATED          | {YYYY-MM-DD}                                             |
| UPDATED          | {YYYY-MM-DD}                                             |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path <path-to-file>                                                        | 
| @origin                                                                     | 
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| {2-5 lines summary}                                                         |
+-----------------------------------------------------------------------------+
*/


# Layout 

/* ============================================================================
 * {FILE} — {DESC}
 * {AUTHOR} | Created: {YYYY-MM-DD} | Updated: {YYYY-MM-DD}
 * @type layout
 * @path path-to-file
 * ========================================================================== */



# Types

/**
 * TYPES: {DOMAIN}
 * File:  {FILE}
 *
 * Contains:
 *   - {TypeA}: {meaning}
 *   - {TypeB}: {meaning}
 *
 * Notes:
 *   {e.g., keep runtime-free, no imports from server-only modules}
 */


# Styles 

/* ============================================================================
 * FILE:  {FILE}
 * ROLE:  STYLESHEET
 *
 * PURPOSE:
 *   {single sentence}
 *
 * @type styles
 * @path {path-to-file}
 *
 * @date {YYYY-MM-DD}
 * @updated {YYYY-MM-DD}
 * ========================================================================== */
