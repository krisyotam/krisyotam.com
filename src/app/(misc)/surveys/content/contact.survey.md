# ==============================================================================
# SURVEY:    Contact Form
# VERSION:   1.0
# OWNER:     Kris Yotam
# UPDATED:   2026-02-18
# PURPOSE:   Contact form with conditional branching by reason
# ==============================================================================

[survey]
id = "contact"
title = "Contact Form"
description = "Get in touch — select a reason and fill out the relevant fields."
anonymous = false
estimated_time = "5m"
status = "active"
start_date = "2025-01-01"
confidence = "certain"
importance = 7
tags = ["contact", "form"]
category = "Contact"

# ------------------------------------------------------------------------------
# SECTION: Identity
# ------------------------------------------------------------------------------

[[section]]
id = "identity"
title = "Who Are You?"

[[question]]
id = "name"
type = "text"
label = "What is your full name?"
placeholder = "Enter your full name"
required = true
min = 2

[[question]]
id = "reason"
type = "radio"
label = "Why are you reaching out?"
options = [
  "Collaborate",
  "Ask a Question",
  "Give a Research Idea",
  "Ask for Advice",
  "Friend Request"
]
required = true

# ------------------------------------------------------------------------------
# SECTION: Collaborate
# ------------------------------------------------------------------------------

[[section]]
id = "collaborate"
title = "Collaboration Details"

[[question]]
id = "collab_background"
type = "textarea"
label = "Professional Background Summary"
placeholder = "Provide a brief overview of your professional experience..."
rows = 4
condition = "reason == Collaborate"
required = true

[[question]]
id = "collab_project_title"
type = "text"
label = "Project Title"
placeholder = "Enter the title of your project"
condition = "reason == Collaborate"
required = true

[[question]]
id = "collab_project_description"
type = "textarea"
label = "Project Description"
placeholder = "Describe your project in detail..."
rows = 6
condition = "reason == Collaborate"
required = true

[[question]]
id = "collab_email"
type = "email"
label = "Contact Email"
placeholder = "Enter your email address"
condition = "reason == Collaborate"
required = true

[[question]]
id = "collab_portfolio"
type = "url"
label = "Portfolio / LinkedIn / Website Link (Optional)"
placeholder = "https://your-portfolio.com"
condition = "reason == Collaborate"
required = false

[[question]]
id = "collab_github"
type = "url"
label = "GitHub Profile (Optional)"
placeholder = "https://github.com/yourusername"
condition = "reason == Collaborate"
required = false

[[question]]
id = "collab_researchgate"
type = "url"
label = "ResearchGate Profile (Optional)"
placeholder = "https://www.researchgate.net/profile/Your_Profile"
condition = "reason == Collaborate"
required = false

[[question]]
id = "collab_method"
type = "radio"
label = "Preferred Collaboration Method (Optional)"
options = [
  "In-person",
  "Remote"
]
condition = "reason == Collaborate"
required = false

[[question]]
id = "collab_comments"
type = "textarea"
label = "Additional Comments (Optional)"
placeholder = "Any extra information you wish to share..."
rows = 4
condition = "reason == Collaborate"
required = false

# ------------------------------------------------------------------------------
# SECTION: Ask a Question
# ------------------------------------------------------------------------------

[[section]]
id = "ask-question"
title = "Your Question"

[[question]]
id = "question_text"
type = "textarea"
label = "Your Question"
placeholder = "What is the question you want answered?"
rows = 4
condition = "reason == Ask a Question"
required = true

[[question]]
id = "question_research"
type = "textarea"
label = "Prior Research"
placeholder = "Describe where you have looked for answers..."
rows = 4
condition = "reason == Ask a Question"
required = true

[[question]]
id = "question_email"
type = "email"
label = "Contact Email"
placeholder = "Enter your email address"
condition = "reason == Ask a Question"
required = true

[[question]]
id = "question_context"
type = "textarea"
label = "Additional Context (Optional)"
placeholder = "Any extra background information..."
rows = 4
condition = "reason == Ask a Question"
required = false

[[question]]
id = "question_motivation"
type = "textarea"
label = "Motivation (Optional)"
placeholder = "What prompted you to ask this question now?"
rows = 4
condition = "reason == Ask a Question"
required = false

# ------------------------------------------------------------------------------
# SECTION: Research Idea
# ------------------------------------------------------------------------------

[[section]]
id = "research-idea"
title = "Research Idea"

[[question]]
id = "research_title"
type = "text"
label = "Research Idea Title"
placeholder = "Enter the title of your research idea"
condition = "reason == Give a Research Idea"
required = true

[[question]]
id = "research_description"
type = "textarea"
label = "Detailed Description"
placeholder = "Explain your research idea in depth..."
rows = 6
condition = "reason == Give a Research Idea"
required = true

[[question]]
id = "research_rationale"
type = "textarea"
label = "Rationale / Importance"
placeholder = "Explain why this research idea is important..."
rows = 4
condition = "reason == Give a Research Idea"
required = true

[[question]]
id = "research_email"
type = "email"
label = "Contact Email"
placeholder = "Enter your email address"
condition = "reason == Give a Research Idea"
required = true

[[question]]
id = "research_resources"
type = "url"
label = "Supporting Resources / Links (Optional)"
placeholder = "https://example.com/resource"
condition = "reason == Give a Research Idea"
required = false

[[question]]
id = "research_previous_work"
type = "textarea"
label = "Previous Work / Experience (Optional)"
placeholder = "Describe any related research or projects..."
rows = 4
condition = "reason == Give a Research Idea"
required = false

[[question]]
id = "research_comments"
type = "textarea"
label = "Additional Comments (Optional)"
placeholder = "Any extra information you wish to include..."
rows = 4
condition = "reason == Give a Research Idea"
required = false

# ------------------------------------------------------------------------------
# SECTION: Advice
# ------------------------------------------------------------------------------

[[section]]
id = "advice"
title = "Advice Request"

[[question]]
id = "advice_situation"
type = "textarea"
label = "Description of Situation"
placeholder = "Provide a detailed account of your current situation..."
rows = 6
condition = "reason == Ask for Advice"
required = true

[[question]]
id = "advice_sought"
type = "textarea"
label = "Specific Advice Sought"
placeholder = "What specific advice or guidance are you looking for?"
rows = 4
condition = "reason == Ask for Advice"
required = true

[[question]]
id = "advice_email"
type = "email"
label = "Contact Email"
placeholder = "Enter your email address"
condition = "reason == Ask for Advice"
required = true

[[question]]
id = "advice_feelings"
type = "textarea"
label = "Current Feelings (Optional)"
placeholder = "How are you feeling about this situation?"
rows = 4
condition = "reason == Ask for Advice"
required = false

[[question]]
id = "advice_tried"
type = "textarea"
label = "What You've Tried (Optional)"
placeholder = "Describe any steps or solutions you have already attempted..."
rows = 4
condition = "reason == Ask for Advice"
required = false

[[question]]
id = "advice_concerns"
type = "textarea"
label = "Underlying Concerns (Optional)"
placeholder = "What might be the deeper issue behind this situation?"
rows = 4
condition = "reason == Ask for Advice"
required = false

[[question]]
id = "advice_background"
type = "textarea"
label = "Background Information (Optional)"
placeholder = "Any additional context or history..."
rows = 4
condition = "reason == Ask for Advice"
required = false

[[question]]
id = "advice_reflections"
type = "textarea"
label = "Personal Reflections (Optional)"
placeholder = "Reflect on any recurring patterns or influences..."
rows = 4
condition = "reason == Ask for Advice"
required = false

# ------------------------------------------------------------------------------
# SECTION: Friend Request
# ------------------------------------------------------------------------------

[[section]]
id = "friend-request"
title = "Friend Request"

[[question]]
id = "friend_intro"
type = "textarea"
label = "Brief Introduction"
placeholder = "Write a short description explaining why you're reaching out..."
rows = 4
condition = "reason == Friend Request"
required = true

[[question]]
id = "friend_interests"
type = "textarea"
label = "Exhaustive List of Interests"
placeholder = "List your interests in detail..."
rows = 6
condition = "reason == Friend Request"
required = true

[[question]]
id = "friend_discord"
type = "text"
label = "Discord Handle"
placeholder = "Enter your Discord handle"
condition = "reason == Friend Request"
required = true

[[question]]
id = "friend_email"
type = "email"
label = "Email Address"
placeholder = "Enter your email address"
condition = "reason == Friend Request"
required = true

[[question]]
id = "friend_age"
type = "number"
label = "Age"
min = 13
max = 120
condition = "reason == Friend Request"
required = true

[[question]]
id = "friend_personality"
type = "text"
label = "Personality Type (Optional)"
placeholder = "e.g., INTJ, ENFP"
condition = "reason == Friend Request"
required = false

[[question]]
id = "friend_enneagram"
type = "text"
label = "Enneagram Type (Optional)"
placeholder = "e.g., Type 4, Type 7"
condition = "reason == Friend Request"
required = false

[[question]]
id = "friend_details"
type = "textarea"
label = "Additional Personality / Interests Details (Optional)"
placeholder = "Any extra details about your personality or hobbies..."
rows = 4
condition = "reason == Friend Request"
required = false

[[question]]
id = "friend_comments"
type = "textarea"
label = "Additional Comments (Optional)"
placeholder = "Any other information you'd like to share..."
rows = 4
condition = "reason == Friend Request"
required = false
