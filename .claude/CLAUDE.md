
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

