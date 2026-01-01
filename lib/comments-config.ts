// Comment system role configuration
// Add usernames (GitHub usernames) to each role array

export const COMMENT_ROLES: {
  owner: string[]
  admin: string[]
  mod: string[]
} = {
  owner: ["krisyotam"],
  admin: [],
  mod: [],
}

export type CommentRole = "owner" | "admin" | "mod" | null

// Role display configuration
export const ROLE_CONFIG = {
  owner: {
    label: "Owner",
    canDeleteAny: true,
  },
  admin: {
    label: "Admin",
    canDeleteAny: true,
  },
  mod: {
    label: "Mod",
    canDeleteAny: false,
  },
} as const

// Helper function to get a user's role
export function getUserRole(username: string | undefined): CommentRole {
  if (!username) return null

  if (COMMENT_ROLES.owner.includes(username)) return "owner"
  if (COMMENT_ROLES.admin.includes(username)) return "admin"
  if (COMMENT_ROLES.mod.includes(username)) return "mod"

  return null
}

// Helper function to check if a user can delete any comment
export function canDeleteAnyComment(username: string | undefined): boolean {
  const role = getUserRole(username)
  if (!role) return false
  return ROLE_CONFIG[role].canDeleteAny
}
