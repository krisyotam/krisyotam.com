import type { FamilyMember, FamilyTree } from "./family-data"

export interface TreeNode {
  member: FamilyMember
  children: TreeNode[]
  spouses: FamilyMember[]
  parents: FamilyMember[]
  level: number
}

export function buildFamilyTree(data: FamilyTree, startId: string = data.rootMemberId, level = 0): TreeNode | null {
  const member = data.members.find((m) => m.id === startId)
  if (!member) return null

  const node: TreeNode = {
    member,
    children: [],
    spouses: [],
    parents: [],
    level,
  }

  // Add spouses
  if (member.spouseIds) {
    node.spouses = member.spouseIds
      .map((id) => data.members.find((m) => m.id === id))
      .filter((spouse): spouse is FamilyMember => spouse !== undefined)
  }

  // Add parents
  if (member.parentIds) {
    node.parents = member.parentIds
      .map((id) => data.members.find((m) => m.id === id))
      .filter((parent): parent is FamilyMember => parent !== undefined)
  }

  // Add children
  if (member.childrenIds) {
    node.children = member.childrenIds
      .map((id) => buildFamilyTree(data, id, level + 1))
      .filter((child): child is TreeNode => child !== null)
  }

  return node
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Unknown"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export function calculateAge(birthDate?: string, deathDate?: string): string {
  if (!birthDate) return "Unknown"

  const birth = new Date(birthDate)
  const end = deathDate ? new Date(deathDate) : new Date()

  let age = end.getFullYear() - birth.getFullYear()
  const monthDiff = end.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--
  }

  return age.toString()
}
