# Survey Markdown Format Guide

This guide documents the markdown format for surveys on krisyotam.com.

---

## File Structure

Survey files use the `.survey.md` extension and live in:
```
src/app/(misc)/surveys/content/
```

---

## Format Overview

Surveys use a TOML-like syntax within markdown. Each file has:
1. **Header comment** - metadata for humans
2. **[survey]** block - survey-level config
3. **[[section]]** blocks - optional grouping
4. **[[question]]** blocks - the actual questions

---

## Survey Block

```toml
[survey]
id = "my-survey"              # Required: URL slug
title = "My Survey"           # Required: Display title
subtitle = "A Subtitle"       # Optional: Shown in header
description = "Optional desc" # Optional: Shown at start
anonymous = true              # Optional: default true
estimated_time = "5m"         # Optional: shown to user
status = "active"             # active | draft | closed

# PageHeader fields (for survey pages)
start_date = "2026-01-22"     # Optional: creation date
end_date = "2026-01-22"       # Optional: last update
confidence = "likely"         # Optional: certainty level
importance = 7                # Optional: 1-10 scale
tags = ["feedback", "meta"]   # Optional: topic tags
category = "Meta"             # Optional: category label
```

### Confidence Values
- `impossible`, `remote`, `highly unlikely`, `unlikely`
- `possible`, `likely`, `highly likely`, `certain`

---

## Section Block (Optional)

Sections group questions with a header. Questions without a section appear at root.

```toml
[[section]]
id = "demographics"
title = "About You"
description = "Optional section description"
```

---

## Question Types

### text
Single-line text input.

```toml
[[question]]
id = "name"
type = "text"
label = "What is your name?"
placeholder = "John Doe"
required = true
min = 2          # min characters
max = 100        # max characters
```

### textarea
Multi-line text input.

```toml
[[question]]
id = "thoughts"
type = "textarea"
label = "Share your thoughts"
placeholder = "Write here..."
rows = 6         # visible rows
required = false
```

### number
Numeric input.

```toml
[[question]]
id = "age"
type = "number"
label = "Your age"
min = 13
max = 120
step = 1         # increment
required = true
```

### email
Email input with validation.

```toml
[[question]]
id = "email"
type = "email"
label = "Email address"
placeholder = "you@example.com"
required = false
```

### url
URL input with validation.

```toml
[[question]]
id = "website"
type = "url"
label = "Your website"
placeholder = "https://example.com"
required = false
```

### select
Dropdown select (single choice).

```toml
[[question]]
id = "country"
type = "select"
label = "Country"
options = [
  "United States",
  "United Kingdom",
  "Canada",
  "Other"
]
required = true
```

### radio
Radio buttons (single choice, all visible).

```toml
[[question]]
id = "frequency"
type = "radio"
label = "How often do you read?"
options = [
  "Daily",
  "Weekly",
  "Monthly",
  "Rarely"
]
required = true
```

### checkbox
Checkboxes (multiple choice).

```toml
[[question]]
id = "interests"
type = "checkbox"
label = "Select your interests"
options = [
  "Technology",
  "Philosophy",
  "Art",
  "Science"
]
min_select = 1   # minimum selections
max_select = 3   # maximum selections
```

### scale
Numeric scale (1-5, 1-10, etc).

```toml
[[question]]
id = "satisfaction"
type = "scale"
label = "How satisfied are you?"
min = 1
max = 5
labels = { 1 = "Not at all", 5 = "Extremely" }
required = true
```

### rating
Star/emoji rating.

```toml
[[question]]
id = "rating"
type = "rating"
label = "Rate your experience"
max = 5          # number of stars
icon = "star"    # star | heart | circle
required = false
```

### date
Date picker.

```toml
[[question]]
id = "birthdate"
type = "date"
label = "Date of birth"
min = "1900-01-01"
max = "2020-12-31"
required = false
```

### time
Time picker.

```toml
[[question]]
id = "preferred_time"
type = "time"
label = "Preferred contact time"
required = false
```

### file
File upload.

```toml
[[question]]
id = "resume"
type = "file"
label = "Upload your resume"
accept = ".pdf,.doc,.docx"   # allowed extensions
max_size = "5MB"             # max file size
required = false
```

### image
Image upload (specialized file).

```toml
[[question]]
id = "avatar"
type = "image"
label = "Upload a photo"
accept = ".jpg,.jpeg,.png,.webp"
max_size = "2MB"
required = false
```

### boolean
Yes/No toggle.

```toml
[[question]]
id = "consent"
type = "boolean"
label = "Do you agree to the terms?"
true_label = "Yes, I agree"
false_label = "No"
required = true
```

### matrix
Grid of options (rows x columns).

```toml
[[question]]
id = "importance"
type = "matrix"
label = "Rate the importance of each"
rows = [
  "Speed",
  "Quality",
  "Price"
]
columns = [
  "Not important",
  "Somewhat",
  "Very important"
]
required = true
```

### ranking
Drag to rank items.

```toml
[[question]]
id = "priorities"
type = "ranking"
label = "Rank in order of priority"
options = [
  "Career",
  "Family",
  "Health",
  "Wealth"
]
required = true
```

---

## Conditional Logic

Show questions based on previous answers:

```toml
[[question]]
id = "other_specify"
type = "text"
label = "Please specify"
condition = "country == 'Other'"
required = true
```

Supported operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`

---

## Complete Example

```toml
# ==============================================================================
# SURVEY:    Reader Feedback
# VERSION:   1.0
# OWNER:     Kris Yotam
# UPDATED:   2026-01-22
# ==============================================================================

[survey]
id = "reader-feedback"
title = "Reader Feedback"
subtitle = "Understanding My Audience"
description = "Help me understand my audience"
anonymous = true
estimated_time = "3m"
status = "active"
start_date = "2026-01-22"
end_date = "2026-01-22"
confidence = "likely"
importance = 8
tags = ["feedback", "meta", "audience"]
category = "Meta"

[[section]]
id = "about"
title = "About You"

[[question]]
id = "age_range"
type = "radio"
label = "Your age?"
options = ["18-25", "26-35", "36-45", "46-55", "56+"]
required = true

[[question]]
id = "occupation"
type = "text"
label = "What do you do?"
placeholder = "e.g. Software Engineer"
required = false

[[section]]
id = "feedback"
title = "Your Feedback"

[[question]]
id = "favorite"
type = "checkbox"
label = "What content do you enjoy?"
options = ["Essays", "Poetry", "Notes", "Reviews", "Papers"]

[[question]]
id = "suggestion"
type = "textarea"
label = "Any suggestions?"
rows = 4
required = false
```

---

## Rendering

Surveys display all questions vertically with:
- Clean, minimal aesthetic matching site design
- Full PostHeader with metadata (status, confidence, tags)
- Progress bar showing completion
- Numbered questions with visual active/completed states
- Keyboard navigation (Enter to scroll to next question)
- Smooth scroll animation when advancing
- Mobile-friendly touch targets
- Validation on required fields before advancing
