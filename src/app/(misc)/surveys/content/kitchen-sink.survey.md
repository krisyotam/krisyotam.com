# ==============================================================================
# SURVEY:    Kitchen Sink Test
# VERSION:   1.0
# OWNER:     Kris Yotam
# UPDATED:   2026-01-22
# PURPOSE:   Test all question types
# ==============================================================================

[survey]
id = "kitchen-sink"
title = "Kitchen Sink Test"
subtitle = "Testing Every Question Type"
description = "This survey tests every question type supported by the system."
anonymous = true
estimated_time = "5m"
status = "active"
start_date = "2026-01-22"
end_date = "2026-01-22"
confidence = "certain"
importance = 7
tags = ["test", "demo", "survey"]
category = "Testing"

# ------------------------------------------------------------------------------
# SECTION: Text Inputs
# ------------------------------------------------------------------------------

[[section]]
id = "text-inputs"
title = "Text Inputs"

[[question]]
id = "name"
type = "text"
label = "What is your name?"
placeholder = "Enter your name"
required = true
min = 2
max = 50

[[question]]
id = "bio"
type = "textarea"
label = "Tell us about yourself"
placeholder = "Write a short bio..."
rows = 4
required = false

[[question]]
id = "email"
type = "email"
label = "Email address"
placeholder = "you@example.com"
required = false

[[question]]
id = "website"
type = "url"
label = "Your website or blog"
placeholder = "https://example.com"
required = false

# ------------------------------------------------------------------------------
# SECTION: Numeric
# ------------------------------------------------------------------------------

[[section]]
id = "numeric"
title = "Numbers"

[[question]]
id = "age"
type = "number"
label = "Your age"
min = 13
max = 120
required = true

[[question]]
id = "satisfaction"
type = "scale"
label = "How satisfied are you with this survey?"
min = 1
max = 5
labels = { 1 = "Not at all", 5 = "Very satisfied" }
required = true

[[question]]
id = "rating"
type = "rating"
label = "Rate your experience"
max = 5
icon = "star"
required = false

# ------------------------------------------------------------------------------
# SECTION: Choice - Single
# ------------------------------------------------------------------------------

[[section]]
id = "single-choice"
title = "Single Choice"

[[question]]
id = "frequency"
type = "radio"
label = "How often do you read long-form content?"
options = [
  "Daily",
  "Weekly",
  "Monthly",
  "Rarely",
  "Never"
]
required = true

[[question]]
id = "country"
type = "select"
label = "Where are you from?"
options = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Other"
]
required = true

[[question]]
id = "consent"
type = "boolean"
label = "Do you agree to participate?"
true_label = "Yes, I agree"
false_label = "No, thanks"
required = true

# ------------------------------------------------------------------------------
# SECTION: Choice - Multiple
# ------------------------------------------------------------------------------

[[section]]
id = "multi-choice"
title = "Multiple Choice"

[[question]]
id = "interests"
type = "checkbox"
label = "Select all that interest you"
options = [
  "Technology",
  "Philosophy",
  "Art & Design",
  "Science",
  "Literature",
  "Music",
  "History"
]
min_select = 1
max_select = 4

[[question]]
id = "priorities"
type = "ranking"
label = "Rank these in order of importance"
options = [
  "Career",
  "Family",
  "Health",
  "Creativity",
  "Wealth"
]
required = true

# ------------------------------------------------------------------------------
# SECTION: Date & Time
# ------------------------------------------------------------------------------

[[section]]
id = "datetime"
title = "Date & Time"

[[question]]
id = "birthdate"
type = "date"
label = "When were you born?"
min = "1920-01-01"
max = "2015-12-31"
required = false

[[question]]
id = "preferred_time"
type = "time"
label = "Best time to contact you?"
required = false

# ------------------------------------------------------------------------------
# SECTION: File Uploads
# ------------------------------------------------------------------------------

[[section]]
id = "uploads"
title = "File Uploads"

[[question]]
id = "document"
type = "file"
label = "Upload a document (optional)"
accept = ".pdf,.doc,.docx,.txt"
max_size = "5MB"
required = false

[[question]]
id = "photo"
type = "image"
label = "Upload a photo (optional)"
accept = ".jpg,.jpeg,.png,.webp"
max_size = "2MB"
required = false

# ------------------------------------------------------------------------------
# SECTION: Advanced
# ------------------------------------------------------------------------------

[[section]]
id = "advanced"
title = "Advanced"

[[question]]
id = "importance_matrix"
type = "matrix"
label = "Rate the importance of each factor"
rows = [
  "Speed",
  "Quality",
  "Price",
  "Support"
]
columns = [
  "Not important",
  "Somewhat",
  "Important",
  "Very important"
]
required = false

# ------------------------------------------------------------------------------
# SECTION: Conditional
# ------------------------------------------------------------------------------

[[section]]
id = "conditional"
title = "Conditional Questions"

[[question]]
id = "has_other"
type = "boolean"
label = "Did you select 'Other' for country?"
true_label = "Yes"
false_label = "No"
required = false

[[question]]
id = "other_country"
type = "text"
label = "Please specify your country"
placeholder = "Enter country name"
condition = "has_other == true"
required = false

# ------------------------------------------------------------------------------
# SECTION: Final
# ------------------------------------------------------------------------------

[[section]]
id = "final"
title = "Final Thoughts"

[[question]]
id = "feedback"
type = "textarea"
label = "Any other feedback?"
placeholder = "Share your thoughts..."
rows = 6
required = false
